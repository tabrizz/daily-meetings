<template>
  <div class="home">
    <h4 class="title">Charla Semanal</h4>
    <b-notification v-if="storeSuccess" type="is-success">Asistencia guardada correctamente</b-notification>
    <b-notification v-if="storeError" type="is-danger">No se pudo guardar la asistencia</b-notification>

    <b-field label="1) Selecciona una fecha">
      <b-datepicker
        @input="getMeeting"
        v-model="selectedDate"
        placeholder="Click para seleccionar..."
        icon="calendar-today"
      ></b-datepicker>
    </b-field>
    <b-collapse class="panel" :open.sync="isOpenTitle">
      <div slot="trigger" class="panel-heading">
        <strong>2) Tema de la Semana</strong>
      </div>
      <div class="panel-block">{{ title }}</div>
    </b-collapse>
    <b-collapse class="panel" :open.sync="isOpenContent">
      <div slot="trigger" class="panel-heading">
        <strong>3) Descripción del Tema</strong>
      </div>
      <div class="panel-block">{{ description }}</div>
    </b-collapse>
    <label class="label">4) Marcar Asistencia</label>
    <div class="box">
      <div class="table-container">
        <table class="table is-narrow is-striped is-size-7">
          <thead>
            <tr>
              <th>Apellidos y Nombres</th>
              <th>Asistió</th>
              <th>Motivo de Inasistencia</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in meeting.employeesList" :key="employee.id">
              <td>{{ employee.lastName }} {{ employee.firstName }}</td>
              <td>
                <div class="field">
                  <b-checkbox type="is-success" v-model="employee.attended"></b-checkbox>
                </div>
              </td>
              <td>
                <b-field>
                  <b-select
                    :disabled="employee.attended"
                    v-model="employee.missingReason"
                    class="is-size-7"
                    placeholder="Selecciona"
                    rounded
                  >
                    <option value="Ninguno">Ninguno</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Permiso">Permiso</option>
                    <option value="Comisión">Comisión</option>
                    <option value="Vacaciones">Vacaciones</option>
                    <option value="Otros">Otros</option>
                  </b-select>
                </b-field>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <b-field label="5) Agregar Invitados">
      <b-taginput
        v-model="meeting.guests"
        :data="filteredTags"
        autocomplete
        field="lastName"
        icon="label"
        placeholder="Agrega invitado"
        @typing="getFilteredTags"
      >
        <template slot-scope="props">{{ props.option.firstName }} {{ props.option.lastName }}</template>
        <template slot="empty">No hay colaboradores registrados</template>
      </b-taginput>
    </b-field>

    <b-field label="6) Tomar fotografías de Evidencia">
      <b-select v-model="selectedCameraId" placeholder="Selecciona la cámara" @input="getStream">
        <option v-for="option in cameras" :value="option.id" :key="option.id">
          {{
          option.text
          }}
        </option>
      </b-select>
    </b-field>

    <video ref="video" autoplay playsinline></video>
    <canvas ref="canvas"></canvas>
    <ul>
      <li v-for="c in meeting.captures" :key="c">
        <img class="captures" :src="c" />
      </li>
    </ul>

    <div class="field has-text-centered">
      <button class="button is-success is-rounded" @click.prevent="grabFrame">
        <b-icon icon="camera"></b-icon>
      </button>
    </div>
    <div class="field has-text-centered">
      <button @click.prevent="storeMeeting()" class="button is-primary is-rounded">
        <b-icon icon="content-save"></b-icon>
        <span>Guardar Asistencia</span>
      </button>
    </div>
    <b-loading :is-full-page="true" :active.sync="isLoading"></b-loading>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  data() {
    return {
      moment: moment(),
      selectedDate: null,
      title: "",
      description: "",
      meeting: {
        id: null,
        employeesList: [],
        guests: [],
        captures: [],
        selectedDate: null
      },
      isOpenTitle: false,
      isOpenContent: false,
      keepFirst: false,
      openOnFocus: false,
      selected: null,
      filteredTags: [],
      mediaStream: null,
      cameras: [],
      constraints: {},
      video: null,
      canvas: null,
      imageCapture: null,
      selectedCameraId: null,
      allEmployees: [],
      auth: {},
      isLoading: false,
      storeSuccess: false,
      storeError: false
    };
  },
  methods: {
    storeMeeting() {
      this.isLoading = true;
      axios
        .post(
          process.env.VUE_APP_URL_API +
            `/meetings/${this.meeting.id}/attendance`,
          this.meeting
        )
        .then(res => {
          if (res.status === 200) {
            this.storeSuccess = true;
            this.$buefy.toast.open({
              duration: 3000,
              message: `Asistencia guardada`,
              position: "is-bottom",
              type: "is-success"
            });
            this.meeting = {
              id: null,
              employeesList: [],
              guests: [],
              captures: [],
              selectedDate: null
            };
          }
          if (res.status === 500) {
            this.storeError = true;
            this.$buefy.toast.open({
              duration: 3000,
              message: `Asistencia ya fue registrada anteriormente`,
              position: "is-bottom",
              type: "is-warning"
            });
          }
          this.isLoading = false;
        })
        .catch(err => {
          if (err.response.status === 400) {
            this.isLoading = false;
            this.storeError = true;
            this.$buefy.toast.open({
              duration: 3000,
              message: `Asistencia no se guardó`,
              position: "is-bottom",
              type: "is-danger"
            });
          }
        });
    },
    getMeeting() {
      this.meeting.selectedDate = moment(new Date(this.selectedDate)).format(
        "YYYY-MM-DD"
      );

      axios
        .get(
          process.env.VUE_APP_URL_API +
            `/meetings/${localStorage.getItem("id")}/user?startDate=${
              this.meeting.selectedDate
            }`
        )
        .then(res => {
          if (res.data) {
            this.meeting.id = res.data.id;
            this.title = res.data.title;
            this.description = res.data.description;
          } else {
            this.meeting.id = null;
            this.title = "No Disponible";
            this.description = "No Disponible";
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getFilteredTags(text) {
      this.filteredTags = this.allEmployees.filter(option => {
        return (
          option.lastName
            .toString()
            .toLowerCase()
            .indexOf(text.toString().toLowerCase()) >= 0
        );
      });
    },
    grabFrame() {
      this.canvas = this.$refs.canvas;
      this.imageCapture.grabFrame().then(imageBitmap => {
        this.canvas.width = imageBitmap.width;
        this.canvas.height = imageBitmap.height;
        this.canvas.getContext("2d").drawImage(imageBitmap, 0, 0);
        this.meeting.captures.push(this.canvas.toDataURL("image/png"));
      });
    },
    gotDevices(mediaDevices) {
      console.log("mediadevices got", mediaDevices);
      let count = 1;
      mediaDevices.forEach(mediaDevice => {
        let option = {};
        if (mediaDevice.kind === "videoinput") {
          option.id = mediaDevice.deviceId;
          // option.text = mediaDevice.label || `Camera ${count++}`;
          if (count === 1) {
            option.text = `1 Tomar Foto Grupal`;
          } else {
            option.text = `2 Tomar Foto Lista Asistencia PDS01-R03`;
          }
          this.cameras.push(option);
          count++;
        }
      });
    },
    getStream() {
      console.log("mediastream", this.mediaStream);
      if (
        typeof this.mediaStream !== "undefined" &&
        this.mediaStream !== null
      ) {
        this.stopMediaTracks(this.mediaStream);
      }
      const videoConstraints = {};
      if (this.selectedCameraId === "") {
        videoConstraints.facingMode = "environment";
      } else {
        videoConstraints.deviceId = { exact: this.selectedCameraId };
      }
      const constraints = {
        video: videoConstraints,
        audio: false
      };
      this.video = this.$refs.video;
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
          this.mediaStream = stream;
          console.log("ref video", this.$refs.video);
          this.imageCapture = new ImageCapture(stream.getVideoTracks()[0]);
          this.video.srcObject = stream;
          this.video.play();
        })
        .catch(error => {
          console.error(error);
        });
    },
    stopMediaTracks(stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
    }
  },
  mounted() {
    // this.auth = {
    //   headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    // }
    navigator.mediaDevices
      .enumerateDevices()
      .then(this.gotDevices)
      .catch(error => {
        console.log("enumerateDevices() error: ", error);
      });
    axios
      .get(
        process.env.VUE_APP_URL_API +
          `/employees/office/${localStorage.getItem("officeId")}`
      )
      .then(res => {
        this.meeting.employeesList = res.data;
        this.meeting.employeesList = this.meeting.employeesList.map(obj => ({
          ...obj,
          attended: true,
          missingReason: "Asistió"
        }));
      })
      .catch(err => {
        console.log(err);
        // if (err.response.status === 401) {
        //   this.$router.push('/login')
        // }
      });

    axios
      .get(process.env.VUE_APP_URL_API + "/employees")
      .then(res => {
        // console.log(res.data);
        this.allEmployees = res.data;
        this.filteredTags = this.allEmployees;
      })
      .catch(err => console.log(err));
  }
};
</script>

<style lang="scss" scoped>
.camera-mod {
  width: 100%;
  height: 100%;
  background-color: white;
}
.camera-stream {
  width: 100%;
  max-height: 100%;
}
canvas {
  display: none;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}
video {
  width: 100%;
  max-width: 600px;
  display: block;
  margin: 0 auto;
}
li {
  display: inline;
  padding: 5px;
}
.captures {
  max-width: 100px;
  max-height: 100px;
}
</style>
