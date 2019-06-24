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
          <ul v-if="flag.menu == 'filter'" class="menu" @click.stop="">
            <li>
              <label class="item">
                <input class="leading-tight" type="checkbox" value='PURCHASE' v-model="filter.type">
                <span class=""> {{ 'PURCHASE' | labels('ORDER') }} </span>
              </label>
              <label class="item">
                <input class="leading-tight" type="checkbox" value='DISPOSAL' v-model="filter.type">
                <span class=""> {{ 'DISPOSAL' | labels('ORDER') }} </span>
              </label>
            </li>
            <li><hr class="divider"></li>
            <li>
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
            </li>
            <li><hr class="divider"></li>
            <li>
              <label class="item">
                <input class="leading-tight" type="checkbox">
                <span class="">전체</span>
              </label>
            </li>
          </ul>
        </div>

        <span class="btn">
          <i class="material-icons">refresh</i>
        </span>

        <div>
          <span class="btn" @click.stop="flag.menu = 'more'">
            <i class="material-icons">more_vert</i>
          </span>
          <ul v-if="flag.menu == 'more'" class="menu" @click.stop="">
            <li>
              <label>
                <input class="leading-tight" type="checkbox">
                <span class=""> {{ 'PURCHASE' | labels('ORDER') }} </span>
              </label>
              <label>
                <input class="leading-tight" type="checkbox">
                <span class=""> {{ 'DISPOSAL' | labels('ORDER') }} </span>
              </label>
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
        <span>Cloud Z CP</span>
        <span class="badge">{{ badges[0] }}</span>
      </li>
      <li>
        <span>Cloud Z DB</span>
        <span class="badge">{{ badges[1] }}</span>
      </li>
    </ul>

    <table class="product-table tx-primary">
      <tbody>
        <tr v-for="(order, idx) in orders.content.resources" :key="idx"
            :class="{disabled: order.orderStatus == 'DONE'}">
          <td class="status clickable" @click.stop="showDialog($event, 'dialog-' + idx, order)">
            {{ order.orderType | labels('ORDER') }} {{ order.orderStatus | labels('ORDER') }}

            <ul v-if="flag.menu == 'dialog-' + idx" class="menu" @click.stop="">
              <template class="item" v-for="(status, idx) in ['REQUESTED', 'PROCEEDING', 'DONE']">
                <li class="item" v-if="order.orderStatus != status" :key="idx">
                  <!-- <span class=""> {{ order.orderType | labels('ORDER') }} {{ status | labels('ORDER') }} </span> -->
                  <span class="">{{ status | labels('ORDER') }}</span>
                </li>
              </template>
            </ul>
          </td>

          <td class="user">
            {{ order.orderUserId || order.orderCustomerId | labels('USER') }}
          </td>

          <td class="title clickable" @click.stop="showOrderDtail('dialog-2-' + idx, order)">
            <span class="">{{ order.productPackageName }}</span>
            -
            <span class="tx-second">{{ `#${order.orderId}` }}</span>

            <div v-if="flag.menu == 'dialog-2-' + idx" class="dialog" @click.stop="">
              <div class="action">
                <span class="btn" @click="flag.menu = ''">
                  <i class="material-icons">share</i>
                </span>
                <span class="btn" @click="flag.menu = ''">
                  <i class="material-icons">close</i>
                </span>
              </div>

              <div class="title">{{ orderSpec.orderProduct.productPackageName }}</div>
              <div class="tx-second text-right">#{{ orderSpec.orderId }}</div>

              <div class="h-2">&nbsp;</div>
              <div class="edit">
                <div class="tx-color-second">Cluster</div>
                <div v-if="orderSpec.orderProduct.orderClusters[0]">
                  {{ orderSpec.orderProduct.orderClusters[0].name }}
                  <span class="btn tx-color-second" @click="orderSpec.orderProduct.orderClusters = []">
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
        status: ['REQUESTED', 'PROCEEDING']
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
      immediate: true,
      handler () { this.showOrders() }
    }
  },
  methods: {
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
          this.orders.content.resources = items.filter(item => {
            return type.indexOf(item.orderType) != -1 && status.indexOf(item.orderStatus) != -1
          })
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
    },
    addCluster (spec, cluster) {
      console.log(cluster)
      this.autocomplete.clusters.push(cluster.name)
      this.$nextTick(() => this.bindCluster(spec, cluster))
    },
    showSnack (msg) {
      this.snack.push(msg)
    },
    showDialog (e, name, order) {
      this.flag.menu = name

      // https://www.sitepoint.com/community/t/how-to-position-modal-dialog-at-x-y-coordinates-of-click-event/224882/2
      // positon popup on page relative to cursor
      // position at time of click event 
      var VPWH = [];                  // view port width / height
      var intVPW, intVPH;             // view port width / height
      var intCoordX = e.clientX;    
      var intCoordY = e.clientY;    // distance from click point to view port top
      var intDistanceScrolledUp = document.body.scrollTop;
            // distance the page has been scrolled up from view port top
      var intPopupOffsetTop = intDistanceScrolledUp + intCoordY;
          // add the two for total distance from click point y to top of page

      var intDistanceScrolledLeft = document.body.scrollLeft;
      var intPopupOffsetLeft = intDistanceScrolledLeft + intCoordX;

      VPWH = this.getViewPortWidthHeight();    // view port Width/Height
      intVPW = VPWH[0];
      intVPH = VPWH[1];

      var popup = {style: {}}
      popup.style.position = 'absolute';
              // if not display: block, .offsetWidth & .offsetHeight === 0
      popup.style.display = 'block';
      popup.style.zIndex = '10100';

      if ( intCoordX > intVPW/2 ) { intPopupOffsetLeft -= popup.offsetWidth; }
            // if x is in the right half of the viewport, pull popup left by its width
      if ( intCoordY > intVPH/2 ) { intPopupOffsetTop -= popup.offsetHeight; }
          // if y is in the bottom half of view port, pull popup up by its height

      // popup.style.top = intPopupOffsetTop + 'px';
      // popup.style.left = intPopupOffsetLeft + 'px';

      popup.style.top = e.pageY + 'px';
      popup.style.left = e.pageX + 'px';

      this.dialog.style = popup.style
      this.dialog.order = order
    },
    getViewPortWidthHeight() {
      // https://stackoverflow.com/a/2035211
      var viewPortWidth;
      var viewPortHeight;

      // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
      if (typeof window.innerWidth != 'undefined') {
        viewPortWidth = window.innerWidth,
        viewPortHeight = window.innerHeight
      }

      // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
      else if (typeof document.documentElement != 'undefined'
      && typeof document.documentElement.clientWidth !=
      'undefined' && document.documentElement.clientWidth != 0) {
          viewPortWidth = document.documentElement.clientWidth,
          viewPortHeight = document.documentElement.clientHeight
      }

      // older versions of IE
      else {
        viewPortWidth = document.getElementsByTagName('body')[0].clientWidth,
        viewPortHeight = document.getElementsByTagName('body')[0].clientHeight
      }
      return [viewPortWidth, viewPortHeight];
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
.tx-color-primary { @apply text-gray-900 }
.tx-color-second { @apply text-gray-600 }
.tx-primary { @apply tx-size-primary tx-color-primary }
.tx-second { @apply tx-size-second tx-color-second }

.product-table { @apply bg-white w-full }
.product-table td { @apply border-gray-200 border-b py-2 px-3 }
.product-table .status { @apply w-20 tx-size-second }
.product-table .user { @apply w-20 tx-size-second }
.product-table .title { @apply pl-5 }

.product-table .disabled { @apply bg-gray-200 }

.tab { @apply flex border-gray-200 border-t border-b }
.tab > * { @apply inline-block p-3 w-1/5 }
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

.btn.disabled { @apply text-gray-400 }
.btn.disabled:hover {
  @apply cursor-pointer bg-transparent opacity-100;
}


.shadow-material { box-shadow: 0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12) }
.shadow-material-deep { box-shadow: 0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.2) }

.menu { @apply rounded shadow-material absolute mt-1 ml-3 bg-white p-3 }
.menu .item { @apply text-black px-2 py-2 }
/* .menu { @apply rounded shadow-material absolute mt-6 -ml-10 bg-white p-3 } */
/* .menu ul { @apply p-3 } */
/* .menu ul li label { @apply text-black px-2 py-2 } */
.menu .divider { @apply border-t mx-2 border-gray-300 }

.product-table .menu { @apply -ml-2 mt-1 }
.clickable:hover { @apply cursor-pointer }

.dialog { @apply rounded shadow-material-deep absolute mt-1 bg-white p-6 }
.dialog .action { @apply flex justify-end mb-1 text-gray-600 -mr-4 -mt-1 text-sm }
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
  @apply bg-red-600 text-white text-xs text-center rounded-lg;
  @apply w-6 ml-2 mb-1 align-middle;
  @apply inline-block;
}
</style>
