#!/bin/bash

# Install globally with Node.js first:
# npm install -g git://github.com/jsdoc3/jsdoc.git

cd docs
jsdoc -c client_conf.json
jsdoc -c server_conf.json
