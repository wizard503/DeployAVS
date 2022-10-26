<template>
  <q-dialog v-model="estado">
    <q-card style="width: 400px; max-width: 90vw; border-radius: 16px;">
      <q-card-section style="padding: 24px; background-color: rgb(134, 70, 243);">
        <div
          class="text-h6 flex items-center"
          style="color: rgb(255, 255, 255);"
        >
          Iniciar sesión
        </div>
      </q-card-section>

      <q-card-section style="margin: 32px 0px;">
        <div class="flex flex-center">
          <img
            src="../assets/LogoSite.png"
            alt="AVS logo"

            style="width: 70%;"
          >
        </div>
      </q-card-section>

      <q-card-section style="margin-bottom: 16px;">
        <div class="flex flex-center">
          <q-btn
            outline
            rounded

            class="q-ma-md flex items-center"

            color="primary"

            style="width: 100%; height: 45px; margin: 16px;"

            @click="onSubmit()"
          >
            <img
              src="https://bit.ly/3MeAxja"
              alt="Google icon"

              style="width: 30px;"
            />

            <span class="q-ml-sm">Google account</span>
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
  </template>

<script>
import { mapActions } from 'vuex'

import eventBus from '../eventBus'

export default {
  name: 'ModalLogin',

  data: () => ({
    estado: false
  }),

  methods: {
    ...mapActions('login', ['doLogin']),

    onSubmit () {
      this.doLogin()

      this.estado = false
    }
  },

  created () {
    eventBus.$on('mostrarModalLogin', () => {
      this.estado = true
    })
  }
}
</script>
