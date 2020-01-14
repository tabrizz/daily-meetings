<template>
  <div>
    <b-navbar :shadow="true" type="is-dark">
      <template slot="brand">
        <b-navbar-item>
          <img src="@/assets/electro_icon.png" width="28" height="28" />
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <strong>Electrocentro</strong>
        </b-navbar-item>
      </template>
      <template slot="start" v-if="isAuthenticated">
        <b-navbar-item to="/" tag="router-link">Inicio</b-navbar-item>
        <b-navbar-item to="/change-password" tag="router-link">Cambiar contraseña</b-navbar-item>
        <b-navbar-dropdown label="Charlas">
          <b-navbar-item :to="{ name: 'list-meeting'}" tag="router-link">Listar</b-navbar-item>
          <b-navbar-item :to="{ name: 'create-meeting'}" tag="router-link">Crear</b-navbar-item>
        </b-navbar-dropdown>
      </template>

      <template slot="end">
        <b-navbar-item tag="div">
          <div class="buttons">
            <button
              v-if="isAuthenticated"
              @click.prevent="logout"
              class="button is-light"
            >Cerrar Sesión</button>
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>
    <b-loading :is-full-page="true" :active.sync="isLoading"></b-loading>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      token: localStorage.getItem("token"),
      isLoading: false,
      showNav: false
    };
  },
  methods: {
    logout() {
      this.isLoading = true;
      this.$store.dispatch("logout").then(() => {
        this.isLoading = false;
        this.$router.push("/login");
      });
    }
  },
  computed: {
    ...mapGetters(["isAuthenticated"])
  }
};
</script>
