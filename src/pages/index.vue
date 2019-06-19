<template>
  <div>
    <div class="card flex items-center" v-for="(fact, factIdx) in facts" :key="factIdx">
      <div class="">
        <img class="arvitor" src="favicon.ico" alt="ChitChat Logo">
      </div>
      <div class="message">
        <h4 class="title">{{ factIdx }}</h4>
        <p class="text">{{ fact.text }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  // async asyncData() {
  //   const res = await axios.get('https://nuxt-ssr.firebaseio.com/facts.json')
  //   const facts = res.data
  //   return { facts }
  // }
  data () {
    return {
      facts: []
    }
  },
  mounted () {
    axios.get('https://nuxt-ssr.firebaseio.com/facts.json')
      .then(res => this.facts = res.data)
  }
}
</script>

<style>
.card { @apply max-w-sm mx-auto p-6 mb-2 bg-white rounded-lg shadow-xl }
.card .arvitor { @apply object-contain object-center w-6 }
.card .message { @apply ml-6 pt-1 }
.card .message .title { @apply text-lg text-gray-900 leading-tight }
.card .message .text { @apply text-base text-gray-600 leading-normal }
</style>
