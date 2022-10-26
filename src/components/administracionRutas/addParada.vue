<template>
    <div>
        <q-dialog v-model="estado" persistent>
        <q-card style="width: 800px; max-width: 90vw; border-radius: 10px;">
          <q-toolbar>
            <div class="search-box" style="width: 95%; margin-right: 10px;">
              <q-input  rounded outlined dense standout="bg-brown-2 text-white"  input-class="text-right" v-model="busqueda" @clear="busqueda = ''">
                <template v-slot:append>
                  <q-icon v-if="busqueda === ''" name="ion-search" color="primary"/>
                  <q-icon v-else name="clear" class="cursor-pointer" @click="busqueda = ''" />
                </template>
              </q-input>
            </div>
            <q-btn flat round dense icon="close" v-close-popup @click="close()"/>
          </q-toolbar>
            <div class="q-py-md q-px-sm">
                <q-card-section>
                  <div
                    class="col-12 col-sm-6"
                  >
                    <q-scroll-area style="height: 320px;">
                      <q-list>
                              <q-item v-for="(parada, index) in filteredParadas"
                                  :key="index">
                                <q-item-section avatar>
                                  <q-icon color="primary" name="ion-pin" />
                                </q-item-section>
                                <q-item-section>
                                  <q-item-label style="font-size: 12px">{{parada.nombre}}</q-item-label>
                                  <q-item-label caption style="font-size: 10px">{{parada.referencia}}</q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <div class="text-grey-8 q-gutter-xs">
                                    <q-btn flat dense round icon="ion-add-circle" size="17px" @click="addParada(parada)">
                                      <q-tooltip  content-class="bg-accent">Agregar</q-tooltip>
                                    </q-btn>
                                  </div>
                                </q-item-section>
                              </q-item>
                      </q-list>
                    </q-scroll-area>
                  </div>
                </q-card-section>
            </div>
        </q-card>
      </q-dialog>
    </div>
</template>
<script>
import eventBus from 'app/src/eventBus'

import { db } from 'app/src/boot/db'

export default {
  name: 'addParada',

  firestore: {
    paradasBuses: db.collection('paradas')
  },

  data: () => ({
    estado: false,
    paradasIda: [],
    paradasVuelta: [],
    paradasBuses: [],
    recorrido: '',
    busqueda: ''
  }),

  methods: {
    close () {
      this.busqueda = ''
    },
    showNotif (config) {
      this.$q.notify(config)
    },
    addParada (parada) {
      if (String(this.recorrido) === 'ida') {
        this.paradasIda.push(parada)
        eventBus.$emit('addParada', parada, this.recorrido)
      } else {
        eventBus.$emit('addParada', parada, this.recorrido)
      }
      this.showNotif({
        type: 'positive',
        message: 'Parada Añadida',
        timeout: 700
      })
    }
  },

  computed: {
    filteredParadas () {
      return this.paradasBuses.filter((parada) => {
        return parada.nombre.toLowerCase().match(this.busqueda.toLowerCase())
      })
    }
  },

  created () {
    eventBus.$on('showAddParada', (recorrido) => {
      this.estado = true
      this.recorrido = recorrido
    })
    eventBus.$on('deleteParada', (parada, recorrido) => {
      if (recorrido === 'ida') {
        this.paradasIda = this.paradasIda.filter(function (i) { return i !== parada })
      } else {
        this.paradasVuelta = this.paradasVuelta.filter(function (i) { return i !== parada })
      }
    })
  }
}
</script>
