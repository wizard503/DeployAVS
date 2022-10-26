<template>
  <q-dialog v-model="estado">
      <q-card style="width: 400px; border-radius: 16px;">
        <carusel-fotos :fotos="parada.fotos" />

        <div style="padding: 24px;">
          <q-card-section style="padding: 0px; margin-bottom: 16px;">
            <q-btn
              fab
              unelevated
              text-color="white"
              icon="eva-pin"
              class="absolute"
              style="top: 0; right: 0; transform: translateY(-100%); background-color: rgb(26, 115, 232);"
            />

            <div
              class="text-caption"
              style="color: rgba(0, 0, 0, 0.54);"
            >
              Localización: [ {{ gps._lat }}, {{  gps._long }} ]
            </div>
          </q-card-section>

          <q-card-section style="padding: 0px; margin-bottom: 16px;">
            <div
              class="text-h6"
              style="font-weight: 500;"
            >
              Parada de buses {{ parada.nombre }}
            </div>

            <div
              class="text-body2"
              style="color: rgba(0, 0, 0, 0.54);"
            >
              {{ parada.referencia }}, {{ parada.ciudad }}
            </div>
          </q-card-section>

          <q-card-section style="padding: 0px">
            <div
              class="text-caption"
              style="color: rgba(0, 0, 0, 0.54);"
            >
              Lugares cercanos: {{ parada.lugaresCercanos }}.
            </div>
          </q-card-section>
        </div>

        <q-separator />

        <q-card-actions
          align="right"
          style="padding: 24px"
        >
          <q-btn
            v-close-popup
            flat
            label="Cerrar"
            class="text-capitalize"
            style="padding: 0px 8px; border-radius: 8px; color: rgba(0, 0, 0, 0.54);"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script>
import CaruselFotos from './caruselFotos.vue'

import eventBus from 'app/src/eventBus'

export default {
  name: 'ModalVer',

  components: { CaruselFotos },

  data: () => ({
    estado: false,

    parada: {},
    gps: {}
  }),

  created () {
    eventBus.$on('mostrarModalVer', (parada) => {
      this.estado = true

      this.parada = parada
      this.gps = parada.gps
    })
  }
}
</script>
