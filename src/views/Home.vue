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

    <div class="camera-mod">
        <video ref="video" class="camera-stream"/>
    </div>
    <img v-bind:src="meeting_picture" class="metting_picture_box" />
    <div class="field has-text-centered">
      <button class="button is-success is-rounded" @click.prevent="capture">
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
      meeting_picture: '',
      mediaStream: null
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
    capture () {
      const mediaStreamTrack = this.mediaStream.getVideoTracks()[0]
      const imageCapture = new window.ImageCapture(mediaStreamTrack)
      return imageCapture.takePhoto().then(blob => {
        this.meeting_picture = URL.createObjectURL(blob)
        console.log(blob)
      })
    }
  },
  mounted () {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(mediaStream => {
          this.mediaStream = mediaStream
          this.$refs.video.srcObject = mediaStream
          this.$refs.video.play()
        })
        .catch(error => console.error('getUserMedia() error:', error))
  },
  destroyed () {
    const tracks = this.mediaStream.getTracks()
    tracks.map(track => track.stop())
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
  .meeting_picture_box {
    height: 50px;
    width: 50px;
  }
</style>
