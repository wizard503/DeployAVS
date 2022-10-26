<template>
  <q-page padding>
    <h4>Editar Usuario</h4>

    <q-intersection>
      <q-item class="row q-col-gutter-lg-md">
        <div class="col-12 col-sm-10">
          <q-input v-model="editUsers.nombre" label="Nombre" lazy-rules
        :rules="[ val => val && val.length > 0 || 'Este campo no puede quedar vacìo']"/>
        </div>
      </q-item>
    </q-intersection>

    <q-intersection>
      <q-item class="row q-col-gutter-lg-md">
        <div class="col-12 col-sm-10">
          <q-input v-model="editUsers.apellido" label="Apellido" lazy-rules
        :rules="[ val => val && val.length > 0 || 'Este campo no puede quedar vacìo']"/>
        </div>
      </q-item>
    </q-intersection>

    <q-intersection>
      <q-item class="row q-col-gutter-lg-md">
        <div class="col-12 col-sm-10">
          <q-input v-model="editUsers.email" filled type="email" label="E-mail" lazy-rules
          :rules="[ val => val && val.length > 0 || 'Ingrese un correo valido', isValidEmail]"/>
        </div>
      </q-item>
    </q-intersection>

     <q-intersection>
      <q-item class="row q-col-gutter-lg-md">
        <div class="col-12 col-sm-10">
           <q-select v-model="editUsers.tipo" :options="options" label="tipo de usuario" />
        </div>
      </q-item>
    </q-intersection>

  <div align="right">
    <q-btn to="/admin/usuarios" v-close-popup label="Cancelar" color="primary" flat icon="cancel" />
    <q-btn to="/admin/usuarios" @click="updateUser" label="Actualizar" color="primary" flat icon="check" />
    </div>

  </q-page>
</template>

<script>
import { db } from '../boot/db'

export default {
  data () {
    return {
      options: [
        'ADMINISTRADOR', 'COLABORADOR'
      ],
      editUsers: {}
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
    agregar () {
      const nuevo = {
        nombre: this.nombre,
        apellido: this.apellido,
        email: this.email,
        tipo: this.tipo
      }
      db.collection('administradores').add(nuevo)
      this.email = ''
      this.nombre = ''
      this.apellido = ''
      this.tipo = ''
    },
    updateUser () {
      db.collection('administradores').doc(this.$route.params.id)
        .set(this.editUsers).then(() => {
          console.log('actualizado')
        }).catch((error) => {
          console.log(error)
        })
      this.$router.push({ name: 'admin-usuarios' })
    },
    infoUser (id) {
      const docRef = db.collection('administradores').doc(id)

      docRef.get().then((doc) => {
        if (doc.exists) {
          // console.log('Document data:', doc.data())
          this.editUsers = doc.data()
          // console.log(this.editUsers.nombre)
        } else {
        // doc.data() will be undefined in this case
          console.log('El usuario no existe')
        }
      }).catch((error) => {
        console.log('Error getting document:', error)
      })
      console.log(id)
    },
    isValidEmail (val) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
      return emailPattern.test(val) || 'Ingrese un correo valido'
    }
  }
}
</script>
