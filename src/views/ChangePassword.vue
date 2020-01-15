<template>
  <div class="changePassword">
    <form @submit.prevent="changePassword">
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
        v-if="$v.user.password.$dirty &&  !$v.user.password.required"
      >La contraseña es requerida</p>
      <b-field label="Repetir Contraseña">
        <b-input
          v-model.trim="$v.user.repeatPassword.$model"
          type="password"
          placeholder="Repetir Contraseña"
          password-reveal
        ></b-input>
      </b-field>
      <p
        class="help is-danger"
        v-if="$v.user.repeatPassword.$dirty &&  !$v.user.repeatPassword.required"
      >Vuelva a escribir la contraseña es requerida</p>
      <p
        class="help is-danger"
        v-if="$v.user.repeatPassword.$dirty &&  !$v.user.repeatPassword.sameAsPassword"
      >Las contraseñas no coinciden</p>
      <div class="field is-grouped is-grouped-centered">
        <p class="control">
          <button class="button is-primary">
            <strong>Aceptar</strong>
          </button>
        </p>
        <p class="control">
          <a href="/" class="button is-light">Cancelar</a>
        </p>
      </div>
      <b-loading :is-full-page="true" :active.sync="isLoading"></b-loading>
    </form>
  </div>
</template>

<script>
import { required, sameAs } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      isLoading: false,
      user: {
        id: localStorage.getItem("id"),
        password: "",
        repeatPassword: ""
      },
      submitStatus: null
    };
  },
  validations: {
    user: {
      password: {
        required
      },
      repeatPassword: {
        required,
        sameAsPassword: sameAs("password")
      }
    }
  },
  methods: {
    changePassword() {
      this.isLoading = true;
      if (this.$v.$invalid) {
        this.isLoading = false;
        this.$buefy.toast.open({
          duration: 3000,
          message: `Rellene ambos campos`,
          position: "is-top",
          type: "is-danger"
        });
      } else {
        this.$store
          .dispatch("changePassword", this.user)
          .then(res => {
            this.isLoading = false;
            if (res.status === 200) {
              this.$buefy.toast.open({
                duration: 3000,
                message: `Contraseña cambiada correctamente`,
                position: "is-top",
                type: "is-success"
              });
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
            if (err.response.status === 500) {
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

<style lang="scss" scoped>
</style>

