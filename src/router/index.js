import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import { firestorePlugin } from 'vuefire'
import { loadScript } from 'esri-loader'

Vue.use(VueRouter)
Vue.use(firestorePlugin)

const options = {
  url: 'https://js.arcgis.com/4.4/'
}
loadScript(options)
export const nuevoBus = new Vue()
export const busStepper = new Vue()
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function ({ store, ssrContext }) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeEach((to, from, next) => {
    const toAdmin = to.matched.some((record) => record.meta.type === 'admin')

    const auth = store.getters['login/getAuth']

    if (toAdmin) {
      if (auth.type === 'admin') {
        next()
      } else {
        next('/admin')
      }
    } else {
      next()
    }
  })

  return Router
}
