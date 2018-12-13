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
      
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <a class="button is-primary" to="/login">
            <strong>Iniciar Sesión</strong>
          </a>
          <button @click.prevent="logout" class="button is-light">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  </div>
  </nav>

</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import EventBus from './../../event-bus'

export default {
  data () {
    return {
      showNav: false,
      loggedIn: false,
      loggedOut: true    
    }
  },
  methods: {
    logout () {
      EventBus.$emit('logout');
      localStorage.removeItem('token');
      this.$router.push('/login');
    }
  },
  mounted () {

  }    
}
</script>
