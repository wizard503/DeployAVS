/* eslint-disable key-spacing */
<template>
  <div>
    <q-splitter
      v-if="$q.platform.is.desktop"
      v-model="splitterModel"
      horizontal
      emit-immediately
      style="height: 90vh"
      reverse
      @input="getPosition"
      :limits="[9, 56]"
      after-class="rounded-borders"
    >

      <template v-slot:before>
        <div class="box bg-primary fixed-top inputs">
        <q-expansion-item
        v-model="expanded"
        dense-toggle
        expand-separator
        dark
        class="text-white text-subtitle1"
        icon="edit_location"
        label="Ingresar Ubicaciones"
        @show="showInputs = !showInputs"
        @hide="showInputs = !showInputs"
        >
        <div class="row q-mt-md justify-around">
          <div class="col q-pl-md">
          <q-btn no-caps size="md" class="shadow-11 bg-deep-purple-11 text-caption text-weight-light" label="Usar mi ubicacion actual" v-if="mostrarBotonGPS" @click="usarGPS"/>
          <q-btn no-caps size="md" class="shadow-11 bg-deep-purple-11 text-caption text-weight-light" label="Dejar de usar mi ubicación actual" v-if="mostrarCancelarGPS" @click="cancelGPS"/>
          </div>
          <div class="col-3 q-pl-lg">
            <q-btn round color="secondary" class="shadow-12" icon="search" @click="search"/>
          </div>
        </div>
        <div class="q-ma-lg">
          <q-select
              dense
              borderless
              v-model="origen"
              use-input
              input-debounce="0"
              label="Punto de Origen"
              :options="options"
              behavior="dialog"
              class="full-width q-px-sm shadow-5 input"
              v-show="mostrarOrigen"
              hide-dropdown-icon
              clearable
              @filter="filterFn"
              @input-value="validarInput"
              emit-value
            >
              <template v-slot:prepend>
                <q-icon name="place" @click.stop class="boxIcon"/>
              </template>
              <template v-slot:option="scope">
                <q-item
                  @click="dibujarParadaSeleccionada(scope.opt, 'origen')"
                  v-bind="scope.itemProps"
                  v-on="scope.itemEvents"
                >
                  <q-item-section avatar>
                    <q-icon :name="scope.opt.icon" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label v-html="scope.opt.nombre" />
                    <q-item-label caption>Lugares cercanos: {{ scope.opt.lugaresCercanos }}</q-item-label>
                    <q-item-label caption>Referencia: {{ scope.opt.referencia }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-select
              dense
              borderless
              v-model="destino"
              use-input
              input-debounce="0"
              label="Punto de Destino"
              :options="options"
              @filter="filterFn"
              behavior="dialog"
              class="full-width q-px-sm q-mt-lg shadow-5 input"
              hide-dropdown-icon
              clearable
              emit-value
            >
              <template v-slot:prepend>
                <q-icon name="place" @click.stop class="boxIcon"/>
              </template>
              <template v-slot:option="scope">
                <q-item
                  @click="dibujarParadaSeleccionada(scope.opt, 'destino')"
                  v-bind="scope.itemProps"
                  v-on="scope.itemEvents"
                >
                  <q-item-section avatar>
                    <q-icon :name="scope.opt.icon" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label v-html="scope.opt.nombre" />
                    <q-item-label caption>Lugares cercanos: {{ scope.opt.lugaresCercanos }}</q-item-label>
                    <q-item-label caption>Referencia: {{ scope.opt.referencia }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
        </div>
      </q-expansion-item>
    </div>
    <MapaDestino/>
      </template>
      <template v-slot:separator>
        <q-icon v-show="showArrowUp" color="primary" size="xl" name="eva-arrowhead-up-outline" />
        <q-icon v-show="!showArrowUp" color="primary" size="xl" name="eva-arrowhead-down-outline" />
      </template>
      <template v-slot:after>
        <div class="bg-orange-6">
          <DestinoOpciones v-show="showContentSplitter"/>
          <PublicidadDestinos :class="{
            'q-pb-xl': showContentSplitter,
            'q-pt-xl q-pb-xl': !showContentSplitter,
          }"/>
        </div>

      </template>

    </q-splitter>
    <q-splitter
      v-if="$q.platform.is.mobile"
      v-model="splitterModel"
      horizontal
      emit-immediately
      style="height: 86.5vh"
      reverse
      @input="getPosition"
      :limits="[9, 56]"
      after-class="rounded-borders"
    >

      <template v-slot:before>
        <div class="box bg-primary fixed-top inputs">
        <q-expansion-item
        v-model="expanded"
        dense-toggle
        expand-separator
        dark
        class="text-white text-subtitle1"
        icon="edit_location"
        label="Ingresar Ubicaciones"
        @show="showInputs = !showInputs"
        @hide="showInputs = !showInputs"
        >
        <div class="row q-mt-md justify-around">
          <div class="col q-pl-md">
          <q-btn no-caps size="md" class="shadow-11 bg-deep-purple-11 text-caption text-weight-light" label="Usar mi ubicacion actual" v-if="mostrarBotonGPS" @click="usarGPS"/>
          <q-btn no-caps size="md" class="shadow-11 bg-deep-purple-11 text-caption text-weight-light" label="Dejar de usar mi ubicación actual" v-if="mostrarCancelarGPS" @click="cancelGPS"/>
          </div>
          <div class="col-3 q-pl-lg">
            <q-btn round color="secondary" class="shadow-12" icon="search" @click="search"/>
          </div>
        </div>
        <div class="q-ma-lg">
          <q-select
              dense
              borderless
              v-model="origen"
              use-input
              input-debounce="0"
              label="Punto de Origen"
              :options="options"
              behavior="dialog"
              class="full-width q-px-sm shadow-5 input"
              v-show="mostrarOrigen"
              hide-dropdown-icon
              clearable
              @filter="filterFn"
              @input-value="validarInput"
              emit-value
            >
              <template v-slot:prepend>
                <q-icon name="place" @click.stop class="boxIcon"/>
              </template>
              <template v-slot:option="scope">
                <q-item
                  @click="dibujarParadaSeleccionada(scope.opt, 'origen')"
                  v-bind="scope.itemProps"
                  v-on="scope.itemEvents"
                >
                  <q-item-section avatar>
                    <q-icon :name="scope.opt.icon" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label v-html="scope.opt.nombre" />
                    <q-item-label caption>Lugares cercanos: {{ scope.opt.lugaresCercanos }}</q-item-label>
                    <q-item-label caption>Referencia: {{ scope.opt.referencia }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-select
              dense
              borderless
              v-model="destino"
              use-input
              input-debounce="0"
              label="Punto de Destino"
              :options="options"
              @filter="filterFn"
              behavior="dialog"
              class="full-width q-px-sm q-mt-lg shadow-5 input"
              hide-dropdown-icon
              clearable
              emit-value
            >
              <template v-slot:prepend>
                <q-icon name="place" @click.stop class="boxIcon"/>
              </template>
              <template v-slot:option="scope">
                <q-item
                  @click="dibujarParadaSeleccionada(scope.opt, 'destino')"
                  v-bind="scope.itemProps"
                  v-on="scope.itemEvents"
                >
                  <q-item-section avatar>
                    <q-icon :name="scope.opt.icon" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label v-html="scope.opt.nombre" />
                    <q-item-label caption>Lugares cercanos: {{ scope.opt.lugaresCercanos }}</q-item-label>
                    <q-item-label caption>Referencia: {{ scope.opt.referencia }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
        </div>
      </q-expansion-item>
    </div>
    <MapaDestino/>
      </template>
      <template v-slot:separator>
        <q-icon v-show="showArrowUp" color="primary" size="xl" name="eva-arrowhead-up-outline" />
        <q-icon v-show="!showArrowUp" color="primary" size="xl" name="eva-arrowhead-down-outline" />
      </template>
      <template v-slot:after>
        <div class="bg-orange-6">
          <DestinoOpciones v-show="showContentSplitter"/>
          <PublicidadDestinos :class="{
            'q-pb-xl': showContentSplitter,
            'q-pt-xl q-pb-xl': !showContentSplitter,
          }"/>
        </div>

      </template>

    </q-splitter>
  </div>
</template>

<style scoped>
  .btn--shockwave.is-active {
    -webkit-animation: shockwaveJump 1s ease-out infinite;
          animation: shockwaveJump 1s ease-out infinite;
  }
  .btn--shockwave.is-active:after {
    content: '';
    border-radius: 50%;
    -webkit-animation: shockwave 1s .65s ease-out infinite;
          animation: shockwave 1s .65s ease-out infinite;
  }
  .btn--shockwave.is-active:before {
    content: '';
    position: absolute;
    border-radius: 50%;
    -webkit-animation: shockwave 1s .5s ease-out infinite;
            animation: shockwave 1s .5s ease-out infinite;
  }
  .inputs {
    margin-top: 50px;
    z-index: 300;
  }
  .box {
    border-radius: 0rem 0rem 1rem 1rem;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  }
  .input {
    background-color: white;
    border-radius: 1.5rem;
    color: black;
  }
  .boxIcon {
    border-radius: 3rem;
    color: white;
    background: linear-gradient(to right, #4568dc, #b06ab3);
    padding: .20rem;
  }
</style>

<script>

import { mapGetters } from 'vuex'
import eventBus from 'app/src/eventBus'
import DestinoOpciones from 'app/src/components/destinos/DestinoOpciones.vue'
import MapaDestino from '../../components/destinos/MapaDestino.vue'
import PublicidadDestinos from 'app/src/components/destinos/PublicidadDestinos.vue'

export default {
  components: { DestinoOpciones, MapaDestino, PublicidadDestinos },
  data () {
    return {
      showContentSplitter: false,
      previusPositionSplitter: 9,
      showArrowUp: true,
      showresults: false,
      splitterModel: 0,
      expanded: true,
      options: [],
      showOptions: true,
      showInputs: false,
      showPublicidad: false,
      mostrarBotonGPS: false,
      mostrarCancelarGPS: true,
      thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: 0.75
      },
      barStyle: {
        right: '2px',
        borderRadius: '9px',
        backgroundColor: '#027be3',
        width: '9px',
        opacity: 0.2
      },
      // Lista original de paradas
      Lparadas: [],
      // Copia de las paradas donde se hace el filtro
      paradasOriginales: [],
      // Variable que utiliza la para iniciar
      numini: 1,
      // Variable para buscar en paradas
      origen: '',
      destino: '',
      // Para ordenar los datos alfabeticamente
      tituloAsc: false,
      // Para eliminar una busqueda
      mostrarEliminar: false,
      // Elemento utilizado para listar 5 elementos por paginacion
      elementosporpagina: 2,
      // Elementos para la Notificacion del GPS
      position: 'center',
      // Cargando Datos
      cargandoDatos: false,
      llave: false,
      mostrarOrigen: false
    }
  },
  computed: {
    ...mapGetters('login', ['getAuth', 'getUsers']),

    paradas () {
      return this.$store.state.DataVuex.paradas
    }
  },
  watch: {
    showInputs (currentValue) {
      this.showPublicidad = !currentValue
    },
    origen (currentValue) {
      if (currentValue === null) {
        this.mostrarBotonGPS = true
        eventBus.$emit('borrarParadaInput', 'origen')
      }
    },
    destino (currentValue) {
      if (currentValue === null) {
        eventBus.$emit('borrarParadaInput', 'destino')
      }
    }

  },
  methods: {
    getPosition (value) {
      if (value > 9) {
        this.showContentSplitter = true
      } else {
        this.showContentSplitter = false
      }
      if (value < this.previusPositionSplitter) {
        this.showArrowUp = false
      }
      if (value > this.previusPositionSplitter) {
        this.showArrowUp = true
      }
      this.previusPositionSplitter = value
      if (this.previusPositionSplitter === 56) {
        this.showArrowUp = false
      }
      if (this.previusPositionSplitter === 9) {
        this.showArrowUp = true
      }
    },
    search () {
      eventBus.$emit('clickSearch')
    },
    usarGPS () {
      this.borrarOrigen()
      this.mostrarOrigen = false
      this.mostrarBotonGPS = false
      this.mostrarCancelarGPS = true
      eventBus.$emit('usarGPS')
    },
    cancelGPS () {
      this.mostrarOrigen = true
      this.mostrarBotonGPS = true
      this.mostrarCancelarGPS = false
      eventBus.$emit('cancelGPS')
    },
    validarInput (value) {
      this.mostrarBotonGPS = true
    },
    addOptions (parada) {
      this.options.push({
        id: parada.id,
        nombre: parada.nombre,
        value: parada.nombre,
        lugaresCercanos: parada.lugaresCercanos,
        referencia: parada.referencia,
        gps: parada.gps,
        fotos: parada.fotos,
        distancia: 0,
        icon: 'directions_bus'
      })
    },
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.options = []
        })
        return
      }
      update(() => {
        this.options = []
        this.paradas.filter((parada) => {
          return parada.nombre.toLowerCase().match(val.toLowerCase()) || parada.lugaresCercanos.split(',').map(lugareCercano => lugareCercano.toLowerCase()).includes(val.toLowerCase())
        }).forEach(parada => this.addOptions(parada))
      })
    },
    dibujarParadaSeleccionada (parada, type) {
      eventBus.$emit('dibujarParadaInput', parada, type)
    },
    clonarParadas () {
      // clonamos las paradas al local data
      if (this.getAuth.type !== 'user') {
        this.Lparadas = this.paradas.map((x) => {
          const elemento = Object.assign({}, x)
          elemento.id = x.id
          return elemento
        })
        // nos ayuda a ordenar siempre alfabeticamente
        this.tituloAsc = false
        if (this.tituloAsc === false) {
          this.ordenarTitulo()
        }
        if (this.llave === true) {
        // Elemento que nos ayuda a indicar que se estan cargando los datos
          this.cargandoDatos = false
        }
      } else {
        // nos ayuda a ordenar siempre alfabeticamente
        this.tituloAsc = false
        if (this.tituloAsc === false) {
          this.ordenarTitulo()
        }
        if (this.llave === true) {
        // Elemento que nos ayuda a indicar que se estan cargando los datos
          this.cargandoDatos = false
        }
      }
    },
    buscarorigen () {
      if (this.origen === '') {
        this.limpiarorigen()
      }
      // this.Lparadas = this.paradas
      this.clonarParadas()
      if (this.posGPS !== null) {
        this.Lparadas = this.paradasOriginales.slice()
      } else {
        this.paradasOriginales = this.Lparadas.slice()
      }
      // eslint-disable-next-line array-callback-return
      this.Lparadas = this.paradasOriginales.filter((item) => {
        if ((item.nombre.toLowerCase().indexOf(this.origen.toLowerCase()) >= 0) || (item.lugaresCercanos.toLowerCase().indexOf(this.origen.toLowerCase()) >= 0)) {
          return true
        }
      })
    },
    borrarOrigen () {
      this.origen = ''
    },
    borrarDestino () {
      this.destino = ''
    }
  },
  created () {
    eventBus.$on('hideInputs', () => {
      this.expanded = false
    })
    eventBus.$on('limpiarDestinoInput', () => {
      console.log('Borrando input de destino')
      this.borrarDestino()
    })
  }

}
</script>
