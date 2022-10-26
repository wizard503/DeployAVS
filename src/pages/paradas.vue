<template>
<div class="container-fluid">
    <InicioParadas></InicioParadas>
    <AnuncioParadas></AnuncioParadas>
</div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap");
</style>

<script>
import InicioParadas from '../components/opcionParadas/InicioParadas.vue'
import AnuncioParadas from '../components/opcionParadas/anuncioParadas.vue'

export default {
  components: { InicioParadas, AnuncioParadas },
  name: 'parada'
}
</script>
