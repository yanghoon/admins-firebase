#!/bin/bash

FIREBASE_PUBLIC=public
NUXT_PUBLIC=bundle
export NUXT_PUBLIC_PATH=/$NUXT_PUBLIC

(cd src && yarn install && yarn build)

rm -rf $FIREBASE_PUBLIC/*
rm -rf functions/nuxt
cp -R src/static/ $FIREBASE_PUBLIC
cp -R src/.nuxt functions/nuxt
cp -R src/.nuxt/dist/client/ ${FIREBASE_PUBLIC}/${NUXT_PUBLIC}

(cd functions && yarn install)
firebase serve --only functions,hosting