<template>
  <div>
    <!-- Delete Confirmation -->
    <q-dialog v-model="estado" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar size="md" icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">Se perderán todos los datos de esta ruta.</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn dense label="Cancel" color="dark" v-close-popup />
          <q-btn dense label="Delete" color="dark" v-close-popup @click="eliminar()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Ruta -->
    <q-item >
      <q-item-section top avatar>
            <q-avatar color="dark" text-color="white" icon="fas fa-bus" />
      </q-item-section>
       <q-item-section top>
        <q-item-label
          lines="1"
          style="font-weight: 500;"
        >
          Ruta {{ ruta.nombre }}
        </q-item-label>

        <q-item-label
          caption
          lines="1"
        >
          Ida: {{ruta.ida.nombre}}
        </q-item-label>
        <q-item-label
          caption
          lines="1"
        >
          Vuelta: {{ruta.vuelta.nombre}}
        </q-item-label>
      </q-item-section>

      <q-item-section side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn  size="14px" flat dense round icon="delete" v-model="estado" @click="showAdvertencia()">
                <q-tooltip content-class="bg-accent">Borrar</q-tooltip>
            </q-btn>
            <q-btn  size="14px" flat dense round icon="ion-create" @click="showEditRuta(ruta)">
                <q-tooltip content-class="bg-accent">Editar-</q-tooltip>
            </q-btn>
          </div>
        </q-item-section>

    </q-item>

    <q-separator inset="item" />
  </div>
</template>

<script>
import eventBus from 'app/src/eventBus'
import { db, storage } from 'app/src/boot/db'

export default {
  name: 'itemRuta',
  data: () => ({
    estado: false
  }),
  props: {
    ruta: Object
  },
  methods: {
    showAdvertencia () {
      this.estado = true
    },
    eliminar () {
      this.ruta.fotos.forEach((url) => {
        storage.refFromURL(url).delete()
      })
      db.collection('rutas').doc(this.ruta.id).delete()
    },
    showEditRuta (ruta) {
      eventBus.$emit('showEditRuta', ruta)
    }
  }
}
</script>
