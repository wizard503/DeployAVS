<template>
  <q-page>
    <div class="q-pa-md">
      <div class="search-box">
        <q-input  rounded outlined   standout="bg-brown-2 text-white"  input-class="text-right" class="q-ml-md" v-model="busqueda" @clear="busqueda = ''">
          <template v-slot:append>
            <q-icon v-if="busqueda === ''" name="ion-search" color="primary"/>
            <q-icon v-else name="clear" class="cursor-pointer" @click="busqueda = ''" />
          </template>
        </q-input>
      </div>
    </div>
    <div class="buttom q-mt-xl">
        <strong>Agregar </strong>
        <q-btn position="right" fab icon="add" color="negative" to="/admin/addruta"/>
    </div>
    <q-list class="list">
      <itemRuta
        v-for="(ruta, index) in filteredRutas"
        :key="index"
        :ruta="ruta"
      />
    </q-list>
    <editRuta />
  </q-page>
</template>

<script>
import itemRuta from 'src/components/administracionRutas/itemRuta.vue'
import editRuta from '../components/administracionRutas/editRuta.vue'

export default {
  name: 'AdministrarParada',
  components: { itemRuta, editRuta },

  data: () => ({
    busqueda: '',
    estado: false
  }),
  computed: {
    filteredRutas () {
      return this.$store.state.DataVuex.rutas.filter((ruta) => {
        return ruta.nombre.match(this.busqueda)
      })
    }
  }
}
</script>
<style scoped>
.buttom {
   float: right;
   margin-bottom: 15px;
 }

 .buttom strong {
   margin-right: 5px;
   font-size: 15px;
 }
.list {
   clear: right;
 }
</style>
