<template>
  <div>
    <q-item style="padding: 16px;">
      <q-item-section avatar>
        <q-icon
          name="eva-pin"
          size="32px"
          style="color: rgb(25, 103, 210);"
        />
      </q-item-section>

      <q-item-section top>
        <q-item-label
          lines="1"
          style="font-weight: 500;"
        >
          Parada de buses {{ parada.nombre }}
        </q-item-label>

        <q-item-label
          caption
          lines="1"
        >
          {{ parada.referencia }}, {{ parada.ciudad }}
        </q-item-label>

        <q-item-label
          caption
          lines="1"
          class="text-primary text-uppercase"
          style="margin-top: 16px; font-weight: 500;"
        >
          <span
            class="cursor-pointer"
            style="color: rgb(25, 103, 210);"
          >
            <router-link
              :to="{
                name: 'home-detalleparada',
                params: {
                  id: parada.id,
                  nombre: parada.nombre,
                  lat: parada.gps.latitude,
                  lon: parada.gps.longitude
                }
              }"
            >
              Ver en el mapa
            </router-link>
          </span>
        </q-item-label>
      </q-item-section>

      <q-item-section side>
        <div class="text-grey-8 q-gutter-xs">
          <q-btn
            flat
            dense
            round
            icon="eva-close-circle"
            size="12px"

            @click="mostrarModalEliminar(parada.id, parada.fotos)"
          >
            <q-tooltip> Eliminar </q-tooltip>
          </q-btn>

          <q-btn
            flat
            dense
            round
            icon="eva-edit"
            size="12px"

            @click="mostrarModalEditar(parada)"
          >
            <q-tooltip> Editar </q-tooltip>
          </q-btn>

          <q-btn
            flat
            dense
            round
            icon="eva-eye"
            size="12px"

            @click="mostrarModalVer(parada)"
          >
            <q-tooltip> Ver </q-tooltip>
          </q-btn>
        </div>
      </q-item-section>
    </q-item>

    <q-separator inset="item" />
  </div>
</template>

<script>
import eventBus from 'app/src/eventBus'

export default {
  name: 'ElementoLista',

  props: {
    parada: Object
  },

  methods: {
    mostrarModalVer (parada) {
      eventBus.$emit('mostrarModalVer', parada)
    },

    mostrarModalEditar (parada) {
      eventBus.$emit('mostrarModalEditar', parada)
    },

    mostrarModalEliminar (id, fotos) {
      eventBus.$emit('mostrarModalEliminar', id, fotos)
    }
  }
}
</script>
