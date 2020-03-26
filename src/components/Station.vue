<template>
  <div class="station_popup" v-if="station.data" v-show="station.index">
    <span class="close" @click="closeSelf">&times;</span>
    <div class="top">
      <div class="title_wrapper" v-for="l in ['et-EE', 'en-GB', 'ru-RU']" :key="l">
        <div v-show="$i18n.locale === l">
          <div class="title"> {{ station.data[l].title }}</div>
          <div class="custom_location" v-if="station.data[l].custom_location">
            {{ station.data[l].custom_location }}
          </div>

          <div class="dates" v-if="station.data.start_date">
            {{ Date.parse(station.data.start_date).toString("d") }} – {{ Date.parse(station.data.end_date).toString("d") }}
            <div v-if="station.data[l].open_times" class="open_times">
              {{ station.data[l].open_times }}
            </div>
          </div>
          <div class="dates" v-else>
            {{ station.data[l].event_dates }}
          </div>
        </div>
      </div>
      <div class="stations_wrapper" v-if="station.data.remote_stations.length > 0" >
        <div v-show="$i18n.locale === l" v-for="l in ['et-EE', 'en-GB', 'ru-RU']" :key="'station.data[l].title' + id + '_' + l" >
          <div class="from_station" @click="animateMap(null, station.latitude, station.longitude)" >
            <span class="rounded">{{ station.data[l].name }}</span>
          </div>
          <div v-if="station.data[l].remotes">
            <div v-for="(remote, i) in station.data[l].remotes" :key="i" class="to_station" @click="animateMap(i, station.data.remote_stations[i].remote_latitude, station.data.remote_stations[i].remote_longitude)" >
              <span class="rounded">{{ remote.remote_name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="text_wrapper" v-for="l in ['et-EE', 'en-GB', 'ru-RU']" :key="l">
      <div v-show="$i18n.locale === l">
        <div class="description"> {{ station.data[l].description}}</div>
        <div v-show="remote_opened === null && !routes.Connection" v-if="station.data[l].remotes" class="come" @click="getDirections(station.latitude, station.longitude)">
          <img :src="loadingGif" v-show="loading" />
          <span v-show="!loading">{{ $texts[l].pop_up_visit_station_button }}</span>
        </div>

        <div v-for="(remote, i) in station.data[l].remotes" :key="i" class="railway_description">
          <span v-if="remote.railway_station_info" v-show="remote_opened === null">
            {{ remote.railway_station_info }}
          </span>
          <span v-if="remote.remote_description" v-show="remote_opened === i"> 
            {{ remote.remote_description }}
          </span>
        </div>
      </div>
    </div>
    <div class="route_error" v-if="routeError">
      <div v-for="l in ['et-EE', 'en-GB', 'ru-RU']" :key="l">
        <span v-show="$i18n.locale === l">{{ $texts[l].cant_map }}</span>
      </div>
    </div>
    <div class="route_chooser" v-if="routes.Connection">
      <p v-for="l in ['et-EE', 'en-GB', 'ru-RU']" :key="l">
        <em v-show="$i18n.locale === l">{{ $texts[l].transit_routes }}</em>
      </p>
      <ol>
        <li class="route_item" v-for="(route, i) in routes.Connection" v-on:click="selectRoute(i)" :key="i">
          {{ moment(route.Dep.time).format('HH:mm') }} &mdash; {{ moment(route.Arr.time).format('HH:mm') }} <span class="duration"> ({{ route.duration.replace(/^PT/, '').toLowerCase() }}) </span>
          <div v-show="selectedRoute === i" class="transit_deets">
            <ol>
              <div v-for="(operator,i) in operators" :key="i" >
                <li class="offsite" v-if="operator[0]"><a :href="operator[0].href" target="_blank">{{ operator[0].text }}</a></li>
              </div>
            </ol>
          </div>
        </li>
      </ol>        
    </div>
  </div>
</template>

<script>
// import axios from 'axios'


export default {
  name: 'Station',
  props: {
    id: Number,
    station: Object,
    routes: Object, 
    routeError: Boolean
  },
  data () {
    return {
      selectedRoute: null,
      operators: [],
      remote_opened: null,
      loadingGif: require('../../static/images/ajax-loader.gif'),
      loading: false
    }
  },
  methods: {
    animateMap (i, lat, lng) {
      this.remote_opened = i
      this.$emit('animate', [lat, lng])
    },
    getDirections (lat, lng) {
      this.loading = true
      this.$emit('transit', [lat, lng])
    },
    selectRoute (i) {
      this.selectedRoute = i
      this.operators =
      this.routes.Operators.Op.map( (o) => o.Link.filter((p) => p.sec_ids.match(this.routes.Connection[i].id)) ).filter(n => n)
      this.$emit('drawline', i)
    },
    closeSelf () {
      this.remote_opened = null
      this.$emit('clickclose')
    }
  },
  async mounted () {
    // console.log('name: ' + this.id)
    // console.log('all: ')
    // console.log(this.station)
    // console.log(this.station.remote_stations)
    // const SITE_URL = `${process.env.VUE_APP_BASE_URL}/site/${this.id}`
    // const response = await axios.get(SITE_URL)
    // this.site = response.data.data
  }
}
</script>
<style lang="scss">
@import '../assets/css/station.scss';
</style>