<template>
  <div class="station_popup" v-if="station" v-show="station.name">
    <span class="close" @click="closeSelf">&times;</span>
    <div class="top">
      <div class="title_wrapper" v-for="l in ['et-EE', 'en-GB', 'ru-RU']" :key="l">
        <div v-show="$i18n.locale == l">
          <div class="title"> {{ station[l].title }}</div>
          <div class="dates">
            {{ Date.parse(station.start_date).toString("d") }} – {{ Date.parse(station.end_date).toString("d") }}
          </div>
        </div>
      </div>
      <div class="stations_wrapper" v-for="l in ['et-EE', 'en-GB', 'ru-RU']" :key="'station' + station.index + '_' + l">
        <div v-show="$i18n.locale == l">
          <div class="from_station" @click="animateMap(station.latitude, station.longitude)" >
            <span class="rounded">{{ station[l].name }}</span>
          </div>
          <div v-for="(remote, i) in station[l].remote_stations" :key="i" class="to_station" @click="animateMap(remote.remote_latitude, remote.remote_longitude)" >
            <span class="rounded">{{ remote.remote_name }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="text_wrapper" v-for="l in ['et-EE', 'en-GB', 'ru-RU']" :key="l">
      <div v-show="$i18n.locale == l">
        <div class="description"> {{ station[l].description}}</div>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'


export default {
  name: 'Station',
  props: {
    id: Number,
    station: Object
  },
  data () {
    return {
      
    }
  },
  methods: {
    animateMap (lat, lng) {
      this.$emit('animate', [lat, lng])
    },
    closeSelf () {
      this.$emit('clickclose')
    }
  },
  async created () {
    // const SITE_URL = `${process.env.VUE_APP_BASE_URL}/site/${this.id}`
    // const response = await axios.get(SITE_URL)
    // this.site = response.data.data
  }
}
</script>
<style lang="scss">
@import '../assets/css/station.scss';
</style>