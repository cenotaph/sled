<template>
  <div id="app">
    <div id="lang">
      <button v-on:click="setLocale('et-EE')">EST</button>
      |
      <button v-on:click="setLocale('en-GB')">ENG</button>
      |
      <button v-on:click="setLocale('ru-RU')">RUS</button>
    </div>
    <div id="nav">
      <router-link to="/">Home</router-link> |
    </div>
    <router-view :locale="locale"/>
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

<style>
@import "../node_modules/leaflet/dist/leaflet.css";
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  z-index: 900;
  position: fixed;
  left: 100px;
  padding: 30px;
}

#lang { 
z-index: 900;
position: fixed;
right: 150px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
