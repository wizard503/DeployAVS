<template>
    <div>
        <div class="q-pa-md row items-start q-gutter-md">

    <q-card class="my-card">
    <q-img src="https://i0.wp.com/diariolahuella.com/wp-content/uploads/2020/11/La-Mila.jpg?fit=1200%2C675ssl=1"/>

    <q-card-section>
        <q-btn
        fab
        color="primary"
        icon="place"
        class="absolute"
        style="top: 0; right: 12px; transform: translateY(-50%);"
        />

    <div class="row no-wrap items-center">
        <div class="col text-h6 ellipsis">
            Parada
        </div>
        <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
            <q-icon name="place" />
            250 ft
        </div>
    </div>

        <q-rating v-model="stars" :max="5" size="32px" />
    </q-card-section>

    <q-card-section class="q-pt-none">
        <div class="text-subtitle1">
            $・Italian, Cafe
        </div>
        <div class="text-caption text-grey">
            Small plates, salads & sandwiches in an intimate setting.
        </div>
    </q-card-section>

    <q-separator />

        <q-card-actions>
            <q-btn flat round icon="event" />
            <q-btn flat color="primary">
                Reserve
            </q-btn>
        </q-card-actions>
    </q-card>
    </div>
        <PublicidadLista/>
    </div>
</template>

<script>
import PublicidadLista from 'app/src/components/administracionParadas/publicidadLista.vue'

export default {
  components: { PublicidadLista }
}
</script>

<style>
.boxcolor{
    background: rgba( 255, 255, 255, 0.25 );
    box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
    backdrop-filter: blur( 4px );
    -webkit-backdrop-filter: blur( 4px );
    border-radius: 30px;
    }

    #detalle-container{
        top: -20px;
        height: 200px;
        margin-top: 40px;
        position: relative;
        border-radius: 5px;
        background: white;
    }
    #detalle-titulo{
        text-align: center;
    }
    #tamanio-titulo {
        margin-top: 0px;
        margin-bottom: 15px;
    }
    #descripcion{
        display: flex;
    }
</style>
