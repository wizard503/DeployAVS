<template>
    <div class="row">
      <div class="col-6 favorite">
        <q-item-label>Favoritos</q-item-label>
      </div>
      <div class="col-6 favorite">
        <div class="posBtn">
          <q-btn align="right" class="btn-fixed-width" color="primary" label="Agregar" size="9px"/>
        </div>
      </div>
      <div class="col-12 rec">
        <q-list bordered class="rounded-borders">
        <q-expansion-item
          expand-separator
          icon="explore"
          label="Destinos"
          caption="vacio"
        >
        </q-expansion-item>

        <q-expansion-item :content-inset-level="0.5" expand-separator icon="directions_bus" label="Paradas" caption="vacio">

        </q-expansion-item>
        <q-expansion-item :content-inset-level="0.5" expand-separator icon="insights" label="Rutas" caption="vacio">
        </q-expansion-item>
      </q-list>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Favoritos',
  data () {
  }
}
</script>

<style scoped>
    .rec{
    border: 1px solid black;
    margin-top: 5px;
  }
  .favorite{
    margin-top: 1.5em;
    margin-bottom: 0.5px;
  }
  .posBtn{
    text-align: right;
  }

</style>
