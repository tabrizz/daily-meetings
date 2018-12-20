<template>
  <div class="home">
    <b-notification v-if="storeSucces" type="is-success">
      Asistencia guardada correctamente
    </b-notification>
    <b-notification v-if="storeError" type="is-danger">
      No se pudo guardar la asistencia
    </b-notification>

    <b-field label="Selecciona una fecha">
      <b-datepicker @input="getMeeting" v-model="selectedDate" placeholder="Click para seleccionar..." icon="calendar-today"></b-datepicker>
    </b-field>
    <b-collapse class="panel" :open.sync="isOpenTitle">
      <div slot="trigger" class="panel-heading">
        <strong>Ley</strong>
      </div>
      <div class="panel-block">
        {{ title }}
      </div>
    </b-collapse>
    <b-collapse class="panel" :open.sync="isOpenContent">
      <div slot="trigger" class="panel-heading">
        <strong>Recomendaciones</strong>
      </div>
      <div class="panel-block">
        {{ description }}
      </div>
    </b-collapse>
    
    <div class="box">
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>A</th>
              <th>O</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in meeting.employees" :key="employee.id">
              <td>{{ employee.last_name }}</td>
              <td>{{ employee.first_name }}</td>
              <td>
                <div class="field">
                  <b-switch type="is-success" v-model="employee.attended"></b-switch>
                </div>
              </td>
              <td>
                <b-field>
                  <b-select :disabled="employee.attended" v-model="employee.missing_reason" placeholder="Selecciona" rounded>
                    <option value="Ninguno">Ninguno</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Permiso">Permiso</option>
                    <option value="Comisión">Comisión</option>
                    <option value="Comisión">Otros</option>
                  </b-select>
                </b-field>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <b-field label="Agregar Invitados">
      <b-taginput
        v-model="meeting.guests"
        :data="filteredTags"
        autocomplete
        field="first_name"
        icon="label"
        placeholder="Agrega invitado"
        @typing="getFilteredTags"
      >
        <template slot-scope="props">{{ props.option.first_name }} {{ props.option.last_name }}</template>
        <template slot="empty">No hay colaboradores registrados</template>
      </b-taginput>
    </b-field>

    <b-field label="Agregar Observaciones">
      <b-taginput v-model="meeting.observations" icon="label" placeholder="Agrega observaciones"></b-taginput>
    </b-field>

    <b-field label="Agregar Sugerencias">
      <b-taginput v-model="meeting.suggestions" icon="label" placeholder="Agrega sugerencias"></b-taginput>
    </b-field>

    <b-field label="Cámara">
      <b-select v-model="selectedCameraId" placeholder="Selecciona la cámara" @input="getStream">
        <option v-for="option in cameras" :value="option.id" :key="option.id">{{ option.text }}</option>
      </b-select>
    </b-field>

    <video ref="video" autoplay playsinline></video>
    <canvas ref="canvas"></canvas>
    <ul>
      <li v-for="c in meeting.captures" :key="c">
        <img class="captures" :src="c">
      </li>
    </ul>

    <div class="field has-text-centered">
      <button class="button is-success is-rounded" @click.prevent="grabFrame">
        <b-icon icon="camera"></b-icon>
      </button>
    </div>
    <div class="field has-text-centered">
      <button @click="storeMeeting" class="button is-primary is-rounded">
        <b-icon icon="content-save"></b-icon>
        <span>Guardar Asistencia</span>
      </button>
    </div>
    <b-loading :is-full-page="true" :active.sync="isLoading"></b-loading>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import moment from 'moment';

export default {
  data() {
    return {
      moment: moment(),
      selectedDate: null,
      title: '',
      description: '',
      meeting: {
        meeting_id: '',
        employees: [],
        guests: [],
        observations: [],
        suggestions: [],
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
      all_employees: [],
      auth: {},
      isLoading: false,
      storeSuccess: false,
      storeError: false
    };
  },
  methods: {
    storeMeeting () {
      this.isLoading = true
      axios.post(process.env.VUE_APP_URL_API + '/meeting-attendance', this.meeting, this.auth)
        .then(res => {
          if (res.data.success !== undefinded) {
            this.storeSuccess = true
          }
          if (res.data.error !== undefinded) {
            this.storeError = true
          }
          this.isLoading = false
        })
        .catch(err => {

        })
    },
    getMeeting() {
      this.meeting.selectedDate = moment(new Date(this.selectedDate)).format('YYYY-MM-DD')
      
      axios.get(process.env.VUE_APP_URL_API + '/meetings/' + this.meeting.selectedDate, this.auth)
        .then(res => {
          if (res.data.length > 0) {
            this.meeting.meeting_id = res.data[0].id
            this.title = res.data[0].title
            this.description = res.data[0].description  
          } else {
            this.meeting.meeting_id = null
            this.title = 'No Disponible'
            this.description = 'No Disponible'
          }
        })
        .catch(err => {
          console.log(err)  
        })
    },
    getFilteredTags(text) {
      this.filteredTags = this.all_employees.filter(option => {
        return (
          option.first_name
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
            option.text =  `Cámara Selfie`
          } else {
            option.text = `Cámara Documento`
          }
          this.cameras.push(option);
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
          //this.video.src = window.URL.createObjectURL(stream);
          this.video.play();
          //return navigator.mediaDevices.enumerateDevices();
        })
        //.then(this.gotDevices)
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
    this.auth = {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    }
    navigator.mediaDevices
      .enumerateDevices()
      .then(this.gotDevices)
      .catch(error => {
        console.log("enumerateDevices() error: ", error);
      });
    console.log('auth', this.auth)  
    axios
      .get(process.env.VUE_APP_URL_API + "/employees-by-office", this.auth)
      .then(res => {
        this.meeting.employees = res.data;
        this.meeting.employees = this.meeting.employees.map(obj => ({
          ...obj,
          attended: true,
          missing_reason: null
        }));
      })
      .catch(err => console.log(err));

    axios
      .get(process.env.VUE_APP_URL_API + "/employees-all", this.auth)
      .then(res => {
        // console.log(res.data);
        this.all_employees = res.data;
        this.filteredTags = this.all_employees;
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
