import VueAnalytics from 'vue-analytics'

export default async ({ Vue, router }) => {
  Vue.use(VueAnalytics, {
    id: 'UA-245739491-1',
    router
  })
}
