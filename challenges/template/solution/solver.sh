#!/bin/bash

curl "$DOMAIN:8080" | grep "flag{template}"

if [ $? -eq 0 ]; then
    echo "Test: Succeeded"
    exit 0
else
    echo "Test: Failed"
    exit 1
fi
