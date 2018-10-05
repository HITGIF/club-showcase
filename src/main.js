import Vue from 'vue'
import App from './App'
import router from './router'
import * as resources from './resources'
import resource from './plugins/resource'
import deviceQueries from './plugins/device-queries'
import Pace from 'pace-progress'
import Viewer from 'v-viewer'
import { MdButton, MdContent, MdIcon, MdDialog, MdField, MdSnackbar } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import VueResource from 'vue-resource'

Vue.config.productionTip = false

Vue.use(resource, {
  resources,
  endpoint: 'https://api.mlzjsu.com'
  // endpoint: 'http://127.0.0.1:5000'
})

Vue.use(deviceQueries, {
  phone: 'max-width: 567px',
  tablet: 'min-width: 568px',
  mobile: 'max-width: 1024px',
  laptop: 'min-width: 1025px',
  desktop: 'min-width: 1280px',
  monitor: 'min-width: 1448px'
})

Vue.use(Viewer)
Vue.use(MdContent)
Vue.use(MdButton)
Vue.use(MdIcon)
Vue.use(MdDialog)
Vue.use(MdField)
Vue.use(MdSnackbar)
Vue.use(VueResource)

new Vue({
  router,
  render: h => h(App),
  mounted() {
    Pace.start()
    Pace.on('hide', () => {
      document.dispatchEvent(new Event('app.rendered'));
    })
  }
}).$mount('#app')
