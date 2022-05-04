#!/bin/bash
service mongodb start
service redis-server start
redis-server --daemonize yes


# pip3 install -r requirements.txt

cd news_pipeline
python3 news_monitor.py &
python3 news_fetcher.py &
python3 news_deduper.py &

cd ../news_recommendation_service
python3 click_log_processor.py &
python3 recommendation_service.py &

cd ../news_topic_modeling_service/server
python3 server.py &


cd ../../backend_server
python3 service.py &


cd ../web_server/server
npm install -g nodemon
npm install
npm start

echo "=================================================="
read -p "PRESS [ENTER] TO TERMINATE PROCESSES." PRESSKEY

kill $(jobs -p)