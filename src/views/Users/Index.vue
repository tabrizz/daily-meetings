<template>
  <div>
    <div class="columns">
      <div class="column is-four-fifths">
        <h3 class="title">Usuarios</h3>
      </div>
      <div class="column">
        <b-button
          icon-left="plus"
          tag="router-link"
          :to="{ name: 'create-user'}"
          type="is-success"
        >Crear Usuario</b-button>
      </div>
    </div>
    <div>
      <router-view />
    </div>
  </div>
</template>

<script>
export default {};
</script>