docker build . -t adapter
docker run -d --name adapter -p 8080:8080 -e EA_PORT=8080 adapter