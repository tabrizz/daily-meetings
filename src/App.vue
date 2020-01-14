<template>
  <div id="app">
    <Navbar />
    <div class="section">
      <div class="container">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "./components/shared/Navbar.vue";
import axios from "axios";

export default {
  components: {
    Navbar
  },
  created() {
    axios.interceptors.response.use(undefined, err => {
      return new Promise(() => {
        if (
          err.response.status === 401 &&
          err.response.config &&
          !err.response.config.__isRetryRequest
        ) {
          this.$store.dispatch("logout").then(() => {
            this.$router.push("login");
          });
        }
        throw err;
      });
    });
  }
};
</script>

