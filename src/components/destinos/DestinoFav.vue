<template>
  <div class=" q-ma-md full-width">
      <div class="row q-ml-md items-end">
        <div class="col">

          <span class="q-mx-md  text-h6 ">Tus destinos favoritos!</span>
        </div>
        <!-- <div class="q-mr-md items-end">
          <q-btn flat round color="primary" icon="thumb_up" />
        </div> -->
      </div>

      <div  class="q-ml-md shadow-5 box" rounded style="width: 92%;">
        <q-intersection v-for="index in 4" :key="index" transition="flip-right"  class="q-ma-xs col-12">
          <q-item clickable v-ripple to="/destinodescripcion">
            <q-item-section avatar>
               <q-icon color="white" name="favorite" />
            </q-item-section>
            <q-item-section class="text-subtitle1 text-weight-medium text-white">Destino Favorito {{index}}</q-item-section>
            <q-item-section avatar>
               <q-icon color="white" name="arrow_forward_ios" />
            </q-item-section>
          </q-item>
        </q-intersection>
      </div>
    </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'destinoFavorito',
  data () {
    return {
    }
  },

  computed: {
    ...mapGetters('login', ['getAuth'])
  },
  methods: {
    esUsuarioLogueado () {
      if (this.getAuth.type === 'user') {
        const identi = this.getAuth.id
        return identi
      } else {
        return false
      }
    }
  }
}
</script>

>
<style lang="sass" scoped>
.box
  border-radius: 1rem
  background: #4568dc
  background: -webkit-linear-gradient(to right, #4568dc, #b06ab3)
  background: linear-gradient(to right, #4568dc, #b06ab3)
</style>

<!--esto es lo que tenia yo *Enrique Trujillo* para comprobar que tipo de usuario es-->
<!-- <template>
  <div>
    {{ esUsuarioLogueado() }}
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'destinosFavoritos',

  computed: {
    ...mapGetters('login', ['getAuth'])
  },
  methods: {
    esUsuarioLogueado () {
      if (this.getAuth.type === 'user') {
        const identi = this.getAuth.id
        return identi
      } else {
        return false
      }
    }
  }

}
</script>
 -->
