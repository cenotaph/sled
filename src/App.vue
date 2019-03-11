<template>
  <div id="app">
    <div class="header">
      <div id="lang">
        <button v-on:click="setLocale('et-EE')">EST</button>
        <button v-on:click="setLocale('ru-RU')">ру</button>
        <button v-on:click="setLocale('en-GB')">ENG</button>
      </div>
      <div class="title">
        <span v-show="$i18n.locale == 'et-EE'">Siberi Lapsepõlv</span>
        <span v-show="$i18n.locale == 'en-GB'">Children of Siberia</span>
        <span v-show="$i18n.locale == 'ru-RU'">Siberi Lapsepõlv in Russian</span>
      </div>
      <div class="header_meta">
        <div class="date">25.03&mdash;16.04.19</div>
        <div class="tagline">
          <span v-show="$i18n.locale == 'et-EE'">Üle-Eestiline Kunstiprogrammv</span>
          <span v-show="$i18n.locale == 'en-GB'">blah blah blah</span>
          <span v-show="$i18n.locale == 'ru-RU'">суас синт персецути</span>
        </div>
      </div>
    </div>
    <div class="content">
      <router-view :locale="locale" />
    </div>
    <div id="footer">
      <div class="sled">
        <img src="./assets/images/sled.png" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'App',
  data () {
    return {
      locale: '' 
    }
  },
  mounted () {
    if (localStorage.locale) {
      this.locale = localStorage.getItem('locale')
    }
  },
  methods: {
    setLocale: function (locale) {
      this.locale = locale
      localStorage.setItem('locale', locale)
      Date.i18n.setLanguage(locale)
    }
  },
  watch: {
    locale: {
      handler () {
        this.$i18n.locale = this.locale
        this.$emit('locale', this.locale)
        localStorage.setItem('locale', this.locale)
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
@import "../node_modules/leaflet/dist/leaflet.css";
@import 'assets/css/siberi.scss';
</style>
