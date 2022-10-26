<template>
  <div class="row">
    <div class="col col-xs-12 col-sm-12 ">
       <BarraDestino id="barra"/>
    </div>
    <div class="col q-ml-xs" >
      <div>
        <cardDestino id="card"></cardDestino>
      </div>
    </div>
    <div class="col col-xs-12 col-sm-12">
      <PublicidadDestinos/>
      <DestinoFavorito></DestinoFavorito>
    </div>
  </div>
</template>

<script>

import BarraDestino from 'app/src/components/destinos/BarraDestino.vue'
import PublicidadDestinos from 'app/src/components/destinos/PublicidadDestinos.vue'
import cardDestino from 'app/src/components/destinos/CardDestino.vue'
import DestinoFavorito from 'app/src/components/destinos/DestinoFav.vue'

export default {
  components: { BarraDestino, PublicidadDestinos, cardDestino, DestinoFavorito },
  methods: {
  }

}

</script>
<style>
  #title {
    margin: 0 1.5rem;
    padding: 0;
    align-items: left;
    text-align: left;
  }
  #barra{
    margin: 0.8rem 1.2rem;
  }
  #card{
    width: 100%;
    margin-bottom: 1rem
  }
  @media only screen and (max-width: 500px){
  }
</style>
