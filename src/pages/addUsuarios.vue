<template>
  <q-page padding>
    <h4>Agregar Usuario</h4>
    <q-intersection>
      <q-item class="row q-col-gutter-lg-md">
        <div class="col-12 col-sm-10">
          <q-input v-model="nombre" filled label="Nombre" hint="ingrese nombre" lazy-rules
        :rules="[ val => val && val.length > 0 || 'Este campo no puede quedar vacìo']"/>
        </div>
      </q-item>
    </q-intersection>

    <q-intersection>
      <q-item class="row q-col-gutter-lg-md">
        <div class="col-12 col-sm-10">
          <q-input v-model="apellido" filled label="Apellido" hint="ingrese apellido" lazy-rules
        :rules="[ val => val && val.length > 0 || 'Este campo no puede quedar vacìo']"/>
        </div>
      </q-item>
    </q-intersection>

    <q-intersection>
      <q-item class="row q-col-gutter-lg-md">
        <div class="col-12 col-sm-10">
          <q-input v-model="email" filled type="email" label="E-mail" hint="ingrese email" lazy-rules
          :rules="[ val => val && val.length > 0 || 'Ingrese un correo valido', isValidEmail]"/>
        </div>
      </q-item>
    </q-intersection>

    <!-- Opcion para seleccionar usuario es colaborador o admin -->
    <q-intersection>
      <q-item>
        <div class="col-12 col-sm-10">
          <q-select
                filled
                v-model="tipo"
                :options="options"
                stack-label
                label="Tipo de usuario"
                :display-value="`${tipo ? tipo : 'Seleccione un tipo de Usuario'}`"
              >
                <template v-slot:append>
                  <q-icon
                    v-if="tipo !== null"
                    class="cursor-pointer"
                    name="clear"
                    @click.stop="tipo = null"
                  />
                </template>
          </q-select>
        </div>
      </q-item>
    </q-intersection>

  <div align="right">
    <q-btn to="/admin/usuarios" v-close-popup label="Cancelar" color="primary" flat icon="cancel" />
    <q-btn to="/admin/usuarios" @click="agregar" label="Guardar" color="primary" flat icon="check" type="submit" :disabled="!registerValid"/>
    </div>
  </q-page>
</template>

<script>
import { db } from '../boot/db'

export default {
  data () {
    return {
      nombre: '',
      apellido: '',
      email: '',
      tipo: '',
      options: [
        'ADMINISTRADOR', 'COLABORADOR'
      ]
    }
  },
  methods: {
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
    isValidEmail (val) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
      return emailPattern.test(val) || 'Ingrese un correo valido'
    }
  },
  computed: {
    registerValid () {
      if (this.nombre === '' || this.apellido === '' || this.email === '' || this.tipo === '') {
        return false
      } else {
        return true
      }
    }
  }
}
</script>
