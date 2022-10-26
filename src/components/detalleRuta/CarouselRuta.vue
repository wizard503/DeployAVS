<template>
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
  </template>

<script>

export default {
  name: 'CarouselRuta',
  data () {
    return {
      autoplay: true,
      slide: 1
    }
  },
  props: {
    ruta: Object
  }
}
</script>
