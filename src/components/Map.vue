<template>
  <div>
    <div class="fullsMap" />
    <div class="activeArea" />
    <l-map ref="myMap"
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      style="height: 70vH"
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
        @click="loadStation(marker.index)"
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
      <station :id="site.index" :station="site" v-show="site.index === opened" 
        @animate="animateMap"
        @clickclose="closeStations"></station>
    </div>
<!-- 
    <h1>Sites:</h1>
    <ul v-if="sites.length > 0">
      <li v-for="site in sites" :key="site.index">{{ site.name.filter((x) => { return x.locale === $i18n.locale})[0].name }}</li>
    </ul> -->
  </div>
</template>

<script>
// import axios from 'axios'
import Station from '@/components/Station'
import L from 'leaflet'
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'
import 'leaflet-active-area'
export default {
  components: {
      LMap,
      LTileLayer,
      LMarker,
      Station
  },
  head: {
    title: {
      inner: 'Siberi Lapsed',
      complement: 'Map'
    }
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
      bounds: null,
      newBounds: null,
      startZoom: null
    }
  },
  methods: {
    animateMap (coords) {
      console.log(coords)

      const map = this.$refs.myMap.mapObject
      map.flyTo(L.latLng(coords[0], coords[1]), 11, { animation: true, duration: 3 })
    },
    zoomUpdate (zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate (center) {
      this.currentCenter = center;
    },
    loadStation (index) {
      const map = this.$refs.myMap.mapObject
      this.opened = index
      map.setActiveArea('activeArea', false, true)
      // this.center = this.sites[index].position
      map.flyTo(this.sites[index].position, 14, { animation: true })

    },
    async closeStations () {
      const map = this.$refs.myMap.mapObject
      this.opened = null
      map.setActiveArea('fullsMap', false, true)
      await map.flyTo(this.center, 8, { animation: true }).once('moveend', () => {
        map.fitBounds(this.bounds)
      })
    }
  },
  async created () {
    // const SITES_URL = `${process.env.VUE_APP_BASE_URL}/`
    // const response = await axios.get(SITES_URL)
    // this.sites = response.data.data
    this.sites = require('../data/index.json')
    this.sites.forEach((site) => {
      this.sites[site.index].data = require("../data/sites/" + site.index + ".json")
    })

    // map.setActiveArea('fullMap')
    this.sites.forEach((site, index) => {
      this.sites[index].position = { lat: site.latitude,
            lng: site.longitude }
      // let marker = await LMarker.new(L.latLng(site.latitude, site.longitude))
      this.markerGroup.push({ index: site.index, position: { lat: site.latitude , lng:  site.longitude }, visible: true, draggable: false})
      site.remote_stations.forEach((remote) =>  {
        this.remoteMarkers.push({ index: site.index, position: { lat: remote.remote_latitude, lng: remote.remote_longitude }, visible: true, draggable: false })
      })
    })

  },
  mounted () {
    const map = this.$refs.myMap.mapObject
    // console.log(this.markerGroup.map((o) => o.position.lat))
    this.bounds = L.latLngBounds(this.markerGroup.map((o) => o.position))
    // console.log(map)
    // console.log(this.bounds)
    map.fitBounds(this.bounds)
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