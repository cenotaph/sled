import Vue from 'vue'
import App from './App.vue'
import router from './router'
import * as Vue2Leaflet from 'vue2-leaflet'
import L from 'leaflet'
import 'vue-awesome/icons/train'
import Icon from 'vue-awesome/components/Icon'
require('datejs')

import VueHead from 'vue-head'

Vue.use(VueHead)
let defaultLocale = ''

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})
Vue.component('l-map', Vue2Leaflet.LMap);
Vue.component('l-tilelayer', Vue2Leaflet.LTileLayer);
Vue.component('l-marker', Vue2Leaflet.LMarker);
Vue.component('l-tooltip', Vue2Leaflet.LTooltip);
Vue.component('l-popup', Vue2Leaflet.LPopup);
Vue.component('l-control-zoom', Vue2Leaflet.LControlZoom);
Vue.component('l-geo-json', Vue2Leaflet.LGeoJson);
Vue.component('l-feature-group', Vue2Leaflet.LFeatureGroup);
Vue.component('v-icon', Icon)

Vue.config.productionTip = false

if (localStorage.locale) {
  if (localStorage.locale === 'et-EE' || localStorage.locale === 'en-GB' || localStorage.locale === 'ru-RU') {
    defaultLocale = localStorage.getItem('locale')
  } else {
    defaultLocale = 'et-EE'
    localStorage.setItem('locale', defaultLocale)
  }
} else {
  defaultLocale = 'et-EE'
  localStorage.setItem('locale', defaultLocale)
}
Date.i18n.setLanguage(defaultLocale)

const i18n = new Vue({ data: { locale: defaultLocale}})

i18n.install = function(){
  Object.defineProperty(Vue.prototype, '$i18n', {
    get () { return i18n }
  })
}
Vue.use(i18n)

new Vue({L,
  router,
  render: h => h(App)
}).$mount('#app')

