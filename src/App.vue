<template>
  <div id="app">
    <div class="header">
      <div id="lang">
        <button v-on:click="setLocale('et-EE')">EST</button>
        <button v-on:click="setLocale('ru-RU')">ру</button>
        <button v-on:click="setLocale('en-GB')">ENG</button>
      </div>
      <div class="title">
        <span v-show="$i18n.locale == 'et-EE'">{{ $texts['et-EE'].big_white_title }}</span>
        <span v-show="$i18n.locale == 'en-GB'">{{ $texts['en-GB'].big_white_title }}</span>
        <span v-show="$i18n.locale == 'ru-RU'">{{ $texts['ru-RU'].big_white_title }}</span>
      </div>
      <div class="header_meta">
        <div class="date">25.03&mdash;14.06.19</div>
        <div class="tagline">
          <span v-show="$i18n.locale == 'et-EE'">{{ $texts['et-EE'].small_white_title }}</span>
          <span v-show="$i18n.locale == 'en-GB'">{{ $texts['en-GB'].small_white_title }}</span>
          <span v-show="$i18n.locale == 'ru-RU'">{{ $texts['ru-RU'].small_white_title }}</span>
        </div>
      </div>
    </div>
    <div class="content">
      <router-view :locale="locale" />
    </div>
    <div id="footer">
      <div class="press_link">
        <p v-for="l in ['et-EE', 'en-GB', 'ru-RU']" :key="l">
          <a href="/PRESS_SL.pdf" target="_blank" v-show="$i18n.locale == l">{{ $texts[l].press_kit }}</a>
        </p>
        <p>siberilapsed@gmail.com</p>
        <p>{{ phone }} </p>
      </div>
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
      phone: ['+372 5552 9199', '+372 58093126', '+372 5627 8338'][Math.floor(Math.random() * 3)],
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
@import 'assets/css/mobile.scss';
</style>
