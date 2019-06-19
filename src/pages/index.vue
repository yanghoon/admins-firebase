<template>
  <ul>
    <li v-for="(fact, factIdx) in facts" :key="factIdx">
      {{ fact.text }}
    </li>
  </ul>
</template>

<script>
import axios from 'axios'

export default {
  async asyncData() {
    const res = await axios.get('https://nuxt-ssr.firebaseio.com/facts.json')
    const facts = res.data
    return { facts }
  }
  // data () {
  //   return {
  //     facts: []
  //   }
  // },
  // mounted () {
  //   axios.get('https://nuxt-ssr.firebaseio.com/facts.json')
  //     .then(res => this.facts = res.data)
  // }
}
</script>

<style>
</style>
