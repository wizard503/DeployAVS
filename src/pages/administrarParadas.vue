<template>
  <q-page>
    <q-list>
      <cabecera-lista />

      <busqueda-lista />

      <elemento-lista
        v-for="(parada, index) in paradas"
        :key="index"
        :parada="parada"
      />
    </q-list>

    <modal-ver />

    <modal-agregar />

    <modal-editar />

    <modal-eliminar />
  </q-page>
</template>

<script>
import CabeceraLista from 'src/components/administracionParadas/cabeceraLista.vue'
import ElementoLista from 'src/components/administracionParadas/elementoLista.vue'
import ModalVer from 'src/components/administracionParadas/modalVer.vue'
import ModalEliminar from 'src/components/administracionParadas/modalEliminar.vue'
import ModalAgregar from 'src/components/administracionParadas/modalAgregar.vue'
import BusquedaLista from 'src/components/administracionParadas/busquedaLista.vue'
import ModalEditar from '../components/administracionParadas/modalEditar.vue'

import eventBus from 'app/src/eventBus'

export default {
  name: 'AdministrarParada',

  components: { CabeceraLista, ElementoLista, ModalVer, ModalEliminar, ModalAgregar, BusquedaLista, ModalEditar },

  data: () => ({
    paradas: []
  }),

  created () {
    eventBus.$on('filtrar', (paradas) => {
      this.paradas = paradas
    })

    eventBus.$on('refrescar', (paradas) => {
      this.paradas = paradas
    })
  }
}
</script>
