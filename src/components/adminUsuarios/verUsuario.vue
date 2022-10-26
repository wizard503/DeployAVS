<template>
  <q-page padding>
    <q-intersection>
      <div class="q-pa-lg doc-container">
        <div class="row justify-center">
          <div class="row-sm-2">
            <span id="text" class="text-weight-bolder text-h5">Usuario {{ verUser.tipo }}</span>
          </div>
        </div>
      </div>
    </q-intersection>

    <q-intersection>
      <q-item class="row q-col-gutter-lg-md">
        <div class="col-12 col-sm-10">
          Nombre:
          <q-input disable v-model="verUser.nombre" filled type="nombre">
            <template v-slot:before>
              <q-icon name="account_circle" />
            </template>
          </q-input>
        </div>
      </q-item>
    </q-intersection>

    <q-intersection>
      <q-item class="row q-col-gutter-lg-md">
        <div class="col-12 col-sm-10">
          Apellido:
          <q-input disable v-model="verUser.apellido" filled type="apellido">
            <template v-slot:before>
              <q-icon name="account_circle" />
            </template>
          </q-input>
        </div>
      </q-item>
    </q-intersection>

    <q-intersection>
      <q-item class="row q-col-gutter-lg-md">
        <div class="col-12 col-sm-10">
          Correo Electronico:
          <q-input disable v-model="verUser.email" filled type="email">
            <template v-slot:before>
              <q-icon name="email" />
            </template>
          </q-input>
        </div>
      </q-item>
    </q-intersection>

    <q-intersection>
      <q-item class="row q-col-gutter-lg-md">
        <div class="col-12 col-sm-10">
          Tipo de usuario:
          <q-input disable v-model="verUser.tipo" filled type="tipo">
            <template v-slot:before>
              <q-icon name="contact_mail" />
            </template>
          </q-input>
        </div>
      </q-item>
    </q-intersection>

    <q-separator inset />
    <div></div>
    <q-separator inset />
    <div></div>
    <q-intersection>
      <div class="q-pa-lg doc-container">
        <div class="row justify-center">
          <div class="row-sm-2">
            <div id="regresar" class="col" text-xs-right>
              <q-btn clickable v-ripple to="/admin/usuarios" label="Volver a la lista de usuarios" name="regresar"
                color="primary" icon="groups">
              </q-btn>
            </div>
          </div>
        </div>
      </div>
    </q-intersection>

  </q-page>
</template>

<script>
import { db } from 'app/src/boot/db'

export default {
  data () {
    return {
      verUser: {}
    }
  },
  mounted () {
    this.getUser()
  },
  methods: {
    async getUser () {
      console.log(this.$route.params.id)
      const id = this.$route.params.id
      this.infoUser(id)
    },
    infoUser (id) {
      const docRef = db.collection('administradores').doc(id)

      docRef.get().then((doc) => {
        if (doc.exists) {
          // console.log('Document data:', doc.data())
          this.verUser = doc.data()
          // console.log(this.verUser.nombre)
        } else {
          // doc.data() will be undefined in this case
          console.log('El usuario no existe')
        }
      }).catch((error) => {
        console.log('Error getting document:', error)
      })
      console.log(id)
    }
  }
}
</script>
