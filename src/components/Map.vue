<template>
  <div>
    <l-map  ref="myMap"
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      :bounds="bounds"
      style="height: 100vH"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate"
    >
      <l-tile-layer
        :url="url"
        :attribution="attribution"
      />
      </l-tile-layer>
      <l-marker
        v-for="marker in markerGroup"
        :key="marker.index"
        :visible="true"
        :draggable="false"
        :lat-lng.sync="marker.position"
        @click="opened = marker.index"
      />
      </l-marker>
      <l-marker
        v-for="marker in remoteMarkers"
        :key="'r' + marker.index"
        :visible="true"
        :draggable="false"
        :lat-lng.sync="marker.position"
        @click="opened = marker.index"
      />
      </l-marker>
    </l-map>
    <div v-for="site in sites" :key="site.index">
      <station :id="site.index" v-show="site.index === opened" @clickclose="closeStations"></station>
    </div>

    <h1>Sites:</h1>
    <ul v-if="sites.length > 0">
      <li v-for="site in sites" :key="site.index">{{ site.name.filter((x) => { return x.locale === $i18n.locale})[0].name }}</li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
import Station from '@/components/Station'
import { L, LMap, LTileLayer, LMarker } from 'vue2-leaflet'

export default {
  components: {
      LMap,
      LTileLayer,
      LMarker, 
      Station
  },
  data () {
    return {
      map: null,
      opened: null,
      sites: [],
      markerGroup: [],
      remoteMarkers: [],
      zoom: 8,
      center: L.latLng(58.8607968, 25.2094053),
      url: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      currentZoom: 8,
      currentCenter: L.latLng(58.8607968, 25.2094053),
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.5
      },
      bounds: null
    }
  },
  methods: {
    zoomUpdate (zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate (center) {
      this.currentCenter = center;
    },
    loadStation (id) {
      alert(id)
    },
    closeStations () {
      this.opened = null
    }
  },
  async created () {
    const SITES_URL = `${process.env.VUE_APP_BASE_URL}/`
    const response = await axios.get(SITES_URL)
    this.sites = response.data.data
    this.sites.forEach((site, index) => {
      this.sites[index].position = { lat: site.latitude,
            lng: site.longitude }
      // let marker = await LMarker.new(L.latLng(site.latitude, site.longitude))
      this.markerGroup.push({ index: site.index, position: { lat: site.latitude , lng:  site.longitude }, visible: true, draggable: false})
      this.remoteMarkers.push({ index: site.index, position: { lat: site.remote_latitude, lng: site.remote_longitude }, visible: true, draggable: false })
      this.bounds = L.latLngBounds(this.markerGroup.map((o) => o.position))
    })
  },
  watch: {
    opened: {
      handler () {
        this.$emit('opened', this.opened)
      },
      deep: true
    }
  }
}
</script>