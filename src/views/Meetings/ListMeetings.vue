<template>
  <div>
    <div class="columns">
      <div class="column is-four-fifths">
        <b-field>
          <b-autocomplete
            v-model="office"
            placeholder="Seleccione la oficina"
            :data="getFilteredTags"
            field="name"
            @select="option => selectedOffice = option"
          ></b-autocomplete>
        </b-field>
      </div>
      <div class="column">
        <button class="button is-primary" @click.prevent="getMeetingsByOffice">
          <strong>Buscar</strong>
        </button>
      </div>
    </div>

    <b-table
      :data="meetings"
      :paginated="true"
      :per-page="`12`"
      :default-sort-direction="`desc`"
      :sort-icon="`arrow-up`"
      :sort-icon-size="`is-small`"
      default-sort="id"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page"
    >
      <template slot-scope="props">
        <b-table-column field="id" label="ID" width="40" sortable numeric>{{ props.row.id }}</b-table-column>

        <b-table-column field="title" label="Título" sortable>{{ props.row.title }}</b-table-column>

        <b-table-column field="user.status" label="Estado" sortable>
          <span v-if="props.row.status === 1" class="tag is-success">Completado</span>
          <span v-else class="tag is-danger">Incompleto</span>
        </b-table-column>

        <b-table-column
          field="date"
          label="Fecha Programada"
          sortable
          centered
        >{{ new Date(props.row.startDate).toLocaleDateString() }}</b-table-column>
        <b-table-column label="Opciones">
          <b-button
            icon-left="eye"
            tag="router-link"
            :to="{ name: 'show-meeting', params: { id: props.row.id }}"
            type="is-info"
          ></b-button>
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      office: "",
      selectedOffice: null,
      offices: [],
      meetings: []
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
    getMeetingsByOffice() {
      axios
        .get(
          process.env.VUE_APP_URL_API +
            `/meetings?officeId=${this.selectedOffice.id}`
        )
        .then(res => {
          this.meetings = res.data;
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
  }
};
</script>