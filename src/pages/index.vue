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
  <div @click="flag.menu = ''">
    <div class="page tx-second">
      <div>
        <div>
          <span class="btn" @click.stop="flag.menu = 'filter'">
            <i class="material-icons">filter_list</i>
          </span>
          <!-- https://tailwindcomponents.com/component/dropdown -->
          <div class="menu row p-4" v-if="flag.menu == 'filter'" @click.stop="">
            <div class="mr-5">
              <div class="item category">
                <span>주문 상태</span>
              </div>

              <label class="item">
                <input class="leading-tight" type="checkbox" value='PURCHASE' v-model="filter.type">
                <span class=""> {{ 'PURCHASE' | labels('ORDER') }} </span>
              </label>
              <label class="item">
                <input class="leading-tight" type="checkbox" value='DISPOSAL' v-model="filter.type">
                <span class=""> {{ 'DISPOSAL' | labels('ORDER') }} </span>
              </label>

              <hr class="divider clear">
              <label class="item">
                <input class="leading-tight" type="checkbox" value='REQUESTED' v-model="filter.status">
                <span class=""> {{ 'REQUESTED' | labels('ORDER') }} </span>
              </label>
              <label class="item">
                <input class="leading-tight" type="checkbox" value='PROCEEDING' v-model="filter.status">
                <span class=""> {{ 'PROCEEDING' | labels('ORDER') }} </span>
              </label>
              <label class="item">
                <input class="leading-tight" type="checkbox" value='DONE' v-model="filter.status">
                <span class=""> {{ 'DONE' | labels('ORDER') }} </span>
              </label>
              <label class="item">
                <input class="leading-tight" type="checkbox" value='DINIED' v-model="filter.status">
                <span class=""> {{ 'DINIED' | labels('ORDER') }} </span>
              </label>

              <hr class="divider clear">
              <label class="item">
                <input class="leading-tight" type="checkbox">
                <span class="">전체</span>
              </label>
            </div>

            <div class="">
              <div class="item category">
                <span>정렬 기준</span>
              </div>

              <hr class="divider clear">
              <label class="item">
                <input class="leading-tight" type="checkbox" v-model="filter.order.recent">
                <span>최근</span>
              </label>

              <hr class="divider clear">
              <label class="item">
                <input class="leading-tight" type="checkbox" value='product-name'>
                <span class="line-through">상품명</span>
                검색으로 대체
              </label>

              <hr class="divider clear">
              <label class="item">
                <input class="leading-tight" type="checkbox" value='user-name'>
                <span class="line-through">고객명</span>
                검색으로 대체
              </label>
            </div>
          </div>
        </div>

        <span class="btn">
          <i class="material-icons">refresh</i>
        </span>

        <div>
          <span class="btn" @click.stop="flag.menu = 'more'">
            <i class="material-icons">more_vert</i>
          </span>
          <ul v-if="flag.menu == 'more'" class="menu wide py-2" @click.stop="">
            <li class="item">
              <span>
                <i class="material-icons">add</i>
                주문 추가
              </span>
            </li>
          </ul>
        </div>
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
        <span class="mw-10">Cloud Z CP</span>
        <span class="badge bg-red-600 ml-2">{{ badges[0] }}</span>
      </li>
      <li>
        <span>Cloud Z DB</span>
        <span class="badge bg-red-600 ml-2">{{ badges[1] }}</span>
      </li>
    </ul>

    <table class="product-table tx-primary">
      <tbody>
        <tr v-if="$_.size(orders.content.resources) == 0">
          <td class="bg-gray-300 text-gray-500 text-lg flex justify-center">
            <div class="text-center py-4" v-if="badges[0] == 0">
              <div><i class="material-icons text-5xl">thumb_up</i></div>
              모든 주문을 완료했습니다
            </div>
            <div class="text-center py-4" v-else>
              <div><i class="material-icons text-6xl">error_outline</i></div>
              일치하는 주문 목록이 없습니다
            </div>
          </td>
        </tr>

        <tr v-for="(order, idx) in orders.content.resources" :key="idx"
            :class="{disabled: order.orderStatus == 'DONE'}">
          <td class="status clickable" @click.stop="showDialog($event, 'dialog-' + idx, order)">
            {{ order.orderType | labels('ORDER') }} {{ order.orderStatus | labels('ORDER') }}
            <i class="material-icons">keyboard_arrow_down</i>

            <ul v-if="flag.menu == 'dialog-' + idx" class="menu wide" @click.stop="">
              <template v-for="(status, idx) in options4Status(order.orderStatus)">
                <li class="item"
                    v-if="order.orderStatus != status" :key="idx"
                    @click="updateStatus(order)">
                  <span class="">
                    {{ status | labels('ORDER') }}
                  </span>
                </li>
              </template>
            </ul>
          </td>

          <td class="user">
            {{ order.orderUserId || order.orderCustomerId | labels('USER') }}
          </td>

          <td class="title clickable" @click.stop="showOrderDtail('dialog-2-' + idx, order)">
            <span class="">{{ order.productPackageName }}</span>
            <div class="badge bg-yellow-500" v-if="!order.clusterName">!</div>
            -
            <span class="tx-second">{{ `#${order.orderId}` }}</span>

            <div v-if="flag.menu == 'dialog-2-' + idx" class="dialog" @click.stop="">
              <div class="action">
                <span class="btn" @click="flag.menu = ''">
                  <i class="material-icons">open_in_new</i>
                </span>
                <span class="btn" @click="flag.menu = ''">
                  <i class="material-icons">close</i>
                </span>
              </div>

              <div class="title">{{ orderSpec.orderProduct.productPackageName }}</div>
              <div class="tx-second text-right">#{{ orderSpec.orderId }}</div>

              <div class="h-2">&nbsp;</div>
              <div class="edit">
                <div>
                  <span class="tx-color-second">Cluster</span>
                 <div class="badge bg-yellow-500" v-if="!orderSpec.orderProduct.orderClusters[0]">!</div>
                </div>
                <div v-if="orderSpec.orderProduct.orderClusters[0]">
                  <span class="mr-2">
                    {{ orderSpec.orderProduct.orderClusters[0].name }}
                  </span>
                  <span class="btn tx-color-second fit">
                    <i class="material-icons">open_in_new</i>
                  </span>
                  <span class="btn tx-color-second fit" @click="removeCluster(orderSpec)">
                    <i class="material-icons">delete_outline</i>
                  </span>
                </div>

                <input type="text" placeholder="Type cluster names"
                  v-if="!orderSpec.orderProduct.orderClusters[0]" v-model="autocomplete.keyword"/>
                <div class="autocomplete" v-if="autocomplete.keyword">
                  <div class="cand"
                      v-for="(name, idx) in autocomplete.clusters.filter(c => c.indexOf(autocomplete.keyword) != -1)"
                      :key="idx">
                    <span @click="bindCluster(orderSpec, {name: name})">{{ name }}</span>
                  </div>
                  <div class="tx-color-second">
                    Add to clusters
                    <span class="btn" @click="addCluster(orderSpec, {name: autocomplete.keyword})">
                      <i class="material-icons">add</i>
                    </span>
                  </div>
                </div>
              </div>

              <div class="h-3">&nbsp;</div>
              <div class="tx-color-second">Category</div>
              <div v-for="(item, idx) in orderSpec.orderProduct.orderPackageCategories" :key="idx">
                {{ item.itemName }}
                <span class="tx-second">{{ item.categoryName }}</span>
              </div>
            </div>
          </td>

          <td class="tx-second text-right w-20">
            {{ order.modDate || order.regDate | moment("MM월 DD일") }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- <div v-if="flag.menu == 'dialog1'" class="dialog" :style="dialog.style">
      <span>
        {{ dialog.order.orderType | labels('ORDER') }} {{ dialog.order.orderStatus | labels('ORDER') }}
      </span>
      <span class="">{{ dialog.order.productPackageName }}</span>
        -
      <span class="tx-second">{{ `#${dialog.order.orderId}` }}</span>
    </div>

    <div v-if="flag.menu == 'dialog2'" class="dialog" :style="dialog.style">
      <span>
        {{ dialog.order.orderType | labels('ORDER') }} {{ dialog.order.orderStatus | labels('ORDER') }}
      </span>
    </div> -->

    <div class="alert" v-if="snack.length">
      <div>
        <div class="label">{{ snack[0] }}</div>
        <span class="action btn" @click.stop="snack=[]">
          <i class="material-icons">close</i>
        </span>
      </div>
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
  'DONE': '완료',
  'DINIED': '반려'
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
        all: false,
        menu: ''
      },
      dialog: {
        style: {},
        order: {}
      },
      orders: {content: {}, page: {}},
      orderSpec: {
        orderProduct: {},
        orderPackageCategories: []
      },
      badges: [],
      filter: {
        type: ['PURCHASE'],
        status: ['REQUESTED', 'PROCEEDING'],
        order: {
          recent: true
        }
      },
      snack: [],
      autocomplete: {
        keyword: '',
        clusters: [
          'cloudzcp-pog-dev',
          'cloudzcp-skn-mos-dev',
          'cloudzcp-skn-mos-prod',
          'cloudzcp-hioms-dev',
          'cloudzcp-hioms-prod'
        ]
      }
    }
  },
  watch: {
    filter: {
      deep: true,
      // immediate: true,
      handler () { this.showOrders() }
    }
  },
  methods: {
    options4Status(val) {
      if(['DONE', 'DINIED'].indexOf(val) != -1)
        return []

      let arr = ['REQUESTED', 'PROCEEDING', 'DONE', 'DINIED']
      let idx = arr.indexOf(val) || 0
      return this.$_.rest(arr, idx)
    },
    toLabels (val) {
      return labels[val]
    },
    showOrders () {
      axios.get('/orders.json')
        .then(res => {
          this.orders = res.data
          if(!this.orders.content.resources) return

          let {type, status} = this.filter
          let items = this.orders.content.resources

          this.badges[0] = items.filter(item => {
            return ['PURCHASE'].indexOf(item.orderType) != -1 && ['REQUESTED', 'PROCEEDING'].indexOf(item.orderStatus) != -1
          }).length

          items = items.filter(item => {
            return type.indexOf(item.orderType) != -1 && status.indexOf(item.orderStatus) != -1
          })
          this.orders.content.resources = this.filter.order.recent ? items : this.$_.sortBy(items, 'regDate')
        })
    },
    showOrderDtail (name, order) {
      this.flag.menu = ''
      this.orderSpec = { orderProduct: {}, orderPackageCategories: [] }
      axios.get(`/order-${order.id}-${order.orderId}.json`)
        .then(res => {
          this.orderSpec = res.data
          this.flag.menu = name
        })
        .catch(e => {
          let res = e.response
          this.flag.menu = ''
          console.log(res)
          this.showSnack(`${res.status} - Cannot load a information.`)
        })
    },
    bindCluster (spec, cluster) {
      spec.orderProduct.orderClusters = [cluster]
      this.autocomplete.keyword = ''

      //TODO: remove
      let order = this.orders.content.resources.find(o => o.id == spec.id) || {}
      order.clusterName = cluster.name
    },
    addCluster (spec, cluster) {
      console.log(cluster)
      this.autocomplete.clusters.push(cluster.name)
      this.$nextTick(() => this.bindCluster(spec, cluster))
    },
    removeCluster (spec) {
      if(confirm('클러스터 정보를 삭제하시겠습니까?')){
        spec.orderProduct.orderClusters = []

        //TODO: remove
        let order = this.orders.content.resources.find(o => o.id == spec.id) || {}
        order.clusterName = ''
      }
    },
    updateStatus (order) {
      if(confirm('주문 상태를 변경하시겠습니까?')) {
        //TODO: change order status
        this.flag.menu = ''
        this.showOrders()
      }
    },
    showSnack (msg) {
      this.snack.push(msg)
    },
    showDialog (e, name, order) {
      this.flag.menu = name

      // https://www.sitepoint.com/community/t/how-to-position-modal-dialog-at-x-y-coordinates-of-click-event/224882/2
      var popup = {style: {}}
      popup.style.position = 'absolute';
      popup.style.display = 'block';
      popup.style.zIndex = '10100';

      popup.style.top = e.pageY + 'px';
      popup.style.left = e.pageX + 'px';

      this.dialog.style = popup.style
      this.dialog.order = order
    }
  },
  mounted () {
    this.showOrders()
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
.tx-color-primary { color: #202124 }
.tx-color-second { @apply text-gray-600 }
.tx-primary { @apply tx-size-primary tx-color-primary }
.tx-second { @apply tx-size-second tx-color-second }

.product-table { @apply bg-white w-full }
.product-table tr:hover { @apply bg-gray-300 }
.product-table td { @apply border-gray-200 border-b py-2 px-3 }
.product-table .status { @apply w-24 tx-size-primary pr-0 }
.product-table .status i { @apply tx-size-primary align-middle }
.product-table .user { @apply w-24 tx-size-primary }
.product-table .title { @apply pl-5 }

.product-table .disabled { @apply bg-gray-200 }

.tab { @apply flex border-gray-200 border-t border-b }
.tab > * { @apply block p-3 w-40 !important }
.tab > *:hover { @apply bg-gray-200 }
.tab .active { @apply text-blue-600 border-blue-600 border-b-2 }

.page { @apply flex justify-between p-3 }
.page div { @apply inline-block }
/* .page span:not(:first-child) { @apply ml-3 } */
.page .btn { @apply ml-3 }
.page .spacer { @apply flex-grow mx-auto }
.btn { @apply px-3 m-0 pb-1 !important inline-block; }
.btn i { @apply align-middle text-lg; }
.btn:hover {
  @apply cursor-pointer bg-gray-700 rounded-full opacity-25;
  @apply text-white;
}

.btn.fit { @apply px-0 }

.btn.disabled { @apply text-gray-400 }
.btn.disabled:hover {
  @apply cursor-pointer bg-transparent opacity-100;
}


.shadow-material { box-shadow: 0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12) }
.shadow-material-deep { box-shadow: 0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.2) }

.menu { @apply rounded shadow-material absolute mt-1 ml-3 bg-white }
.menu { @apply flex flex-col !important }
.menu.row { @apply flex-row !important }
.menu div { @apply block }
.menu .item { @apply text-black px-2 py-2 }
.menu .item.category { @apply mb-3 border-b border-gray-700 }

.menu.wide { @apply py-2 px-0 }
.menu.wide .item { @apply p-1 px-4 }
.menu.wide .item:hover { @apply bg-gray-300 }
.menu.wide .item span { @apply align-bottom }
.menu.wide .item i { @apply text-lg align-middle }
/* .menu { @apply rounded shadow-material absolute mt-6 -ml-10 bg-white p-3 } */
/* .menu ul { @apply p-3 } */
/* .menu ul li label { @apply text-black px-2 py-2 } */
.menu .divider { @apply border-t mx-2 border-gray-300 }
.menu .divider.clear { @apply border-transparent }

.product-table .menu { @apply -ml-2 mt-1 }
.clickable:hover { @apply cursor-pointer }

.dialog { @apply rounded shadow-material-deep absolute mt-1 bg-white py-6 px-8 }
.dialog .action { @apply flex justify-end text-gray-600 -mr-4 -mt-1 text-sm }
.dialog .title { @apply text-lg p-0 }
.dialog .edit input { @apply border-b-2 }

.alert {
  @apply fixed top-0 inset-x-0 mt-5;
  @apply flex justify-center;
}
.alert > div:first-child {
  @apply rounded shadow-material;
  @apply bg-red-500 text-white tx-size-primary;
}
.alert .label { @apply inline-block py-3 px-2 ml-4 leading-none }
.alert .action { @apply inline-block py-3 px-2 mr-4 leading-none }

.badge {
  @apply text-white text-xs text-center rounded-lg;
  @apply w-6 mb-1 align-middle;
  @apply inline-block;
}
</style>
