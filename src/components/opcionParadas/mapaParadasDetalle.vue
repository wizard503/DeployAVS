<template>
  <body>
    <div id='viewDiv' class="balt-theme"></div>
  </body>
</template>
<script>
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import esriConfig from '@arcgis/core/config'
import Graphic from '@arcgis/core/Graphic'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import CIMSymbol from '@arcgis/core/symbols/CIMSymbol'
export default {
  name: 'WebMap',
  props: {
    msg: String
  },
  data () {
    return {
      tamano: 0,
      nombre: '',
      lati: '',
      long: ''
    }
  },
  computed: {
    paradas () {
      return this.$store.state.DataVuex.paradas
    },
    rutasStore () {
      return this.$store.state.DataVuex.rutas
    }
  },
  mounted () {
    this.loadMap()
  },
  methods: {
    loadMap () {
      esriConfig.apiKey = 'AAPK16512e5dc22244fcb9bedb1820640129FlDVJG2s9GliiIGcZzB8oCB_Tt12SwHUgxuop9gyFxTfTaSlcUihemOWj9_Tau7O'
      // create map with the given options
      const map = new Map({
        basemap: 'osm-standard'
      })

      const view = new MapView({
        map: map,
        center: [this.long, this.lati], // Longitude, latitude
        zoom: 16, // Zoom level
        container: 'viewDiv' // Div element
      })

      const graphicsLayer = new GraphicsLayer()
      map.add(graphicsLayer)
      const point = { // Create a point
        type: 'point',
        longitude: this.long,
        latitude: this.lati
      }
      const cimSymbol = new CIMSymbol({
        data: {
          type: 'CIMSymbolReference',
          symbol: {
            type: 'CIMPointSymbol',
            symbolLayers: [
              {
                type: 'CIMVectorMarker',
                enable: true,
                anchorPointUnits: 'Relative',
                dominantSizeAxis3D: 'Y',
                size: 15.75,
                billboardMode3D: 'FaceNearPlane',
                frame: {
                  xmin: 0,
                  ymin: 0,
                  xmax: 21,
                  ymax: 21
                },
                markerGraphics: [
                  {
                    type: 'CIMMarkerGraphic',
                    geometry: {
                      rings: [
                        [
                          [10.5, 18],
                          [11.74, 17.94],
                          [12.98, 17.75],
                          [14.14, 17.46],
                          [15.15, 17.08],
                          [15.95, 16.63],
                          [16.53, 16.13],
                          [16.88, 15.58],
                          [17, 15],
                          [17, 5],
                          [16, 5],
                          [16, 3.5],
                          [15.85, 3.15],
                          [15.5, 3],
                          [14.5, 3],
                          [14.15, 3.15],
                          [14, 3.5],
                          [14, 5],
                          [7, 5],
                          [7, 3.5],
                          [6.85, 3.15],
                          [6.5, 3],
                          [5.5, 3],
                          [5.15, 3.15],
                          [5, 3.5],
                          [5, 5],
                          [4, 5],
                          [4, 15],
                          [4.12, 15.58],
                          [4.47, 16.13],
                          [5.05, 16.63],
                          [5.85, 17.08],
                          [6.86, 17.46],
                          [8.02, 17.75],
                          [9.26, 17.94],
                          [10.5, 18]
                        ],
                        [
                          [7, 16],
                          [7, 15],
                          [14, 15],
                          [14, 16],
                          [7, 16]
                        ],
                        [
                          [7, 6.5],
                          [7, 7.5],
                          [6.86, 7.86],
                          [6.5, 8],
                          [5.5, 8],
                          [5.14, 7.86],
                          [5, 7.5],
                          [5, 6.5],
                          [5.15, 6.15],
                          [5.5, 6],
                          [6.5, 6],
                          [6.85, 6.15],
                          [7, 6.5]
                        ],
                        [
                          [16, 6.5],
                          [16, 7.5],
                          [15.86, 7.86],
                          [15.5, 8],
                          [14.5, 8],
                          [14.15, 7.86],
                          [14, 7.5],
                          [14, 6.5],
                          [14.15, 6.15],
                          [14.5, 6],
                          [15.5, 6],
                          [15.85, 6.15],
                          [16, 6.5]
                        ],
                        [
                          [16, 9],
                          [16, 14],
                          [5, 14],
                          [5, 9],
                          [16, 9]
                        ]
                      ]
                    },
                    symbol: {
                      type: 'CIMPolygonSymbol',
                      symbolLayers: [
                        {
                          type: 'CIMSolidStroke',
                          enable: true,
                          capStyle: 'Round',
                          joinStyle: 'Round',
                          lineStyle3D: 'Strip',
                          miterLimit: 10,
                          width: 0,
                          color: [0, 0, 0, 255]
                        },
                        {
                          type: 'CIMSolidFill',
                          enable: true,
                          color: [255, 255, 255, 255] // Color de relleno de figura
                        }
                      ]
                    }
                  }
                ],
                scaleSymbolsProportionally: true,
                respectFrame: true
              },
              {
                type: 'CIMVectorMarker',
                enable: true,
                colorLocked: true,
                anchorPointUnits: 'Relative',
                dominantSizeAxis3D: 'Y',
                size: 25,
                billboardMode3D: 'FaceNearPlane',
                frame: {
                  xmin: -5,
                  ymin: -5,
                  xmax: 5,
                  ymax: 5
                },
                markerGraphics: [
                  {
                    type: 'CIMMarkerGraphic',
                    geometry: {
                      rings: [
                        [
                          [0, 5],
                          [0.87, 4.92],
                          [1.71, 4.7],
                          [2.5, 4.33],
                          [3.21, 3.83],
                          [3.83, 3.21],
                          [4.33, 2.5],
                          [4.7, 1.71],
                          [4.92, 0.87],
                          [5, 0],
                          [4.92, -0.87],
                          [4.7, -1.71],
                          [4.33, -2.5],
                          [3.83, -3.21],
                          [3.21, -3.83],
                          [2.5, -4.33],
                          [1.71, -4.7],
                          [0.87, -4.92],
                          [0, -5],
                          [-0.87, -4.92],
                          [-1.71, -4.7],
                          [-2.5, -4.33],
                          [-3.21, -3.83],
                          [-3.83, -3.21],
                          [-4.33, -2.5],
                          [-4.7, -1.71],
                          [-4.92, -0.87],
                          [-5, 0],
                          [-4.92, 0.87],
                          [-4.7, 1.71],
                          [-4.33, 2.5],
                          [-3.83, 3.21],
                          [-3.21, 3.83],
                          [-2.5, 4.33],
                          [-1.71, 4.7],
                          [-0.87, 4.92],
                          [0, 5]
                        ]
                      ]
                    },
                    symbol: {
                      type: 'CIMPolygonSymbol',
                      symbolLayers: [
                        {
                          type: 'CIMSolidStroke',
                          enable: true,
                          capStyle: 'Round',
                          joinStyle: 'Round',
                          lineStyle3D: 'Strip',
                          miterLimit: 10,
                          width: 0.5,
                          color: [0, 0, 0, 255] // Color de linea exterior
                        },
                        {
                          type: 'CIMSolidFill',
                          enable: true,
                          color: [255, 0, 0, 255] // Color de relleno
                        }
                      ]
                    }
                  }
                ],
                scaleSymbolsProportionally: true,
                respectFrame: true
              }
            ],
            haloSize: 1,
            scaleX: 1,
            angleAlignment: 'Display',
            version: '2.0.0',
            build: '8933'
          }
        }
      })
      const popupTemplate = {
        title: '{Name}',
        content: '{Description}'
      }
      const attributes = {
        Name: this.nombre,
        Description: 'Parada de bus'
      }
      const pointGraphic = new Graphic({
        geometry: point,
        symbol: cimSymbol,
        attributes: attributes,
        popupTemplate: popupTemplate
      })
      graphicsLayer.add(pointGraphic)

      console.log(view)
    }
  },
  created () {
    const nomb = String(this.$route.params.nombre)
    this.nombre = nomb
    const latitud = String(this.$route.params.lat)
    this.lati = latitud
    const longitud = String(this.$route.params.lon)
    this.long = longitud
  }
}
</script>

<style scoped>
@import '~@arcgis/core/assets/esri/themes/light/main.css';

.balt-theme {
  height: 63%;
  width: 100%;
}
</style>
