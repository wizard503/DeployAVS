<template>
    <div id="viewDiv" class="balt-theme"></div>
</template>
<script>
import { nuevoBus } from '../../router/index'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import esriConfig from '@arcgis/core/config'
import Graphic from '@arcgis/core/Graphic'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import WebStyleSymbol from '@arcgis/core/symbols/WebStyleSymbol'
import Circle from '@arcgis/core/geometry/Circle'
export default {
  name: 'WebMap',
  props: {
    msg: String
  },
  data () {
    return {
      Lparadas: [],
      tamano: 0,
      parada: null
    }
  },
  computed: {
    paradas () {
      return this.$store.state.DataVuex.paradas
    },
    rutas () {
      return this.$store.state.DataVuex.rutas
    },
    posGPS: {
      get () { return this.$store.state.DataVuex.posGPS },
      set (val) { this.$store.commit('DataVuex/actualizarGPS', val) }
    },
    cargando () {
      if (this.paradas.length === 0) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    paradas () {
      this.clonarParadas()
      this.verMapa()
    },
    posGPS () {
      this.verMapaConGps()
    }
  },
  created () {
  },
  destroyed () {
    console.log('Componente eliminado')
    nuevoBus.$off()
  },
  mounted () {
    if (this.paradas.length > 0) {
      this.clonarParadas()
    }
    if (this.posGPS !== null) {
      this.verMapaConGps()
    } else {
      this.verMapa()
    }
    nuevoBus.$on('paradas', () => {
      this.mostrarMapaFInal()
    })
  },
  methods: {
    clonarParadas () {
      // clonamos las paradas al local data
      this.Lparadas = this.paradas.map((x) => {
        const elemento = Object.assign({}, x)
        elemento.id = x.id
        return elemento
      })
    },
    mostrarMapaFInal (parada) {
      this.parada = parada
      this.verMapa()
    },
    verMapa () {
      esriConfig.apiKey = 'AAPK16512e5dc22244fcb9bedb1820640129FlDVJG2s9GliiIGcZzB8oCB_Tt12SwHUgxuop9gyFxTfTaSlcUihemOWj9_Tau7O'
      const map = new Map({
        basemap: 'osm-standard' // Basemap layer service
      })
      const view = new MapView({
        map: map,
        center: [-89.563337, 13.980626], // Longitude, latitude
        zoom: 13, // Zoom level
        container: 'viewDiv' // Div element
      })
      console.log(view)
      const graphicsLayer = new GraphicsLayer()
      map.add(graphicsLayer)
      // Listar todas las paradas en el mapa
      for (let c = 0; c < this.paradas.length; c++) {
        const point = { // Create a point
          type: 'point',
          longitude: this.Lparadas[c].gps._long,
          latitude: this.Lparadas[c].gps._lat
        }
        const webStyleSymbol = new WebStyleSymbol({
          name: 'bus-station',
          styleName: 'Esri2DPointSymbolsStyle'
        })
        const popupTemplate = {
          title: '{Name}',
          content: '{Description}'
        }
        const attributes = {
          Name: this.Lparadas[c].nombre,
          Description: 'Parada de bus'
        }
        const pointGraphic = new Graphic({
          geometry: point,
          symbol: webStyleSymbol,
          attributes: attributes,
          popupTemplate: popupTemplate
        })
        graphicsLayer.add(pointGraphic)
      }

      // Fin de Listar todas las paradas
    },
    verMapaConGps () {
      esriConfig.apiKey = 'AAPK16512e5dc22244fcb9bedb1820640129FlDVJG2s9GliiIGcZzB8oCB_Tt12SwHUgxuop9gyFxTfTaSlcUihemOWj9_Tau7O'
      const map = new Map({
        basemap: 'osm-standard' // Basemap layer service
      })
      const view = new MapView({
        map: map,
        center: [this.posGPS.longitude, this.posGPS.latitude], // Longitude, latitude
        zoom: 16, // Zoom level
        container: 'viewDiv' // Div element
      })
      const graphicsLayer = new GraphicsLayer()
      map.add(graphicsLayer)
      // Crear el GPS
      if (this.posGPS !== null) {
        const point = {
          type: 'point',
          longitude: this.posGPS.longitude,
          latitude: this.posGPS.latitude
        }

        const webStyleSymbol = new WebStyleSymbol({
          name: 'tear-pin-1',
          styleName: 'Esri2DPointSymbolsStyle'
        })

        const attributes = {
          name: 'Localizacion GPS',
          description: 'Usted se encuentra aqui'
        }

        const pointGraphic = new Graphic({
          geometry: point,
          symbol: webStyleSymbol,
          attributes: attributes,
          popupTemplate: {
            title: attributes.name,
            content: attributes.description
          }
        })

        graphicsLayer.add(pointGraphic)
      }
      // Fin del punto del GPS
      // Inicio del rango del GPS
      const circleGeometry = new Circle({
        center: [this.posGPS.longitude, this.posGPS.latitude],
        geodesic: true,
        numberOfPoints: 100,
        radius: 0.3,
        radiusUnit: 'kilometers'
      })

      view.graphics.add(new Graphic({
        geometry: circleGeometry,
        symbol: {
          type: 'simple-fill',
          color: [0, 144, 244, 0.1],
          outline: {
            width: 3,
            color: 'dodgerblue'
          }
        }
      }))
      // Fin del rango del GPS
      // Listar todas las paradas en el mapa
      for (let c = 0; c < this.paradas.length; c++) {
        const point = { // Create a point
          type: 'point',
          longitude: this.Lparadas[c].gps._long,
          latitude: this.Lparadas[c].gps._lat
        }
        const webStyleSymbol = new WebStyleSymbol({
          name: 'bus-station',
          styleName: 'Esri2DPointSymbolsStyle'
        })
        const popupTemplate = {
          title: '{Name}',
          content: '{Description}'
        }
        const attributes = {
          Name: this.Lparadas[c].nombre,
          Description: 'Parada de bus'
        }
        const pointGraphic = new Graphic({
          geometry: point,
          symbol: webStyleSymbol,
          attributes: attributes,
          popupTemplate: popupTemplate
        })
        graphicsLayer.add(pointGraphic)
      }

      // Fin de Listar todas las paradas
    }
  }
}
</script>

<style scoped>
@import 'https://js.arcgis.com/4.23/@arcgis/core/assets/esri/themes/light/main.css';
.balt-theme {
    height:100%;
    width: 100%;
    padding: 0;
    margin: 0;
}
</style>
