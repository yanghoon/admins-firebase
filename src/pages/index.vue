<template>
  <!-- <div>
    <div class="product tx-primary flex items-center"
          v-for="(order, idx) in orders.content.resources" :key="idx">
      <span class="col">
        {{ order.orderType | labels('ORDER') }} {{ order.orderStatus | labels('ORDER') }}
      </span>
      <span class="col-2">{{ order.orderUserId || order.orderCustomerId | labels('USER') }}</span>
      <div class="col flex-grow">
        <span class="tx-primary">{{ order.productPackageName }}</span>
        -
        <span class="text-2nd">{{ `#${order.orderId}` }}</span>
      </div>
      <span class="text-2nd">{{ order.modDate || order.regDate | moment("MM월 DD일") }}</span>
    </div>
  </div> -->
  <div>
    <div class="page tx-second">
      <div>
        <span class="btn">
          <i class="material-icons">refresh</i>
        </span>
        <span class="btn">
          <i class="material-icons">more_vert</i>
        </span>
      </div>
      <div class="spacer"></div>
      <div>
        <span>
          {{ `${orders.content.count}개 중 ${orders.page.offset}-${orders.page.limit}` }}
        </span>
        <span class="btn disabled">
          <i class="material-icons">keyboard_arrow_left</i>
        </span>
        <span class="btn">
          <i class="material-icons">keyboard_arrow_right</i>
        </span>
        <span class="btn">
          <i class="material-icons">settings</i>
        </span>
      </div>
    </div>

    <ul class="tab">
      <li class="active">
        <span>Cloud Z CP</span>
      </li>
      <li>
        <span>Cloud Z DB</span>
      </li>
    </ul>

    <table class="product-table tx-primary">
      <tbody>
        <tr v-for="(order, idx) in orders.content.resources" :key="idx"
            class="">
          <td class="status">
            {{ order.orderType | labels('ORDER') }} {{ order.orderStatus | labels('ORDER') }}
          </td>
          <td class="user">
            {{ order.orderUserId || order.orderCustomerId | labels('USER') }}
          </td>
          <td class="title">
            <span class="">{{ order.productPackageName }}</span>
            -
            <span class="tx-second">{{ `#${order.orderId}` }}</span>
          </td>
          <td class="tx-second text-right">
            {{ order.modDate || order.regDate | moment("MM월 DD일") }}
          </td>
        </tr>
      </tbody>
    </table>
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

let users = {
  'zservice': 'Z Service',
  'jooo85': 'Z Action'
}

export default {
  // async asyncData() {
  //   const res = await axios.get('https://nuxt-ssr.firebaseio.com/facts.json')
  //   const facts = res.data
  //   return { facts }
  // }
  data () {
    return {
      flag: {
        all: false
      },
      orders: {content: {}, page: {}}
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
  },
  filters: {
    labels (val, type) {
      if (type == 'ORDER') {
        return labels[val] || val
      } else if (type == 'USER') {
        return users[val] || val
      }
      return val
    }
  }
}
</script>

<style>
.tx-size-primary { @apply text-sm }
.tx-size-second { @apply text-xs }
.tx-color-primary { @apply text-gray-900 }
.tx-color-second { @apply text-gray-600 }
.tx-primary { @apply tx-size-primary tx-color-primary }
.tx-second { @apply tx-size-second tx-color-second }

.product-table { @apply bg-white w-full }
.product-table td { @apply border-gray-200 border-b py-2 px-3 }
.product-table .status { @apply w-20 tx-size-second }
.product-table .user { @apply w-20 tx-size-second }
.product-table .title { @apply pl-5 }

/* .product-table .disabled { @apply bg-gray-200 } */

.tab { @apply flex border-gray-200 border-t border-b }
.tab > * { @apply inline-block p-3 w-1/5 }
.tab > *:hover { @apply bg-gray-200 }
.tab .active { @apply text-blue-600 border-blue-600 border-b-2 }

.page { @apply flex justify-between p-3 }
.page div { @apply inline-block }
.page span:not(:first-child) { @apply ml-3 }
.page .spacer { @apply flex-grow mx-auto }

.btn { @apply px-3 m-0 pb-1 !important; }
.btn i { @apply align-middle text-lg; }
.btn:hover {
  @apply cursor-pointer bg-gray-700 rounded-full opacity-25;
  @apply text-white;
}

.btn.disabled { @apply text-gray-400 }
.btn.disabled:hover {
  @apply cursor-pointer bg-transparent opacity-100;
}
</style>
