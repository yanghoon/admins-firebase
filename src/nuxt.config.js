module.exports = {
  /*
   ** Headers of the page
   */
  head: {
    title: "admins",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "Nuxt.js project" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  /*
   ** Customize the progress bar color
   */
  loading: { color: "#3B8070" },
  /*
   ** Build configuration
   */
  css: ['~/assets/css/tailwind.css'],
  build: {
    publicPath: process.env.NUXT_PUBLIC_PATH || "/assets",
    vendor: ["axios", "babel-polyfill"],
    extractCSS: true,
    postcss: [
      require('tailwindcss')('./tailwind.config.js'),
      require('autoprefixer')
    ],
    /*
     ** Run ESLint on save
     */
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        });
      }
    }
  },
  babel: {
    presets: ["es2015", "stage-0"],
    plugins: [
      [
        "transform-runtime",
        {
          polyfill: true,
          regenertator: true
        }
      ]
    ]
  }
};

