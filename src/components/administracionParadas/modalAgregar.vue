<template>
  <q-dialog v-model="estado">
    <q-card style="width: 700px; max-width: 90vw; border-radius: 16px;">
      <q-card-section style="padding: 24px; background-color: rgb(26, 115, 232);">
        <div
          class="text-h6 flex items-center"
          style="color: rgb(255, 255, 255);"
        >
          Agregar una parada de buses
        </div>
      </q-card-section>

      <q-scroll-area style="height: 420px;">
        <div class="row">
          <div
            class="col-12 col-sm-6"
            style="padding: 24px;"
          >
            <q-card-section style="padding: 0px; margin-bottom: 16px;">
              <div
                class="text-body2"
                style="color: rgba(0, 0, 0, 0.54);"
              >
                Nombre
              </div>

              <q-input
                outlined
                dense
                clearable
                clear-icon="eva-close"
                v-model="parada.nombre"

                @clear="parada.nombre = ''"
              />
            </q-card-section>

            <q-card-section style="padding: 0px; margin-bottom: 16px;">
              <div
                class="text-body2"
                style="color: rgba(0, 0, 0, 0.54);"
              >
                Referencia
              </div>

              <q-input
                outlined
                dense
                clearable
                clear-icon="eva-close"
                v-model="parada.referencia"

                @clear="parada.referencia = ''"
              />
            </q-card-section>

            <q-card-section style="padding: 0px; margin-bottom: 16px;">
              <div
                class="text-body2"
                style="color: rgba(0, 0, 0, 0.54);"
              >
                Ciudad
              </div>

              <q-input
                outlined
                dense
                disable
                clear-icon="eva-close"
                v-model="parada.ciudad"
              />
            </q-card-section>

            <q-card-section style="padding: 0px; margin-bottom: 16px;">
              <div
                class="text-body2"
                style="color: rgba(0, 0, 0, 0.54);"
              >
                Lugares cercanos
              </div>

              <q-input
                outlined
                dense
                autogrow
                clearable
                clear-icon="eva-close"
                v-model="parada.lugaresCercanos"

                @clear="parada.lugaresCercanos = ''"
              />
            </q-card-section>

            <div class="row">
              <div class="col-6">
                <q-card-section style="padding: 0px; margin-end: 8px;">
                  <div
                    class="text-body2"
                    style="color: rgba(0, 0, 0, 0.54);"
                  >
                    Latitud
                  </div>

                  <q-input
                    outlined
                    dense
                    type="number"
                    v-model="parada.gps._lat"
                  />
                </q-card-section>
              </div>

              <div class="col-6">
                <q-card-section style="padding: 0px; margin-start: 8px;">
                  <div
                    class="text-body2"
                    style="color: rgba(0, 0, 0, 0.54);"
                  >
                    Longitud
                  </div>

                  <q-input
                    outlined
                    dense
                    type="number"
                    v-model="parada.gps._long"
                  />
                </q-card-section>
              </div>
            </div>
          </div>

          <div
            class="col-12 col-sm-6"
            style="padding: 24px;"
          >
            <q-card-section style="padding: 0px; margin-bottom: 32px;">
              <div
                class="text-body2"
                style="color: rgba(0, 0, 0, 0.54);"
              >
                Fotografías de la parada
              </div>

              <q-file
                outlined
                dense
                counter
                multiple
                max-files="3"
                accept="image/*"
                v-model="fotos"
              >
                <template v-slot:prepend>
                  <q-icon name="eva-upload" />
                </template>

                <template v-slot:file></template>
              </q-file>
            </q-card-section>

            <q-card-section style="padding: 0px;">
              <q-chip
                square
                removable
                icon-remove="eva-close"
                class="full-width q-my-xs"
                style="padding: 16px; color: rgba(0, 0, 0, 0.54); background-color: rgba(0, 0, 0, 0.055);"

                v-for="(foto, index) in fotos"
                :key="foto.name"

                @remove="cancelarFoto(index)"
              >
                <q-avatar>
                  <q-icon
                    name="eva-image"
                    size="20px"
                  />
                </q-avatar>

                <div
                  class="ellipsis"
                  style="margin: 0px 8px;"
                >
                  {{ foto.name }}
                </div>
              </q-chip>
            </q-card-section>
          </div>
        </div>
      </q-scroll-area>

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
          style="padding: 0px 8px; border-radius: 8px; color: rgba(0, 0, 0, 0.54);"
        />

        <q-btn
          v-close-popup
          unelevated
          label="Guardar"
          class="text-capitalize"
          :style="'padding: 0px 8px; border-radius: 8px; color: ' + color + '; background-color: ' + backgroundColor + ';'"

          :disable="validar()"

          @click="agregar()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import eventBus from 'app/src/eventBus'

import { db, GeoPoint, storage } from 'app/src/boot/db'

export default {
  name: 'ModalAgregar',

  data: () => ({
    estado: false,

    color: '',

    backgroundColor: '',

    parada: {
      nombre: '',
      referencia: '',
      ciudad: 'Santa Ana',
      lugaresCercanos: '',
      gps: new GeoPoint(0, 0),
      fotos: []
    },

    fotos: [],

    urls: []
  }),

  methods: {
    validar () {
      if (
        this.parada.nombre.length > 0 &&
        this.parada.referencia.length > 0 &&
        this.parada.ciudad.length > 0 &&
        this.parada.lugaresCercanos.length > 0 &&
        String(this.parada.gps._lat).length > 0 &&
        String(this.parada.gps._long).length > 0
      ) {
        this.color = 'rgba(255, 255, 255)'
        this.backgroundColor = 'rgb(26, 115, 232)'

        return false
      } else {
        this.color = 'rgba(0, 0, 0, 0.54)'
        this.backgroundColor = 'rgba(0, 0, 0, 0.06)'

        return true
      }
    },

    reestablecer () {
      this.parada = {
        nombre: '',
        referencia: '',
        ciudad: 'Santa Ana',
        lugaresCercanos: '',
        gps: new GeoPoint(0, 0),
        fotos: []
      }

      this.fotos = []

      this.urls = []
    },

    agregar () {
      db.collection('paradas').add(this.parada).then((parada) => {
        this.fotos.forEach((foto) => {
          const archivo = storage.ref('paradas/' + parada.id + '/' + Math.floor(Math.random() * 999999) + ' - ' + foto.name)

          archivo.put(foto).then(() => {
            archivo.getDownloadURL().then((url) => {
              this.urls.push(url)

              db.collection('paradas').doc(parada.id).update({ fotos: this.urls })
            })
          })
        })

        db.collection('paradas').doc(parada.id).update({ id: parada.id })

        this.reestablecer()
      })
    },

    cancelarFoto (index) {
      this.fotos.splice(index, 1)
    }
  },

  created () {
    eventBus.$on('mostrarModalAgregar', () => {
      this.estado = true
    })
  }
}
</script>
