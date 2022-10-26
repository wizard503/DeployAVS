<template>
  <div class="col">
    <q-carousel
      animated
      :autoplay="autoplay"
      v-model="slide"
      arrows
      infinite
      class="carrousel shadow-8"
    >
      <q-carousel-slide v-for="(slide, index) in destinos"
        :key="slide.id"
        :name="slide.id "
        :img-src="slide.url" >
        <div class="absolute-bottom custom-caption" >
          <div class="text-h6" align="right">
            <h6 class="name-destino">{{slide.nombre}}</h6>
            <q-btn
            class="q-mx-sm boton"
            unelevated
            color="white"
            to="/destinodescripcion"
          ><q-icon name="directions_bus" class="icono"></q-icon></q-btn>
          <q-btn
            class="q-mx-sm boton"
            unelevated
            color="white"
            @click="favoriteDestino(index)"
          >
          <q-icon v-if="slide.isFavorite" name="favorite_border" class="icono"></q-icon>
          <q-icon v-else name="favorite" class="icono"></q-icon>

        </q-btn>
          </div>
        </div>
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<script>
import { db } from 'app/src/boot/db'

export default {
  name: 'cardDestinos',
  setup () {
    return {
    }
  },
  data () {
    return {
      slide: 1,
      autoplay: true,
      destinos: []
    }
  },
  methods: {
    llenarArray () {
      this.destinos = this.getDestinos()
    },
    getDestinos () {
      return this.$store.getters['DataVuex/getDestinoPrincipal']
    },
    favoriteDestino (index) {
      const { url, nombre, id, gps, isFavorite, docRefId } = this.destinos[index]

      if (!isFavorite) {
        db.collection('destinos-favoritos').add({ url, nombre, id, gps }).then(response => {
          this.$store.dispatch('DataVuex/ADD_DOC_FAVORITE', { index, id: response.id })
        })
      } else {
        db.collection('destinos-favoritos').doc(docRefId).delete()
      }
      this.$store.dispatch('DataVuex/FAVORITE_DESTINO', { index })
    }
  },
  computed: {

  },
  created () {
    this.llenarArray()
  }
}
</script>

<style lang="sass" scoped>
.text-h6
  display: flex
.custom-caption
  text-align: center
  padding: 12px
  color: white
  background: linear-gradient(to right, #4568dc, #b06ab3)
  border-radius: 1rem 1rem
.name-destino
  width: 75%
  margin: 0
  padding: 0
  text-align: center
.carrousel
  border-radius: 1.6rem
  height: 450px
  margin: 0.5rem 1rem
.icono
  color: #b06ab3
  border-radius: .5rem
.boton
  border-radius: .75rem

@media only screen and (max-width: 425px)
  .carrousel
    height: 300px
</style>
