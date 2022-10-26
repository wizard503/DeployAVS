<template>
  <div>
    <addParada></addParada>
    <q-dialog v-model="estado" persistent>
    <q-card style="width: 700px; max-width: 90vw; border-radius: 16px;">
      <q-toolbar>
          <q-avatar>
            <q-icon name="ion-bus" size="md"/>
          </q-avatar>

          <q-toolbar-title>Editar Ruta <span class="text-weight-bold">{{ruta.nombre}}</span></q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup @click="cancel()" />
        </q-toolbar>
      <q-separator style="margin-bottom: 16px" color="black"/>
      <q-scroll-area style="height: 420px;">
          <div
            style="padding: 24px;"
          >
            <q-card-section style="padding: 0px; margin-bottom: 5px; ">
              <div
                class="text-body2"
                style="color: rgba(0, 0, 0, 0.54);"
              >
                Datos
              </div>
            </q-card-section>
            <q-separator style="margin-bottom: 16px" color="black"/>
            <q-card-section style="padding: 0px; margin-bottom: 16px;">
              <q-input
                class="q-mt-sm"
                label="Nombre"
                rounded outlined
                dense
                clearable
                clear-icon="eva-close"
                v-model="ruta.nombre"
                @clear="ruta.nombre = ''"
              />
            </q-card-section>
            <div class="row">
              <div class="col-6">
                <q-card-section style="padding: 0px; margin-end: 8px;">
                  <q-input
                    class="q-mt-sm"
                    label="Precio normal"
                    rounded outlined
                    dense
                    type="number"
                    v-model="ruta.precios.normal"
                    @clear="ruta.precios.normal = ''"
                  />
                </q-card-section>
              </div>
              <div class="col-6">
                <q-card-section style="padding: 0px; margin-start: 8px;">
                  <q-input
                    class="q-mt-sm"
                    label="Precio especial"
                    rounded outlined
                    dense
                    type="number"
                    v-model="ruta.precios.especial"
                    @clear="ruta.precios.especial = ''"
                  />
                </q-card-section>
              </div>
            </div>
            <q-card-section style="padding: 0px; margin-bottom: 16px;">
              <q-input
                    class="q-mt-sm"
                    label="Frecuencia"
                    rounded outlined
                    dense
                    type="number"
                    v-model="ruta.frecuencia"
                />
            </q-card-section>
            <q-card-section style="padding: 0px; margin-bottom: 16px;">
              <q-input
                class="q-mt-sm"
                label="Ciudad"
                rounded outlined
                dense
                disable
                clear-icon="eva-close"
                v-model="ruta.ciudad"
              />
            </q-card-section>
            <q-card-section style="padding: 0px;margin-top: 30px; margin-bottom: 5px; ">
              <div
                class="text-body2"
                style="color: rgba(0, 0, 0, 0.54);"
              >
                Recorridos
              </div>
            </q-card-section>
            <q-separator color="black"/>
          </div>
            <q-card-section>
                <q-tabs
                    v-model="tab"
                    dense
                    class="text-grey-7"
                    active-color="primary"
                    indicator-color="orange"
                    align="justify"
                    narrow-indicator
                    no-caps
                >
                    <q-tab name="ida" label="Recorrido Ida" />
                    <q-tab name="vuelta" label="Recorrido Vuelta"/>
                </q-tabs>

                <q-tab-panels
                    v-model="tab"
                    animated
                    vertical
                    transition-prev="scale"
                    transition-next="scale"
                >
                    <q-tab-panel name="ida">
                        <q-input
                            class="q-mt-sm"
                            label="trayectoria"
                            rounded outlined
                            dense
                            clear-icon="eva-close"
                            v-model="ruta.ida.nombre"
                            @clear="ruta.ida.nombre = ''"
                        />
                        <q-input
                            class="q-mt-sm"
                            label="Tiempo"
                            rounded outlined
                            dense
                            clear-icon="eva-close"
                            v-model="ruta.ida.tiempo"
                        />
                        <q-input
                            class="q-mt-sm"
                            label="Primer viaje"
                            rounded outlined
                            dense
                            clear-icon="eva-close"
                            v-model="ruta.ida.primerviaje"
                            @clear="ruta.ida.primerviaje = ''"
                        />
                        <q-input
                            class="q-mt-sm"
                            label="Ultimo viaje"
                            rounded outlined
                            dense
                            clear-icon="eva-close"
                            v-model="ruta.ida.ultimoviaje"
                            @clear="ruta.ida.ultimoviaje = ''"
                        />
                        {{ /* CMBOX */ }}
                        <div class="q-pa-md">
                            <q-btn  push color="dark" text-color="white" label="Añadir Paradas" @click="showAddParada('ida')"/>
                        </div>
                        {{ /* LIST PARADAS AÑADIDAS */ }}
                        <q-list v-if="hasParadasIda()" dense bordered padding class="rounded-borders text-black">
                            <q-item v-for="(parada, index) in this.ruta.ida.paradas" :key="index">
                                <q-item-section>
                                    <q-item-label>{{parada.nombre}}</q-item-label>
                                    <q-item-label caption>{{parada.referencia}}</q-item-label>
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
                            class="q-mt-sm"
                            label="trayectoria"
                            rounded outlined
                            dense
                            clear-icon="eva-close"
                            v-model="ruta.vuelta.nombre"
                            @clear="ruta.vuelta.nombre = ''"
                        />
                        <q-input
                            class="q-mt-sm"
                            label="tiempo"
                            rounded outlined
                            dense
                            clear-icon="eva-close"
                            v-model="ruta.vuelta.tiempo"
                        />
                        <q-input
                            class="q-mt-sm"
                            label="Primer viaje"
                            rounded outlined
                            dense
                            clear-icon="eva-close"
                            v-model="ruta.vuelta.primerviaje"
                            @clear="ruta.vuelta.primerviaje = ''"
                        />
                        <q-input
                            class="q-mt-sm"
                            label="Ultimo viaje"
                            rounded outlined
                            dense
                            clear-icon="eva-close"
                            v-model="ruta.vuelta.ultimoviaje"
                            @clear="ruta.vuelta.ultimoviaje = ''"
                        />
                        {{ /* CMBOX */ }}
                        <div class="q-pa-md">
                            <q-btn  push color="dark" text-color="white" label="Añadir Paradas" @click="showAddParada('vuelta')"/>
                        </div>
                        {{ /* LIST PARADAS AÑADIDAS */ }}
                        <q-list v-if="hasParadasVuelta()" dense bordered padding  class="rounded-borders text-black">
                            <q-item v-for="(parada, index) in this.ruta.vuelta.paradas" :key="index">
                                <q-item-section>
                                    <q-item-label >{{parada.nombre}}</q-item-label>
                                    <q-item-label caption>{{parada.referencia}}</q-item-label>
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
            </q-card-section>
          <div
            style="padding: 24px;"
          >
            <q-card-section style="padding: 0px;margin-top: 30px; margin-bottom: 5px; ">
              <div
                class="text-body2"
                style="color: rgba(0, 0, 0, 0.54);"
              >
                Fotografías de la ruta
              </div>
            </q-card-section>
            <q-separator class="q-mb-lg" color="black"/>
            <q-card-section style="padding: 0px; margin-bottom: 32px;">
              <input
                    @change="selectImages($event)"
                    type="file"
                    id="formFile"
                    accept="image/*"
                    required
                    multiple
                    style="display: none"
                />
                <q-btn no-caps  push color="dark" text-color="white" @click="openUpload" id="save">
                    <q-icon left size="20px" name="ion-cloud-upload" />
                    <div>Añadir</div>
                </q-btn>
            </q-card-section>
            <q-carousel
              animated
              v-model="slide"
              navigation
              infinite
              :autoplay="autoplay"
              arrows
              control-color="grey-14"
              class="rounded-borders bg-grey-1 shadow-3"
              height="26rem"
            >
              <q-carousel-slide
                v-for="(foto, index) in ruta.fotos"
                :key="index"
                :name="index"
              >
              <div class="text-center">
                <q-img :src="foto" style="height: 25em; width: 19em;" class="rounded-borders"/>
              </div>
            </q-carousel-slide>
        </q-carousel>
            <q-card-section style="margin-top: 15px;">
              <q-chip
                square
                removable
                icon-remove="eva-close"
                class="full-width q-my-xs"
                style="padding: 16px;"

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

              <q-chip
                square
                removable
                icon-remove="eva-close"
                class="full-width q-my-xs"
                style="padding: 16px; "

                v-for="(fotoStorage, index) in fotosStorage"
                :key="fotoStorage.name"

                @remove="cancelarFotoStorage(index)"
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
                  {{ fotoStorage.name }}
                </div>
              </q-chip>
            </q-card-section>
          </div>
      </q-scroll-area>

      <q-separator />
        <q-card-actions
            align="right"
            style="padding: 10px; background-color:cadetblue;"
        >
            <q-btn
                v-close-popup
                unelevated
                label="Guardar"
                class="text-capitalize"
                :style="'padding: 0px 8px; border-radius: 8px; color: ' + color "
                :color=backgroundColor
                :disable="validar()"
                @click="editar()"
            />
        </q-card-actions>
    </q-card>
  </q-dialog>
  </div>
</template>
<script>
import eventBus from 'app/src/eventBus'
import addParada from 'src/components/administracionRutas/addParada.vue'
import { db, storage } from 'app/src/boot/db'

export default {
  name: 'EditRuta',
  firestore: {
    paradasBuses: db.collection('paradas')
  },
  components: { addParada },
  data: () => ({
    gps: {},
    tab: 'ida',
    estado: false,
    rutas: [],
    paradasdeIda: [],
    paradasdeVuelta: [],
    paradasBuses: [],
    color: '',
    backgroundColor: '',
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
    autoplay: true,
    slide: 1,
    fotos: [],
    fotosStorage: [],
    urls: [],
    eliminar: [],
    maxFotos: 0
  }),
  methods: {
    cancel () {
      this.paradasdeIda = []
      this.paradasdeVuelta = []
      this.estado = false
    },
    showAddParada (recorrido) {
      eventBus.$emit('showAddParada', recorrido)
    },

    validar () {
      if (
        this.ruta.nombre.length > 0 &&
        String(this.ruta.frecuencia.length) > 0 &&
        this.ruta.ciudad.length > 0 &&
        String(this.ruta.precios.normal).length > 0 &&
        String(this.ruta.precios.especial).length > 0 &&
        (this.fotos.length > 0 || this.fotosStorage.length > 0)
      ) {
        this.color = 'rgba(255, 255, 255)'
        this.backgroundColor = 'dark'
        return false
      } else {
        this.color = 'rgba(0, 0, 0, 0.54)'
        this.backgroundColor = 'rgba(0, 0, 0, 0.06)'
        return true
      }
    },
    hasParadasVuelta () {
      return this.ruta.vuelta.paradas.length > 0
    },

    hasParadasIda () {
      return this.ruta.ida.paradas.length > 0
    },
    addParadaIda (parada) {
      this.ruta.ida.paradas.push(parada)
    },
    eliminarParadaIda (parada) {
      this.ruta.ida.paradas = this.ruta.ida.paradas.filter(function (i) { return i !== parada })
      eventBus.$emit('deleteParada', parada, 'ida')
    },
    addParadaVuelta (parada) {
      this.ruta.vuelta.paradas.push(parada)
    },
    eliminarParadaVuelta (parada) {
      this.ruta.vuelta.paradas = this.ruta.vuelta.paradas.filter(function (i) { return i !== parada })
      eventBus.$emit('deleteParada', parada, 'vuelta')
    },
    intercambiarParadasIda (parada, position) {
      const i = this.ruta.ida.paradas.indexOf(parada)

      if (i !== 0 && position === 'up') {
        [this.ruta.ida.paradas[i], this.ruta.ida.paradas[i - 1]] = [this.ruta.ida.paradas[i - 1], this.ruta.ida.paradas[i]]
      }
      if ((i !== this.ruta.ida.paradas.length - 1) && position === 'down') {
        [this.ruta.ida.paradas[i], this.ruta.ida.paradas[i + 1]] = [this.ruta.ida.paradas[i + 1], this.ruta.ida.paradas[i]]
      }
      this.$forceUpdate()
    },

    intercambiarParadasVuelta (parada, position) {
      const i = this.ruta.vuelta.paradas.indexOf(parada)

      if (i !== 0 && position === 'up') {
        [this.ruta.vuelta.paradas[i], this.ruta.vuelta.paradas[i - 1]] = [this.ruta.vuelta.paradas[i - 1], this.ruta.vuelta.paradas[i]]
      }
      if ((i !== this.ruta.vuelta.paradas.length - 1) && position === 'down') {
        [this.ruta.vuelta.paradas[i], this.ruta.vuelta.paradas[i + 1]] = [this.ruta.vuelta.paradas[i + 1], this.ruta.vuelta.paradas[i]]
      }
      this.$forceUpdate()
    },
    refrescarParadasIda () {
      this.ruta.ida.paradas = this.paradasdeIda
    },
    refrescarParadasVuelta () {
      this.ruta.vuelta.paradas = this.paradasdeVuelta
    },
    editar () {
      this.eliminarFotos()
      this.ruta.fotos = this.urls

      db.collection('rutas').doc(this.ruta.id).set(this.ruta).then(() => {
        this.fotos.forEach((foto) => {
          const archivo = storage.ref('rutas/' + this.ruta.id + '/' + Math.floor(Math.random() * 999999) + ' - ' + foto.name)
          archivo.put(foto).then(() => {
            archivo.getDownloadURL().then((url) => {
              this.urls.push(url)
              db.collection('rutas').doc(this.ruta.id).update({ fotos: this.urls })
            })
          })
        })
      })
      eventBus.$emit('refrescar', this.rutas)
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
    eliminarFotos () {
      this.eliminar.forEach((url) => {
        storage.refFromURL(url).delete()
      })
    },
    cancelarFotoStorage (index) {
      this.eliminar.push(this.urls[index])
      this.urls.splice(index, 1)
      this.fotosStorage.splice(index, 1)
      this.maxFotos++
    },
    cancelarFoto (index) {
      this.fotos.splice(index, 1)
    },
    llenarDatos (ruta) {
      this.fotos = []
      this.eliminar = []
      this.ruta = {
        id: String(ruta.id),
        nombre: String(ruta.nombre),
        precios: {
          normal: String(ruta.precios.normal),
          especial: String(ruta.precios.especial)
        },
        fotos: ruta.fotos.map(String),
        frecuencia: ruta.frecuencia,
        ciudad: String(ruta.ciudad),
        ida: {
          nombre: String(ruta.ida.nombre),
          tiempo: String(ruta.ida.tiempo),
          primerviaje: String(ruta.ida.primerviaje),
          ultimoviaje: String(ruta.ida.ultimoviaje),
          paradas: ruta.ida.paradas
        },
        vuelta: {
          nombre: String(ruta.vuelta.nombre),
          tiempo: String(ruta.vuelta.tiempo),
          primerviaje: String(ruta.vuelta.primerviaje),
          ultimoviaje: String(ruta.vuelta.ultimoviaje),
          paradas: ruta.vuelta.paradas
        }
      }
      this.urls = ruta.fotos.map(String)
      this.fotosStorage = this.urls.map((url) => {
        return storage.refFromURL(url)
      })
      this.maxFotos = 3 - ruta.fotos.length
    }
  },
  created () {
    eventBus.$on('showEditRuta', (ruta) => {
      this.estado = true
      this.llenarDatos(ruta)
      this.ruta = ruta
    })
    eventBus.$on('addParada', (parada, recorrido) => {
      if (String(recorrido) === 'ida') {
        this.paradasdeIda = Object.values(this.ruta.ida.paradas)
        this.paradasdeIda.push(parada)
        this.refrescarParadasIda()
      } else {
        this.paradasdeVuelta = Object.values(this.ruta.vuelta.paradas)
        this.paradasdeVuelta.push(parada)
        this.refrescarParadasVuelta()
      }
    })
  }
}
</script>
