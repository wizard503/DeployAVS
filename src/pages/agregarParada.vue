<template>
  <q-page>
   <template>
      <div class="justify-center full-height full-width text-center">
        <span class="text-h5 text-weight-bold text-uppercase">Agregar Paradas</span>
      </div>
      <div class="row">
        <div class="flex-break col" style="max-width: 600px">
          <div class="q-pa-md">
            <div class="q-gutter-md">
              <q-input outlined label="Nombre de la Parada" />
              <q-input outlined label="Direccion" />
              <q-input outlined label="Referencias Cercanas" />
              <q-input outlined disable label="Localizacion" >
                <template v-slot:prepend>
                  <q-icon name="place" />
                </template>
              </q-input>
              <div>
                <q-file outlined v-model= "files" label="Agregar Fotografias" counter max-files="3"
                  filled
                  multiple>
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                </q-file>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-break">
          <div class="q-pa-md">
            <div class="q-gutter-md">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30973.531777352866!2d-89.58187661157528!3d13.976961155279884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f62e8a88f74c611%3A0x334dedcda18267cd!2sSanta%20Ana!5e0!3m2!1ses-419!2ssv!4v1648190283840!5m2!1ses-419!2ssv" width="350" height="350" style="border:1;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>
        </div>
      </div>
      <div class="justify-center full-height full-width text-center">
        <q-btn style="margin: 15px" color="white" text-color="black" label="Cancelar" />
        <q-btn color="white" text-color="black" label="Guardar" />
      </div>
    </template>
  </q-page>
</template>

<script>
export default {
  name: 'agregarParada'
}
</script>
