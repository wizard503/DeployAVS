<template>
  <q-page>
    <div>
      <div>
        <div v-if="getAuth.type === 'none'" class="row">
          <!-- este div contiene lo que se muestra cuando el usuario NO esta loggeado -->
          <div class="column col-xs-10 col-sm-11 q-pl-md q-mt-md">
            <span class="text-subtitle1">Ver rutas favoritas</span>
          </div>
          <div class="column col-xs-2 col-sm-1 q-mt-sm" style="position: relative">
            <q-toggle
            disable
            v-model="seeFavs"
            color="primary"
            keep-color
            @input="handleToogle()"
            style="position: absolute; right:10px;"
            >
              <q-popup-proxy>
                <q-banner>
                  <template v-slot:avatar>
                    <q-icon name="manage_accounts" color="primary" />
                  </template>
                  Para guardar una ruta como favorita, primero debes iniciar sesión.
                </q-banner>
              </q-popup-proxy>
            </q-toggle>
          </div>
          <!--fin del div de usuario NO loggeado -->
        </div>
        <div v-else class="row">
          <!-- este div contiene lo que se muestra cuando el usuario SI esta loggeado -->
          <div class="column col-xs-10 col-sm-11 q-pl-md q-mt-md">
            <span v-if="!seeFavs" class="text-subtitle1">Ver rutas favoritas</span>
            <span v-else class="text-subtitle1">Ver todas las rutas</span>
          </div>
          <div class="column col-xs-2 col-sm-1 q-mt-sm" style="position: relative">
            <q-toggle
            v-model="seeFavs"
            color="primary"
            keep-color
            @input="handleToogle()"
            style="position: absolute; right:10px;"
            >
            </q-toggle>
          </div>
          <!--fin del div de usuario SI loggeado -->
        </div>
      </div>
    </div>
    <div v-if="!seeFavs">
      <div class="q-pa-md" style="padding:10px 10px 0 10px">
        <div class="search-box">
          <q-input dense bg-color="white" rounded outlined color="#49af96"
            bottom-slots
            style="" input-class="text-left" v-model="busqueda" @clear="busqueda = ''">
            <template v-slot:append>
              <q-icon v-if="busqueda === ''" name="ion-search" color="primary"/>
              <q-icon v-else name="clear" class="cursor-pointer" @click="busqueda = ''" />
            </template>
          </q-input>
        </div>
      </div>
      <q-list class="list">
        <listaRuta
          v-for="(ruta) in filtroRutas"
          :key="ruta.id"
          :ruta="ruta"
        />
      </q-list>
      <div class="row q-mt-xs">
        <div class="col col-xs-12">
          <q-img
            src="https://i.ibb.co/CWN5hZt/banner3.png"
            style="max-width: 100%; height: 70px;"
            contain
          >
          </q-img>
        </div>
      </div>
    </div>
    <div v-else>
      <!--Este div muestra las favoritas-->
      <div class="q-pa-md" style="padding:10px 10px 0 10px">
      <div class="search-box">
        <q-input dense bg-color="white" rounded outlined color="#49af96"
      bottom-slots
      style="" input-class="text-left" v-model="busquedaFav" @clear="busquedaFav = ''">
          <template v-slot:append>
            <q-icon v-if="busquedaFav === ''" name="ion-search" color="primary"/>
            <q-icon v-else name="clear" class="cursor-pointer" @click="busquedaFav = ''" />
          </template>
        </q-input>
      </div>
    </div>
    <q-list class="list">
      <listaRuta
        v-for="(ruta) in arrParadasFavRender"
        :key="ruta.id"
        :ruta="ruta"
      />
    </q-list>
    <div class="row q-mt-xs">
    <div class="col col-xs-12">
      <q-img
        src="https://i.ibb.co/CWN5hZt/banner3.png"
        style="max-width: 100%; height: 70px;"
        contain
        >
      </q-img>
    </div>
    </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import listaRuta from 'src/components/listaRuta.vue'
export default {
  name: 'rutas',
  components: { listaRuta },
  data: () => ({
    forceUpdateKey: 0,
    isUserLogged: false,
    estadoFav: null,
    busqueda: '',
    busquedaFav: '',
    seeFavs: false,
    arrIdParadasFav: [],
    arrParadasFav: []
  }),
  computed: {
    ...mapGetters('login', ['getAuth', 'getUsers']),
    filtroRutas () {
      return this.$store.state.DataVuex.rutas.filter((ruta) => {
        return ruta.nombre.match(this.busqueda)
      })
    },
    arrParadasFavRender () {
      return this.arrParadasFav.filter(ruta => {
        return ruta.nombre.match(this.busquedaFav)
      })
    }
  },
  methods: {
    getRutasFav () {
      // eslint-disable-next-line array-callback-return
      this.arrUsers = this.getUsers.filter((item) => {
        if (item.id === this.getAuth.id) {
          return true
        }
      })
      this.arrIdParadasFav = this.arrUsers[0].rutasFavoritas
      // console.log('ID paradas fav', this.arrIdParadasFav)
    },
    handleToogle () {
      this.busqueda = ''
      // console.log('toogle!', this.seeFavs)
      this.getRutasFav()
      this.arrParadasFav = []
      const tempArr = this.filtroRutas
      for (const element of tempArr) {
        if (this.arrIdParadasFav.includes(element.id)) {
          this.arrParadasFav.push(element)
        }
      }
      this.$forceUpdate()
    }
  }
}
</script>
