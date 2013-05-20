#!/bin/sh

# Updates Dependencies
# Build minified Game

cd client
python bin/lime.py update
python bin/lime.py build obacht -o obacht/obacht.min.js
