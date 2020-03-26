<template>
  <div>
    <div class="fullsMap" />
    <div class="activeArea" />
    <l-map ref="myMap"
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      style="height: 78vH"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate"
    >
      <l-tile-layer
        :url="url"
        :attribution="attribution"
      />
      <l-marker
        :key="'homeMarker'"
        :visible="mapHome.visible"
        :draggable="false"
        :lat-lng.sync="mapHome.position"
        :icon="home" 
      />

      <l-marker
        v-for="marker in markerGroup"
        :key="marker.index"
        :visible="true"
        :draggable="false"
        :lat-lng.sync="marker.position"
        @click="loadStation(marker.index)"
        :icon="stationIcon"
      />

      <l-marker
        v-for="marker in remoteMarkers"
        :key="'r' + marker.position.lat + marker.index"
        :visible="true"
        :draggable="false"
        :lat-lng.sync="marker.position"
        @click="opened = marker.index"
      />
      </l-marker>
      <l-polyline v-if="polyline"
            :lat-lngs="polyline"
            :color="'#fce2ed'">
            </l-polyline>
    </l-map>
    <div v-for="site in sites" :key="site.index">
      <station :id="site.index" :station="site" v-show="site.index === opened" 
        :routes="routes"
        :routeError="routeError"
        @animate="animateMap"
        @drawline="selectRoute"
        @transit="mapTransit"
        @clickclose="closeStations">
        </station>

    </div>


<!-- 
    <h1>Sites:</h1>
    <ul v-if="sites.length > 0">
      <li v-for="site in sites" :key="site.index">{{ site.name.filter((x) => { return x.locale === $i18n.locale})[0].name }}</li>
    </ul> -->
  </div>
</template>

<script>
import axios from 'axios'
import Station from '@/components/Station'
import L from 'leaflet'
import { LMap, LTileLayer, LMarker, LPolyline } from 'vue2-leaflet'
import 'leaflet-providers'
import 'leaflet-active-area'

export default {
  components: {
      LMap,
      LTileLayer,
      LPolyline,
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
      home: L.icon({
        iconUrl: require('../../static/images/marker-icon-orange.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        iconSize: [32, 51],
        iconAnchor: [16,37]
      }),
      stationIcon: L.icon({
        iconUrl: require('../../static/images/marker-icon-pink.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        iconSize: [32, 51],
        iconAnchor: [16,37]
      }),
      routes: {},
      routeError: null,
      sites: [],
      destCoords: [],
      appId: 'QCJaKxfVS3WQo8N9mmh8',
      appCode: 'G_bqYSFUlIGxKq3YEVSkEA',
      markerGroup: [],
      remoteMarkers: [],
      mapHome: {
        position: {
          lat: 57.9632935,
          lng: 26.8463984
        },
        visible: false
      },
      polyline: null,
      zoom: 8,
      center: L.latLng(58.8607968, 25.2094053),
      url: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
      // url: "https://2.base.maps.api.here.com/maptile/2.1/maptile/newest/reduced.day/{z}/{x}/{y}/512/png8?app_id=" + this.appId + "&app_code=" + this.appCode + "&ppi=320",
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      currentZoom: 8,
      currentCenter: L.latLng(58.8607968, 25.2094053),
      showParagraph: false,
      mapOptions: {
        zoomControl: false,
        zoomSnap: 0.5
      },
      bounds: null,
      newBounds: null,
      startZoom: null
    }
  },
  methods: {
    animateMap (coords) {
      const map = this.$refs.myMap.mapObject
      map.flyTo(L.latLng(coords[0], coords[1]), 11, { animation: true, duration: 3 })
    },
    selectRoute (routeId) {
      const map = this.$refs.myMap.mapObject
      let line = []
      this.routes.Connection[routeId].Sections.Sec.map( (o) => {
        if (o.graph) {
          let pieces = o.graph.split(/(\s+)/)
          pieces.forEach((p) => {
            let [Lat, Lng] = p.split(/,/)
            if (Lat && Lng) {
              line.push([parseFloat(Lat), parseFloat(Lng)])
            }
          })
        } else if (o.Dep.Stn) {
          line.push([o.Dep.Stn.y, o.Dep.Stn.x])
          if (o.Arr.Stn) {
            line.push([o.Arr.Stn.y, o.Arr.Stn.x])
          } else if (o.Arr.Addr) {
            line.push([o.Arr.Addr.y, o.Arr.Addr.x])
          }
        } else if (o.Dep.Addr) {
          line.push([o.Dep.Addr.y, o.Dep.Addr.x])
          if (o.Arr.Stn) {
            line.push([o.Arr.Stn.y, o.Arr.Stn.x])
          } else if (o.Arr.Addr) {
            line.push([o.Arr.Addr.y, o.Arr.Addr.x])
          }
        }
      })
      // console.log(line)
      this.polyline = line
      map.fitBounds(L.latLngBounds(this.polyline), {animate: true, duration: 2})
    },
    mapTransit (coords, tallinn) {
      this.polyline = null
      this.routes = {}

      const map = this.$refs.myMap.mapObject
      map.locate()
      console.log('one iteration for ' + coords)
      map.on('locationfound', async (e) => {
        let start = []
        if (tallinn == true) {
          start = [59.441088, 24.738060]
          // start = [56.9713962,23.9890824]
        } else {
          start = [e.latlng.lat, e.latlng.lng]
        }
        this.mapHome = {position: { lat: start[0], lng: start[1] } }
        this.mapHome.visible = true
        map.fitBounds([start, coords])

        const TRANSIT_URL = "https://transit.api.here.com/v3/route.json?app_id=" + 
        this.appId + "&app_code=" + this.appCode + "&routing=all&dep=" + start[0] + 
        "," + start[1] + "&arr=" + coords[0] + "," + coords[1] + "&routing=tt&max=6&walk=6000,100&maneuvers=1&graph=1&time=" + new Date().toISOString()

        const hereReq = await axios.get(TRANSIT_URL)
        if (hereReq.data.Res.Connections) {
          this.routes = hereReq.data.Res.Connections
        } else {
          this.destCoords = coords
          this.routeError = true          
        }
      }), function () {
        console.log('exited')
      }
    },
    zoomUpdate (zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate (center) {
      this.currentCenter = center;
    },
    loadStation (index) {
      this.routes = {}
      this.routeError = false
      this.polyline = null
      const map = this.$refs.myMap.mapObject
      this.opened = index
      map.setActiveArea('activeArea', false, true)
      // this.center = this.sites[index].position
      map.flyTo(this.sites[index].position, 14, { animation: true })

    },
    async closeStations () {
      this.routes = null
      this.routeError = false
      this.polyline = null
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
    
    new L.Control.Zoom({ position: 'bottomleft' }).addTo(map);
    // console.log(this.markerGroup.map((o) => o.position.lat))
    this.bounds = L.latLngBounds(this.markerGroup.map((o) => o.position))
    // console.log(map)
    // console.log(this.bounds)
    // const defaultLayer = 
    // L.tileLayer.provider('HERE.terrainDay', {
    //     app_id: this.appId,
    //     app_code: this.appCode
    // }).addTo(map)
    // const baseLayers = {"HERE": defaultLayer,
    //   'Thunderforest Transport': L.tileLayer.provider('Thunderforest.Transport')
    // }
    // // var layerControl = L.control.layers(baseLayers, overlayLayers, {
    // //   collapsed: false
    // // }).addTo(map);
    // L.control.layers(baseLayers, {
    //   collapsed: false
    // }).addTo(map)

    map.fitBounds(this.bounds)
  },
  watch: {
    routeError: {
      handler () {
        if (this.routeError === true) {
          this.mapTransit(this.destCoords, true)
        }
      }
    },
    routes: {
      handler () {
        this.$emit('routes', this.routes)
      },
      deep: true
    },
    opened: {
      handler () {
        this.$emit('opened', this.opened)
      },
      deep: true
    }
  }
}
</script>