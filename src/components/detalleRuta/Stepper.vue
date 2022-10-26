<template>
    <q-step
            :name="index"
            :title="detalles.nombre"
            icon="airline_stops"
            :done="step>index"
            >
            <q-btn align="around" class="btn-fixed-width" color="primary" label="Detalles" icon="info" size="sm"  @click="$router.push({ name: 'home-detalleparada', params: { id: detalles.id, nombre: detalles.nombre, lat: detalles.gps._lat, lon: detalles.gps._long} })"/>
          </q-step>
 </template>

<script>

import { busStepper } from '../../router/index'

export default {
  name: 'StepperComponent',
  props: {
    detalles: Object,
    index: Number,
    step: Number
  },
  data () {
    return {

    }
  },
  methods: {
    emitir () {
      busStepper.$emit('cambioStep', 'DATO PRUEBA')
    }
  }
}
</script>
