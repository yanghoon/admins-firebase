<template>
  <div>
    <div class="product flex items-center"
          v-for="(order, idx) in orders.content.resources" :key="idx">
      <span class="status">
        {{ toLabels(order.orderType) }} {{ toLabels(order.orderStatus) }}
      </span>
      <span class="user">{{ order.orderCustomerId }}</span>
      <span class="name">{{ order.productPackageName }}</span>
      <p class="info">- {{ `#${order.id}` }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

let labels = {
  'PURCHASE': '구매',
  'DISPOSAL': '취소',
  'REQUESTED': '요청',
  'PROCEEDING': '진행중',
  'DONE': '완료'
}

export default {
  // async asyncData() {
  //   const res = await axios.get('https://nuxt-ssr.firebaseio.com/facts.json')
  //   const facts = res.data
  //   return { facts }
  // }
  data () {
    return {
      orders: {content: {}}
    }
  },
  methods: {
    toLabels (val) {
      return labels[val]
    }
  },
  mounted () {
    axios.get('/orders.json')
      .then(res => this.orders = res.data)
  }
}
</script>

<style>
.product {
  @apply w-9/12 mx-auto p-3 bg-white
  /* @apply ml-6 pt-1 */
}
.product .status { @apply text-sm text-gray-900 mr-5 }
.product .user { @apply text-sm text-gray-900 mr-10 }
.product .name { @apply text-sm text-gray-900 mr-1 }
.product .info { @apply text-xs text-gray-600 leading-normal }
</style>
