<template>
  <div>
    <form>
      <b-field label="Título">
        <b-input v-model.trim="$v.meeting.title.$model" type="text" placeholder="Título"></b-input>
      </b-field>
      <p
        class="help is-danger"
        v-if="$v.meeting.title.$dirty && !$v.meeting.title.required"
      >El título es requerido</p>

      <b-field label="Descripción">
        <b-input
          v-model.trim="$v.meeting.description.$model"
          maxlength="800"
          type="textarea"
          placeholder="Descripción"
        ></b-input>
      </b-field>
      <p
        class="help is-danger"
        v-if="$v.meeting.description.$dirty && !$v.meeting.description.required"
      >La descripción es requerida</p>

      <b-field label="Fecha de Inicio">
        <b-datetimepicker
          rounded
          placeholder="Fecha de Inicio"
          icon="calendar-today"
          v-model="startDate"
        ></b-datetimepicker>
      </b-field>

      <b-field label="Fecha de Inicio">
        <b-datetimepicker
          rounded
          placeholder="Fecha de Inicio"
          icon="calendar-today"
          v-model="endDate"
        ></b-datetimepicker>
      </b-field>
      <div class="block">
        <b-radio v-model="meeting.quantity" name="quantity" native-value="one">Uno</b-radio>
        <b-radio v-model="meeting.quantity" name="quantity" native-value="all">Todos</b-radio>
      </div>
      <b-field v-if="meeting.quantity === 'one'" label="Oficina">
        <b-autocomplete
          v-model="office"
          placeholder="Seleccione la oficina"
          :data="getFilteredTags"
          field="name"
          @select="option => selectedOffice = option"
        ></b-autocomplete>
      </b-field>

      <div class="field is-grouped is-grouped-centered">
        <p class="control">
          <button class="button is-primary" @click.prevent="createMeeting()">
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
import { required } from "vuelidate/lib/validators";
import axios from "axios";
import moment from "moment";

export default {
  data() {
    return {
      moment: moment(),
      isLoading: false,
      meeting: {
        title: "",
        description: "",
        officeId: 0,
        startDate: null,
        endDate: null,
        quantity: null
      },
      startDate: null,
      endDate: null,
      offices: [],
      office: "",
      selectedOffice: null
    };
  },
  methods: {
    createMeeting() {
      this.isLoading = true;
      if (this.$v.$invalid) {
        this.isLoading = false;
        this.$buefy.toast.open({
          duration: 3000,
          message: `Ingrese todos los datos del formulario`,
          position: "is-top",
          type: "is-danger"
        });
      } else {
        if (this.meeting.quantity === "one") {
          this.meeting.officeId = this.selectedOffice.id;
        } else if (this.meeting.quantity === "all") {
          this.meeting.officeId = 0;
        } else {
          this.$buefy.toast.open({
            duration: 3000,
            message: `Selecciona la oficina`,
            position: "is-top",
            type: "is-danger"
          });
        }

        this.meeting.startDate = moment(new Date(this.startDate)).format(
          "YYYY-MM-DD hh:mm:ss"
        );

        this.meeting.endDate = moment(new Date(this.endDate)).format(
          "YYYY-MM-DD hh:mm:ss"
        );
        axios
          .post(process.env.VUE_APP_URL_API + `/meetings`, this.meeting)
          .then(res => {
            if (res.status === 200) {
              this.isLoading = false;
              this.$router.push("/");
            } else {
              this.isLoading = false;
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
            console.log(err);
          });
      }
    },
    getOffices() {
      axios
        .get(process.env.VUE_APP_URL_API + `/offices`)
        .then(res => {
          this.offices = res.data;
        })
        .catch(err => console.log(err));
    }
  },
  computed: {
    getFilteredTags() {
      return this.offices.filter(option => {
        return (
          option.name
            .toString()
            .toLowerCase()
            .indexOf(this.office.toString().toLowerCase()) >= 0
        );
      });
    }
  },
  mounted() {
    this.getOffices();
  },
  validations: {
    meeting: {
      title: {
        required
      },
      description: {
        required
      }
    }
  }
};
</script>
