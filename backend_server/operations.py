import os
import sys
import redis
import random
import pickle
import json

from bson.json_util import dumps
from datetime import datetime

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))
import mongodb_client

from cloudAMQP_client import CloudAMQPClient
import news_recommendation_service_client

REDIS_HOST = 'localhost'
REDIS_PORT = 6379

NEWS_TABLE_NAME = 'news'
USERS_TABLE_NAME = 'users'
CLICK_LOGS_TABLE_NAME = 'click_logs'

NEWS_LIMIT = 100
NEWS_LIST_BATCH_SIZE = 10
USER_NEWS_TIMEOUT_IN_SECONDS = 600

LOG_CLICK_TASK_QUEUE_URL = 'amqps://nipppnnn:XVJKPT64ItvKru7S4se-C0-O4n8UqP9F@beaver.rmq.cloudamqp.com/nipppnnn'
LOG_CLICK_TASK_QUEUE_NAME = "log-click-task-queue"

redis_client = redis.StrictRedis(REDIS_HOST, REDIS_PORT, db=0)
click_queue_client = CloudAMQPClient(LOG_CLICK_TASK_QUEUE_URL, LOG_CLICK_TASK_QUEUE_NAME)


def getUserInfo(user_id):
    db = mongodb_client.get_db()
    user_info = list(db[USERS_TABLE_NAME].find({'email': {'$eq': user_id}}))
    print(user_info)
    print("operations")
    return json.loads(dumps(user_info))


def updateUserInfo(user_id, user_info, attr):
    db = mongodb_client.get_db()
    db[USERS_TABLE_NAME].update_one({'email': user_id}, { "$set": { attr: user_info } })
    return

def getNewsSummariesForUser(user_id, page_num):
    page_num = int(page_num)
    if page_num <= 0:
        raise ValueError('page_num should be a positive integer.')
    begin_index = (page_num - 1) * NEWS_LIST_BATCH_SIZE
    end_index = page_num * NEWS_LIST_BATCH_SIZE

    # The news list to be returned
    sliced_news = []

    if redis_client.get(user_id) is not None:
        news_digests = pickle.loads(redis_client.get(user_id))

        # If begin_index is out of range, return empty list
        # If end_index is out of range, return all remaining news
        sliced_news_digests = news_digests[begin_index: end_index]
        db = mongodb_client.get_db()
        sliced_news = list(db[NEWS_TABLE_NAME].find({'digest': {'$in': sliced_news_digests}}))
    else:
        db = mongodb_client.get_db()
        total_news = list(db[NEWS_TABLE_NAME].find().sort([('publishedAt', -1)]).limit(NEWS_LIMIT))

        total_news_digests = list(map(lambda x:x['digest'], total_news))
        print(total_news_digests)
        redis_client.set(user_id, pickle.dumps(total_news_digests))
        redis_client.expire(user_id, USER_NEWS_TIMEOUT_IN_SECONDS)

        sliced_news = total_news[begin_index:end_index]

    preference = news_recommendation_service_client.getPreferenceForUser(user_id)
    topPreference = None

    if preference is not None and len(preference) > 0:
        topPreference = preference[0]
    
    for news in sliced_news:

        if news['class'] == topPreference:
            news['reason'] = 'Recommend'
        if news['publishedAt'].date() == datetime.today().date():
            news['time'] = 'today'
    redditNews=[]
    for news in sliced_news:
        if (news['source']['name']=="Reddit /r/all"):
            redditNews.append(news)
            #sliced_news.remove(news)
    for news in redditNews:
        sliced_news.remove(news)
    return json.loads(dumps(sliced_news))

def getSpecialNewsSummariesForUser(user_id, category, page_num):
    page_num = int(page_num)
    if page_num <= 0:
        raise ValueError('page_num should be a positive integer.')
    begin_index = (page_num - 1) * NEWS_LIST_BATCH_SIZE
    end_index = page_num * NEWS_LIST_BATCH_SIZE

    # The news list to be returned
    sliced_news = []

    if redis_client.get(user_id) is not None:
        # news_digests = pickle.loads(redis_client.get(user_id))

        # # If begin_index is out of range, return empty list
        # # If end_index is out of range, return all remaining news
        # sliced_news_digests = news_digests[begin_index: end_index]
        # db = mongodb_client.get_db()
        # sliced_news = list(db[NEWS_TABLE_NAME].find({'digest': {'$in': sliced_news_digests}, 'class': {'$eq':category}}))
        pass
    if True:
        db = mongodb_client.get_db()
        total_news = list(db[NEWS_TABLE_NAME].find({'class':category}).sort([('publishedAt', -1)]).limit(NEWS_LIMIT))

        total_news_digests = list(map(lambda x:x['digest'], total_news))
        print(total_news_digests)
        redis_client.set(user_id, pickle.dumps(total_news_digests))
        redis_client.expire(user_id, USER_NEWS_TIMEOUT_IN_SECONDS)

        sliced_news = total_news[begin_index:end_index]

    preference = news_recommendation_service_client.getPreferenceForUser(user_id)
    topPreference = None

    if preference is not None and len(preference) > 0:
        topPreference = preference[0]
    special_sliced_news = []
    for news in sliced_news:
        if news['class'] == category:
            special_sliced_news.append(news)
        if news['class'] == topPreference:
            news['reason'] = 'Recommend'
        if news['publishedAt'].date() == datetime.today().date():
            news['time'] = 'today'
    return json.loads(dumps(special_sliced_news))


def logNewsClickForUser(user_id, news_id):
    print("click")
    message = {'userId': user_id, 'newsId': news_id, 'timestamp': datetime.utcnow()}

    # Back up the log message to mongodb
    db = mongodb_client.get_db()
    col = db[CLICK_LOGS_TABLE_NAME];
    col.insert_one(message)

    # Send log task to machine learing service
    message = {'userId': user_id, 'newsId': news_id,
               'timestamp': str(datetime.utcnow())}
    click_queue_client.sendMessage(message)

def like(user_id, news_id):
    print("like")

    # Back up the log message to mongodb
    db = mongodb_client.get_db()
    col = db["likes"];
    message = {'userId': user_id, 'newsId': [news_id], 'timestamp': datetime.utcnow()}
    #col.insert_one( {'userId': 1111, 'newsId':[1234,5678], 'timestamp': datetime.utcnow()})
    entry=col.find({ "userId": user_id})
    if len(list(entry))>0:
        temp=col.find({ "userId": user_id})
        for x in temp:
            if news_id not in x['newsId']:
                newlist=x['newsId']+[news_id]
            else:
                newlist=x['newsId']
            col.update_one({"userId": user_id},{"$set":{'newsId':newlist}})
    else:
        col.insert_one(message)
    '''if col.find({'userID':user_id}).count()>0:
        print(col['newsId'])
    else:
        col.insert_one(message)
        '''

    # col.find({'email': {'$eq': user_id}}).update({"$pushAll": {"likes" : [news_id]}} )'''
def getLikeForUser(user_id, page_num):
    sliced_likes = []
    db = mongodb_client.get_db()
    col = db["likes"];
    entry=col.find({ "userId": user_id})
    for x in entry:
        sliced_likes=x['newsId']
    return json.loads(dumps(sliced_likes))

    '''# Send log task to machine learing service
    message = {'userId': user_id, 'newsId': news_id,
               'timestamp': str(datetime.utcnow())}
    click_queue_client.sendMessage(message)'''

def getLikedNewsSummariesForUser(user_id, page_num):
    print(user_id)
    page_num = int(page_num)
    if page_num <= 0:
        raise ValueError('page_num should be a positive integer.')
    begin_index = (page_num - 1) * NEWS_LIST_BATCH_SIZE
    end_index = page_num * NEWS_LIST_BATCH_SIZE

    # The news list to be returned
    sliced_news = []
    if redis_client.get(user_id) is not None:
        news_digests = pickle.loads(redis_client.get(user_id))

        # If begin_index is out of range, return empty list
        # If end_index is out of range, return all remaining news
        sliced_news_digests = news_digests[begin_index: end_index]
        db = mongodb_client.get_db()
        col = db["likes"];
        entry=col.find({ "userId": user_id})
        #print(entry[0])
        for x in entry:
            sliced_likes=x['newsId']

        sliced_news = list(db[NEWS_TABLE_NAME].find({'digest': {'$in': sliced_news_digests}}))
        likednews=[]
        for news in sliced_news:

            if news['digest'] in sliced_likes:
                likednews.append(news)
    else:
        db = mongodb_client.get_db()

        total_news = list(db[NEWS_TABLE_NAME].find().sort([('publishedAt', -1)]).limit(NEWS_LIMIT))

        total_news_digests = list(map(lambda x:x['digest'], total_news))
        print(total_news_digests)
        redis_client.set(user_id, pickle.dumps(total_news_digests))
        redis_client.expire(user_id, USER_NEWS_TIMEOUT_IN_SECONDS)

        col = db["likes"];
        entry=col.find({ "userId": user_id})
        for x in entry:
            sliced_likes=x['newsId']
        likednews=[]

        for news in total_news:
            if news['digest'] in sliced_likes:
                likednews.append(news)
        sliced_news = total_news[begin_index:end_index]

    preference = news_recommendation_service_client.getPreferenceForUser(user_id)
    topPreference = None

    if preference is not None and len(preference) > 0:
        topPreference = preference[0]

    for news in sliced_news:

        if news['class'] == topPreference:
            news['reason'] = 'Recommend'
        if news['publishedAt'].date() == datetime.today().date():
            news['time'] = 'today'
    redditNews=[]
    for news in sliced_news:
        if (news['source']['name']=="Reddit /r/all"):
            redditNews.append(news)
            #sliced_news.remove(news)
    for news in redditNews:
        sliced_news.remove(news)
    print(likednews)
    return json.loads(dumps(likednews))





def getRecommendNewsSummariesForUser(user_id, page_num):
    page_num = int(page_num)
    if page_num <= 0:
        raise ValueError('page_num should be a positive integer.')
    begin_index = (page_num - 1) * NEWS_LIST_BATCH_SIZE
    end_index = page_num * NEWS_LIST_BATCH_SIZE

    # The news list to be returned
    sliced_news = []
    if redis_client.get(user_id) is not None:
        news_digests = pickle.loads(redis_client.get(user_id))

        # If begin_index is out of range, return empty list
        # If end_index is out of range, return all remaining news
        sliced_news_digests = news_digests[begin_index: end_index]
        db = mongodb_client.get_db()
        sliced_news = list(db[NEWS_TABLE_NAME].find({'digest': {'$in': sliced_news_digests}}))
        col = db["user_preference_model"]
        entry=col.find({ "userId": user_id})
        for x in entry:
            number=x['preference']
        a = sorted(number.items(), key=lambda x: x[1], reverse=True)
        preference_class = [a[0][0], a[1][0]]
        prenews = []
        for news in sliced_news:
            if news['class'] in preference_class:
                prenews.append(news)

    else:
        db = mongodb_client.get_db()

        total_news = list(db[NEWS_TABLE_NAME].find().sort([('publishedAt', -1)]).limit(NEWS_LIMIT))

        total_news_digests = list(map(lambda x:x['digest'], total_news))
        print(total_news_digests)
        redis_client.set(user_id, pickle.dumps(total_news_digests))
        redis_client.expire(user_id, USER_NEWS_TIMEOUT_IN_SECONDS)

        col = db["user_preference_model"]
        entry=col.find({ "userId": user_id})
        for x in entry:
            number=x['preference']
        a = sorted(number.items(), key=lambda x: x[1], reverse=True)

        preference_class = [a[0][0], a[1][0]]
        print(preference_class)                

        prenews=[]
        
        for news in total_news:
            if news['class'] in preference_class:
                prenews.append(news)
        sliced_news = total_news[begin_index:end_index]

    preference = news_recommendation_service_client.getPreferenceForUser(user_id)
    topPreference = None

    if preference is not None and len(preference) > 0:
        topPreference = preference[0]

    for news in sliced_news:

        if news['class'] == topPreference:
            news['reason'] = 'Recommend'
        if news['publishedAt'].date() == datetime.today().date():
            news['time'] = 'today'
    redditNews=[]
    for news in sliced_news:
        if (news['source']['name']=="Reddit /r/all"):
            redditNews.append(news)
            #sliced_news.remove(news)
    for news in redditNews:
        sliced_news.remove(news)
    return json.loads(dumps(prenews))
