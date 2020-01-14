<template>
  <div>
    <div v-if="meeting.status === 0">
      <b-message
        title="Charla no realizada"
        type="is-warning"
        :closable="false"
      >La charla aún no fue realizada</b-message>
    </div>
    <div v-else>
      <b-message :title="meeting.title" type="is-info" :closable="false">{{ meeting.description }}</b-message>
      <div class="columns">
        <div class="column">
          <div class="card">
            <div class="card-image">
              <figure class="image is-4by3">
                <img :src="`${url}/pictures/${meeting.selfiePic}`" alt="Foto grupal" />
              </figure>
            </div>
            <div class="card-content">Foto grupal</div>
          </div>
        </div>
        <div class="column">
          <div class="card">
            <div class="card-image">
              <figure class="image is-4by3">
                <img :src="`${url}/pictures/${meeting.documentPic}`" alt="Foto documento" />
              </figure>
            </div>
            <div class="card-content">Foto documento</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      id: null,
      meeting: {},
      url: process.env.VUE_APP_URL
    };
  },
  methods: {
    getMeeting() {
      axios
        .get(process.env.VUE_APP_URL_API + `/meetings/${this.id}`)
        .then(res => {
          this.meeting = res.data;
        });
    }
  },
  mounted() {
    this.id = this.$route.params.id;
    this.getMeeting();
  }
};
</script>