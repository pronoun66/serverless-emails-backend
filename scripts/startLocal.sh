#!/bin/bash
set -e

export LOCAL_TEST_URL=http://localhost:3000
export API_GATEWAY_KEY=HsMgcCPRXxaYwgI1lcM8jpYm2VXT2i46oxaSYxri
export APP_ENV="local"
export REGION="ap-southeast-2"

docker-compose -f docker-compose.yml stop
docker-compose -f docker-compose.yml up -d

export AWS_ACCESS_KEY_ID=accessKeyId
export AWS_SECRET_ACCESS_KEY=secretAccessKey

aws dynamodb create-table --cli-input-json file://tests/tables/emailJob.json --region ap-southeast-2 --endpoint-url http://localhost:8000
aws dynamodb create-table --cli-input-json file://tests/tables/emailServer.json --region ap-southeast-2 --endpoint-url http://localhost:8000
