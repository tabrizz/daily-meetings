<template>
  <div>
    <ValidationObserver v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(submitEmployee)">
        <ValidationProvider rules="required" v-slot="{ errors }">
          <b-field label="Nombres">
            <b-input v-model="employee.firstName"></b-input>
          </b-field>
          <p class="help is-danger">{{ errors[0] }}</p>
        </ValidationProvider>
        <ValidationProvider rules="required" v-slot="{ errors }">
          <b-field label="Apellidos">
            <b-input v-model="employee.lastName"></b-input>
          </b-field>
          <p class="help is-danger">{{ errors[0] }}</p>
        </ValidationProvider>
        <ValidationProvider rules="required" v-slot="{ errors }">
          <b-field label="DNI">
            <b-input v-model="employee.dni"></b-input>
          </b-field>
          <p class="help is-danger">{{ errors[0] }}</p>
        </ValidationProvider>
        <ValidationProvider rules="required|email" v-slot="{ errors }">
          <b-field label="Correo">
            <b-input v-model="employee.email"></b-input>
          </b-field>
          <p class="help is-danger">{{ errors[0] }}</p>
        </ValidationProvider>
        <b-field label="Oficina">
          <b-select
            placeholder="Selecciona una oficina"
            v-model="employee.officeId"
          >
            <option
              v-for="office in offices"
              :value="office.id"
              :key="office.id"
              >{{ office.name }}</option
            >
          </b-select>
        </b-field>
        <div class="field is-grouped is-grouped-centered">
          <p class="control">
            <button type="submit" class="button is-primary">Guardar</button>
          </p>
          <p class="control">
            <b-button
              tag="router-link"
              type="is-danger"
              :to="{ name: 'list-employee' }"
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
      employee: {
        firstName: "",
        lastName: "",
        email: "",
        dni: "",
        officeId: null
      },
      offices: []
    };
  },
  methods: {
    getOffices() {
      axios
        .get(process.env.VUE_APP_URL_API + `/offices`)
        .then(res => {
          this.offices = res.data;
        })
        .catch(err => console.log(err));
    },
    submitEmployee() {
      axios
        .post(process.env.VUE_APP_URL_API + `/employees`, this.employee)
        .then(res => {
          if (res.status === 200) {
            this.$router.push("/employees");
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
