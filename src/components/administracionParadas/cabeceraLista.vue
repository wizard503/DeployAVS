<template>
  <div>
    <q-item style="padding: 16px;">
      <q-item-section avatar>
        <q-btn
          round
          unelevated
          icon="eva-file-add"
          style="color: rgb(25, 103, 210); background-color: rgba(26, 115, 232, 0.12);"

          @click="mostrarModalAgregar()"
        >
          <q-tooltip>
            Agregar
          </q-tooltip>
        </q-btn>
      </q-item-section>

      <q-item-section>
        <q-item-label
          lines="1"
          class="text-h5"
          style="font-weight: 500;"
        >
          Paradas de buses
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-separator inset="item" />
  </div>
</template>

<script>
import eventBus from '../../eventBus'

export default {
  name: 'CabeceraLista',

  methods: {
    mostrarModalAgregar () {
      eventBus.$emit('mostrarModalAgregar')
    }
  }
}
</script>
