<template>
  <div id="app">
    <Navbar />
    <div class="section">
      <div class="container">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from './components/shared/Navbar.vue'
import axios from 'axios'

export default {
  components: {
    Navbar
  },
  created() {
    axios.interceptors.response.use(undefined, (err) => {
      return new Promise((resolve, reject) => {
        if (err.response.status === 401 && err.response.config && !err.response.config.__isRetryRequest) {
          this.$store.dispatch('logout')
            .then(res => {
              this.$router.push('login')
            })
        }
        throw err;
      });
  });
  }
}
</script>


<style lang="scss">
  @import "~bulma/sass/utilities/_all";
  // Set your colors
  $primary: #7957D5;
  $primary-invert: findColorInvert($primary);
  $twitter: #4099ff;
  $twitter-invert: findColorInvert($twitter);
  // Setup $colors to use as bulma classes (e.g. 'is-twitter')
  $colors: (
      "white": ($white, $black),
      "black": ($black, $white),
      "light": ($light, $light-invert),
      "dark": ($dark, $dark-invert),
      "primary": ($primary, $primary-invert),
      "info": ($info, $info-invert),
      "success": ($success, $success-invert),
      "warning": ($warning, $warning-invert),
      "danger": ($danger, $danger-invert),
      "twitter": ($twitter, $twitter-invert)
  );
  // Links
  $link: $primary;
  $link-invert: $primary-invert;
  $link-focus-border: $primary;

  $navbar-background-color: #003062;
  $navbar-item-color: #FFFFFF;
  $navbar-item-hover-color: #F8F8F8;
  $navbar-item-hover-background-color: #004C99;
  // Import Bulma and Buefy styles
  @import "~bulma";
  @import "~buefy/src/scss/buefy";
</style>
