<template>
  <q-img class="absolute-top" src="https://bit.ly/3dY70O9" style="height: 175px">
    <div class="absolute-bottom bg-transparent">
      <q-avatar size="60px" class="q-mb-sm">
        <img :src="getAuth.photoURL">
      </q-avatar>
      <div class="text-weight-bold">{{ getAuth.name }}</div>
      <div>{{ getAuth.username }}</div>
    </div>
  </q-img>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'profilecard',

  data: () => ({ }),

  computed: {
    ...mapGetters('login', ['getAuth'])
  },

  methods: {
    ...mapActions('login', ['getActiveAuth'])
  }
}
</script>
