<template>
 <div class="q-pa-md" style="z-index=999; ">
      <q-header  color="primary" style="width: calc(100% - 37px);">
        <!--bg-cyan-10-->
        <q-toolbar class="header ">
          <q-btn @click="regresar()"
          flat rounded color="white" icon="arrow_back_ios"/>
          <p style="width:100%; text-align:center; font-weight:500; font-size:1.3rem; vertical-align:center; margin-top:2px; margin-right: calc(37px / 2);">{{title}}</p>
        </q-toolbar>
      </q-header>
 </div>
</template>
<script>
export default {
  name: 'NavbarLogo',
  props: {
    title: String
  },
  methods: {
    regresar () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.header-logo-a{
     width: 50px;
     height: 50px;
     margin: 5px;
}

.header-logo-avs{
  width: 75px;
  height: 25px
}
a{
  text-decoration: none;

}
.header{
  height:50px}

@media only screen and (max-width: 900px) {
  .header-logo-a{
     width: 40px;
     height: 40px;
     margin: 5px;
}

.header-logo-avs{
  width: 55px;
  height: 20px;
  margin: 5px 0px 0px 0px;
}
  .header{
    height: 50px;
  }
}

.footer-height {
  height: 75px;
}
* {
  margin: 0;
  padding: 0;
  box-shadow: -200px -200px 5px -200px rgba(0,0,0,0.75) !important;
}
.posIcon {
  padding-bottom: 300px;
}
</style>
