<template>
  <div>
    <q-item clickable v-ripple :to="{name:'home-detalleruta', params:{id: ruta.id}}">
      <q-item-section top avatar>
            <q-avatar color="primary" text-color="white" icon="directions_bus" />
      </q-item-section>
       <q-item-section top class="q-pr-xl q-mr-md">
        <q-item-label style="font-weight: 700;">
          {{ ruta.nombre }}
        </q-item-label>
        <q-item-label caption>
          Frecuencia: {{ruta.frecuencia}} min
        </q-item-label>
        <q-item-label caption>
          Precio: ${{ruta.precios.normal}}
        </q-item-label>
      </q-item-section>
        <div style='display:flex; justify-content:center;'>
          <div v-if="!(getAuth.type === 'admin') && !(getAuth.type === 'user')">
            <q-btn flat color="white" text-color="primary" round icon="favorite_border" size="md" @click.prevent="">
              <q-popup-proxy>
                <q-banner>
                  <template v-slot:avatar>
                    <q-icon name="manage_accounts" color="primary" />
                  </template>
                  Para guardar una ruta como favorita, primero debes iniciar sesión.
                </q-banner>
              </q-popup-proxy>
            </q-btn>
          </div>
          <div v-show="getAuth.type === 'user'">
            <div v-if="this.estadoFav">
              <q-btn flat color="white" text-color="primary" round icon="favorite" size="md" @click.prevent="favHandler()"/>
            </div>
            <div v-else>
              <q-btn flat color="white" text-color="primary" round icon="favorite_border"  size="md" @click.prevent="favHandler()"/>
            </div>
          </div>
        </div>
    </q-item>
    <q-separator/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { db } from 'app/src/boot/db'
export default {
  name: 'listaRuta',
  props: {
    ruta: Object
  },
  data () {
    return {
      estadoFav: null
    }
  },
  computed: {
    ...mapGetters('login', ['getAuth', 'getUsers'])
  },
  watch: {
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
      this.arrParadasFav = this.arrUsers[0].rutasFavoritas ?? []
    },
    favHandler () {
      this.getRutasFav()
      this.arrFavActuales = this.arrParadasFav.slice()
      if (!this.estadoFav) {
        // la ruta no es fav, se debe agregar
        this.arrFavActuales.push(this.ruta.id)
        this.estadoFav = true
      } else {
        const tempArr = this.arrFavActuales
        // la ruta es favorita, se debe eliminar
        this.arrFavActuales = tempArr.filter(uwu => uwu !== this.ruta.id)
        this.estadoFav = false
      }
      db.collection('usuarios').doc(this.getAuth.id).update({
        rutasFavoritas: this.arrFavActuales
      }).then(() => {
        // console.log('Document successfully updated!')
      }).catch((error) => {
        console.error('Error updating document: ', error)
      })
      this.$forceUpdate()
    },
    checkRutaFav () {
      this.getRutasFav()
      this.estadoFav = this.arrParadasFav.includes(this.ruta.id)
    }
  },
  mounted () {
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
