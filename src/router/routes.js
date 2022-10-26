const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('app/src/pages/Index.vue')
      },
      {
        path: '/destinos',
        name: 'home-destinos',
        component: () => import('app/src/pages/destinos/destinos.vue')
      },
      {
        path: '/rutas',
        name: 'home-rutas',
        component: () => import('pages/rutas.vue')
      },
      {
        path: '/paradas',
        name: 'home-paradas',
        component: () => import('pages/paradas.vue')
      },
      {
        path: '/detalleparada/:id/:nombre/:lat/:lon',
        name: 'home-detalleparada',
        component: () => import('pages/detalleParada.vue')
      },
      {
        path: '/detalleruta/:id',
        name: 'home-detalleruta',
        component: () => import('pages/detalleRuta.vue')
      },
      {
        path: '/destinodescripcion',
        name: 'descripcion-destino',
        component: () => import('pages/destinos/destinoDescripcion.vue')
      },
      {
        path: '/destinodetalle',
        name: 'detalle-destino',
        component: () => import('pages/destinos/destinoDetalle.vue')
      }
    ]
  },

  {
    path: '/admin',
    name: 'admin',
    component: () => import('app/src/layouts/AdminLayout.vue'),
    meta: { type: 'admin' },
    children: [
      {
        path: '/admin/paradas',
        name: 'admin-paradas',
        component: () => import('pages/administrarParadas.vue'),
        meta: { type: 'admin' }
      },
      {
        path: '/admin/agregar-parada',
        name: 'agregar-parada',
        component: () => import('pages/agregarParada.vue'),
        meta: { type: 'admin' }
      },
      {
        path: '/admin/ver-parada',
        name: 'ver-parada',
        component: () => import('pages/verParada.vue'),
        meta: { type: 'admin' }
      },
      {
        path: '/admin/rutas',
        name: 'admin-ruta',
        component: () => import('pages/administrarRutas.vue'),
        meta: { type: 'admin' }
      },
      {
        path: '/admin/usuarios',
        name: 'admin-usuarios',
        component: () => import('pages/administrarUsuarios.vue'),
        meta: { type: 'admin' }
      },
      {
        path: '/admin/addusuario',
        name: 'admin-addusuario',
        component: () => import('pages/addUsuarios.vue'),
        meta: { type: 'admin' }
      },
      {
        path: '/admin/editUser/:id',
        name: 'admin-edit',
        component: () => import('../components/EditUser.vue'),
        meta: { type: 'admin' }
      },
      {
        path: '/admin/verUsuario/:id',
        name: 'admin-verusuario',
        component: () => import('../components/adminUsuarios/verUsuario.vue'),
        meta: { type: 'admin' }
      },
      {
        path: '/admin/addruta',
        name: 'admin-addruta',
        component: () => import('pages/addRutas.vue'),
        meta: { type: 'admin' }
      },
      {
        path: '/admin/publicidad',
        name: 'admin-publicidad',
        component: () => import('pages/administrarPublicidad.vue'),
        meta: { type: 'admin' }
      }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
