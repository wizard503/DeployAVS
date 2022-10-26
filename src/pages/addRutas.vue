<template>
    <div>
      <addParada></addParada>

    <div class="text-h4 q-mt-md q-mb-md">Agregar Ruta</div>
            <q-input
            v-model="ruta.nombre"
            @clear="ruta.nombre = ''"
            label="Nombre de la Ruta" />
            <q-input
            type="number"
            v-model="ruta.precios.normal"
            label="Precio normal" />
            <q-input
            type="number"
            v-model="ruta.precios.especial"
            label="Precio especial" />
            <q-input
            type="number"
            v-model="ruta.frecuencia"
            @clear="ruta.frecuencia = ''"
            label="Frecuencia" />

            <q-card class="q-my-lg  q-pa-sm">
                  <input
                    @change="selectImages($event)"
                    type="file"
                    id="formFile"
                    accept="image/*"
                    required
                    multiple
                    style="display: none"
                  />
              <q-item>
                <q-item-section avatar>
                  <q-btn push color="white" text-color="primary" round icon="fas fa-solid fa-upload" @click="openUpload" id="save" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>Agregar Fotos</q-item-label>
                  <q-item-label caption>
                    Mínimo 1 imagen
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-separator />

              <q-card-section horizontal class="q-my-lg q-ml-lg">
                <div class="col q-col-gutter-md">
                  <q-card  v-for="(imagen, id) in previewImages"
                        :key="id"
                        :name="id">
                      <q-img :src="previewImages[id]"/>

                      <q-card-actions>
                        <q-btn push color="white" text-color="primary" size="12px" icon-right="delete" label="Delete" @click="delImage(id)"/>
                      </q-card-actions>
                    </q-card>
                </div>
              </q-card-section>
            </q-card>
        <q-tabs
          v-model="tab"
          dense
          active-color="primary"
          indicator-color="orange"
          align="justify"
          narrow-indicator
          class="primary"
          no-caps
        >
          <q-tab name="ida" label="Recorrido Ida" />
          <q-tab name="vuelta" label="Recorrido Vuelta"/>
        </q-tabs>
        <q-separator/>

        <q-tab-panels
          v-model="tab"
          animated
          swipeable
          vertical
          transition-prev="scale"
          transition-next="scale"
        >

          <q-tab-panel name="ida">
            <q-input
            v-model="ruta.ida.nombre"
            @clear="ruta.ida.nombre = ''"
            label="Trayectoria" />
            <q-input
            type="number"
            label="Tiempo" v-model="ruta.ida.tiempo"
            @clear="ruta.ida.tiempo = ''"/>
            <q-input
            v-model="ruta.ida.primerviaje"
            @clear="ruta.ida.primerviaje = ''"
            label="Primer viaje" />
            <q-input
            v-model="ruta.ida.ultimoviaje"
            @clear="ruta.ida.ultimoviaje = ''"
            label="Ultimo viaje" />
            <div class="q-pa-sm">
                <q-btn  push color="dark" text-color="white" label="Añadir Paradas" @click="showAddParada()"/>
            </div>
               {{ /* LIST PARADAS AÑADIDAS */ }}
              <q-list v-if="hasParadasIda()"  dense bordered padding class="rounded-borders">
                <q-item v-for="(parada, index) in paradasIda" :key="index">
                  <q-item-section top>
                    <q-item-label style="font-size: 13px" class="text-weight-medium">
                      {{parada.nombre}}
                    </q-item-label>

                    <q-item-label style="font-size: 11px" caption>
                      {{parada.referencia}}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side >
                      <div class="row" >
                        <div>
                          <div class="colum">
                            <div>
                              <q-btn flat dense round icon="fas fa-solid fa-caret-up" @click="intercambiarParadasIda(parada, 'up')" size="sm" ></q-btn>
                            </div>
                            <div>
                              <q-btn flat dense round icon="fas fa-solid fa-caret-down" @click="intercambiarParadasIda(parada, 'down')" size="sm" ></q-btn>
                            </div>
                          </div>
                        </div>
                        <div>
                          <q-btn flat dense round icon="delete" size="15px" @click="eliminarParadaIda(parada)"></q-btn>
                        </div>
                      </div>
                  </q-item-section>
                </q-item>
              </q-list>
          </q-tab-panel>

          <q-tab-panel name="vuelta">
            <q-input
            v-model="ruta.vuelta.nombre"
            @clear="ruta.vuelta.nombre = ''"
            label="Trayectoria" />
            <q-input
            type="number"
            v-model="ruta.vuelta.tiempo"
            @clear="ruta.vuelta.tiempo = ''"
            label="Tiempo" />
            <q-input
            v-model="ruta.vuelta.primerviaje"
            @clear="ruta.vuelta.primerviaje = ''"
            label="Primer viaje" />
            <q-input
            v-model="ruta.vuelta.ultimoviaje"
            @clear="ruta.vuelta.ultimoviaje = ''"
            label="Ultimo viaje" />
            <div class="q-pa-sm">
                <q-btn  push color="dark" text-color="white" label="Añadir Paradas" @click="showAddParada()"/>
            </div>
               {{ /* LIST PARADAS AÑADIDAS */ }}
              <q-list v-if="hasParadasVuelta()" dense bordered padding class="rounded-borders">
                <q-item v-for="(parada, index) in paradasVuelta"
                        :key="index">
                  <q-item-section top>
                    <q-item-label style="font-size: 13px"
                      class="text-weight-medium"
                    >
                      {{parada.nombre}}
                    </q-item-label>

                    <q-item-label style="font-size: 11px"
                      caption
                    >
                      {{parada.referencia}}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side >
                    <div class="row" >
                      <div>
                        <div class="colum">
                          <div>
                            <q-btn flat dense round icon="fas fa-solid fa-caret-up" @click="intercambiarParadasVuelta(parada, 'up')" size="sm" ></q-btn>
                          </div>
                          <div>
                            <q-btn flat dense round icon="fas fa-solid fa-caret-down" @click="intercambiarParadasVuelta(parada, 'down')" size="sm" ></q-btn>
                          </div>
                        </div>
                      </div>
                      <div>
                        <q-btn flat dense round icon="delete" size="15px" @click="eliminarParadaVuelta(parada)"></q-btn>
                      </div>
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
          </q-tab-panel>
        </q-tab-panels>

  <div align="right">
    <q-btn v-close-popup label="Cancelar" color="primary" flat icon="cancel" to="/admin/rutas"/>
    <q-btn label="Guardar" color="primary" flat icon="save" :disable="validar()" @click="agregar()"/>
    </div>
  </div>
</template>
<script>
import { db, storage } from 'app/src/boot/db'
import eventBus from 'app/src/eventBus'

import addParada from 'src/components/administracionRutas/addParada.vue'
export default {
  name: 'AddRuta',
  components: { addParada },
  firestore: {
    paradasBuses: db.collection('paradas')
  },

  data: () => ({
    message: '',
    busqueda: '',
    tab: 'ida',
    estado: false,
    color: '',
    backgroundColor: '',
    paradasBuses: [],
    paradasIda: [],
    paradasVuelta: [],

    ruta: {
      nombre: '',
      precios: {
        normal: null,
        especial: null
      },
      ciudad: 'Santa Ana',
      frecuencia: null,
      fotos: [],
      ida: {
        nombre: '',
        tiempo: null,
        primerviaje: '',
        ultimoviaje: '',
        paradas: []
      },
      vuelta: {
        nombre: '',
        tiempo: null,
        primerviaje: '',
        ultimoviaje: '',
        paradas: []
      }
    },

    fotos: [],
    previewImages: [],

    urls: []
  }),
  computed: {
    filteredParadas () {
      return this.paradasBuses.filter((parada) => {
        return parada.nombre.match(this.busqueda)
      })
    }
  },

  methods: {
    showNotif (config) {
      this.$q.notify(config)
    },
    getRecorrido () {
      console.log(this.tab)
      return this.tab
    },
    showAddParada () {
      eventBus.$emit('showAddParada', this.getRecorrido())
    },

    intercambiarParadasIda (parada, position) {
      const i = this.paradasIda.indexOf(parada)

      if (i !== 0 && position === 'up') {
        [this.paradasIda[i], this.paradasIda[i - 1]] = [this.paradasIda[i - 1], this.paradasIda[i]]
      }
      if ((i !== this.paradasIda.length - 1) && position === 'down') {
        [this.paradasIda[i], this.paradasIda[i + 1]] = [this.paradasIda[i + 1], this.paradasIda[i]]
      }
      this.$forceUpdate()
    },

    intercambiarParadasVuelta (parada, position) {
      const i = this.paradasVuelta.indexOf(parada)

      if (i !== 0 && position === 'up') {
        [this.paradasVuelta[i], this.paradasVuelta[i - 1]] = [this.paradasVuelta[i - 1], this.paradasVuelta[i]]
      }
      if ((i !== this.paradasVuelta.length - 1) && position === 'down') {
        [this.paradasVuelta[i], this.paradasVuelta[i + 1]] = [this.paradasVuelta[i + 1], this.paradasVuelta[i]]
      }
      this.$forceUpdate()
    },

    eliminarParadaIda (parada) {
      this.paradasIda = this.paradasIda.filter(function (i) { return i !== parada })
    },

    eliminarParadaVuelta (parada) {
      this.paradasVuelta = this.paradasVuelta.filter(function (i) { return i !== parada })
    },

    hasParadasVuelta () {
      return this.paradasVuelta.length > 0
    },

    hasParadasIda () {
      return this.paradasIda.length > 0
    },
    selectImages (event) {
      let reader = new FileReader()

      for (let index = 0; index < event.target.files.length; index++) {
        this.fotos.push(event.target.files[index])
        reader.readAsDataURL(event.target.files[index])

        reader.onloadend = (e) => {
          this.previewImages.push(e.target.result)
        }
        reader = new FileReader()
      }
    },
    openUpload () {
      document.getElementById('formFile').click()
    },
    delImage (id) {
      this.fotos.splice(id, 1)
      this.previewImages.splice(id, 1)
    },
    validar () {
      if (
        this.ruta.nombre.length > 0 &&
        this.ruta.precios.normal > 0 &&
        this.ruta.precios.especial > 0 &&
        this.ruta.frecuencia > 0
      ) {
        return false
      } else {
        return true
      }
    },
    agregar () {
      this.ruta.ida.paradas = this.paradasIda
      this.ruta.vuelta.paradas = this.paradasVuelta
      db.collection('rutas').add(this.ruta).then((ruta) => {
        this.fotos.forEach((foto) => {
          const archivo = storage.ref('rutas/' + ruta.id + '/' + Math.floor(Math.random() * 999999) + ' - ' + foto.name)
          archivo.put(foto).then(() => {
            archivo.getDownloadURL().then((url) => {
              this.urls.push(url)
              db.collection('rutas').doc(ruta.id).update({ fotos: this.urls })
            })
          })
        })
      })
      this.showNotif({
        type: 'positive',
        message: 'Ruta añadida',
        timeout: 700
      })
      this.$router.push('/admin/rutas')
    },
    cancelarFoto (index) {
      this.fotos.splice(index, 1)
    }
  },
  created () {
    eventBus.$on('addParada', (parada, recorrido) => {
      if (String(recorrido) === 'ida') {
        this.paradasIda.push(parada)
      } else {
        this.paradasVuelta.push(parada)
      }
    })
  }
}
</script>
<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 1em;
}
.my-card {
  width: 100%;
  max-width: 250px
}
</style>
