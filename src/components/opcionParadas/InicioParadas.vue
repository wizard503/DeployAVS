/* eslint-disable key-spacing */
<template>
  <div class="container-fluid">
    <!--DIALOGO PARA ACTIVAD GPS-->
    <q-dialog v-model="persistent" persistent transition-show="scale" transition-hide="scale">
      <q-card style="border-radius: 25px">
          <q-toolbar class="q-pt-md">
            <q-icon left size="3em" name="my_location" />
            <q-toolbar-title>
              <span class="text-weight-bold">{{title}}</span>
            </q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup @click="cambioVerBotongps()"/>
          </q-toolbar>
          <q-card-section class="q-pt-md">
            {{message}}
          </q-card-section>
          <q-card-actions align="right" class="q-pa-md">
            <q-btn
              @click="pedirGps()"
              style="border-radius: 15px"
              label="Aceptar"
              color="green"
              v-close-popup
              v-if="!gpserror"
            />
          </q-card-actions>
      </q-card>
    </q-dialog>
    <!--FIN DEL GPS-->
    <!--DIALOGO PARA INGRESAR COMO USUARIO-->
    <q-dialog v-model="persistentUsuario" persistent transition-show="scale" transition-hide="scale">
      <q-card style="border-radius: 20px;">
        <q-card-section style="padding: 10px;">
          <div style="display: flex">
            <q-icon left size="3em" style="color: #8646f3;" name="favorite" />
            <label style="margin-top: 5px; color: black; font-weight: bold; font-size: 20px;">¡ATENCIÓN!</label>
    </div>
        </q-card-section>

        <q-card-section class="q-pt-none" style="padding: 10px;">
          Debe iniciar sesión con Google para poder acceder a la función de Favoritos.
        </q-card-section>

        <q-card-actions align="right" style="padding: 10px;">
          <q-btn label="ok" style="border-radius: 15px;" @click="cerrarnotiUser" color="green" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!---->
    <q-layout view="lHh Lpr lff" style="min-height:auto">
        <div class="col-12 col-md-auto" style="">
          <div class="q-pa-md" style="max-width: 100%; padding:10px 10px 10px 10px;" >
          <q-expansion-item
            class="shadow-1 overflow-hidden"
            style="border-radius: 30px"
            icon="map"
            :label="this.texto"
            @click="startCounting()"
            header-class="bg-primary text-white"
            expand-icon-class="text-white"
            default-opened
            v-model="expanded"
            :duration="1000"
            >
            <q-parallax class="mapa">
              <WebMap/>
            </q-parallax>
          </q-expansion-item>
          </div>
            <div class="row justify-between">
            </div>
        </div>
        <div class="col-12">
          <!--Solo se ve en PC-->
        <div class="row gt-sm" style="margin: 5px 0 5px 0">
          <div class="col-3"></div>
          <div class="col-6" v-show="this.mostrarArrayNormal" style="text-align: center;"><label style=" font-weight: 500;font-size: 1.8rem ;">Paradas Cercanas</label></div>
          <div class="col-6" v-show="this.mostrarArrayFav" style="text-align: center;"><label style=" font-weight: 500;font-size: 1.8rem ;">Paradas Favoritas</label></div>
          <div class="col-3 "  style="text-align: right; padding-right: 15px;" v-show="!(getAuth.type === 'admin')">
          <q-btn color="primary" @click="verFavoritos()" push>
        <div class="row items-center no-wrap">
        <q-icon v-show="this.mostrarArrayFav" left name="favorite" />
        <q-icon v-show="this.mostrarArrayNormal" left name="favorite_border" />
        <div class="text-center">
          Favoritos
        </div>
        </div>
          </q-btn>
        </div>
        </div>
        <!--FIN DE PC-->
        <!--Solo se ve en celular-->
        <div class="row lt-md" style="margin: 5px 0 5px 0">
          <div class="col-9"  v-show="this.mostrarArrayNormal" style="text-align: left; padding-left: 15px;"><label style=" font-weight: 500;font-size: 1.8rem ;">Paradas Cercanas</label></div>
          <div class="col-9" v-show="this.mostrarArrayFav" style="text-align: left; padding-left: 15px;"><label style=" font-weight: 500;font-size: 1.8rem ;">Paradas Favoritas</label></div>
          <div class="col-3"  style="text-align: right; padding-right: 10px;" v-show="!(getAuth.type === 'admin')">
          <q-btn color="primary" @click="verFavoritos()" push>
        <div class="row items-center no-wrap">
          <q-icon v-show="this.mostrarArrayFav" left name="favorite" />
        <q-icon v-show="this.mostrarArrayNormal" left name="favorite_border" />
        <div class="text-center">
          FAV
        </div>
        </div>
          </q-btn>
        </div>
        </div>
        <!--FIN DE CELULAR-->
        </div>
        <!--BARRA DE BUSQUEDA PARA PARADAS-->
        <div class="row" style="margin:0 10px" v-show="this.mostrarArrayNormal">
      <div class="col" style="margin: 0 10px 0 0;">
      <q-input v-model="cadena" v-on:keyup="buscartexto()" @keyup.enter="buscartexto" dense bg-color="white"
      rounded outlined color="#49af96"
      bottom-slots label="Ingrese la parada que necesites"
      style=""
    >
        <template v-slot:prepend>
          <q-icon name="directions_bus" />
        </template>
        <template v-slot:append>
          <q-icon @click="buscartexto()" name="search" />
          <q-icon v-if="cadena" @click="limpiar()" name="delete" />
        </template>
      </q-input>
      </div>
      <div class="col-auto"><span @click="ordenarTitulo()" class="material-icons" style="font-size:20pt; margin-top: 5px;">sort_by_alpha</span>
</div>
    </div>
    <!--FIN DE BARRA DE BUSQUEDA PARADAS-->
    <!--BARRA DE BUSQUEDA PARA FAVORITAS-->
    <div class="row" style="margin:0 10px" v-show="this.mostrarArrayFav">
      <div class="col" style="margin: 0 10px 0 0;">
      <q-input v-model="cadenafav" v-on:keyup="buscartextofav()" @keyup.enter="buscartexto" dense bg-color="white"
      rounded outlined color="#49af96"
      bottom-slots label="Ingrese la parada favorita que necesites"
      style=""
    >
        <template v-slot:prepend>
          <q-icon name="directions_bus" />
        </template>
        <template v-slot:append>
          <q-icon @click="buscartextofav()" name="search" />
          <q-icon v-if="cadenafav" @click="limpiarfav()" name="delete" />
        </template>
      </q-input>
      </div>
      <div class="col-auto"><span @click="ordenarTitulofav()" class="material-icons" style="font-size:20pt; margin-top: 5px;">sort_by_alpha</span>
</div>
    </div>
    <!--FIN DE VAORITOS-->
    <!--Muestra el array de paradas cercanas-->
        <div class="row-12" v-show="this.mostrarArrayNormal">
          <div class="q-pa-md" v-if="cargando">
            <div class="q-gutter-md">
              <q-skeleton height="300px" />
            </div>
          </div>
          <div class="q-pa-md" v-if="(cargandoDatos) && (this.posGPS !== null)"> <!--ACA solo es cargandoDatos-->
            <div class="q-gutter-md">
              <q-skeleton height="300px" />
            </div>
          </div>
          <div class="row item-center" v-if="(posGPS !== null) && (datosPaginados.length === 0) && (cargandoDatos === false)">
            <div class="" style="margin: auto; width: auto;height: 100% ;padding: 10px;">
              <q-card class="my-card">
      <img height="350px" src="../../assets/pngwing.com (1).png">

      <q-card-actions align="center">
        <q-item-label style="font-size: 17px;color:#8646f3; font-weight: 1000; text-align: center;">¡NO HAY PARADAS CERCANAS!</q-item-label>
      </q-card-actions>
    </q-card>
            </div>
          </div>
            <q-scroll-area style="height: 300px;" v-show="!(this.cargandoDatos)">
          <div class="">
    <div class="row" style="padding-left: 20px;">
      <q-item clickable v-ripple style="width:100%" v-for=" (item, index) in datosPaginados " :key="index"
        :to="{ name: 'home-detalleparada', params: { id: item.id, nombre: item.nombre, lat: item.gps.latitude, lon: item.gps.longitude, fav:item.favorito } }">
        <q-item-section avatar>
          <q-icon name="directions_bus" color="black" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ item.nombre }} <label style="font-size:11px; color: gray; font-family:'Franklin Gothic Medium','Arial Narrow', Arial, sans-serif;">Distancia: {{item.distancia}}m</label></q-item-label>
          <q-item-label caption lines="3">{{ item.lugaresCercanos }} </q-item-label>
        </q-item-section>
        <q-item-section side>
          <span v-if="!item.favorito" class="material-icons" style="font-size:2em; color: gray;">favorite_border</span>
          <span v-if="item.favorito" class="material-icons" style="font-size:2em; color: #8646f3;">favorite</span>
        </q-item-section>
      </q-item>
    </div>
  </div>
  </q-scroll-area>
  <!---->
  <div class="q-pa-lg flex flex-center" style="padding: 10px 0 0 0">
    <q-pagination
      v-model="numini"
      color="grey"
      :max="this.totalPaginas()"
      :max-pages="6"
      v-on:click="getDataPagina(numini)"
      boundary-numbers
    />
  </div>
        </div>
        <!--FIN DE MOSTRAR EL ARRAY DE NO FAVORITAS-->
        <!--MUESTRA EL ARRAY DE SOLO FAVORITAS-->
        <div class="row-12" v-show="this.mostrarArrayFav">
          <div class="q-pa-md" v-if="cargando">
            <div class="q-gutter-md">
              <q-skeleton height="300px" />
            </div>
          </div>
          <div class="row item-center" v-if="(mostrarFavoritas.length === 0)">
            <div class="" style="margin: auto; width: auto;height: 100% ;padding: 10px;">
              <q-card class="my-card">
      <img height="350px" src="../../assets/parafasFavNo.png">

      <q-card-actions align="center">
        <q-item-label style="font-size: 17px;color:#8646f3; font-weight: 1000; text-align: center;">¡NO HAY PARADAS FAVORITAS!</q-item-label>
      </q-card-actions>
    </q-card>
            </div>
          </div>
          <!--ACA PUEDE IR PARA CUANDO NO HAY FAVORITAS-->
           <q-scroll-area style="height: 300px;">
          <div class="">
    <div class="row" style="padding-left: 20px;">
      <q-item clickable v-ripple style="width:100%" v-for=" (item, index) in mostrarFavoritas " :key="index"
        :to="{ name: 'home-detalleparada', params: { id: item.id, nombre: item.nombre, lat: item.gps.latitude, lon: item.gps.longitude, fav:item.favorito } }">
        <q-item-section avatar>
          <q-icon name="directions_bus" color="black" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ item.nombre }} <label style=" font-size:11px; color: gray; font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Distancia:{{item.distancia}}m</label></q-item-label>
          <q-item-label caption lines="3">{{ item.lugaresCercanos }} </q-item-label>
        </q-item-section>
        <q-item-section side>
          <span v-if="item.favorito" class="material-icons" style="font-size:2em; color: #8646f3;">favorite</span>
        </q-item-section>
      </q-item>
    </div>
  </div>
  </q-scroll-area>
  <!---->
  <div class="q-pa-lg flex flex-center" style="padding: 10px 0 0 0" v-show="this.mostrarArrayNormal">
    <q-pagination
      v-model="numini"
      color="grey"
      :max="this.totalPaginas()"
      :max-pages="6"
      v-on:click="getDataPagina(numini)"
      boundary-numbers
    />
  </div>
        </div>
        <!--FIN-->
    </q-layout>
    <!--<p>{{this.paradas}}</p>-->
    <div class="row-12" style="margin-top: 10px; margin-bottom: 15px">
      <div class="col-12">
        <q-img
          src="https://i.ibb.co/LzBj3Ns/banner3.png" style="border-radius: 20px"
          width="100%"
        />
      </div>
    </div>
</div>
</template>
<script>
import { nuevoBus } from '../../router/index'
import WebMap from '../opcionParadas/mapaParadas.vue'

import { mapGetters } from 'vuex'

export default {
  name: 'paradasInicio',
  components: {
    WebMap
  },
  data () {
    return {
      permission: String,
      title: String,
      message: String,
      // Variable para hacer que el mapa se oculte aut
      expanded: true,
      // Datos primera copia directa de vuex
      Lparadas: [],
      // Variable que nos ayuda a mostrar un msj por si no hay par. cercanas
      nohayParadas: false,
      // Datos que se muestran al usuario
      datosPaginados: [],
      // Copia de seguridad para estar filtrando datos y buscando
      paradasOriginales: [],
      // Variable que utiliza la paginacion para iniciar
      numini: 1,
      // Variable para buscar en paradas
      cadena: '',
      cadenafav: '',
      // variables para el mapa
      mostrar: false,
      counter: 0,
      texto: 'Ocultar Mapa',
      // Para ordenar los datos alfabeticamente
      tituloAsc: false,
      tituloAscfav: false,
      // Para eliminar una busqueda
      mostrarEliminar: false,
      // Elemento utilizado para listar 5 elementos por paginacion
      elementosporpagina: 5,
      // Elementos para la Notificacion del GPS
      position: 'center',
      persistent: false,
      persistentUsuario: false,
      mostrarNoti: false,
      ubicacionGPS: null,
      // Cargando Datos
      cargandoDatos: false,
      llave: false,
      // Favoritos del usuario
      LparadasFavoritas: [],
      mostrarFavoritas: [],
      mostrarArrayNormal: true,
      mostrarArrayFav: false,
      paradasFavoritascopia: [],
      banderaSiesfav: false,
      mostrarFavoritasOriginal: [],
      // No se puede acceder al gps
      gpserror: false,
      ledioaceptar: false

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
    posGPS: {
      get () { return this.$store.state.DataVuex.posGPS },
      set (val) { this.$store.commit('DataVuex/actualizarGPS', val) }
    },
    cargando () {
      if (this.paradas.length === 0) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    gpserror () {
      if ((this.gpserror === true) && (this.posGPS === null)) {
        this.message = 'No se pudo acceder a su ubicacion, por favor verifique en su configuracion tenerlo activado.'
        this.title = 'ADVERTENCIA'
        this.open('center')
      }
    },
    paradas () {
      // Si hay algun cambio en paradas
      // Las ira a traer de vuex y les asignara su distancia dependiendo el gps
      this.clonarParadas()
    },
    totalPaginas () {
      // Para que se vaya actualizado la cant de paginacion
      // Segun los datos que se muestre
      this.totalPaginas()
    },
    Lparadas () {
      // Al encontrar un cambio en Lparadas se actualizara la paginaicion
      // Como tambien se desplega lo que es la soli del GPS
      this.getDataPagina(this.numini)
      if (this.posGPS === null) {
        if (this.mostrarNoti === true) {
          this.open('center')
        }
      }
    },
    posGPS () {
      // Si se obtiene el gps ya no se pide activarlo
      // Se clonan las paradas y se filtra segun la ubicacion
      // Las paradas cercanas
      this.mostrarNoti = false
      this.clonarParadas()
      this.paradasOriginales = this.Lparadas.slice()
      this.Lparadas = this.paradasOriginales.filter(student => student.distancia <= 300)
      // Ordenar por distancia
      this.ordenarporDistancia()
      this.paradasOriginales = this.Lparadas.slice()
      this.llave = true
      if (this.getAuth.type === 'user') {
        this.cargandoDatos = false
      }
      /*
      if ((this.cargandoDatos === true)) {
        this.cargandoDatos = false
      }
      */
    },
    getAuth () {
      console.log('cambio')
      // this.verFavoritos()
      // eslint-disable-next-line array-callback-return
      this.clonarParadas()
      this.paradasOriginales = this.Lparadas.slice()
      this.Lparadas = this.paradasOriginales.filter(student => student.distancia <= 300)
      // Ordenar por distancia
      this.ordenarporDistancia()
      this.paradasOriginales = this.Lparadas.slice()
      this.llave = true
    }
  },
  created () {
    // this.handlePermission()
  },
  mounted () {
    if (this.posGPS === null) {
      this.message = 'Desea utilizar su GPS para navegar con la mejor experiencia que proporciona nuestra pagina web.'
      this.title = 'RECOMENDACIÓN'
      this.mostrarNoti = true
      console.log('Hola')
    }
    this.ocultarMapaTimeout()
    if (this.paradas.length > 0) {
      // Sirve para cargar las paradas ya sea si se tiene el gps o no con su distancia
      this.clonarParadas()
      // Esto codigo nos ayuda a mantener las paradas cercanas cuando se cambia de pag
      if (this.posGPS !== null) {
        this.paradasOriginales = this.Lparadas.slice()
        this.Lparadas = this.paradasOriginales.filter(student => student.distancia <= 300)
        this.paradasOriginales = this.Lparadas.slice()
        this.ordenarporDistancia()
      }
    }
  },
  beforeDestroy () {
    this.stopCounting()
  },
  methods: {
    cambioVerBotongps () {
      this.gpserror = false
      this.mostrarNoti = false
    },
    // Creamos el metodo para filtar el array de paradas favoritas
    clonarParadasFav () {
      // this.clonarParadas()
      this.clonarParadasF()
      if (this.LparadasFavoritas.length !== 0) {
        // eslint-disable-next-line array-callback-return
        this.mostrarFavoritas = this.paradasFavoritascopia.filter((item) => {
          for (let index = 0; index < this.LparadasFavoritas[0].paradasFavoritas.length; index++) {
            if (this.LparadasFavoritas[0].paradasFavoritas[index] === item.id) {
              return true
            }
          }
        })
      }
      // console.log(this.mostrarFavoritas)
    },
    // Metodo par ver los guardar los favoritos de forma local
    verFavoritos () {
      if (this.getAuth.type === 'user') {
        this.mostrarArrayNormal = !this.mostrarArrayNormal
        this.mostrarArrayFav = !this.mostrarArrayFav
        this.limpiar()
        this.limpiarfav()
        // eslint-disable-next-line array-callback-return
        this.LparadasFavoritas = this.getUsers.filter((item) => {
          if (item.id === this.getAuth.id) {
            return true
          }
        })
        this.clonarParadasFav()
      } else {
        this.persistentUsuario = true
      }
    },
    // Metodo para ordenar las paradas de menor dis. a mayor dis.
    ordenarporDistancia () {
      if (this.posGPS !== null) {
        this.Lparadas.sort((a, b) => {
          let retorno = 1
          if (a.distancia > b.distancia) { retorno = 1 } else if (a.distancia < b.distancia) { retorno = -1 }
          return retorno
        })
      }
    },
    // Metodo que ayuda a que no aparezca de vuelta la noti del GPS
    cerrarnoti () {
      this.mostrarNoti = false
    },
    cerrarnotiUser () {
      this.persistentUsuario = false
    },
    // Con este se le pide al usuario que active GPS
    pedirGps () {
      // aca iria el this.cargandoDatos = true
      // eslint-disable-next-line no-unsafe-negation
      if (!'geolocation' in navigator) {
        return alert('Tu navegador no soporta el acceso a la ubicación. Intenta con otro')
      } else {
        const succesGPS = ubicacion => {
          this.posGPS = ubicacion.coords
        }

        const onErrorDeUbicacion = err => {
          console.log('Error obteniendo ubicación: ', err)
          // quitar lo comentado
          // this.message = 'No se pudo acceder a su ubicacion, por favor verifique en su configuracion tenerlo activado.'
          // this.title = 'ADVERTENCIA'
          this.gpserror = true
          // this.open('center')
        }

        const opcionesDeSolicitud = {
          enableHighAccuracy: true, // Alta precisión
          maximumAge: 0, // No queremos caché
          timeout: 5000 // Esperar solo 5 segundos
        }
        // Solicitar
        navigator.geolocation.getCurrentPosition(succesGPS, onErrorDeUbicacion, opcionesDeSolicitud)
      }
    },
    // Abre la notificacion pidiendo GPS
    open (position) {
      this.position = position
      this.persistent = true
    },
    // Con este metodo se oculta el mapa despues de x segundos al cargar la pag.
    ocultarMapaTimeout () {
      clearTimeout(this.ocultadorMapa)
      this.ocultadorMapa = setTimeout(() => {
        this.expanded = false
        this.texto = 'Mostrar Mapa'
      }, 2222)
    },
    // Calculamos el total de paginas a utilizar segun los Datos que tenemos
    totalPaginas () {
      return Math.ceil(this.Lparadas.length / this.elementosporpagina)
    },
    // Inicializamos lo que seria los datos que mostraremos al usuario
    // calculando su cantidad de elementos y los guardamos
    getDataPagina (nopagina) {
      this.datosPaginados = []
      // eslint-disable-next-line prefer-const
      let ini = (nopagina * this.elementosporpagina) - this.elementosporpagina
      // eslint-disable-next-line prefer-const
      let fin = (nopagina * this.elementosporpagina)
      this.datosPaginados = this.Lparadas.slice(ini, fin)
      // if (this.datosPaginados.length === 0) {
      //   this.nohayParadas = true
      // }
    },
    clonarParadasF () {
      // clonamos las paradas al local data
      this.paradasFavoritascopia = this.paradas.map((x) => {
        const elemento = Object.assign({}, x)
        elemento.id = x.id
        if (this.posGPS !== null) {
          // Calcular la distancia
          const rad = function (x) { return x * Math.PI / 180 }
          const R = 6378.137 // Radio de la tierra en km
          const dLat = rad(x.gps._lat - this.posGPS.latitude)
          const dLong = rad(x.gps._long - this.posGPS.longitude)
          const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(this.posGPS.latitude)) * Math.cos(rad(x.gps._lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2)
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
          const d = R * c * 1000
          elemento.distancia = Math.round(d)
        } else {
          // Asignamos 0 si no activo el gps
          elemento.distancia = 0
        }
        if (this.mostrarFavoritas.length === 0) {
          elemento.favorito = false
        } else {
          elemento.favorito = true
        }
        return elemento
      })
    },
    clonarParadas () {
      // clonamos las paradas al local data
      if (this.getAuth.type !== 'user') {
        this.Lparadas = this.paradas.map((x) => {
          const elemento = Object.assign({}, x)
          elemento.id = x.id
          if (this.posGPS !== null) {
          // Calcular la distancia
            const rad = (x) => x * Math.PI / 180
            const R = 6378.137 // Radio de la tierra en km
            const dLat = rad(x.gps._lat - this.posGPS.latitude)
            const dLong = rad(x.gps._long - this.posGPS.longitude)
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(this.posGPS.latitude)) * Math.cos(rad(x.gps._lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2)
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
            const d = R * c * 1000
            elemento.distancia = Math.round(d)
          } else {
            // Asignamos 0 si no activo el gps
            elemento.distancia = 0
          }
          elemento.favorito = false
          return elemento
        })
        // nos ayuda a ordenar siempre alfabeticamente
        this.tituloAsc = false
        if (this.tituloAsc === false) {
          this.ordenarTitulo()
        }
        //
        //
        if (this.posGPS !== null) {
          this.llave = true
        }
        //
        //
        if (this.llave === true) {
        // Elemento que nos ayuda a indicar que se estan cargando los datos
          this.cargandoDatos = false
        }
      } else {
        // eslint-disable-next-line array-callback-return
        this.LparadasFavoritas = this.getUsers.filter((item) => {
          if (item.id === this.getAuth.id) {
            return true
          }
        })
        this.clonarParadasFav()
        // eslint-disable-next-line array-callback-return
        this.Lparadas = this.paradasFavoritascopia.filter((item) => {
          for (let index = 0; index < this.mostrarFavoritas.length; index++) {
            if (this.banderaSiesfav === false) {
              item.favorito = false
            }
            if (item.id === this.mostrarFavoritas[index].id) {
              item.favorito = true
              this.banderaSiesfav = true
            }
          }
          this.banderaSiesfav = false
          return true
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
        // puse un IFFFFFFFFFFFFFFFFFF
        if (this.LparadasFavoritas.length !== 0) {
        // eslint-disable-next-line array-callback-return
          this.mostrarFavoritas = this.paradasFavoritascopia.filter((item) => {
            for (let index = 0; index < this.LparadasFavoritas[0].paradasFavoritas.length; index++) {
              if (this.LparadasFavoritas[0].paradasFavoritas[index] === item.id) {
                return true
              }
            }
          })
        }
        // FIN DEL IFFFFFFFFF
      }
    },
    startCounting () {
      // Metodo que cambia el texto que aparece en el elemento de despliegue del mapa
      this.counter++
      if (this.counter % 2 === 0) {
        this.texto = 'Mostrar Mapa'
      } else {
        this.texto = 'Ocultar Mapa'
      }
    },
    ordenarTitulo () {
      this.mostrarEliminar = true
      this.tituloAsc = !this.tituloAsc
      this.Lparadas.sort((a, b) => {
        let retorno = 1
        if (a.nombre.toLowerCase() > b.nombre.toLowerCase()) { retorno = 1 } else if (a.nombre.toLowerCase() < b.nombre.toLowerCase()) { retorno = -1 }
        if (!this.tituloAsc) { retorno = retorno * -1 }

        return retorno
      })
      // Para actualizar lo que es datosPaginados que es lo que mostramos al usuario
      this.getDataPagina(this.numini)
    },
    ordenarTitulofav () {
      this.mostrarEliminar = true
      this.tituloAscfav = !this.tituloAscfav
      this.mostrarFavoritas.sort((a, b) => {
        let retorno = 1
        if (a.nombre.toLowerCase() > b.nombre.toLowerCase()) { retorno = 1 } else if (a.nombre.toLowerCase() < b.nombre.toLowerCase()) { retorno = -1 }
        if (!this.tituloAscfav) { retorno = retorno * -1 }

        return retorno
      })
      // Para actualizar lo que es datosPaginados que es lo que mostramos al usuario
    },

    stopCounting () {
      clearInterval(this.timer)
    },
    anteriorPagina () {
      this.$router.go(-1)
    },
    mostrarMapaComp () {
      if (this.counter === 0) {
        this.mostrar = true
        nuevoBus.$emit('paradas', this.Lparadas)
      }
    },
    buscartexto () {
      // eslint-disable-next-line eqeqeq
      if (this.cadena == '') {
        this.limpiar()
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
        if ((item.nombre.toLowerCase().indexOf(this.cadena.toLowerCase()) >= 0) || (item.lugaresCercanos.toLowerCase().indexOf(this.cadena.toLowerCase()) >= 0)) {
          return true
        }
      })
      this.ordenarporDistancia()
    },
    buscartextofav () {
      // eslint-disable-next-line eqeqeq
      if (this.cadenafav == '') {
        this.clonarParadasFav()
      }
      // this.Lparadas = this.paradas
      this.clonarParadasFav()
      // eslint-disable-next-line no-const-assign
      this.mostrarFavoritasOriginal = this.mostrarFavoritas.slice()
      // eslint-disable-next-line array-callback-return
      this.mostrarFavoritas = this.mostrarFavoritasOriginal.filter((item) => {
        if ((item.nombre.toLowerCase().indexOf(this.cadenafav.toLowerCase()) >= 0) || (item.lugaresCercanos.toLowerCase().indexOf(this.cadenafav.toLowerCase()) >= 0)) {
          return true
        }
      })
      this.ordenarporDistancia()
    },
    limpiarfav () {
      this.cadenafav = ''
      this.buscartextofav()
    },
    limpiar () {
      this.cadena = ''
      // this.mostrarEliminar = false
      if (this.Lparadas.length > 0) {
        if (this.posGPS !== null) {
          // Limpiamos cualquier busqueda y devolvemos el arreglo original
          this.Lparadas = this.paradasOriginales.slice()
          this.tituloAsc = false
          this.ordenarporDistancia()
        } else {
          // NOs trae las paradas completas a como estaban antes de la busqueda
          this.clonarParadas()
          this.tituloAsc = false
          this.ordenarTitulo()
        }
      } else {
        if (this.posGPS !== null) {
          // Limpiamos cualquier busqueda y devolvemos el arreglo original
          this.Lparadas = this.paradasOriginales.slice()
          this.tituloAsc = false
          this.ordenarporDistancia()
        } else {
          // NOs trae las paradas completas a como estaban antes de la busqueda
          this.clonarParadas()
          this.tituloAsc = false
          this.ordenarTitulo()
        }
      }
      this.mostrarEliminar = false
    }
  }

}
</script>
