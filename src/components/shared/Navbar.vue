<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" href="/">
      <img src="@/assets/electro_icon.png" width="28" height="28">
      <strong>&nbsp;Electrocentro</strong>
    </a>

    <a role="button" class="navbar-burger burger" @click="showNav = !showNav" :class="{ 'is-active': showNav }" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div id="navbarBasicExample" class="navbar-menu" :class="{ 'is-active': showNav }">
    <div class="navbar-start">
      <a class="navbar-item">
        Inicio
      </a>
      <a href="/change-password" class="navbar-item">
        Cambiar contraseña
      </a>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <!-- <a v-if="!token" class="button is-primary" href="/login">
            <strong>Iniciar Sesión</strong>
          </a> -->
          <button v-if="isAuthenticated" @click.prevent="logout" class="button is-light">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  </div>
  <b-loading :is-full-page="true" :active.sync="isLoading"></b-loading>
  </nav>

</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      token: localStorage.getItem('token'),
      isLoading: false,
      showNav: false,   
    }
  },
  methods: {
    logout () {
      this.isLoading = true
      this.$store.dispatch('logout')
        .then(() => {
          this.isLoading = false
          this.$router.push('/login')
        })
    }
  },
  computed: {
    ...mapGetters([
      'isAuthenticated',
    ])
  }  
}
</script>
