<template>
  <div class="home">
    <b-field label="Selecciona una fecha">
        <b-datepicker
            placeholder="Click para seleccionar..."
            icon="calendar-today">
        </b-datepicker>
    </b-field>

    <b-collapse class="panel" :open.sync="isOpenTitle">
      <div slot="trigger" class="panel-heading">
        <strong>Ley</strong>
      </div>      
      <div class="panel-block">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br/>
        Nulla accumsan, metus ultrices eleifend gravida, nulla nunc varius lectus, nec rutrum justo nibh eu lectus. <br/>
        Ut vulputate semper dui. Fusce erat odio, sollicitudin vel erat vel, interdum mattis neque.
      </div>
    </b-collapse>
    <b-collapse class="panel" :open.sync="isOpenContent">
      <div slot="trigger" class="panel-heading">
        <strong>Contenido</strong>
      </div>      
      <div class="panel-block">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br/>
        Nulla accumsan, metus ultrices eleifend gravida, nulla nunc varius lectus, nec rutrum justo nibh eu lectus. <br/>
        Ut vulputate semper dui. Fusce erat odio, sollicitudin vel erat vel, interdum mattis neque.
      </div>
    </b-collapse>


    <b-table
      :data="data"
      :columns="columns"
      :checked-rows.sync="checkedRows"
      checkable>

      <template slot="bottom-left">
        <b>Total de Asistentes</b>: {{ checkedRows.length }}
      </template>
    </b-table>
 
    <b-field label="Agregar Invitados">
      <b-taginput
        v-model="guests"
        :data="filteredTags"
        autocomplete
        field="first_name"
        icon="label"
        placeholder="Agrega invitado"
        @typing="getFilteredTags">
        <template slot-scope="props">
          {{props.option.first_name}}
        </template>
        <template slot="empty">
          There are no items
        </template>
      </b-taginput>
    </b-field>

    <b-field label="Agregar Observaciones">
      <b-taginput
        v-model="observations"
        icon="label"
        placeholder="Agrega observaciones">
      </b-taginput>
    </b-field>

    <b-field label="Agregar Sugerencias">
      <b-taginput
        v-model="suggestions"
        icon="label"
        placeholder="Agrega sugerencias">
      </b-taginput>
    </b-field>

    <b-field label="Cámara">
      <b-select v-model="selectedCameraId" placeholder="Selecciona la cámara" @input="getStream">
        <option
          v-for="option in cameras"
          :value="option.id"
          :key="option.id">
          {{ option.text }}
        </option>
      </b-select>
    </b-field>
    
    <video ref="video" autoplay playsinline></video>
    <canvas ref="canvas"></canvas>
    <ul>
      <li v-for="c in captures" :key="c">
        <img class="captures" :src="c" />
      </li>
    </ul>

    <div class="field has-text-centered">
      <button class="button is-success is-rounded" @click.prevent="grabFrame">
        <b-icon icon="camera"></b-icon>
      </button>
    </div>
    <div class="field has-text-centered">
      <button class="button is-primary is-rounded">
        <b-icon icon="content-save"></b-icon>
        <span>Guardar Asistencia</span>
      </button>
    </div> 
  </div>
</template>

<script>
// @ is an alias to /src
const data2 = [
                { 'id': 1, 'first_name': 'Jesse', 'last_name': 'Simmons' },
                { 'id': 2, 'first_name': 'John', 'last_name': 'Jacobs' },
                { 'id': 3, 'first_name': 'Tina', 'last_name': 'Gilbert' },
                { 'id': 4, 'first_name': 'Clarence', 'last_name': 'Flores' },
                { 'id': 5, 'first_name': 'Anne', 'last_name': 'Lee' }
            ] 
export default {
         
  data () {
    const data = [
                { 'id': 1, 'first_name': 'Jesse', 'last_name': 'Simmons' },
                { 'id': 2, 'first_name': 'John', 'last_name': 'Jacobs' },
                { 'id': 3, 'first_name': 'Tina', 'last_name': 'Gilbert' },
                { 'id': 4, 'first_name': 'Clarence', 'last_name': 'Flores' },
                { 'id': 5, 'first_name': 'Anne', 'last_name': 'Lee' }
            ];
    
    return {
      isOpenTitle: false,
      isOpenContent: false,
      data,
      checkedRows: [data[1], data[3]],
      keepFirst: false,
      openOnFocus: false,
      selected: null,
      name: '',  
      columns: [
        {
            field: 'first_name',
            label: 'Nombres',
        },
        {
            field: 'last_name',
            label: 'Apellidos',
        }
      ],
      guests: [],
      data2,
      filteredTags: data2,
      observations: [],
      suggestions: [],
      mediaStream: null,
      cameras: [],
      constraints: {},
      video: null,
      canvas: null,
      imageCapture: null,
      selectedCameraId: null,
      captures: []
    }
  },
  methods: {
    getFilteredTags(text) {
      this.filteredTags = this.data2.filter((option) => {
        return option.first_name
          .toString()
          .toLowerCase()
          .indexOf(text.toString().toLowerCase()) >= 0
      })
    },
    grabFrame () {
      this.canvas = this.$refs.canvas;
      // let context = this.canvas.getContext("2d").drawImage(this.video, 0, 0, 900, 480);
      // console.log(this.canvas.toDataURL("image/png"))
      // this.captures.push(this.canvas.toDataURL("image/png"));
      this.imageCapture.grabFrame().then((imageBitmap) => {
        this.canvas.width = imageBitmap.width;
        this.canvas.height = imageBitmap.height;
        this.canvas.getContext('2d').drawImage(imageBitmap, 0, 0);
        this.captures.push(this.canvas.toDataURL("image/png"));
      });
    },
    gotDevices (mediaDevices) {
      console.log('mediadevices got', mediaDevices);
      let count = 1;
      mediaDevices.forEach(mediaDevice => {
        let option = {};
        if (mediaDevice.kind === 'videoinput') {
          option.id = mediaDevice.deviceId;
          option.text = mediaDevice.label || `Camera ${count++}`;
          this.cameras.push(option);
        }
      })
    },
    getStream () {
      console.log('mediastream', this.mediaStream);
      if (typeof this.mediaStream !== 'undefined' && this.mediaStream !== null) {
        this.stopMediaTracks(this.mediaStream);
      }
      const videoConstraints = {};
      if (this.selectedCameraId === '') {
        videoConstraints.facingMode = 'environment';
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
          console.log('ref video', this.$refs.video);
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
    },
    trial () {
      console.log('trial')
    }
  },
  mounted () {
    navigator.mediaDevices.enumerateDevices()
      .then(this.gotDevices)
      .catch(error => {
        console.log('enumerateDevices() error: ', error);
      });
    //this.cameras = [{id: 1, text: 'cam1'}, {id: 2, text: 'cam2'}]
  }
}
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
    max-width: 7%;
    max-height: 7%;
  }
</style>
