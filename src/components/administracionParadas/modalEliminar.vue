<template>
  <q-dialog v-model="estado">
    <q-card style="width: 700px; max-width: 90vw; border-radius: 16px;">
      <q-card-section style="padding: 24px; background-color: #fbe9e7;">
        <div
          class="text-h6"
          style="color: rgb(198, 40, 40);"
        >
          <q-icon
            name="eva-alert-triangle"
            size="25px"
            style="margin-right: 8px;"
          />

          ¿Quieres eliminar esta parada de buses?
        </div>

        <div style="color: rgb(198, 40, 40); padding-top: 16px; font-weight: 500;">
          Esta acción eliminara permanentemente todos los datos de la ubicación, incluidos los datos anidados.
        </div>
      </q-card-section>

      <q-card-section style="padding: 24px;">
        <div style="color: rgba(0, 0, 0, 0.54); margin-bottom: 16px">
          Ubicación del documento
        </div>

        <div style="font-weight: 500;">/paradas/{{ id }}</div>

        <div style="color: rgba(0, 0, 0, 0.54); margin-top: 16px">
          Para confirmar que deseas eliminar esta parada de buses, escribe su ID:

          <span style="color: #000000; font-weight: 500;"> {{ id }} </span>
        </div>

        <div
          class="row"
          style="margin-top: 16px"
        >
          <div class="col-12 col-sm-6">
            <q-input
              outlined
              dense
              :placeholder="id"
              v-model="idTexto"
            />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions
        align="right"
        style="padding: 24px"
      >
        <q-btn
          v-close-popup
          flat
          label="Cancelar"
          class="text-capitalize"
          style="padding: 0px 8px; border-radius: 8px; color: rgba(0, 0, 0, 0.54)"
        />

        <q-btn
          v-close-popup
          unelevated
          label="Eliminar"
          class="text-capitalize"
          :style="'padding: 0px 8px; border-radius: 8px; color: ' + color + '; background-color: ' + backgroundColor + ';'"

          :disable="validar()"

          @click="eliminar()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import eventBus from 'app/src/eventBus'

import { db, storage } from 'app/src/boot/db'

export default {
  name: 'ModalEliminar',

  data: () => ({
    estado: false,

    idTexto: '',

    color: '',
    backgroundColor: '',

    id: '',
    fotos: []
  }),

  methods: {
    validar () {
      if (this.id === this.idTexto) {
        this.color = 'rgb(255, 255, 255)'
        this.backgroundColor = 'rgb(198, 40, 40)'

        return false
      } else {
        this.color = 'rgba(0, 0, 0, 0.54)'
        this.backgroundColor = 'rgba(0, 0, 0, 0.06)'

        return true
      }
    },

    eliminar () {
      db.collection('paradas').doc(this.id).delete()

      this.fotos.forEach((url) => {
        storage.refFromURL(url).delete()
      })
    }
  },

  created () {
    eventBus.$on('mostrarModalEliminar', (id, fotos) => {
      this.estado = true

      this.idTexto = ''

      this.id = id
      this.fotos = fotos
    })
  }
}
</script>
