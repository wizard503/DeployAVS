<template>
  <q-layout view="lHh Lpr lff" style="position:relative;">
    <!---->
    <NavbarLogo title="Detalle de Ruta" style="z-index:999; margin-bottom: 10px" />
    <div class="row justify-center">
      <div class="column col-xs-12 col-lg-6 q-mb-xs">
        <CardDetalle class="margin-sides " :ruta="ruta"/>
      </div>
    </div>
    <div class="row q-mt-xs justify-center">
      <div class="col col-xs-12 col-lg-6" >
        <q-expansion-item
          class="shadow-1 overflow-hidden"
          style="border-radius: 25px; margin:0 10px 10px 10px"
          icon="collections"
          label="Fotos de ruta de bus"
          header-class="bg-primary text-white text-center"
          expand-icon-class="text-white"
          :duration="1000"
        >
          <CarouselRuta :ruta="ruta"/>
        </q-expansion-item>
      </div>
    </div>
    <div class="row q-mt-xs">
      <div class="col col-md-6 col-xs-12" style="max-width: 100%;" >
        <q-responsive :ratio="1" class="col margin-sides shadow-4 mapa rounded-borders">
          <WebMap v-if="cargaMapa" :ruta="ruta.ida"/>
          <q-skeleton v-if="!cargaMapa" type="text" animation="pulse-x"/>
        </q-responsive>
      </div>

      <div class="col col-xs-12 lt-md margin-anuncio">
        <q-img
          src="https://i.ibb.co/pbMxM8s/banner2.png"
          style="max-width: 100%; height: 70px;"
          contain
          >
        </q-img>
      </div>
      <div class="col col-md-6 col-xs-12" >
        <div class="bg-primary text-white rounded-borders selector-sentido" >
          <q-list>
            <q-item v-if="visibilidad" class="sentido-info">
              <q-item-section>
                <q-item-label>Seleccione sentido de ruta:</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="!visibilidad" class="sentido-info">
              <q-item-section>
                <q-item-label>Sentido de ruta:</q-item-label>
              </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple class="sentido-info">
              <q-item-section avatar>
                <q-radio v-model="group" checked-icon="task_alt" val="ida" color="accent" @input="cambiarSentido()"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ruta.ida.nombre}}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item tag="label" v-ripple v-if="visibilidad" class="sentido-info">
              <q-item-section avatar>
                <q-radio v-model="group" checked-icon="task_alt" val="vuelta" color="accent" @input="cambiarSentido()"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ruta.vuelta.nombre}}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div class="rounded-borders selector-sentido margin-bottom">
          <CardSentido :sentido="sentido"/>
        </div>
        <div class="rounded-borders selector-sentido">
          <q-scroll-area
          :thumb-style="thumbStyle"
          :content-style="contentStyle"
          :content-active-style="contentActiveStyle"
          style="height: 450px;"
          >
        <q-stepper
          v-model="step"
          header-nav
          vertical
          ref="stepper"
          color="primary"
          animated
          >
      <stepper-component  v-for="(j, index) in sentido.paradas"
        :key="index"
        :detalles="j"
        :step="step"
        :index="index"></stepper-component>
        </q-stepper>
      </q-scroll-area>
        </div>
      </div>
    </div>
    <div>
    </div>
    <div class="row q-mt-xs gt-sm">
      <div class="col col-xs-12">
        <q-img
          src="https://i.ibb.co/pbMxM8s/banner2.png"
          style="max-width: 100%; height: 70px;"
          contain
          >
        </q-img>
      </div>
    </div>
  </q-layout>
</template>
<script>
import { nuevoBus, busStepper } from '../router/index'
import WebMap from '../components/detalleRuta/mapaRutas.vue'
import StepperComponent from '../components/detalleRuta/Stepper.vue'
import CardDetalle from '../components/detalleRuta/CardDetalle.vue'
import CardSentido from '../components/detalleRuta/CardSentido.vue'
import CarouselRuta from '../components/detalleRuta/CarouselRuta.vue'
import NavbarLogo from '../components/Navbar/NavbarLogo.vue'

export default {
  name: 'home-detalleruta',
  components: {
    StepperComponent,
    WebMap,
    CardDetalle,
    CardSentido,
    CarouselRuta,
    NavbarLogo
  },
  data () {
    return {
      ruta: [],
      sentido: [],
      id: String(this.$route.params.id),
      visibilidad: true,
      cargaMapa: false,
      // stepper
      step: 0,
      group: 'ida',
      // fin stepper
      parada: '',
      // stepper component
      contentStyle: {
        backgroundColor: 'rgba(0,0,0,0.02)',
        color: '#555'
      },

      contentActiveStyle: {
        backgroundColor: '#F5ECCE',
        color: 'black'
      },

      thumbStyle: {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#8338ec',
        width: '5px',
        opacity: 0.75
      }
    }
  },
  methods: {
    cambiarSentido () {
      if (this.group === 'ida') {
        this.sentido = this.ruta.ida
      } else if (this.group === 'vuelta') {
        this.sentido = this.ruta.vuelta
      }
      nuevoBus.$emit('paradas', this.sentido)
    },
    regresar () {
      this.$router.go(-1)
    },
    getData () {
      this.ruta = this.rutas.find(elem => elem.id === this.id)
      this.sentido = this.ruta.ida
      if (!this.ruta.vuelta.paradas.length) this.visibilidad = false
    }
  },
  computed: {
    rutas () {
      return this.$store.state.DataVuex.rutas
    }
  },
  watch: {
    rutas () {
      this.getData()
    }
  },
  mounted () {
    nuevoBus.$emit('paradas', this.sentido)
  },
  beforeMount () {
    setTimeout(() => {
      this.cargaMapa = true
    }, 3000)
  },
  created () {
    this.getData()
    busStepper.$on('cambioStep', () => this.step++)
  }
}
</script>
<style scoped>
@import 'https://js.arcgis.com/4.23/@arcgis/core/assets/esri/themes/light/main.css';

.selector-sentido{
  margin-right:10px; margin-left: 10px;
}

.sentido-info{
  height: 2em;
}
.margin-bottom{
  margin-bottom: 10px;
}

.margin-sides{
  margin-left:10px;
  margin-right: 10px;
}
.margin-anuncio{
 padding: 5px;
}

.border-rad{
  border-radius:10px !important
}

</style>
