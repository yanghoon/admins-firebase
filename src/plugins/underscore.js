import Vue from 'vue'
import underscore from 'underscore'

const VueUnderscore = {
  install: function(Vue, options) {
    Vue.prototype.$_ = underscore;
  }
};

Vue.use(VueUnderscore)

export default VueUnderscore
export const _= underscore