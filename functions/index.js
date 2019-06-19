const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const express = require("express");
const { Nuxt, Builder } = require("nuxt");

const app = express();

const config = {
  dev: false,
  buildDir: "nuxt",
  build: { publicPath: process.env.NUXT_PUBLIC_PATH || "/assets" }
};
const nuxt = new Nuxt(config);

function handleRequest(req, res) {
  res.set("Cache-Control", "public, max-age=600, s-maxage=1200");
  nuxt
    .renderRoute("/")
    // eslint-disable-next-line promise/always-return
    .then(result => {
      nuxt.render(req, res);
    })
    .catch(e => {
      console.log(e)
      res.send(e);
    });
}
app.use(handleRequest);
exports.nuxtApp = functions.https.onRequest(app);