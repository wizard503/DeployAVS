<template>
<q-layout view="lHh Lpr lff" style="position:relative;">
   <NavbarLogo title="Detalle de Parada" style="margin-bottom:10px; z-index:999"/>
  <div class="container-fluid">
    <div class="col-12 col-md-auto" style="margin: 0 10px 0 10px;">
      <div id="maptam" class="row justify-between" style="border: none ;border-radius: 10px">
        <q-parallax><WebMap/>
        </q-parallax>
      </div>
    </div>
    <div class="row gt-sm">
      <div v-show="!(getAuth.type === 'admin')" class="col-1 self-center" style="padding-left: 2.5%;">
        <div v-show="!(getAuth.type === 'admin') && !(getAuth.type === 'user')">
          <q-btn push color="white" text-color="primary" round icon="favorite_border" size="lg">
            <q-popup-proxy>
              <q-banner>
                <template v-slot:avatar>
                  <q-icon name="manage_accounts" color="primary" />
                </template>
                Para guardar una parada como favorita, primero debes iniciar sesión.
              </q-banner>
            </q-popup-proxy>
          </q-btn>
        </div>
        <div v-show="getAuth.type === 'user'">
          <div v-if="this.estadofav">
            <q-btn push color="white" text-color="primary" round icon="favorite" size="lg" @click="cambiofav()"/>
          </div>
          <div v-else>
            <q-btn push color="white" text-color="primary" round icon="favorite_border"  size="lg" @click="cambiofav()"/>
          </div>
        </div>
      </div>
      <div class="col-10" style="margin-top: 10px; border-bottom: 5px  #0a9396">
        <q-intersection>
          <q-item>
            <q-item-section>
              <q-item-label style="font-size:20px">{{this.Lparada.nombre}}</q-item-label>
              <q-item-label caption lines="3" style="font-size:15px"
                >Lugares cercanos: {{this.Lparada.lugaresCercanos}}</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-intersection>
      </div>
    </div>
    <div class="row lt-md">
      <div v-show="!(getAuth.type === 'admin')" class="col-2 self-center" style="padding-left: 3%;">
        <div v-show="!(getAuth.type === 'admin') && !(getAuth.type === 'user')">
          <q-btn push color="white" text-color="primary" round icon="favorite_border" size="md">
            <q-popup-proxy>
              <q-banner>
                <template v-slot:avatar>
                  <q-icon name="manage_accounts" color="primary" />
                </template>
                Para guardar una parada como favorita, primero debes iniciar sesión.
              </q-banner>
            </q-popup-proxy>
          </q-btn>
        </div>
        <div v-show="getAuth.type === 'user'">
          <div v-if="this.estadofav">
            <q-btn push color="white" text-color="primary" round icon="favorite" size="md" @click="cambiofav()"/>
          </div>
          <div v-else>
            <q-btn push color="white" text-color="primary" round icon="favorite_border"  size="md" @click="cambiofav()"/>
          </div>
        </div>
      </div>
      <div class="col-10" style="margin-top: 10px; border-bottom: 5px  #0a9396">
        <q-intersection>
          <q-item>
            <q-item-section>
              <q-item-label style="font-size:20px">{{this.Lparada.nombre}}</q-item-label>
              <q-item-label caption lines="3" style="font-size:15px"
                >Lugares cercanos: {{this.Lparada.lugaresCercanos}}</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-intersection>
      </div>
    </div>
    <div class="row-12" style="margin-top: 10px">
      <div class="row gt-sm">
        <div class="col-1"></div>
        <div
          class="col-4"
          style="border-bottom: 5px solid #6B7B8E; margin-bottom: 22px ;"
        ></div>
        <div
          class="col-2"
          style="text-align: center; font-weight:500; font-size: 1.5rem"
        >
          <label> Rutas de buses </label>
        </div>
        <div
          class="col-4"
          style="border-bottom: 5px solid #6B7B8E; margin-bottom: 22px"
        ></div>
        <div class="col-1"></div>
      </div>
      <div class="row lt-md">
        <div class="col-1"></div>
        <div
          class="col-2"
          style="border-bottom: 5px solid #6B7B8E; margin-bottom: 19px ;"
        ></div>
        <div
          class="col-6"
          style="text-align: center;font-size: 25px; font-weight:500; font: size 1.5rem;"
        >
          <label> Rutas de buses </label>
        </div>
        <div
          class="col-2"
          style="border-bottom: 5px solid #6B7B8E; margin-bottom: 19px"
        ></div>
        <div class="col-1"></div>
      </div>
    </div>
    <div class="row-12" style="margin-top: 10px ; margin-bottom: 2px">
      <div class="row gt-sm">
        <div
          class="col-5 "
          style="
            background-color: #6B7B8E;
            border: 5px solid #6B7B8E;
            text-align: center;
            color: white;
            font-size: 20px;
          "
        >
          <label> Nombre de ruta </label>
        </div>
        <div class="col-2" style=""></div>
        <div
          class="col-5"
          style="
            background-color:#6B7B8E;
            border: 5px solid #6B7B8E;
            text-align: center;
            color: white;
            font-size: 20px;
          "
        >
          <label> Llegada </label>
        </div>
      </div>
    </div>
    <div class="row-12">
      <div class="row gt-sm justify-center  " style="padding-top: 5px">
      </div>
    </div>
    <div class="row-12" style="margin-top: 10px ; margin-bottom: 2px">
      <div class="row lt-md">
        <div
          class="col-8 "
          style="
            background-color: #6B7B8E;
            border: 5px solid #6B7B8E;
            text-align: center;
            color: white;
            font-size: 20px;
          "
        >
          <label> Nombre de ruta </label>
        </div>
        <div class="col-1"> </div>
        <div
          class="col-3"
          style="
            background-color: #6B7B8E;
            border: 5px solid #6B7B8E;
            text-align: center;
            color: white;
            font-size: 20px;
          "
        >
          <label> Llegada </label>
        </div>
      </div>
    </div>
    <div class="row-12">
      <div class="row lt-md justify-center" style="padding-top:5px">
      </div>
    </div>
    <div class="row-12" style="margin-top: 10px">
      <q-intersection
        v-for="(ite, ky) in ArrayFiltrado" :key="ky"
        style="padding-top: 5px; font-size: 15px"
        class="example-item col-12"
      >
        <q-item clickable v-ripple  :to="{name: 'home-detalleruta',params:{id: ite.id}}" >
          <q-item-section avatar>
            <q-icon name="directions_bus" color="black" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ite.nombre}}</q-item-label>
            <q-item-label caption lines="3"
              >Destinos: {{ite.ida.nombre}}</q-item-label
            >
          </q-item-section>
          <q-item-section side>
            <q-item-label
              > {{ite.frecuencia}} min <q-icon name="schedule" color="primary"
            /></q-item-label>
          </q-item-section>
        </q-item>
      </q-intersection>
    </div>
    <div  class="container-fluid">
      <div class="row-12" style="margin-top: 10px" >
        <div class="col-12">
          <q-carousel v-show="fotosCarru"  animated v-model="slide" arrows navigation infinite :autoplay="autoplay">
            <q-carousel-slide
              v-for="(foto, key) in this.Lparada.fotos" :key="key"
                :name="key"
                :img-src="foto">
            </q-carousel-slide>
          </q-carousel>
        </div>
      </div>
    </div>
    <div class="row-12" style="margin-top: 10px; margin-bottom: 15px">
      <div class="col-12">
        <q-img
          src="https://i.ibb.co/LzBj3Ns/banner3.png" style="border-radius: 20px"
          width="100%"
        />
      </div>
    </div>
  </div>
</q-layout>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap");
#maptam{
  height: 312px;
}
</style>

<script>

import WebMap from '../opcionParadas/mapaParadasDetalle.vue'
import NavbarLogo from '../Navbar/NavbarLogo.vue'
import { mapGetters } from 'vuex'
import { db } from 'app/src/boot/db'

export default {
  name: 'detalleParadaInicio',
  components: {
    WebMap,
    NavbarLogo
  },
  data () {
    return {
      idparada: null,
      Lparada: [],
      Lrutasfiltrado: [],
      Lrutas: [],
      slide: 1,
      autoplay: true,
      // new
      allData: [],
      ArrayFiltrado: [],
      fotosCarru: false,
      estadofav: null,
      Lusuario: [],
      LparadasFavoritas: [],
      Lfav: [],
      posicionfav: 0
    }
  },
  computed: {
    ...mapGetters('login', ['getAuth', 'getUsers']),

    paradas () {
      return this.$store.state.DataVuex.paradas
    },
    rutas () {
      return this.$store.state.DataVuex.rutas
    },

    cargando () {
      if (this.rutas.length === 0) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    rutas () {
      this.clonarRutas()
      this.dataFilter()
    },
    paradas () {
      this.buscarparada()
    },
    getAuth () {
      this.busquedadefavoritos()
      this.comprobarfav()
      console.log(this.Lusuario[0].id)
      console.log(this.LparadasFavoritas)
    }
  },
  methods: {
    anteriorPagina () {
      this.$router.go(-1)
    },
    busquedadefavoritos () {
      // eslint-disable-next-line array-callback-return
      this.Lusuario = this.getUsers.filter((item) => {
        if (item.id === this.getAuth.id) {
          return true
        }
      })

      this.LparadasFavoritas = this.Lusuario[0].paradasFavoritas
    },
    comprobarfav () {
      for (let index = 0; index < this.LparadasFavoritas.length; index++) {
        if (this.LparadasFavoritas[index] === this.idparada) {
          this.estadofav = true
        } else {
          this.estadofav = false
        }
      }
    },
    agregarfavoritos () {
      this.busquedadefavoritos()
      console.log(this.Lfav)
      this.Lfav = this.LparadasFavoritas.slice()
      this.Lfav.push(this.idparada)
      console.log(this.Lfav)

      db.collection('usuarios').doc(this.getAuth.id).update({
        paradasFavoritas: this.Lfav
      }).then(() => {
        console.log('Document successfully updated!')
      }).catch((error) => {
        console.error('Error updating document: ', error)
      })
    },
    eliminarfavoritos () {
      this.busquedadefavoritos()
      this.Lfav = this.LparadasFavoritas.slice()
      console.log(this.Lfav)
      for (let index = 0; index < this.Lfav.length; index++) {
        if (this.Lfav[index] === this.idparada) {
          this.posicionfav = index
        }
      }
      this.Lfav.splice(this.posicionfav, 1)
      console.log(this.Lfav)

      db.collection('usuarios').doc(this.getAuth.id).update({
        paradasFavoritas: this.Lfav
      }).then(() => {
        console.log('Document successfully updated!')
      }).catch((error) => {
        console.error('Error updating document: ', error)
      })
    },
    cambiofav () {
      if (this.estadofav === true) {
        // aqui se tiene que eliminar
        this.estadofav = false
        this.eliminarfavoritos()
      } else {
        // aqui se agrega
        this.estadofav = true
        this.agregarfavoritos()
      }
    },
    buscarparada () {
      // busqueda con find
      this.Lparada = this.paradas.find((obj) => {
        return obj.id === this.idparada
      })
    },
    clonarRutas () {
      // clonamos las paradas al local data
      this.Lrutas = this.rutas.map((x) => {
        const elemento = Object.assign({}, x)
        elemento.id = x.id
        return elemento
      })
    },
    dataFilter () {
      const paradasMatch = []
      const idParadaActual = String(this.Lparada.id)

      for (const index of this.Lrutas) {
        for (const jindex of index.ida.paradas) {
          if (jindex.id === idParadaActual) {
            paradasMatch.push(index)
          }
        }
      }

      for (const index of this.Lrutas) {
        for (const jindex of index.vuelta.paradas) {
          if (jindex.id === idParadaActual) {
            paradasMatch.push(index)
          }
        }
      }
      const tempArr = new Set(paradasMatch)
      this.ArrayFiltrado = [...tempArr]
    }
  },
  mounted () {
    this.idparada = this.$route.params.id
    this.buscarparada()
    if (this.getAuth.type === 'user') {
      this.busquedadefavoritos()
      this.comprobarfav()
    }
    if (this.rutas.length > 0) {
      this.clonarRutas()
      this.dataFilter()
    }
  },
  created () {
    const favorite = (this.$route.params.fav)
    this.estadofav = favorite
  }
}
</script>
<style scoped>
*{
  overflow: hidden;
}
.title-container{
  margin:10px;
}
</style>
