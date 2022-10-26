
<template>
    <div class="row q-mt-md full-width justify-end">
        <div class="row q-mt-md full-width">
            <q-input clickable
                rounded
                standout="bg-secondary text-white"
                bottom-slots
                v-model="text"
                label="Tu ubicación actual"
                bg-color="grey-2"
                style="width: 100%"
            >
                <template v-slot:prepend>
                <q-icon name="place" />
                </template>
            </q-input>
            <q-input clickable
                rounded
                standout="bg-secondary text-white"
                bottom-slots
                v-model="text"
                label="Destino deseado"
                bg-color="grey-2"
                style="width: 100%"
            >
                <template v-slot:prepend>
                <q-icon name="place" />
                </template>
            </q-input>
        </div>

        <div class="row justify-end">
          <q-btn
            class="q-py-xs"
            v-ripple to="/destinodetalle"
            color="accent"
            text-color="white"
            icon="search"
            style="font-size: 15px"
            unelevated rounded
          > Buscar</q-btn>
        </div>
    </div>
</template>

<script>
export default {
  name: 'destinoFavorito',
  data () {
    return {
    }
  }
}
</script>

<style scoped>
</style>
