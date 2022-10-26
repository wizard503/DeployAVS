<template>
  <q-layout view="lHh Lpr lff">
    <!-- Encabezado + btn "Agregar" -->
    <div class="q-pa-lg doc-container">
      <div class="row justify-center">
        <div id="box" class="row-12 col-sm-4">
          <span id="text" class="text-weight-bolder text-h5">Administración de los Usuarios</span>
        </div>
        <div class="row-sm-2">
          <div id="agregar" class="col" text-xs-right>
            <q-btn clickable v-ripple to="/admin/addusuario" label="Agregar" name="btnAgregar" color="primary"
              icon="class">
            </q-btn>
          </div>
        </div>
      </div>
    </div>

    <!-- Titulo "Usuarios colaboradores" + buscador -->

    <div class="row">
      <div class="col">
        <q-item-section avatar id="avatar">
          <q-icon name="manage_accounts" color="black" />
        </q-item-section>
      </div>
    </div>
    <div class="row" >
      <div class="col col-xs-6 col-md-9 col-sm-6" id="box1">
        <q-item-section>
          <span class="text-weight-bolder text-h6" id="text0">Usuarios agregados al sitio</span>
        </q-item-section>
      </div>
      <div class="col-6 col-xs-6 col-md-3 col-sm-6" id="box2">
        <q-item-section side>
          <q-input id="search" filled placeholder="Buscar usuario" v-model="cadena">
            <template v-slot:append>
              <q-icon name="person_search" />
            </template>
          </q-input>
          <!--boton buscar-->
          <q-btn class="buscar" label="Buscar" name="btnBuscar" color="primary" @click="filterUsers()">
          </q-btn>
          <!--boton limpiar-->
          <q-btn class="limpiar" label="Limpiar" name="btnLimpiar" color="primary" @click="clearSearch()"></q-btn>
        </q-item-section>
      </div>
    </div>

    <!-- Nombre de usuarios + opciones "ver" "borrar" "editar" -->

    <div class="q-pa-md" id="lista">
      <q-intersection>
        <q-item v-for="(administrador, index) in administradores" :key="index">
          <q-item-section avatar>
            <q-icon name="perm_identity" color="black" />
          </q-item-section>
          <q-item-section>
            <q-item-label> {{ administrador.nombre }} {{ administrador.apellido }} </q-item-label>
            <q-item-label caption> {{ administrador.tipo }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="text-grey-8 q-gutter-xs">

              <!-- VER -->
              <q-btn size="14px" flat dense round icon="preview" clickable v-ripple :to="`/admin/verUsuario/${administrador.id}`">
                <q-tooltip content-class="bg-indigo">Ver</q-tooltip>
              </q-btn>

              <!-- ELIMINAR -->

              <q-btn @click="eliminar(administrador.id)" size="14px" flat dense round icon="person_remove">
                <q-tooltip content-class="bg-negative">Borrar</q-tooltip>
              </q-btn>

              <!-- EDITAR -->
              <q-btn size="14px" flat dense round icon="draw" :to="`/admin/editUser/${administrador.id}`">
                <q-tooltip content-class="bg-indigo">Editar</q-tooltip>
              </q-btn>

              <!--
              <q-dialog v-model="vermod" v-if="unicoUser != null">
                <q-card>
                  <q-card-section>
                    <div class="text-h6">Usuario</div>
                  </q-card-section>
                  <q-card-section>
                    <q-item-label> Usuario: {{ unicoUser.data.nombre }} {{ unicoUser.data.apellido }}</q-item-label>
                  </q-card-section>
                  <q-card-section>
                   <q-item-label> Correo: {{ unicoUser.data.email }} </q-item-label>
                  </q-card-section>
                  <q-card-section>
                    <q-item-label> Tipo: {{ unicoUser.data.tipo }} </q-item-label>
                  </q-card-section>
                  <q-card-actions align="right">
                    <q-btn flat label="Aceptar" color="primary" v-close-popup />
                  </q-card-actions>
                </q-card>
              </q-dialog>
              <div v-if="unicoUser != null">
              </div>
              -->
            </div>
          </q-item-section>
        </q-item>
      </q-intersection>
    </div>
  </q-layout>
</template>

<script>
import { db } from '../boot/db'
// import InfoUsuario from './InfoUsuario.vue'

export default {
  name: 'administrarUsuarios',
  components: {},
  data () {
    return {
      administradores: [],
      eliminar1: false,
      vermod: false,
      adminSearch: [],
      cadena: '',
      unicoUser: null
    }
  },
  methods: {
    eliminar (id) {
      if (confirm('Esta seguro de borrar el usuario ')) {
        console.log(id)
        db.collection('administradores').doc(id).delete()
        this.$q.notify({ message: 'usuario eliminado' })
      }
    },
    editar (id, nombre, apellido, tipo) {
      document.getElementById('nombre').value = nombre
    },
    // metodo para buscar usuarios
    filterUsers () {
      if (this.adminSearch.length === 0) {
        this.adminSearch = this.administradores.slice()
      } else {
        this.administradores = this.adminSearch.slice()
      }
      this.administradores = this.administradores.filter((item) => {
        const x = item.nombre.toLowerCase().indexOf(this.cadena.toLowerCase())
        return (x >= 0)
      })
    },
    // metodo para limpiar la busqueda
    clearSearch () {
      if (this.adminSearch.length > 0) {
        this.administradores = this.adminSearch.slice()
      }
      this.cadena = ''
    },
    infoUser (id) {
      /*
      this.administradores.doc(id)
        .get()
        .then(y => {
          this.unicoUser = {
            id: y.id,
            data: y.data()
          }
        })
      console.log(id)
      */
      const docRef = db.collection('administradores').doc(id)

      docRef.get().then((doc) => {
        if (doc.exists) {
          console.log('Document data:', doc.data())
          this.unicoUser = {
            id: doc.id,
            data: doc.data()
          }
          console.log(this.unicoUser.data.nombre)
        } else {
        // doc.data() will be undefined in this case
          console.log('El usuario no existe')
        }
      }).catch((error) => {
        console.log('Error getting document:', error)
      })
      console.log(id)
    }
  },
  firestore: {
    administradores: db.collection('administradores')
  }
}
</script>
<style>
.buscar {
  position: relative;
  top: 36px;
  right: 100px;
}

#agregar {
  padding-left: 40px;
}
@media screen and (max-width: 600px) {
  .doc-container{
    padding: 0%;
  }

  #agregar {
    padding: 0%;
    padding-top: 15px;
  }

  #search {
    position: relative;
  }
  #avatar {
    padding-top: 20px;
    padding-left: 50px;
  }

  #box1 {
    position: relative;
    bottom: 20%;
  }

  #box2 {
    position: relative;
    top: 40px;
    right: 25%;
    padding-bottom: 0%;
  }

  #text0 {
    position: relative;
    padding: 0%;
    bottom: 25px;
    left: 50px;
    width: 300px;
    font-size: 18px;
    padding-left: 40px;
  }

  #text {
    position: relative;
    padding: 0%;
    font-size: 22px;
  }

  #buscar {
    position: relative;
  }

  #lista {
    padding-top: 20%;
  }

  .buscar {
    position: relative;
    top: 36px;
    right: 15%;
  }

  .limpiar {
    position: relative;
    left: 60%;
  }
}
</style>
