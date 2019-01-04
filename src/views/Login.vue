<template>
<div class="login">
  <form @submit.prevent="login">
    <b-field label="Usuario">
      <b-input v-model.trim="$v.user.username.$model" placeholder="Usuario"></b-input>
    </b-field>
    <p class="help is-danger" v-if="$v.user.username.$dirty && !$v.user.username.required">El usuario es requerido</p>
    <b-field label="Contraseña">
      <b-input v-model.trim="$v.user.password.$model" type="password"
        placeholder="Contraseña"
        password-reveal>
      </b-input>
    </b-field>
    <p class="help is-danger" v-if="$v.user.password.$dirty &&  !$v.user.password.required">La contraseña es requerida</p>
    <div class="field is-grouped is-grouped-centered">
      <p class="control">
        <button class="button is-primary">
          <strong>Iniciar Sesión</strong>
        </button>
      </p>
      <p class="control">
        <a class="button is-light">
          Salir
        </a> 
      </p>
    </div>
    <b-loading :is-full-page="true" :active.sync="isLoading"></b-loading>
  </form>
</div>
  
</template>

<script>
import axios from 'axios';
import { required } from 'vuelidate/lib/validators'

export default {
  data () {
     return  {
       isLoading: false,
       user: {
         username: '',
         password: ''
       }
     }
  },
  validations: {
    user: {
      username: {
        required
      },
      password: {
        required
      }
    }
  },
  methods: {
    login () {
      this.isLoading = true        
      this.$store.dispatch('login', this.user)
        .then(() => {
          this.isLoading = false    
          this.$router.push('/')
        })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

