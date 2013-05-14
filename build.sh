#!/bin/sh

# Updates Dependencies
# Build minified Game

cd client
bin/lime.py update
bin/lime.py build obacht -o obacht/obacht.min.js
