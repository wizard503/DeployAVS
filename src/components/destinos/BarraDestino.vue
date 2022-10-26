<template>
    <div>
          <div>
            <q-intersection  transition="scale"  class="bg-white bordes shadow-5">
              <q-item clickable v-ripple to="/destinodescripcion">
                <q-item-section class="q-ml-md text-subtitle1 text-dark">Encuentra tu destino aquí!</q-item-section>
                <q-item-section avatar>
                  <q-icon  class="boxIcon" name="travel_explore
                  " />
                </q-item-section>
            </q-item>
            </q-intersection>
          </div>
    </div>
</template>

<script>
export default {
  name: 'barraDestino',
  data () {
    return {
      slide: 1,
      autoplay: true
    }
  }
}
</script>

<style scoped>
  .bordes{
    border-radius: 3rem;
    width: 100%;
  }

  .fondo{
    background-color: rgba(0, 0, 0, .6);
  }

  .boxIcon{
    border-radius: 3rem;
    color: white;
    background: linear-gradient(to right, #4568dc, #b06ab3);
    padding: .25rem;
  }

</style>
