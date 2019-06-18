#!/bin/bash

(cd src && yarn install && yarn build)

rm -rf public/*
# rm -r public/assets/*
cp -R src/static/ public
cp -R functions/nuxt/dist/client/ public

(cd functions && yarn install)
firebase deploy