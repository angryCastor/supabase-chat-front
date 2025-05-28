#!/bin/bash

configPath='/etc/nginx/nginx.conf'
search='##PORT##'
replace="$PORT"
sed -i "s|$search|$replace|" $configPath
