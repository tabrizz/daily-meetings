<template>
  <div>
    <ValidationObserver v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(submitUser)">
        <ValidationProvider rules="required" v-slot="{ errors }">
          <b-field label="Nombres y Apellidos">
            <b-input v-model="user.name"></b-input>
          </b-field>
          <p class="help is-danger">{{ errors[0] }}</p>
        </ValidationProvider>
        <ValidationProvider rules="required|email" v-slot="{ errors }">
          <b-field label="Correo">
            <b-input v-model="user.email"></b-input>
          </b-field>
          <p class="help is-danger">{{ errors[0] }}</p>
        </ValidationProvider>
        <b-field label="Oficina">
          <b-select
            placeholder="Selecciona una oficina"
            v-model="user.officeId"
          >
            <option
              v-for="office in offices"
              :value="office.id"
              :key="office.id"
              >{{ office.name }}</option
            >
          </b-select>
        </b-field>
        <ValidationProvider
          rules="required|confirmed:repeatPassword"
          v-slot="{ errors }"
        >
          <b-field label="Contraseña">
            <b-input
              v-model="user.password"
              type="password"
              placeholder="Contraseña"
              password-reveal
              ref="user.password"
            ></b-input>
          </b-field>
          <p class="help is-danger">{{ errors[0] }}</p>
        </ValidationProvider>
        <ValidationProvider v-slot="{ errors }" vid="repeatPassword">
          <b-field label="Repetir Contraseña">
            <b-input
              v-model="repeatPassword"
              type="password"
              ref="repeatPassword"
              placeholder="Repetir Contraseña"
              password-reveal
            ></b-input>
          </b-field>
          <p class="help is-danger">{{ errors[0] }}</p>
        </ValidationProvider>

        <div class="field is-grouped is-grouped-centered">
          <p class="control">
            <button type="submit" class="button is-primary">Guardar</button>
          </p>
          <p class="control">
            <b-button
              tag="router-link"
              type="is-danger"
              :to="{ name: 'list-user' }"
              >Cancelar</b-button
            >
          </p>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      id: null,
      user: {
        name: "",
        email: "",
        password: "",
        officeId: null,
        role: "USER"
      },
      repeatPassword: "",
      offices: [],
      changePass: false
    };
  },
  methods: {
    cleanFields() {
      this.repeatPassword = "";
      this.user.password = "";
    },
    getOffices() {
      axios
        .get(process.env.VUE_APP_URL_API + `/offices`)
        .then(res => {
          this.offices = res.data;
        })
        .catch(err => console.log(err));
    },
    submitUser() {
      axios
        .post(process.env.VUE_APP_URL_API + `/users/register`, this.user)
        .then(res => {
          if (res.status === 200) {
            this.$router.push("/users");
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
          this.$buefy.toast.open({
            duration: 3000,
            message: `Ocurrió un problema, inténtelo más tarde`,
            position: "is-top",
            type: "is-warning"
          });
          console.log(err);
        });
    }
  },
  mounted() {
    this.getOffices();
  }
};
</script>
