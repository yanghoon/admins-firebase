# Overview
[Live Demo](https://admins-c7f0d.firebaseapp.com/)

# Setup
## Node
clean node (on Mac): https://gomugom.github.io/how-to-remove-node-from-macos/

```bash
$ brew install node
$ node -v && npm -v
v10.16.0
6.9.0
```

## Firebase
```bash
$ npm install -g firebase-tools
$ firebase --version
7.0.0
```

## Nuxt
Guides: https://ko.nuxtjs.org/guide/installation

```bash
$ brew install yarn
$ yarn global add @vue/cli @vue/cli-init

# on MAC
# echo "export PATH=$(yarn global bin):\$PATH" >> ~/.bashrc
$ vue --version
3.8.4
$ vue init nuxt-community/starter-template src
```

## Integration
Article: https://itnext.io/how-to-create-a-ssr-serverless-app-with-firebase-nuxt-js-in-an-hour-6e6e03d0b3b8

Github:  https://github.com/nuxt/nuxt.js/issues/2446

Nuxt(Config) : https://github.com/nuxt/nuxt.js#using-nuxtjs-programmatically
```bash
$ firebase init
# Firestore, Functions, Hosting
# admins-xxxxx (admins)
# firestore.rules
# firestore.indexes.json
# JavaScript
# npm: yes
# public: yes
# SPA: yes

$ vi functions/index.js
```
