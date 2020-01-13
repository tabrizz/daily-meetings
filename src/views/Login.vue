<template>
  <div class="login">
    <form @submit.prevent="login">
      <b-field label="Usuario">
        <b-input v-model.trim="$v.user.email.$model" placeholder="Usuario"></b-input>
      </b-field>
      <p
        class="help is-danger"
        v-if="$v.user.email.$dirty && !$v.user.email.required"
      >El usuario es requerido</p>
      <b-field label="Contraseña">
        <b-input
          v-model.trim="$v.user.password.$model"
          type="password"
          placeholder="Contraseña"
          password-reveal
        ></b-input>
      </b-field>
      <p
        class="help is-danger"
        v-if="$v.user.password.$dirty && !$v.user.password.required"
      >La contraseña es requerida</p>
      <div class="field is-grouped is-grouped-centered">
        <p class="control">
          <button class="button is-primary">
            <strong>Iniciar Sesión</strong>
          </button>
        </p>
        <p class="control">
          <a class="button is-light">Salir</a>
        </p>
      </div>
      <b-loading :is-full-page="true" :active.sync="isLoading"></b-loading>
    </form>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      isLoading: false,
      user: {
        email: "",
        password: ""
      },
      submitStatus: null
    };
  },
  validations: {
    user: {
      email: {
        required
      },
      password: {
        required
      }
    }
  },
  methods: {
    login() {
      this.isLoading = true;
      if (this.$v.$invalid) {
        this.isLoading = false;
        this.$buefy.toast.open({
          duration: 3000,
          message: `Ingrese su usuario y contraseña`,
          position: "is-top",
          type: "is-danger"
        });
      } else {
        this.$store
          .dispatch("login", this.user)
          .then(res => {
            this.isLoading = false;
            console.log("res status", res.status);
            if (res.status === 200) {
              this.$router.push("/");
            } else {
              this.$buefy.toast.open({
                duration: 3000,
                message: `Ocurrió un problema, inténtelo más tarde`,
                position: "is-top",
                type: "is-warning"
              });
            }
          })
          .catch(err => {
            this.isLoading = false;
            if (err.response.status === 400) {
              this.$buefy.toast.open({
                duration: 3000,
                message: `Usuario o contraseña incorrecta!`,
                position: "is-top",
                type: "is-danger"
              });
            } else if (err.response.status === 500) {
              this.$buefy.toast.open({
                duration: 3000,
                message: `Ocurrió un problema, inténtelo más tarde`,
                position: "is-top",
                type: "is-danger"
              });
            }
          });
      }
    },
    submit() {}
  }
};
</script>

<style lang="scss" scoped></style>
