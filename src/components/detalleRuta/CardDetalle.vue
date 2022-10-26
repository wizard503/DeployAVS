<template>
  <div>
    <q-card class="my-card">
    <q-item class="bg-primary text-white">
      <q-item-section>
          <q-item-label class="text-h6 text-center">{{ ruta.nombre }}</q-item-label>
      </q-item-section>
    </q-item>
    <q-separator />
    <q-card-section horizontal>
      <q-card-section>
        <q-item>
          <q-item-section avatar>
            <q-icon color="primary" name="payments" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Precio Normal</q-item-label>
            <q-item-label caption>${{ ruta.precios.normal }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            <q-icon color="primary" name="payments" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Precio Especial</q-item-label>
            <q-item-label caption>${{ ruta.precios.especial }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            <q-icon color="primary" name="timer" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Frecuencia</q-item-label>
            <q-item-label caption>{{ ruta.frecuencia }} min</q-item-label>
          </q-item-section>
        </q-item >
      </q-card-section>
    </q-card-section>
    <q-separator />
    <q-card-actions align="center" >
      <div v-show="!(getAuth.type === 'admin') && !(getAuth.type === 'user')">
        <q-item>
          <q-btn push color="white" text-color="primary" round icon="favorite_border" size="sm">
            <q-popup-proxy>
              <q-banner>
                <template v-slot:avatar>
                  <q-icon name="manage_accounts" color="primary" />
                </template>
                Para guardar una ruta como favorita, primero debes iniciar sesión.
              </q-banner>
            </q-popup-proxy>
          </q-btn>
          <span class="text-subtitle2 q-pl-sm q-pt-xs">Agregar a favoritos</span>
        </q-item>
      </div>
      <div v-show="getAuth.type === 'user'">
        <div v-if="this.estadoFav">
          <q-item>
            <q-btn push color="white" text-color="primary" round icon="favorite" size="sm" @click="favHandler()"/>
            <span class="text-subtitle2 q-pl-sm q-pt-xs">Guardada en favoritos</span>
          </q-item>
        </div>
        <div v-else>
          <q-item>
            <q-btn push color="white" text-color="primary" round icon="favorite_border"  size="sm" @click="favHandler()"/>
            <span class="text-subtitle2 q-pl-sm q-pt-xs">Agregar a favoritos</span>
          </q-item>
        </div>
      </div>
    </q-card-actions>
  </q-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { db } from 'app/src/boot/db'

export default {
  name: 'CardDetalle',
  props: {
    ruta: Object
  },
  data () {
    return {
      idRuta: null,
      estadoFav: null,
      arrParadasFav: [],
      arrUsers: [],
      arrFavActuales: []
    }
  },
  computed: {
    ...mapGetters('login', ['getAuth', 'getUsers']),
    paradas () {
      return this.$store.state.DataVuex.paradas
    },
    rutas () {
      return this.$store.state.DataVuex.rutas
    }
  },
  watch: {
    rutas () {
      this.clonarRutas()
    },
    getAuth () {
      this.getRutasFav()
      this.checkRutaFav()
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
      this.arrParadasFav = this.arrUsers[0].rutasFavoritas
    },
    favHandler () {
      this.getRutasFav()
      this.arrFavActuales = this.arrParadasFav.slice()
      console.log(this.arrFavActuales)
      if (!this.estadoFav) {
        // la ruta no es fav, se debe agregar
        this.arrFavActuales.push(this.idRuta)
        this.estadoFav = true
      } else {
        const tempArr = this.arrFavActuales
        // la ruta es favorita, se debe eliminar
        this.arrFavActuales = tempArr.filter(uwu => uwu !== this.idRuta)
        this.estadoFav = false
      }
      db.collection('usuarios').doc(this.getAuth.id).update({
        rutasFavoritas: this.arrFavActuales
      }).then(() => {
        console.log('Document successfully updated!')
      }).catch((error) => {
        console.error('Error updating document: ', error)
      })
    },
    checkRutaFav () {
      this.getRutasFav()
      this.estadoFav = this.arrParadasFav.includes(this.$route.params.id)
    }
  },
  mounted () {
    this.idRuta = this.$route.params.id
    if (this.getAuth.type === 'user') {
      this.getRutasFav()
    }
  },
  created () {
    if (this.getAuth.type === 'user') {
      this.checkRutaFav()
    }
  }
}
</script>
