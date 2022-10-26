<template>
  <div>
    <q-item style="padding: 2rem 1rem;">
      <q-item-section avatar>
        <q-icon
          name="eva-search"
          size="32px"
          style="color: rgb(25, 103, 210);"
        />
      </q-item-section>

      <q-item-section>
        <q-input
          outlined
          dense
          clearable
          clear-icon="eva-close"
          v-model="busqueda"

          @clear="busqueda = ''"
        />
      </q-item-section>
    </q-item>

    <q-separator inset="item" />
  </div>
</template>

<script>
import eventBus from 'app/src/eventBus'

import { mapGetters } from 'vuex'

export default {
  name: 'BusquedaLista',

  data: () => ({
    paradasBusqueda: [],

    busqueda: ''
  }),

  computed: {
    ...mapGetters('DataVuex', ['paradas'])
  },

  methods: {
    filtrar (paradas, busqueda) {
      let paradasBusqueda = []

      if (busqueda.length > 0) {
        paradas.forEach((parada) => {
          const nombre = parada.nombre.toLowerCase()
          const referencia = parada.referencia.toLowerCase()
          const lugaresCercanos = parada.lugaresCercanos.toLowerCase()

          busqueda = busqueda.toLowerCase()

          if ((nombre.indexOf(busqueda) !== -1) || (referencia.indexOf(busqueda) !== -1) || (lugaresCercanos.indexOf(busqueda) !== -1)) {
            paradasBusqueda.push(parada)
          }
        })
      } else {
        paradasBusqueda = paradas
      }

      return paradasBusqueda
    }
  },

  created () {
    eventBus.$emit('filtrar', this.filtrar(this.paradas, this.busqueda))
  },

  updated () {
    eventBus.$emit('busqueda', this.busqueda)

    eventBus.$emit('filtrar', this.filtrar(this.paradas, this.busqueda))
  }
}
</script>
