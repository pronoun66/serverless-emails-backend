#!/bin/bash
set -e


export REGION="ap-southeast-2"
export IS_TEST=true
export LOCAL_TEST_URL=http://localhost:3000

export TABLE_EMAIL_JOB="serverless-emails-dev-email-job"
export TABLE_EMAIL_SERVER="serverless-emails-dev-email-server"


TEST_PATH=$1

if [ -z $1 ]
  then
    TEST_PATH=tests/integration
fi

./node_modules/mocha/bin/mocha $TEST_PATH --recursive --timeout 10000 --bail --errors-only