<template>
  <div>
    <div class="columns">
      <div class="column is-four-fifths">
        <h3 class="title">Empleados</h3>
      </div>
      <div class="column">
        <b-button
          icon-left="plus"
          tag="router-link"
          :to="{ name: 'create-employee' }"
          type="is-success"
          >Crear Empleado</b-button
        >
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
