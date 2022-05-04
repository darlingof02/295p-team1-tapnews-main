import requests
from json import loads

NEWS_API_ENDPOINT = 'https://newsapi.org/v2/'
# NEWS_API_KEY = '105dac05d92c4ac882bf237d22d8479b'
#NEWS_API_KEY = '98e34d9231564ec1acbfcadbcb37cba3'
NEWS_API_KEY = '99f5864cba38454abb4c1a6c941ade0e'
TOP_HEADLINES_API = 'top-headlines'

CNN = 'cnn'
DEFAULT_SOURCES = [CNN]

# If you are in regions that are have access to newsapi.org, you can delete the following line.
# proxies={'http': 'http://127.0.0.1:10809', 'https': 'http://127.0.0.1:10809'}

def buildUrl(end_point=NEWS_API_ENDPOINT, api_name=TOP_HEADLINES_API):
    return end_point + api_name

def getNewsFromSource(sources=DEFAULT_SOURCES, pageSize=100):
    articles = []
    for source in sources:
        payload = {'apiKey' : NEWS_API_KEY,
                   'sources' : source,
                   'pageSize' : pageSize}
        response = requests.get(buildUrl(), params=payload)
        res_json = loads(response.content)
        # Extract info from response
        if (res_json is not None and res_json['status'] == 'ok'):
            articles.extend(res_json['articles'])
            
    return articles