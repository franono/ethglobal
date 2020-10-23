# clhackathon

docker build . -t linkpal-standard-adapter
docker run -d --name lnikpal-standard-adapter -p 8081:8080 -e EA_PORT=8080 linkpal-standard-adapter