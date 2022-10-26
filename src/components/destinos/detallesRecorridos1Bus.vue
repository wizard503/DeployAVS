<template>
  <div>
    <q-item>
      <q-item-section avatar>
        <q-icon color="white" name="ion-bus" />
      </q-item-section>
      <q-item-section class="text-subtitle1 text-weight-medium text-white">Ruta {{ruta.nombre}}</q-item-section>
      <q-item-section top side>
        <div class="">
          <q-btn flat round :color="color" icon="favorite" @click="favorite = !favorite"/>
          <q-btn
          color="grey"
          round
          flat
          dense
          :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          @click="expanded = !expanded"
        />
        </div>
      </q-item-section>
    </q-item>
      <div v-show="expanded">
        <q-separator />
          <q-list bordered padding style="background-color: #e2e3e7;">
            <q-item>
              <q-item-section>
                <q-item-label overline>DETALLES DEL</q-item-label>
                <q-item-label>Recorrido</q-item-label>
                <q-item-label caption>Pasaje Normal: ${{ruta.precios.normal}} - Pasaje Especial: ${{ruta.precios.especial}}</q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-item-label caption>Tiempo aprox.: {{ruta.tiempoRecorrido.toFixed(2)}} min</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator spaced />

            <q-item>
              <q-item-section top avatar>
                <q-avatar color="primary" text-color="white" icon="directions_walk" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Primer paso</q-item-label>
                <q-item-label caption lines="3">{{step1}}</q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-item-label caption>Distancia: {{ruta.distParadaInicio.toFixed(2)}} m</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator spaced/>

            <q-item>
              <q-item-section top avatar>
                <q-avatar color="primary" text-color="white" icon="directions_bus" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Segundo paso</q-item-label>
                <q-item-label caption lines="2">{{step2}}</q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-item-label caption>Tiempo aprox.: {{ruta.frecuencia}} min</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator spaced />

            <q-item>
              <q-item-section top avatar>
                <q-avatar color="primary" text-color="white" icon="signpost" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Tercer paso</q-item-label>
                <q-item-label caption lines="2">{{step3}}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator spaced />

            <q-item>
              <q-item-section top avatar>
                <q-avatar color="primary" text-color="white" icon="place" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Cuarto paso</q-item-label>
                <q-item-label caption lines="2">{{step4}}</q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-item-label caption>Distancia: {{ruta.distParadaFin.toFixed(2)}} m</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator spaced />
          </q-list>
      </div>
  </div>
</template>
<script>
import eventBus from 'app/src/eventBus'

export default {
  name: 'DetallesDestino',
  props: {
    ruta: Object
  },
  data: () => ({
    id: String,
    color: 'grey',
    expanded: false,
    favorite: false,
    nombre: String,
    step1: String,
    step2: String,
    step3: String,
    step4: String,
    currentStep: 1,
    paradasRecorrido: [],
    paradasRestantes: []
  }),
  methods: {
    llenarDatos () {
      this.id = this.ruta.id
      this.step1 = 'Camine a la parada de bus ' + this.ruta.nameParadaIni
      this.step2 = 'Espere y aborde la ruta de bus ' + this.ruta.nombre
      this.step3 = 'Bajarse en la parada de bus ' + this.ruta.nameParadaFin
      this.step4 = 'Camine hasta su punto de Destino . Feliz vije😊'
      this.nombre = this.ruta.nombre
      this.paradasRecorrido = this.ruta.paradasDestino // Paradas por las que pasa el recorrido
      this.paradasRestantes = this.ruta.paradas // Resto de paradas que hace la ruta
    }
  },
  watch: {
    expanded (currentValue) {
      if (currentValue) {
        eventBus.$emit('closeOtherResults', this.id)
        eventBus.$emit('DrawRecorrido1', this.ruta.paradasDestino, this.ruta.paradas)
      }
    },
    favorite (currentValue) {
      (currentValue) ? this.color = 'red' : this.color = 'grey'
      this.$q.notify({
        message: (currentValue) ? 'Recorrido favorito añadido' : 'Recorrido favorito eliminado',
        color: (currentValue) ? 'green' : 'red',
        icon: (currentValue) ? 'task_alt' : 'delete'
      })
    }
  },
  created () {
    this.llenarDatos()
    eventBus.$on('closeOtherResults', (id) => {
      if (this.id !== id) {
        this.expanded = false
      }
    })
  }
}
</script>
<style scoped>
</style>
