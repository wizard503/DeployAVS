<template>
  <div class="q-pa-md">
    <q-layout view="hHh lpR fFf">
      <q-header class="bg-primary">
        <q-toolbar>
          <router-link to="/admin" style="display: flex; align-items: center">
            <img src="~assets/LogoSite.png" class="q-mr-sm" alt="AVS logo"  style="width: 40px; height: 40px; margin-start: 16px;">
            <img src="~assets/AVS.png" alt="AVS logo"  style="width: 60px; height: 20px; margin-start: 8px;">
          </router-link>
          <q-space/>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="drawer"
        show-if-above
        :width="250"
        :breakpoint="400"
        side="right"
      >
        <q-scroll-area
          style="
            height: calc(100% - 180px);
            margin-top: 180px;
            border-right: 1px solid #ddd;
          "
        >
          <q-list padding>
            <div
              class="q-mb-lg"

              v-for="(option, index) in options"
              :key="index"
            >
              <q-item-label header>{{ option.title }}</q-item-label>

              <q-item
                v-for="(link, index) in option.links"
                :key="index"

                :to="link.href"
              >
                <q-item-section avatar top>
                  <q-avatar :icon="link.icon" color="primary" text-color="white" />
                </q-item-section>

                <q-item-section>
                  <q-item-label lines="1">{{ link.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <div
              class="q-mb-lg"
            >
              <q-item-label header>Sobre nosotros</q-item-label>

              <q-item href="https://website.atrasvasolo.com" target="_blank">
                <q-item-section avatar top>
                  <q-avatar icon="public" color="primary" text-color="white" />
                </q-item-section>

                <q-item-section>
                  <q-item-label lines="1">Sitio web</q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <div
              class="flex flex-center"

              style="margin-top: 100px;"
            >
              <q-btn
                outline
                rounded

                class="q-ma-md"

                color="primary"
                icon="logout"
                label="Cerrar sesión"

                style="width: 100%; height: 45px;"

                @click="onLogout()"
              />
            </div>
          </q-list>
        </q-scroll-area>

        <profileCard></profileCard>
      </q-drawer>

      <q-page-container>
        <router-view></router-view>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import profileCard from '../components/profileCard.vue'

import { mapActions } from 'vuex'

export default {
  components: { profileCard },

  data: () => ({
    drawer: false,

    options: [
      {
        title: 'Home',
        links: [
          { name: 'Inicio', href: '/', icon: 'home' }
        ]
      },
      {
        title: 'Administración',
        links: [
          { name: 'Paradas', href: '/admin/paradas', icon: 'directions_bus' },
          { name: 'Rutas', href: '/admin/rutas', icon: 'insights' },
          { name: 'Usuarios', href: '/admin/usuarios', icon: 'people_alt' },
          { name: 'Publicidad', href: '/admin/publicidad', icon: 'web_stories' }
        ]
      }
    ]
  }),

  methods: {
    ...mapActions('login', ['onLogout'])
  }
}
</script>
