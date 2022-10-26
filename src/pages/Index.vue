<template>
  <div class="q-pa-md" style="margin:10px 15px 10px 15px;">
    <q-carousel
      animated
      v-model="slide"
      navigation
      infinite
      :autoplay="autoplay"
      arrows
      transition-prev="slide-right"
      transition-next="slide-left"
      @mouseenter="autoplay = false"
      @mouseleave="autoplay = true"
      height="24rem"
      width="24rem"
      class="posCar"
    >
      <q-carousel-slide :name="1" img-src="https://www.cultura.gob.sv/wp-content/uploads/2022/02/IMG-20220202-WA0179.jpg" />
      <q-carousel-slide :name="2" img-src="https://live.staticflickr.com/65535/51757046767_a535935259_b.jpg" />
      <q-carousel-slide :name="3" img-src="https://cdn-pro.elsalvador.com/wp-content/uploads/2020/10/catedral-santa-ana-2.jpg" />
    </q-carousel>
    <!--<reciente class="posRec"></reciente>-->
    <!--<div class="mapDiv">
      <Emap :basemap="basemap">
        <EmapView :center="center" :zoom="zoom"></EmapView>
      </Emap>
    </div>-->
  </div>
</template>

<script >
// import Reciente from '../components/IndexLayout/Reciente.vue'
// import '@arcgis/core/assets/esri/themes/light/main.css'
// import esriConfig from '@arcgis/core/config.js'
// esriConfig.assetsPath = '/assets'

export default {
  name: 'PageIndex',
  // components: { Reciente },
  data () {
    return {
      slide: 1,
      autoplay: true
      // basemap: 'topo',
      // center: [-89.5728, 13.9711],
      // zoom: 16
    }
  }
}
</script>

<style scoped>
  .posCar{
    border-radius:10px;
    position: relative;
    z-index: 1;
  }
  .posRec{
    margin-top: 20px;
  }

  .mapDiv{
    width: 100%;
    height: 300px;
  }
</style>
