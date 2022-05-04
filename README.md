295P-Team1 Tapnews

You can quickly deploy this project by Docker.

We've already pushed the Docker image on the following link:

https://hub.docker.com/r/youknowqyh/tapnews

You can type the following commands to run the container:

```shell
sudo docker pull youknowqyh/tapnews
sudo docker run --rm -it  -p 3000:3000/tcp -p 4040:4040/tcp -p 5050:5050/tcp -p 6060:6060/tcp youknowqyh/tapnews:latest
```



# Getting started

### 1. Install Redis

```
wget http://download.redis.io/releases/redis-3.2.6.tar.gz
tar xzf redis-3.2.6.tar.gz
cd redis-3.2.6
make
sudo make install
cd utils
sudo ./install_server.sh
```

### 2. Install mongodb

```
sudo apt update && sudo apt upgrade -y
sudo apt install mongodb
sudo systemctl status mongodb
sudo systemctl start mongodb
```

### 3. Install Node.js

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.4/install.sh | bash
source ~/.bashrc
nvm install node
```

### 4. Install Python

```
apt-get install -y python
pip install -r requirements.txt
```

### 5. Run

```shell
# Open multiple tabs to run 5 services

# backend server on port 4040
cd backend_server
python service.py

# Click log processor
cd news_recommendation_service
python click_log_processor.py

# Web server on port 3000
cd web_server/server
npm install
npm start

# news recommendation service on port 5050
cd news_recommendation_service
python recommendation_service.py

# news_topic_modeling_service on port 6060
cd news_topic_modeling_service/server
python server.py
```





