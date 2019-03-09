<template>
  <div class="station_popup" v-if="site" v-show="site.name">
    <span class="close" @click="closeSelf">&times;</span>
    <div class="dates">
      {{ Date.parse(site.start_date).toString("d") }} – {{ Date.parse(site.end_date).toString("d") }}
    </div>
    <div class="text_wrapper" v-for="l in ['et-EE', 'en-GB', 'ru-RU']" :key="l">
      <div v-show="$i18n.locale == l">
        <div class="site_name">{{ site[l].name }}</div>
        <div class="title"> {{ site[l].title }}</div>
        <div class="description"> {{ site[l].description}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'


export default {
  name: 'Station',
  props: {
    id: Number
  },
  data () {
    return {
      site: {}
    }
  },
  methods: {
    closeSelf () {
      this.$emit('clickclose', 1)
    }
  },
  async created () {
    const SITE_URL = `${process.env.VUE_APP_BASE_URL}/site/${this.id}`
    const response = await axios.get(SITE_URL)
    this.site = response.data.data
  }
}
</script>
<style lang="scss">
  .station_popup {
    position: absolute;
    top: 30%;
    left: 30%;
    width: 40%;
    z-index: 10000;
    background-color: white;
    padding: 0 1rem 1rem 1rem;
    border: 1px solid black;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    -webkit-box-shadow: 0px 0px 10px 0px rgba(200, 200, 200, 0.67);
    -moz-box-shadow: 0px 0px 10px 0px rgba(255, 200, 200, 0.67);
    box-shadow: 0px 0px 10px 0px rgba(200, 200, 200, 0.67);

    .close {
      color: #aaa;
      float: right;
      font-size: 28px;
      font-weight: bold;
    }

    .close:hover,
    .close:focus {
      color: black;
      text-decoration: none;
      cursor: pointer;
    }
  }
  .dates {
    margin-top: 1rem;
  }
  .site_name {
    font-weight: bold;
  }
  .title {
    text-decoration: underline;
    margin-bottom: 1rem;
  }
  .description {
    text-align: left;
    font-size: 0.9rem;
  }
</style>