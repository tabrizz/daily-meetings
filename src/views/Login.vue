<template>
<div class="login">
  <form @submit.prevent="login">
    <b-field label="Usuario">
      <b-input v-model="user.username" placeholder="Usuario"></b-input>
    </b-field>
    <b-field label="Contraseña">
      <b-input v-model="user.password" type="password"
        placeholder="Contraseña"
        password-reveal>
      </b-input>
    </b-field>
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
import EventBus from './../event-bus'

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
  methods: {
    login () {
      this.isLoading = true        
              
      axios.post(process.env.VUE_APP_URL_API + '/login', this.user)
        .then(res => {
          // console.log(res.data.token);

          this.isLoading = false
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('username', res.data.user.name)
          EventBus.$emit('login')
          this.$router.push('/')
        })
        .catch(err => {
          console.log(err)
        });
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

