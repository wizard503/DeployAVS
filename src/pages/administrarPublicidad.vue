<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col"></div>
      <div align="center" class="col-10 col-xs-12">
        <span class="text-weight-bolder text-h5"
          >Administración Publicitaria</span
        >
      </div>
    </div>

    <div class="q-pa-sm doc-container"></div>
    <q-btn label="Agregar Anuncio" color="primary" @click="inception = true" id="boton"/>
    <div class="q-pa-xs">
      <q-dialog v-model="inception" persistent id="dialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Agregar nuevo anuncio</div>
        </q-card-section>

        <q-card-section class="q-pt-none" id="form">
          <q-form>
            <div class="q-my-md">
                <q-input v-model="nameanuncio" label="Nombre del Anuncio" stack-label :dense="dense" :rules="[ val => val && val.length > 0 || 'Campo requerido']"/>
            </div>
            <div class="q-my-md">
                <q-input v-model="proveedor" label="Proveedor del anuncio" stack-label :rules="[ val => val && val.length > 0 || 'Campo requerido']" :dense="dense" />
            </div>
            <div class="q-my-md">
                <q-file filled bottom-slots v-model="imganuncio" label="seleccionar archivo"  counter :rules="val => { file = val[0] }">
                    <template v-slot:prepend>
                        <q-icon name="cloud_upload" @click.stop></q-icon>
                    </template>
                    <template v-slot:append>
                        <q-icon name="close" @click.stop="imganuncio= null" class="cursor-pointer"></q-icon>
                    </template>
                </q-file>
            </div>

      </q-form>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn color="primary" label="Aceptar" @click="crearAnuncio()"/>
          <q-btn color="red" label="Cancelar" @click="onReset()" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    </div>
    <div class="q-pa-sm doc-container"></div>
    <span
      >Recuerde la resolucion adecuada para la publicidad debe ser de
      150x700!</span
    >
    <div class="col d-flex justify-center">
      {{cargaranuncios}}
    <div class="col" >
        <div class="row q-pa-md row justify-center q-gutter-md">
            <!-- aqui se muestran los anuncios activos en cards-->
            <q-card v-for="(anuncio, i) in anuncios" :key="i" :name="i" class="my-card" flat bordered>
                <q-card-section horizontal>
                    <q-img class="col" :src="anuncio.imagenanuncio" style="height: 150px">
                        <div class="absolute-bottom" style="opacity: 70%;color:white;-webkit-text-stroke: 1px white;">
                            <div class="text-left text-caption text-weight-thin"> {{anuncio.nombre}} by {{anuncio.anunciante}} </div>
                        </div>

                    </q-img>
                    <q-card-actions vertical class="justify-around q-px-md">
                        <q-btn flat round color="red" icon="delete" @click="eliminarAnuncio(anuncio.id)" />

                    </q-card-actions>
                </q-card-section>
            </q-card>
        </div>

    </div>
  </div>
  </div>
</template>

<script>
import { db, storage } from '../boot/db.js'
const ref = storage.ref()

export default {
  name: 'NuevoAnuncio',
  data () {
    return {
      inception: false,
      img: '',
      nameanuncio: '',
      dense: false,
      imganuncio: null,
      proveedor: '',
      anuncios: []
    }
  },
  firestore: {
    anuncios: db.collection('anuncios')
  },
  methods: {
    async crearAnuncio () {
      const idgenerado = await db.collection('anuncios').add({
        anunciante: this.proveedor,
        imganuncio: 'imagen',
        nombre: this.nameanuncio
      })
      let imgurl = ''
      const fileName = `anuncios/${idgenerado.id}/${idgenerado.id}-image.jpg`
      imgurl = (await (await storage.ref(fileName).put(this.imganuncio)).ref.getDownloadURL())
      db.collection('anuncios').doc(idgenerado.id).update({ imganuncio: imgurl })
      this.$q.notify({ message: 'Anuncio agregado correctamente' })
      this.onReset()
    },
    onReset () {
      this.img = ''
      this.nameanuncio = ''
      this.dense = false
      this.imganuncio = null
      this.proveedor = ''
      this.inception = 'v-close-popup'
    },
    eliminarAnuncio (i) {
      ref.child('/anuncios/' + i + '/' + i + '-image.jpg').delete()
      db.collection('anuncios').doc(i).delete()
      this.$q.notify({ message: 'Anuncio eliminado con exito' })
    }
  },
  watch: {
    cargaranuncios () {
      this.anunciosactivos = this.anuncios
    }
  }
}
</script>

<style>
#form{
  width: 300px;
  height: 250px;
}
.my-card{
  width: 100%;
  max-width: 950px;
  }

@media screen and (max-width: 600px) {
  #boton{
    margin-left: 20%;
  }
}
</style>
