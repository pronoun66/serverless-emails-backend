#!/bin/bash
set -e

export IS_TEST=true

TEST_PATH=$1

if [ -z $1 ]
  then
    TEST_PATH=tests/unit
fi

./node_modules/mocha/bin/mocha $TEST_PATH --recursive --timeout 10000 --bail --errors-only