.PHONY: run clean test build push exec release

IMAGE ?= app
TAG = $(shell git ls-files -s . | shasum - | awk '{print $$1}')
HOST_PORT = 8080
CONTAINER_PORT = 80

clean:
	echo "Running ${@}"
	-docker rm -vf $(shell docker ps -qa)

build:
	echo "Running ${@}"
	docker build --build-arg AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} --build-arg AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} -t ${IMAGE} -t ${IMAGE_REPO}/${IMAGE}:${TAG} -t ${IMAGE_REPO}/${IMAGE} .

push:
	echo "Running ${@}"
	docker push ${IMAGE_REPO}/${IMAGE}:$(TAG)
	docker push ${IMAGE_REPO}/${IMAGE}:latest

# test:
# 	echo "Running ${@}"
# 	docker run --rm -v ${PWD}/test/coverage:/reactor/test/coverage -v ${PWD}/test/results:/reactor/test/results ${IMAGE_REPO}/${IMAGE}:${TAG} npm test

run:
	echo "Running ${@}"
	docker run -p ${HOST_PORT}:${CONTAINER_PORT} -e CONFIG=${CONFIG} -e NODE_ENV=${NODE_ENV} -e STARTR_SECRETS_PASSWORD=${STARTR_SECRETS_PASSWORD} --name ${IMAGE} ${IMAGE_REPO}/${IMAGE}:${TAG}

exec:
	echo "Running ${@}"
	docker exec -it ${IMAGE} /bin/bash