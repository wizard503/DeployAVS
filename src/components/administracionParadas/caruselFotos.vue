<template>
  <q-carousel
    thumbnails
    swipeable
    arrows
    next-icon="eva-arrow-ios-forward"
    prev-icon="eva-arrow-ios-back"
    navigation
    navigation-icon="eva-radio-button-off"
    navigation-active-icon="eva-radio-button-on"
    height="300px"

    v-model="foto"
  >
    <q-carousel-slide
      v-for="(foto, index) in fotos"
      :key="index"
      :name="index"
      :img-src="foto"
    />
  </q-carousel>
</template>

<script>

export default {
  name: 'CaruselFotos',

  props: {
    fotos: []
  },

  data: () => ({
    foto: 0
  })
}
</script>
