<template>
    <q-card class="my-card">
        <q-card-section horizontal>
            <q-card-section>
                <q-item>
                    <q-item-section avatar>
                        <q-icon color="primary" name="watch_later" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Tiempo de recorrido</q-item-label>
                        <q-item-label caption>{{sentido.tiempo}}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item>
                    <q-item-section avatar>
                        <q-icon color="primary" name="departure_board" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Hora salida del primer bus</q-item-label>
                        <q-item-label caption>{{sentido.primerviaje}}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item>
                    <q-item-section avatar>
                        <q-icon color="primary" name="departure_board" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Hora salida del último bus</q-item-label>
                        <q-item-label caption>{{sentido.ultimoviaje}}</q-item-label>
                    </q-item-section>
                </q-item>
            </q-card-section>
        </q-card-section>
    </q-card>
</template>
<script>
export default {
  name: 'CardSentido',
  props: {
    sentido: Object
  }
}
</script>
