<template>
  <div @click="flag.menu = ''">
    <div class="page tx-second border-gray-200 border-b">
      <div>
        <div>
          <span class="btn" @click.stop="flag.menu = 'filter'">
            <i class="material-icons">filter_list</i>
          </span>
          <!-- https://tailwindcomponents.com/component/dropdown -->
          <div class="menu row p-4" v-if="flag.menu == 'filter'" @click.stop="">
            <div class="mr-5">
              <div class="item category">
                <span>배치 상태</span>
              </div>

              <!-- https://docs.spring.io/spring-batch/trunk/apidocs/org/springframework/batch/core/BatchStatus.html -->
              <template v-for="(status, idx)
                   in ['COMPLETED', 'FAILED', '',
                       'ABANDONED', 'UNKNOWN', '',
                       'STARTING', 'STARTED', '',
                       'STOPPING', 'STOPPED']">
                <hr class="divider clear" v-if="!status" :key="idx">
                <label class="item" v-else :key="idx">
                  <input class="leading-tight" type="checkbox" :value="status" v-model="filter.status">
                  <span class=""> {{ status }} </span>
                </label>
              </template>
            </div>

            <div class="">
              <div class="item category">
                <span>정렬 기준</span>
              </div>

              <hr class="divider clear">
              <label class="item">
                <input class="leading-tight" type="checkbox" v-model="filter.date.recent">
                <span>최근</span>
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
                배치 실행
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div class="spacer"></div>
      <div>
        <span> {{ `${jobs.content.count}개 중 ${jobs.page.offset}-${jobs.page.limit}` }} </span>
        <span class="btn disabled"> <i class="material-icons">keyboard_arrow_left</i> </span>
        <span class="btn"> <i class="material-icons">keyboard_arrow_right</i> </span>
        <span class="btn"> <i class="material-icons">settings</i> </span>
      </div>
    </div>

    <table class="product-table tx-primary w-full">
      <tbody>
        <tr v-if="$_.size(jobs.content.resources) == 0">
          <td class="bg-gray-300 text-gray-500 text-lg flex justify-center">
            <div class="text-center py-4" v-if="badges[0] == 0">
              <div><i class="material-icons text-5xl">thumb_up</i></div>
              모든 주문을 완료했습니다
            </div>
            <div class="text-center py-4" v-else>
              <div><i class="material-icons text-5xl">error_outline</i></div>
              일치하는 주문 목록이 없습니다
            </div>
          </td>
        </tr>

        <tr v-for="(item, idx) in jobs.content.resources" :key="idx">
          <td class="tx-primary whitespace-no-wrap">
            <div class="w-auto">
              {{ item.jobName }}
              <span class="tx-second">{{ `#${item.jobId}` }}</span>
            </div>
          </td>

          <td class="whitespace-no-wrap">
            <span class="label" :class="item.jobStatus.toLowerCase()">
              {{ item.jobStatus }}
            </span>
          </td>

          <td class="td-truncate" :class="{'COMPLETED': 'text-gray-500', 'FAILED':'text-red-500'}[item.jobStatus] || ''">
            {{item.exitMessage}}
          </td>

          <td class="tx-second whitespace-no-wrap">
            <div :data-tooltip="$_.chain(item.jobParameters).pairs().map(e=> `${e[0]}: ${e[1]}`).value().join(', ')">
              <span class="tx-primary">
                {{ Object.keys(item.jobParameters).length }}
                parameter{{Object.keys(item.jobParameters).length != 1 && 's' || ''}}
              </span>
            </div>
          </td>

          <td class="tx-second whitespace-no-wrap text-right">
            <div class="">
              <span class="tx-primary">
                {{ item.endTime | moment('diff', item.startTime) | moment('m') }}
              </span>
              분 동안
            </div>
          </td>
          <td class="tx-second text-right whitespace-no-wrap">
            {{ item.startTime | moment("MM월 DD일") }}
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
      jobs: {content: {}, page: {}},

      flag: {
        all: false,
        menu: ''
      },
      dialog: {
        style: {},
        order: {}
      },
      orderSpec: {
        orderProduct: {},
        orderPackageCategories: []
      },
      badges: [],
      filter: {
        status: ['COMPLETED', 'FAILED', 'ABANDONED', 'UNKNOWN', 'STARTING', 'STARTED', 'STOPPING', 'STOPPED' ],
        date: {
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
      handler () { this.showExecution() }
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
    showExecution () {
      axios.get('/batch/executions.json')
        .then(res => {
          this.jobs = res.data
          if(!this.jobs.content.resources) return

          let {status} = this.filter
          let items = this.jobs.content.resources

          items = items.filter(item => status.indexOf(item.jobStatus) != -1)
          this.jobs.content.resources = this.filter.date.recent ? items : this.$_.sortBy(items, 'startTime')
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
    this.showExecution()
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
.td-truncate {
  min-width: 25rem;
  max-width: 0px;
  @apply w-full truncate;
} /* https://stackoverflow.com/a/20412246 */
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

.label {
  @apply text-white text-xs text-center rounded;
  @apply m-1 px-2 align-middle w-11/12;
  @apply inline-block;
}
.label.starting, .label.started{ @apply bg-blue-500 }
.label.completed, .label.abandoned { @apply bg-gray-400 }
.label.failed, .label.stopping, .label.stopped { @apply bg-red-500 }
.label.unknown { @apply bg-yellow-500 }

/* https://programmingsummaries.tistory.com/369 */
[data-tooltip]:hover {
  @apply relative inline-block
}
[data-tooltip]:hover:after {
  @apply absolute inset-x-0 bottom-0 z-10;
  @apply -mb-12 px-3 py-2 rounded;
  @apply text-white bg-gray-900;

  content: attr(data-tooltip);
  width: fit-content;
}
</style>
