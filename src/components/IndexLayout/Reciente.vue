<template>
    <div class="row">
      <span class="recienteSt">Recientes</span>
      <div class="col-12 recSt">
        <q-list bordered class="rounded-borders">

        <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label lines="1">INSA CALLE PTE</q-item-label>
          <q-item-label caption lines="2">

          </q-item-label>
        </q-item-section>

        <q-item-section side top>
          1 min ago
        </q-item-section>
      </q-item>

      <q-separator inset="item" />

      <q-item clickable v-ripple>

        <q-item-section>
          <q-item-label lines="1">UES</q-item-label>
          <q-item-label caption lines="2">

          </q-item-label>
        </q-item-section>

        <q-item-section side top>
          1 min ago
        </q-item-section>
      </q-item>
      <q-separator inset="item" />

      <q-item clickable v-ripple>

        <q-item-section>
          <q-item-label lines="1">INSA CALLE PTE</q-item-label>
          <q-item-label caption lines="2">

          </q-item-label>
        </q-item-section>

        <q-item-section side top>
          5 min ago
        </q-item-section>
      </q-item>
    </q-list>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Reciente'
}
</script>

<style scoped>
    .recSt{
        border: 1px solid black;
        margin-top: 5px;
    }
    .recienteSt{
        font-size: 15px;
    }
</style>
