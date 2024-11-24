# Makefile

.PHONY: dev prod

# builds the docker container and runs the container in development mode
dev:
	docker-compose up -d --build

# stops the docker container
stop-dev:
	docker-compose down

# builds the docker container and runs the container in production mode
prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# stops the docker container
stop-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
