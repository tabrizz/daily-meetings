<template>
  <div>
    <div v-if="meeting.status === 0">
      <b-message title="Charla no realizada" type="is-warning" :closable="false"
        >La charla aún no fue realizada</b-message
      >
    </div>
    <div v-else>
      <b-notification type="is-info" has-icon>
        La charla fue realizada: {{ meeting.statusDescription }}
      </b-notification>
      <b-message :title="meeting.title" type="is-info" :closable="false">{{
        meeting.description
      }}</b-message>
      <div class="columns">
        <div class="column">
          <div class="card">
            <div class="card-image">
              <figure class="image is-4by3">
                <img
                  :src="`${url}/pictures/${meeting.selfiePic}`"
                  alt="Foto grupal"
                />
              </figure>
            </div>
            <div class="card-content">Foto grupal</div>
          </div>
        </div>
        <div class="column">
          <div class="card">
            <div class="card-image">
              <figure class="image is-4by3">
                <img
                  :src="`${url}/pictures/${meeting.documentPic}`"
                  alt="Foto documento"
                />
              </figure>
            </div>
            <div class="card-content">Foto documento</div>
          </div>
        </div>
      </div>
      <b-table
        :data="employees"
        :paginated="true"
        :per-page="`12`"
        :default-sort-direction="`asc`"
        :sort-icon="`arrow-up`"
        :sort-icon-size="`is-small`"
        default-sort="id"
        aria-previous-label="Previous page"
        aria-page-label="Page"
        aria-current-label="Current page"
      >
        <template slot-scope="props">
          <b-table-column field="id" label="ID" width="40" sortable numeric>{{
            props.row.id
          }}</b-table-column>

          <b-table-column field="firstName" label="Nombres" sortable>{{
            props.row.firstName
          }}</b-table-column>
          <b-table-column field="lastName" label="Apellidos" sortable>{{
            props.row.lastName
          }}</b-table-column>
          <b-table-column field="attended" label="Asistencia" sortable>
            <span v-if="props.row.attended === 1" class="tag is-success"
              >Presente</span
            >
            <span v-else class="tag is-danger">Faltante</span>
          </b-table-column>
          <b-table-column field="missingReason" label="Descripción" sortable>{{
            props.row.missingReason
          }}</b-table-column>
        </template>
      </b-table>
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
      employees: [],
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
    },
    getEmployees() {
      axios
        .get(process.env.VUE_APP_URL_API + `/meetings/${this.id}/attendance`)
        .then(res => {
          this.employees = res.data;
        });
    }
  },
  mounted() {
    this.id = this.$route.params.id;
    this.getMeeting();
    this.getEmployees();
  }
};
</script>
