<template>
  <div class="q-pa-md">
    <q-layout view="hHh lpR fFf">
      <q-header class="bg-primary">
        <q-toolbar>
          <router-link to="/" style="display: flex; align-items: center">
            <img src="~assets/LogoSite.png" class="q-mr-sm" alt="AVS logo"  style="width: 40px; height: 40px; margin-start: 16px;">
            <img src="~assets/AVS.png" alt="AVS logo"  style="width: 60px; height: 20px; margin-start: 8px;">
          </router-link>
          <q-space/>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" style="margin: 8px;" />
        </q-toolbar>
      </q-header>

      <q-footer class="footer" style="background-color: #6B7B8E;">
        <div class="navigation-container">
          <div class="navigation">
            <ul>
                <li class="list active" @click="navbarClickHandler($event)" ref="home">
                  <router-link :to="{name: 'home'}">
                    <a href="#">
                        <span class="icon">
                            <q-icon name="home"></q-icon>
                        </span>
                        <span class="text">home</span>
                    </a>
                  </router-link>
                </li>
                <li class="list" @click="navbarClickHandler($event)" ref="destinos">
                  <router-link :to="{name: 'home-destinos'}">
                    <a href="#">
                        <span class="icon">
                            <q-icon name="explore"></q-icon>
                        </span>
                        <span class="text">Destinos</span>
                    </a>
                  </router-link>
                </li>
                <li class="list" @click="navbarClickHandler($event)" ref="paradas">
                    <router-link :to="{name: 'home-paradas'}">
                    <a href="#">
                        <span class="icon">
                            <q-icon name="directions_bus"></q-icon>
                        </span>
                        <span class="text">Paradas</span>
                    </a>
                    </router-link>
                </li>
                <li class="list" @click="navbarClickHandler($event)" ref="rutas">
                  <router-link :to="{name: 'home-rutas'}">
                    <a href="#">
                        <span class="icon">
                            <q-icon name="insights"></q-icon>
                        </span>
                        <span class="text">Rutas</span>
                    </a>
                  </router-link>
                </li>
                <div class="indicator"></div>
            </ul>
          </div>
        </div>
      </q-footer>

      <q-drawer
        v-model="drawer"
        show-if-above
        :width="250"
        :breakpoint="400"
        side="right"
      >
        <profile-card></profile-card>

        <q-scroll-area
          style="
            height: calc(100% - 180px);
            margin-top: 180px;
            border-right: 1px solid #ddd;
          "
        >
          <q-list padding>
            <div
              style="margin-bottom: 12px;"

              v-for="(option, index) in options"
              :key="index"
            >
              <q-item-label header style="padding: 8px 16px 8px 16px;">{{ option.title }}</q-item-label>

              <q-item
                style="padding: 2px 16px;"

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
              style="margin-bottom: 8px;"

              v-if="getAuth.type === 'admin'"
            >
              <q-item-label header style="padding: 8px 16px 16px 16px;">Administración</q-item-label>

              <q-item
                to="/admin"

                style="padding: 8px 16px;"
              >
                <q-item-section avatar top>
                  <q-avatar icon="settings" color="primary" text-color="white" />
                </q-item-section>

                <q-item-section>
                  <q-item-label lines="1">Configuración</q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <div
              style="margin-bottom: 16px;"
            >
              <q-item-label header style="padding: 8px 16px 4px 16px;">Sobre nosotros</q-item-label>

              <q-item
                href="https://website.atrasvasolo.com"
                target="_blank"

                style="padding: 8px 16px;"
              >
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

              style="margin-top: 0px;"
            >
              <q-btn
                outline
                rounded

                class="q-ma-md"

                color="primary"
                icon="login"
                label="Iniciar sesión"

                style="width: 100%; height: 45px; margin: 16px;"

                v-if="getAuth.type === 'none'"

                @click="mostrarModalLogin()"
              />

              <q-btn
                outline
                rounded

                class="q-ma-md"

                color="primary"
                icon="logout"
                label="Cerrar sesión"

                style="width: 100%; height: 45px; margin: 16px;"

                v-else-if="getAuth.type !== 'none'"

                @click="onLogout()"
              />
            </div>

            <modal-login />
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <router-view></router-view>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import ModalLogin from '../components/modalLogin.vue'
import ProfileCard from '../components/profileCard.vue'

import { mapGetters, mapActions } from 'vuex'

import eventBus from '../eventBus'

export default {
  components: { ProfileCard, ModalLogin },

  data: () => ({
    drawer: false,

    show: false,

    options: [
      {
        title: 'Home',
        links: [
          { name: 'Inicio', href: '/', icon: 'home' }
        ]
      },
      {
        title: 'General',
        links: [
          { name: 'Destinos', href: '/destinos', icon: 'explore' },
          { name: 'Paradas', href: '/paradas', icon: 'directions_bus' },
          { name: 'Rutas', href: '/rutas', icon: 'insights' }
        ]
      }
    ]
  }),

  computed: {
    ...mapGetters('login', ['getAuth'])
  },

  methods: {
    ...mapActions('login', ['onLogout']),

    mostrarModalLogin () {
      eventBus.$emit('mostrarModalLogin')
    },

    navbarClickHandler (evt) {
      // funcion que maneja los clics en la navbar
      evt.stopPropagation()
      for (const u in this.$refs) {
        this.$refs[u].classList.remove('active')
      }
      evt.currentTarget.classList.toggle('active')
    },

    sidebarEventHandler (seccion) {
      // funcion que maneja los clicks en la sidebar, header y refresco de la pagina para mover el indicador de la navbar
      for (const u in this.$refs) {
        this.$refs[u].classList.remove('active')
      }
      this.$refs[seccion].classList.add('active')
    },

    navbarUpdater () {
      // esto hace que el indicador se mueva al icono correspondiente cuando se actualiza la pagina
      let actualRoute = String(this.$router.history.current.path)
      if (actualRoute === '/') {
        this.sidebarEventHandler('home')
      } else {
        actualRoute = actualRoute.split('/')[1]
        if (actualRoute === 'paradas' || actualRoute === 'rutas' || actualRoute === 'destinos') {
          this.sidebarEventHandler(actualRoute)
        } else {
          let pathCorregido = 'home'
          switch (actualRoute) {
            case 'detalleparada' :
              pathCorregido = 'paradas'
              break
            case 'detalleruta' :
              pathCorregido = 'rutas'
              break
            case 'destinodescripcion' :
              pathCorregido = 'destinos'
              break
            case 'destinodetalle' :
              pathCorregido = 'destinos'
              break
          }
          this.sidebarEventHandler(pathCorregido)
        }
      }
      // console.log('path = ', this.$router.history.current.path.split('/')[1])
    }
  },

  mounted () {
    this.navbarUpdater()
  },

  updated () {
    this.navbarUpdater()
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
}

.navigation-container{
  background-color: #8646f3;
  display: flex;
  justify-content: center;
}

.navigation {
  position: relative;
  width: 350px;
  height: 60px;
  background: #8646f3;
  display: flex;
  justify-content: center;
  align-items: space-between;
  border-radius: 10px;
}

.navigation ul {
  display: flex;
  width: auto;
  text-transform: capitalize;
}

.navigation ul li {
  position: relative;
  list-style: none;
  width: 70px;
  height: 60px;
  z-index: 2;
}

.navigation ul li a {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  text-align: center;
}

.navigation ul li a .icon {
  position: relative;
  display: block;
  line-height: 65px;
  font-size: 2.3em;
  transition: 0.5s;
  color: #222327;
}

.navigation ul li.active a .icon {
  transform: translateY(-35px);
  color: #FFFFFF;
}

.navigation ul li a .text {
  position: absolute;
  color: #fff;
  font-weight: 400;
  font-size: 1.1em;
  letter-spacing: 0.03em;
  transition: 0.5s;
  opacity: 0;
  transform: translateY(15px);
  background: #800080;
  padding: 2px 7px;
  border-radius: 12px;
}

.navigation ul li.active a .text {
  transform: translateY(-1px);
  opacity: 1;
}

.indicator {
  position: absolute;
  top: -35px;
  width: 70px;
  height: 70px;
  background: #8646f3;
  border-radius: 50%;
  z-index: 1;
  transition: 0.5s;
}

.indicator::before {
  content: "";
  position: absolute;
  top: 5px;
  left: -28px;
  width: 30px;
  height: 30px;
  background: transparent;
  border-radius: 50%;
  box-shadow: 15px 18px #8646f3;
}

.indicator::after {
  content: "";
  position: absolute;
  top: 5px;
  right: -28px;
  width: 30px;
  height: 30px;
  background: transparent;
  border-radius: 50%;
  box-shadow: -15px 18px #8646f3;
}

.navigation ul li:nth-child(1).active ~ .indicator {
transform: translateX(calc(70px * 0));
}

.navigation ul li:nth-child(2).active ~ .indicator {
  transform: translateX(calc(70px * 1));
}

.navigation ul li:nth-child(3).active ~ .indicator {
  transform: translateX(calc(70px * 2));
}

.navigation ul li:nth-child(4).active ~ .indicator {
  transform: translateX(calc(70px * 3));
}
.navigation ul li:nth-child(5).active ~ .indicator {
  transform: translateX(calc(70px * 4));
}

.footer-height {
  height: 75px;
}

.posIcon {
  padding-bottom: 300px;
}
</style>
