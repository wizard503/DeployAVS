<template>
    <div>
      <q-item>
        <q-item-section avatar>
          <q-icon color="white" name="ion-bus" />
        </q-item-section>
        <q-item-section class="text-subtitle1 text-weight-medium text-white">Ruta {{recorridoDetails.ruta1}} - Ruta {{recorridoDetails.ruta2}}</q-item-section>
        <q-item-section top side>
          <div class="">
            <q-btn flat round :color="color" icon="favorite" @click="favorite = !favorite" />
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
          <q-list bordered style="background-color: #e2e3e7;">
            <q-item>
              <q-item-section>
                <q-item-label overline>DETALLES DEL</q-item-label>
                <q-item-label>Recorrido</q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-item-label caption>Tiempo aprox.: {{Math.round(recorridoDetails.tiempoTotal)}} min</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator spaced />
            <q-item class="q-mb-sm">
              <q-item-section>
                <q-item-label>Ruta {{recorridoDetails.ruta1}}</q-item-label>
                <q-item-label caption>Pasaje Normal: ${{recorridoDetails.preciosRuta1.normal}} - Pasaje Especial: ${{recorridoDetails.preciosRuta1.especial}}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section top avatar>
                <q-avatar color="primary" text-color="white" icon="directions_walk" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Primer paso</q-item-label>
                <q-item-label caption lines="3">{{step1}}</q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-item-label caption>Distancia: {{recorridoDetails.distParadaAbordaje1}} m</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator spaced inset="item"/>

            <q-item>
              <q-item-section top avatar>
                <q-avatar color="primary" text-color="white" icon="directions_bus" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Segundo paso</q-item-label>
                <q-item-label caption lines="2">{{step2}}</q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-item-label caption>Tiempo aprox.: {{recorridoDetails.frecuenciaRuta1}} min</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator spaced inset="item"/>

            <q-item>
              <q-item-section top avatar>
                <q-avatar color="primary" text-color="white" icon="signpost" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Tercer paso</q-item-label>
                <q-item-label caption lines="2">{{step3}}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator spaced/>

            <q-item class="q-my-sm">
              <q-item-section>
                <q-item-label>Ruta {{recorridoDetails.ruta2}}</q-item-label>
                <q-item-label caption>Pasaje Normal: ${{recorridoDetails.preciosRuta2.normal}} - Pasaje Especial: ${{recorridoDetails.preciosRuta2.especial}}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section top avatar>
                <q-avatar color="primary" text-color="white" icon="directions_walk" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Primer paso</q-item-label>
                <q-item-label caption lines="3">{{step4}}</q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-item-label caption>Distancia: {{recorridoDetails.distParadaAbordaje2}} m</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator spaced inset="item"/>

            <q-item>
              <q-item-section top avatar>
                <q-avatar color="primary" text-color="white" icon="directions_bus" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Segundo paso</q-item-label>
                <q-item-label caption lines="2">{{step5}}</q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-item-label caption>Tiempo aprox.: {{recorridoDetails.frecuenciaRuta2}} min</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator spaced inset="item"/>

            <q-item>
              <q-item-section top avatar>
                <q-avatar color="primary" text-color="white" icon="signpost" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Tercer paso</q-item-label>
                <q-item-label caption lines="2">{{step6}}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator spaced inset="item"/>

            <q-item>
              <q-item-section top avatar>
                <q-avatar color="primary" text-color="white" icon="place" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Cuarto paso</q-item-label>
                <q-item-label caption lines="2">{{step7}}</q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-item-label caption>Distancia: {{recorridoDetails.distPD}} m</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
    </div>
  </template>
<script>
import eventBus from 'app/src/eventBus'

export default {
  name: 'DetallesDestino',
  props: {
    recorrido: Object
  },
  data: () => ({
    id: String,
    expanded: false,
    favorite: false,
    color: 'grey',
    step1: String,
    step2: String,
    step3: String,
    step4: String,
    step5: String,
    step6: String,
    step7: String,
    recorridoDetails: {
      ruta1: '',
      recorridoRuta1: '',
      recorridoRuta2: '',
      frecuenciaRuta1: 0,
      preciosRuta1: Object,
      distParadaAbordaje1: 0,
      tiempoRuta1: 0,
      ruta2: '',
      frecuenciaRuta2: 0,
      preciosRuta2: Object,
      distParadaAbordaje2: 0,
      tiempoRuta2: 0,
      distPD: 0,
      tiempoTotal: 0,
      paradasRecorridoRuta2: null,
      paradasRecorridoRuta1: null
    }
  }),
  methods: {
    cancel () {
      this.estado = false
    },
    llenarDatos () {
      this.id = this.recorrido.id
      this.step1 = 'Camine a la parada de bus ' + this.recorrido.paradaAbordaje1
      this.step2 = 'Espere y aborde la ruta de bus ' + this.recorrido.ruta1
      this.step3 = 'Bajarse en la parada de bus ' + this.recorrido.paradaBajada1
      this.step4 = 'Camine a la parada de bus ' + this.recorrido.paradaAbordaje2
      this.step5 = 'Espere y aborde la ruta de bus ' + this.recorrido.ruta2
      this.step6 = 'Bajarse en la parada de bus ' + this.recorrido.paradaBajada2
      this.step7 = 'Camine hasta su punto de Destino . Feliz vije😊'
      this.recorridoDetails = {
        ruta1: this.recorrido.ruta1,
        recorridoRuta1: this.recorrido.recorridoRuta1,
        recorridoRuta2: this.recorrido.recorridoRuta2,
        frecuenciaRuta1: this.recorrido.frecuenciaRuta1,
        preciosRuta1: this.recorrido.preciosRuta1,
        distParadaAbordaje1: this.recorrido.distParadaAbordaje1,
        tiempoRuta1: this.recorrido.tiempoRuta1,
        ruta2: this.recorrido.ruta2,
        frecuenciaRuta2: this.recorrido.frecuenciaRuta2,
        preciosRuta2: this.recorrido.preciosRuta2,
        distParadaAbordaje2: this.recorrido.distParadaAbordaje2,
        tiempoRuta2: this.recorrido.tiempoRuta2,
        distPD: this.recorrido.distPD,
        tiempoTotal: this.recorrido.tiempoTotal,
        paradasRecorridoRuta1: this.recorrido.paradasRuta1,
        paradasRecorridoRuta2: this.recorrido.paradasRuta2
      }
    }
  },
  watch: {
    expanded (currentValue) {
      if (currentValue) {
        eventBus.$emit('closeOtherResults', this.id)
        eventBus.$emit('DrawRecorrido2', this.recorrido.paradasRuta1, this.recorrido.paradasRuta2)
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
