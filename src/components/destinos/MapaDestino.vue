<template>
  <div>
    <!-- Container Map -->
    <div v-show="showMapa" id="viewDiv" style="height:81vh">
      <q-inner-loading
      :showing="visible"
      :label="loadingLabel"
      label-class="text-teal"
      label-style="font-size: 1.1em"
      />
    </div>
    <!-- Search Buttom -->
    <q-btn v-if="showTrackButtom" @click="startTracking()" round color="primary" icon="navigation" class="absolute" style="top: 10vh ; right: 12px" />
    <q-btn v-if="showStopButtom" @click="stopTracking(true)" round color="primary" icon="location_disabled" class="absolute" style="top: 10vh ; right: 12px" />
    <!-- Notificaion de permisos de GPS -->
    <q-dialog v-model="visibleGPS" persistent>
      <q-card style="border-radius: 25px">
          <q-toolbar class="q-pt-md">
            <q-icon left size="3em" name="my_location" />
            <q-toolbar-title>
              <span class="text-weight-bold">¡Recomendación!</span>
            </q-toolbar-title>
          </q-toolbar>
          <q-card-section class="q-pt-md">
            {{message}}
          </q-card-section>
          <q-card-actions align="right" class="q-pa-md">
            <q-btn
            v-close-popup
              style="border-radius: 15px"
              label="Aceptar"
              color="green"
              v-if="permission !== 'denied'"
            />
          </q-card-actions>
      </q-card>
    </q-dialog>
</div>
</template>

<script>
import eventBus from 'app/src/eventBus'
import esriConfig from '@arcgis/core/config'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import Graphic from '@arcgis/core/Graphic'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import Track from '@arcgis/core/widgets/Track'
import WebStyleSymbol from '@arcgis/core/symbols/WebStyleSymbol'
import CIMSymbol from '@arcgis/core/symbols/CIMSymbol'
const posicion = []
let trackWidget = null
export default {
  name: 'WebMap',
  data () {
    return {
      paradaOrigen: null,
      paradaDestino: null,
      puntoOrigen: Object,
      loadingLabel: String,
      showTrackButtom: true,
      showStopButtom: false,
      alert: false,
      isLoading: false,
      visible: false,
      showMapa: false,
      posicion,
      map: new Map({
        basemap: 'osm-standard'
      }),
      view: Object,
      graphicsLayer: new GraphicsLayer(),
      graphicsLayer2: new GraphicsLayer(),
      visibleGPS: false,
      message: String,
      permission: false
    }
  },
  methods: {
    setPuntoOrigen () {
      console.log('cantidad de graficos en el mapa: ', this.graphicsLayer2.graphics.length)
      if (this.graphicsLayer2.graphics.length === 2) {
        console.log('borrando y añadiendo un nuevo punto de origen')
        this.graphicsLayer2.graphics.shift()
        this.graphicsLayer2.graphics.unshift(this.puntoOrigen)
      } else {
        console.log('añadiendo un nuevo punto de origen')
        this.graphicsLayer2.graphics.unshift(this.puntoOrigen)
      }
      console.log('cantidad de graficos en el mapa: ', this.graphicsLayer2.graphics.length)
      this.view.goTo({
        center: this.puntoOrigen.geometry,
        scale: 9500
      }).catch((error) => {
        if (error.name !== 'AbortError') {
          console.error(error)
        }
      })
    },
    startTracking () {
      this.showTextLoading('Iniciando seguimiento de tu recorrido en tiempo real')
      trackWidget.start()
      setTimeout(() => {
        if (!this.permission) {
          this.showTrackButtom = true
          this.showStopButtom = false
          this.stopTextLoading()
          this.message = 'Para poder dar seguimiento a tu recorrido necesitamos usar el gps, por favor habilita todos los campos necesarios para que podamos usar tu servicio de ubicación'
          this.title = 'Opps'
          this.visibleGPS = true
        }
      }, 5000)
      this.view.goTo({
        center: [this.posGPS.longitude, this.posGPS.latitude],
        scale: 9500
      }).catch((error) => {
        if (error.name !== 'AbortError') {
          console.error(error)
        }
      })
    },
    stopTracking () {
      console.log('cantidad de graficos en el mapa: ', this.graphicsLayer2.graphics.length)
      this.showTextLoading('Deteniendo seguimiento de tu destino en tiempo real')
      this.showTrackButtom = true
      this.showStopButtom = false
      trackWidget.stop()
      this.stopTextLoading()
    },
    showTextLoading (message) {
      this.loadingLabel = message
      this.isLoading = true
      this.visible = true
    },
    stopTextLoading () {
      if (this.isLoading) {
        setTimeout(() => {
          this.visible = false
          this.isLoading = false
        }, 1500)
      }
    },
    showDestinoNotFound () {
      this.$q.notify({
        message: 'Opps!. Faltan Datos',
        caption: 'Para poder buscar recorridos a tu destino asegurate de ingresar tu destino o marcarlo en el mapa.',
        position: 'center',
        color: 'orange-9',
        icon: 'running_with_errors'
      })
    },
    solicitarGPS () {
      console.log('\nSolicitando GPS......')
      // eslint-disable-next-line no-unsafe-negation
      if (!'geolocation' in navigator) {
        return alert('Tu navegador no soporta el acceso a la ubicación. Intenta con otro')
      } else {
        this.showMapa = true
        this.showTextLoading('Obteniendo tu ubicación actual')
        const succesGPS = ubicacion => {
          this.posGPS = ubicacion.coords
          this.Mapa()
          posicion[0] = ubicacion.coords.latitude
          posicion[1] = ubicacion.coords.longitude
          console.log('\t\tObtuvimos las coordenadas')
          console.log(this.posGPS)
          this.showTrackButtom = true
          this.showSearchButtom = true
        }

        const onErrorDeUbicacion = () => {
          this.showMapa = false
          this.stopTextLoading()
          this.message = 'No pudimos obtener tu ubicación, por favor habilita todos los campos necesarios para que podamos usar tu servicio de ubicación'
          this.title = 'Opps'
          this.visibleGPS = true
        }

        const opcionesDeSolicitud = {
          enableHighAccuracy: true, // Alta precisión
          maximumAge: 0, // No queremos caché
          timeout: 5000 // Esperar solo 5 segundos
        }
        // Solicitar
        navigator.geolocation.getCurrentPosition(succesGPS, onErrorDeUbicacion, opcionesDeSolicitud)
      }
    },
    Mapa () {
      esriConfig.apiKey = 'AAPKde73b0ab93ae4b398e8ff2191e6be6e5FtJsdQ4_Z_ZtT7tS9vHolHhA4R-sG5z3mmww8QPv3_4VCDlA46dXcjX1wN9g0G-K'

      this.view = new MapView({
        container: 'viewDiv',
        map: this.map,
        popup: {
          alignment: 'top-right',
          collapsed: true,
          dockEnabled: true,
          dockOptions: {
            // Disables the dock button from the popup
            buttonEnabled: false,
            // Ignore the default sizes that trigger responsive docking
            breakpoint: false
          },
          viewModel: {
            includeDefaultActions: false
          }
        },
        highlightOptions: {
          color: '#00ffff',
          haloColor: '#00FF8B',
          haloOpacity: 1,
          fillOpacity: 0.5
        },
        zoom: 14,
        center: [this.posGPS.longitude, this.posGPS.latitude]
      })
      trackWidget = new Track({
        view: this.view,
        graphic: new Graphic({
          symbol: new WebStyleSymbol({
            name: 'trail',
            styleName: 'Esri2DPointSymbolsStyle'
          })
        }),
        visible: false,
        goToLocationEnabled: false
      })

      this.map.add(this.graphicsLayer)
      this.map.add(this.graphicsLayer2)

      this.puntoOrigen = new Graphic({
        geometry: {
          type: 'point',
          longitude: this.posGPS.longitude,
          latitude: this.posGPS.latitude
        },
        symbol: new WebStyleSymbol({
          name: 'esri-pin-2',
          styleName: 'Esri2DPointSymbolsStyle'
        })
      })
      this.view.when(() => {
        this.view.ui.remove('zoom')
        console.log('iniciando vista')
        if (this.graphicsLayer2.graphics.length <= 1) {
          this.graphicsLayer2.add(this.puntoOrigen)
        }
        this.stopTextLoading()
      }, (error) => {
        console.log(error)
      })
      trackWidget.on('track', (trackEvent) => {
        this.permission = true
        this.stopTextLoading()
        this.showTrackButtom = false
        this.showStopButtom = true
        eventBus.$emit('updatePosGPS', trackEvent.position.coords)
      })

      this.view.on('click', (event) => {
        if (!this.inputsFlag) {
          if ((this.paradaDestino || (posicion[2] && posicion[3])) && !(this.paradaOrigen || (posicion[0] && posicion[1]))) {
            posicion[0] = event.mapPoint.latitude
            posicion[1] = event.mapPoint.longitude
            this.graphicsLayer2.graphics.unshift(new Graphic({
              geometry: {
                type: 'point',
                longitude: event.mapPoint.longitude,
                latitude: event.mapPoint.latitude
              },
              symbol: new WebStyleSymbol({
                name: 'esri-pin-2',
                styleName: 'Esri2DPointSymbolsStyle'
              })
            }))
          } else {
            if (this.graphicsLayer2.graphics.length === 3) {
              console.log('Borrando')
              this.graphicsLayer2.graphics.pop()
            }
            if (this.graphicsLayer2.graphics.length === 2) {
              console.log('Borrando')
              this.graphicsLayer2.graphics.pop()
            }
            posicion[2] = event.mapPoint.latitude
            posicion[3] = event.mapPoint.longitude
            this.graphicsLayer2.add(new Graphic({
              geometry: {
                type: 'point',
                longitude: event.mapPoint.longitude,
                latitude: event.mapPoint.latitude
              },
              symbol: new WebStyleSymbol({
                name: 'esri-pin-1',
                styleName: 'Esri2DPointSymbolsStyle'
              })
            }))
            eventBus.$emit('limpiarDestinoInput')
            this.paradaDestino = null
          }
          eventBus.$emit('changeCoords')
          this.graphicsLayer.removeAll()
        }
      })
    },
    addGraphic (point, symbol, attributes, popupTemplate, graphicsLayer) {
      const pointGraphic = new Graphic({
        geometry: point,
        symbol,
        attributes,
        popupTemplate
      })
      graphicsLayer.add(pointGraphic)
    },
    drawGraphics (paradas, highlight, ...symbols) {
      for (let parada = 0; parada < paradas.length; parada++) {
        const point = {
          type: 'point',
          longitude: paradas[parada].gps._long,
          latitude: paradas[parada].gps._lat
        }
        const mediaInfos = []
        // Get parada images
        for (const image of paradas[parada].fotos) {
          mediaInfos.push({
            value: {
              sourceURL: image
            }
          })
        }
        const popupTemplate = {
          content: [
            {
              type: 'fields',
              fieldInfos: [
                {
                  fieldName: 'Nombre'
                },
                {
                  fieldName: 'Cercanos',
                  label: 'Lugares Cercanos'
                },
                {
                  fieldName: 'Referencia'
                }
              ]
            },
            {
              type: 'media',
              mediaInfos
            }
          ]
        }
        const attributes = {
          Nombre: 'Parada de Bus ' + paradas[parada].nombre,
          Cercanos: paradas[parada].lugaresCercanos,
          Referencia: paradas[parada].referencia
        }
        if ((parada === 0 || parada === paradas.length - 1) && highlight) {
          this.addGraphic(point, symbols[0], attributes, popupTemplate, this.graphicsLayer)
        } else {
          this.addGraphic(point, (highlight) ? symbols[1] : symbols[0], attributes, popupTemplate, this.graphicsLayer)
        }
      }
    },
    drawParadasRecorrido (paradas) {
      const paradasIntermedias = new CIMSymbol({
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
                          [
                            10.5,
                            18
                          ],
                          [
                            11.74,
                            17.94
                          ],
                          [
                            12.98,
                            17.75
                          ],
                          [
                            14.14,
                            17.46
                          ],
                          [
                            15.15,
                            17.08
                          ],
                          [
                            15.95,
                            16.63
                          ],
                          [
                            16.53,
                            16.13
                          ],
                          [
                            16.88,
                            15.58
                          ],
                          [
                            17,
                            15
                          ],
                          [
                            17,
                            5
                          ],
                          [
                            16,
                            5
                          ],
                          [
                            16,
                            3.5
                          ],
                          [
                            15.85,
                            3.15
                          ],
                          [
                            15.5,
                            3
                          ],
                          [
                            14.5,
                            3
                          ],
                          [
                            14.15,
                            3.15
                          ],
                          [
                            14,
                            3.5
                          ],
                          [
                            14,
                            5
                          ],
                          [
                            7,
                            5
                          ],
                          [
                            7,
                            3.5
                          ],
                          [
                            6.85,
                            3.15
                          ],
                          [
                            6.5,
                            3
                          ],
                          [
                            5.5,
                            3
                          ],
                          [
                            5.15,
                            3.15
                          ],
                          [
                            5,
                            3.5
                          ],
                          [
                            5,
                            5
                          ],
                          [
                            4,
                            5
                          ],
                          [
                            4,
                            15
                          ],
                          [
                            4.12,
                            15.58
                          ],
                          [
                            4.47,
                            16.13
                          ],
                          [
                            5.05,
                            16.63
                          ],
                          [
                            5.85,
                            17.08
                          ],
                          [
                            6.86,
                            17.46
                          ],
                          [
                            8.02,
                            17.75
                          ],
                          [
                            9.26,
                            17.94
                          ],
                          [
                            10.5,
                            18
                          ]
                        ],
                        [
                          [
                            7,
                            16
                          ],
                          [
                            7,
                            15
                          ],
                          [
                            14,
                            15
                          ],
                          [
                            14,
                            16
                          ],
                          [
                            7,
                            16
                          ]
                        ],
                        [
                          [
                            7,
                            6.5
                          ],
                          [
                            7,
                            7.5
                          ],
                          [
                            6.86,
                            7.86
                          ],
                          [
                            6.5,
                            8
                          ],
                          [
                            5.5,
                            8
                          ],
                          [
                            5.14,
                            7.86
                          ],
                          [
                            5,
                            7.5
                          ],
                          [
                            5,
                            6.5
                          ],
                          [
                            5.15,
                            6.15
                          ],
                          [
                            5.5,
                            6
                          ],
                          [
                            6.5,
                            6
                          ],
                          [
                            6.85,
                            6.15
                          ],
                          [
                            7,
                            6.5
                          ]
                        ],
                        [
                          [
                            16,
                            6.5
                          ],
                          [
                            16,
                            7.5
                          ],
                          [
                            15.86,
                            7.86
                          ],
                          [
                            15.5,
                            8
                          ],
                          [
                            14.5,
                            8
                          ],
                          [
                            14.15,
                            7.86
                          ],
                          [
                            14,
                            7.5
                          ],
                          [
                            14,
                            6.5
                          ],
                          [
                            14.15,
                            6.15
                          ],
                          [
                            14.5,
                            6
                          ],
                          [
                            15.5,
                            6
                          ],
                          [
                            15.85,
                            6.15
                          ],
                          [
                            16,
                            6.5
                          ]
                        ],
                        [
                          [
                            16,
                            9
                          ],
                          [
                            16,
                            14
                          ],
                          [
                            5,
                            14
                          ],
                          [
                            5,
                            9
                          ],
                          [
                            16,
                            9
                          ]
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
                          color: [
                            0,
                            0,
                            0,
                            255
                          ]
                        },
                        {
                          type: 'CIMSolidFill',
                          enable: true,
                          color: [
                            88,
                            89,
                            91,
                            255
                          ]
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
                size: 18.5,
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
                          [
                            0,
                            5
                          ],
                          [
                            0.87,
                            4.92
                          ],
                          [
                            1.71,
                            4.7
                          ],
                          [
                            2.5,
                            4.33
                          ],
                          [
                            3.21,
                            3.83
                          ],
                          [
                            3.83,
                            3.21
                          ],
                          [
                            4.33,
                            2.5
                          ],
                          [
                            4.7,
                            1.71
                          ],
                          [
                            4.92,
                            0.87
                          ],
                          [
                            5,
                            0
                          ],
                          [
                            4.92,
                            -0.87
                          ],
                          [
                            4.7,
                            -1.71
                          ],
                          [
                            4.33,
                            -2.5
                          ],
                          [
                            3.83,
                            -3.21
                          ],
                          [
                            3.21,
                            -3.83
                          ],
                          [
                            2.5,
                            -4.33
                          ],
                          [
                            1.71,
                            -4.7
                          ],
                          [
                            0.87,
                            -4.92
                          ],
                          [
                            0,
                            -5
                          ],
                          [
                            -0.87,
                            -4.92
                          ],
                          [
                            -1.71,
                            -4.7
                          ],
                          [
                            -2.5,
                            -4.33
                          ],
                          [
                            -3.21,
                            -3.83
                          ],
                          [
                            -3.83,
                            -3.21
                          ],
                          [
                            -4.33,
                            -2.5
                          ],
                          [
                            -4.7,
                            -1.71
                          ],
                          [
                            -4.92,
                            -0.87
                          ],
                          [
                            -5,
                            0
                          ],
                          [
                            -4.92,
                            0.87
                          ],
                          [
                            -4.7,
                            1.71
                          ],
                          [
                            -4.33,
                            2.5
                          ],
                          [
                            -3.83,
                            3.21
                          ],
                          [
                            -3.21,
                            3.83
                          ],
                          [
                            -2.5,
                            4.33
                          ],
                          [
                            -1.71,
                            4.7
                          ],
                          [
                            -0.87,
                            4.92
                          ],
                          [
                            0,
                            5
                          ]
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
                          // COLOR DEL BORDE
                          color: [
                            0,
                            0,
                            0,
                            255
                          ]
                        },
                        {
                          type: 'CIMSolidFill',
                          enable: true,
                          // COLOR DE RELLENO
                          color: [
                            240,
                            178,
                            122,
                            200
                          ]
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
      const paradasInicioFin = new CIMSymbol({
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
                          [
                            10.5,
                            18
                          ],
                          [
                            11.74,
                            17.94
                          ],
                          [
                            12.98,
                            17.75
                          ],
                          [
                            14.14,
                            17.46
                          ],
                          [
                            15.15,
                            17.08
                          ],
                          [
                            15.95,
                            16.63
                          ],
                          [
                            16.53,
                            16.13
                          ],
                          [
                            16.88,
                            15.58
                          ],
                          [
                            17,
                            15
                          ],
                          [
                            17,
                            5
                          ],
                          [
                            16,
                            5
                          ],
                          [
                            16,
                            3.5
                          ],
                          [
                            15.85,
                            3.15
                          ],
                          [
                            15.5,
                            3
                          ],
                          [
                            14.5,
                            3
                          ],
                          [
                            14.15,
                            3.15
                          ],
                          [
                            14,
                            3.5
                          ],
                          [
                            14,
                            5
                          ],
                          [
                            7,
                            5
                          ],
                          [
                            7,
                            3.5
                          ],
                          [
                            6.85,
                            3.15
                          ],
                          [
                            6.5,
                            3
                          ],
                          [
                            5.5,
                            3
                          ],
                          [
                            5.15,
                            3.15
                          ],
                          [
                            5,
                            3.5
                          ],
                          [
                            5,
                            5
                          ],
                          [
                            4,
                            5
                          ],
                          [
                            4,
                            15
                          ],
                          [
                            4.12,
                            15.58
                          ],
                          [
                            4.47,
                            16.13
                          ],
                          [
                            5.05,
                            16.63
                          ],
                          [
                            5.85,
                            17.08
                          ],
                          [
                            6.86,
                            17.46
                          ],
                          [
                            8.02,
                            17.75
                          ],
                          [
                            9.26,
                            17.94
                          ],
                          [
                            10.5,
                            18
                          ]
                        ],
                        [
                          [
                            7,
                            16
                          ],
                          [
                            7,
                            15
                          ],
                          [
                            14,
                            15
                          ],
                          [
                            14,
                            16
                          ],
                          [
                            7,
                            16
                          ]
                        ],
                        [
                          [
                            7,
                            6.5
                          ],
                          [
                            7,
                            7.5
                          ],
                          [
                            6.86,
                            7.86
                          ],
                          [
                            6.5,
                            8
                          ],
                          [
                            5.5,
                            8
                          ],
                          [
                            5.14,
                            7.86
                          ],
                          [
                            5,
                            7.5
                          ],
                          [
                            5,
                            6.5
                          ],
                          [
                            5.15,
                            6.15
                          ],
                          [
                            5.5,
                            6
                          ],
                          [
                            6.5,
                            6
                          ],
                          [
                            6.85,
                            6.15
                          ],
                          [
                            7,
                            6.5
                          ]
                        ],
                        [
                          [
                            16,
                            6.5
                          ],
                          [
                            16,
                            7.5
                          ],
                          [
                            15.86,
                            7.86
                          ],
                          [
                            15.5,
                            8
                          ],
                          [
                            14.5,
                            8
                          ],
                          [
                            14.15,
                            7.86
                          ],
                          [
                            14,
                            7.5
                          ],
                          [
                            14,
                            6.5
                          ],
                          [
                            14.15,
                            6.15
                          ],
                          [
                            14.5,
                            6
                          ],
                          [
                            15.5,
                            6
                          ],
                          [
                            15.85,
                            6.15
                          ],
                          [
                            16,
                            6.5
                          ]
                        ],
                        [
                          [
                            16,
                            9
                          ],
                          [
                            16,
                            14
                          ],
                          [
                            5,
                            14
                          ],
                          [
                            5,
                            9
                          ],
                          [
                            16,
                            9
                          ]
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
                          color: [
                            0,
                            0,
                            0,
                            255
                          ]
                        },
                        {
                          type: 'CIMSolidFill',
                          enable: true,
                          color: [
                            236,
                            240,
                            241,
                            255
                          ]
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
                size: 22.5,
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
                          [
                            0,
                            5
                          ],
                          [
                            0.87,
                            4.92
                          ],
                          [
                            1.71,
                            4.7
                          ],
                          [
                            2.5,
                            4.33
                          ],
                          [
                            3.21,
                            3.83
                          ],
                          [
                            3.83,
                            3.21
                          ],
                          [
                            4.33,
                            2.5
                          ],
                          [
                            4.7,
                            1.71
                          ],
                          [
                            4.92,
                            0.87
                          ],
                          [
                            5,
                            0
                          ],
                          [
                            4.92,
                            -0.87
                          ],
                          [
                            4.7,
                            -1.71
                          ],
                          [
                            4.33,
                            -2.5
                          ],
                          [
                            3.83,
                            -3.21
                          ],
                          [
                            3.21,
                            -3.83
                          ],
                          [
                            2.5,
                            -4.33
                          ],
                          [
                            1.71,
                            -4.7
                          ],
                          [
                            0.87,
                            -4.92
                          ],
                          [
                            0,
                            -5
                          ],
                          [
                            -0.87,
                            -4.92
                          ],
                          [
                            -1.71,
                            -4.7
                          ],
                          [
                            -2.5,
                            -4.33
                          ],
                          [
                            -3.21,
                            -3.83
                          ],
                          [
                            -3.83,
                            -3.21
                          ],
                          [
                            -4.33,
                            -2.5
                          ],
                          [
                            -4.7,
                            -1.71
                          ],
                          [
                            -4.92,
                            -0.87
                          ],
                          [
                            -5,
                            0
                          ],
                          [
                            -4.92,
                            0.87
                          ],
                          [
                            -4.7,
                            1.71
                          ],
                          [
                            -4.33,
                            2.5
                          ],
                          [
                            -3.83,
                            3.21
                          ],
                          [
                            -3.21,
                            3.83
                          ],
                          [
                            -2.5,
                            4.33
                          ],
                          [
                            -1.71,
                            4.7
                          ],
                          [
                            -0.87,
                            4.92
                          ],
                          [
                            0,
                            5
                          ]
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
                          // COLOR DEL BORDE
                          color: [
                            0,
                            0,
                            0,
                            255
                          ]
                        },
                        {
                          type: 'CIMSolidFill',
                          enable: true,
                          // COLOR DE RELLENO
                          color: [
                            211,
                            84,
                            0,
                            255
                          ]
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
      this.drawGraphics(paradas, true, paradasInicioFin, paradasIntermedias)
    },
    drawParadasRestantes (paradas) {
      const paradasRestantes = new CIMSymbol({
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
                size: 12.75,
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
                          [
                            10.5,
                            18
                          ],
                          [
                            11.74,
                            17.94
                          ],
                          [
                            12.98,
                            17.75
                          ],
                          [
                            14.14,
                            17.46
                          ],
                          [
                            15.15,
                            17.08
                          ],
                          [
                            15.95,
                            16.63
                          ],
                          [
                            16.53,
                            16.13
                          ],
                          [
                            16.88,
                            15.58
                          ],
                          [
                            17,
                            15
                          ],
                          [
                            17,
                            5
                          ],
                          [
                            16,
                            5
                          ],
                          [
                            16,
                            3.5
                          ],
                          [
                            15.85,
                            3.15
                          ],
                          [
                            15.5,
                            3
                          ],
                          [
                            14.5,
                            3
                          ],
                          [
                            14.15,
                            3.15
                          ],
                          [
                            14,
                            3.5
                          ],
                          [
                            14,
                            5
                          ],
                          [
                            7,
                            5
                          ],
                          [
                            7,
                            3.5
                          ],
                          [
                            6.85,
                            3.15
                          ],
                          [
                            6.5,
                            3
                          ],
                          [
                            5.5,
                            3
                          ],
                          [
                            5.15,
                            3.15
                          ],
                          [
                            5,
                            3.5
                          ],
                          [
                            5,
                            5
                          ],
                          [
                            4,
                            5
                          ],
                          [
                            4,
                            15
                          ],
                          [
                            4.12,
                            15.58
                          ],
                          [
                            4.47,
                            16.13
                          ],
                          [
                            5.05,
                            16.63
                          ],
                          [
                            5.85,
                            17.08
                          ],
                          [
                            6.86,
                            17.46
                          ],
                          [
                            8.02,
                            17.75
                          ],
                          [
                            9.26,
                            17.94
                          ],
                          [
                            10.5,
                            18
                          ]
                        ],
                        [
                          [
                            7,
                            16
                          ],
                          [
                            7,
                            15
                          ],
                          [
                            14,
                            15
                          ],
                          [
                            14,
                            16
                          ],
                          [
                            7,
                            16
                          ]
                        ],
                        [
                          [
                            7,
                            6.5
                          ],
                          [
                            7,
                            7.5
                          ],
                          [
                            6.86,
                            7.86
                          ],
                          [
                            6.5,
                            8
                          ],
                          [
                            5.5,
                            8
                          ],
                          [
                            5.14,
                            7.86
                          ],
                          [
                            5,
                            7.5
                          ],
                          [
                            5,
                            6.5
                          ],
                          [
                            5.15,
                            6.15
                          ],
                          [
                            5.5,
                            6
                          ],
                          [
                            6.5,
                            6
                          ],
                          [
                            6.85,
                            6.15
                          ],
                          [
                            7,
                            6.5
                          ]
                        ],
                        [
                          [
                            16,
                            6.5
                          ],
                          [
                            16,
                            7.5
                          ],
                          [
                            15.86,
                            7.86
                          ],
                          [
                            15.5,
                            8
                          ],
                          [
                            14.5,
                            8
                          ],
                          [
                            14.15,
                            7.86
                          ],
                          [
                            14,
                            7.5
                          ],
                          [
                            14,
                            6.5
                          ],
                          [
                            14.15,
                            6.15
                          ],
                          [
                            14.5,
                            6
                          ],
                          [
                            15.5,
                            6
                          ],
                          [
                            15.85,
                            6.15
                          ],
                          [
                            16,
                            6.5
                          ]
                        ],
                        [
                          [
                            16,
                            9
                          ],
                          [
                            16,
                            14
                          ],
                          [
                            5,
                            14
                          ],
                          [
                            5,
                            9
                          ],
                          [
                            16,
                            9
                          ]
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
                          color: [
                            0,
                            0,
                            0,
                            255
                          ]
                        },
                        {
                          type: 'CIMSolidFill',
                          enable: true,
                          color: [
                            88,
                            89,
                            91,
                            255
                          ]
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
                size: 15.5,
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
                          [
                            0,
                            5
                          ],
                          [
                            0.87,
                            4.92
                          ],
                          [
                            1.71,
                            4.7
                          ],
                          [
                            2.5,
                            4.33
                          ],
                          [
                            3.21,
                            3.83
                          ],
                          [
                            3.83,
                            3.21
                          ],
                          [
                            4.33,
                            2.5
                          ],
                          [
                            4.7,
                            1.71
                          ],
                          [
                            4.92,
                            0.87
                          ],
                          [
                            5,
                            0
                          ],
                          [
                            4.92,
                            -0.87
                          ],
                          [
                            4.7,
                            -1.71
                          ],
                          [
                            4.33,
                            -2.5
                          ],
                          [
                            3.83,
                            -3.21
                          ],
                          [
                            3.21,
                            -3.83
                          ],
                          [
                            2.5,
                            -4.33
                          ],
                          [
                            1.71,
                            -4.7
                          ],
                          [
                            0.87,
                            -4.92
                          ],
                          [
                            0,
                            -5
                          ],
                          [
                            -0.87,
                            -4.92
                          ],
                          [
                            -1.71,
                            -4.7
                          ],
                          [
                            -2.5,
                            -4.33
                          ],
                          [
                            -3.21,
                            -3.83
                          ],
                          [
                            -3.83,
                            -3.21
                          ],
                          [
                            -4.33,
                            -2.5
                          ],
                          [
                            -4.7,
                            -1.71
                          ],
                          [
                            -4.92,
                            -0.87
                          ],
                          [
                            -5,
                            0
                          ],
                          [
                            -4.92,
                            0.87
                          ],
                          [
                            -4.7,
                            1.71
                          ],
                          [
                            -4.33,
                            2.5
                          ],
                          [
                            -3.83,
                            3.21
                          ],
                          [
                            -3.21,
                            3.83
                          ],
                          [
                            -2.5,
                            4.33
                          ],
                          [
                            -1.71,
                            4.7
                          ],
                          [
                            -0.87,
                            4.92
                          ],
                          [
                            0,
                            5
                          ]
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
                          // COLOR DEL BORDE
                          color: [
                            0,
                            0,
                            0,
                            20
                          ]
                        },
                        {
                          type: 'CIMSolidFill',
                          enable: true,
                          // COLOR DE RELLENO
                          color: [
                            0,
                            0,
                            0,
                            80
                          ]
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
      this.drawGraphics(paradas, false, paradasRestantes)
    }
  },
  computed: {
    posGPS: {
      get () { return this.$store.state.DataVuex.posGPS },
      set (val) { this.$store.commit('DataVuex/actualizarGPS', val) }
    },
    inputsFlag () {
      return (this.paradaOrigen && this.paradaDestino)
    }
  },
  destroyed () {
    trackWidget.stop()
  },
  mounted () {
    if (this.posGPS !== null) {
      this.showMapa = true
      // this.showTextLoading('Obteniendo tu ubicación actual')
      console.log('Ya hay gps en Vuex')
      posicion[0] = this.posGPS.latitude
      posicion[1] = this.posGPS.longitude
      this.Mapa()
    } else {
      this.solicitarGPS()
    }
  },
  created () {
    eventBus.$on('clickSearch', () => {
      if (((posicion[0] && posicion[1]) || this.paradaOrigen) && ((posicion[2] && posicion[3]) || this.paradaDestino)) {
        this.graphicsLayer.removeAll()
        this.$store.commit('DataVuex/updateMapCoords', posicion)
        eventBus.$emit('search', this.paradaOrigen, this.paradaDestino)
        eventBus.$emit('hideInputs')
      } else {
        this.showDestinoNotFound()
      }
    })
    eventBus.$on('usarGPS', () => {
      this.paradaOrigen = null
      this.graphicsLayer.removeAll()
      console.log('usando ubicacion actual')
      this.showTextLoading()
      this.solicitarGPS()
      this.puntoOrigen = new Graphic({
        geometry: {
          type: 'point',
          longitude: this.posGPS.longitude,
          latitude: this.posGPS.latitude
        },
        symbol: new WebStyleSymbol({
          name: 'esri-pin-2',
          styleName: 'Esri2DPointSymbolsStyle'
        })
      })
      this.setPuntoOrigen()
      this.stopTextLoading()
    })
    eventBus.$on('cancelGPS', () => {
      this.graphicsLayer2.graphics.shift()
      this.graphicsLayer.removeAll()
      this.puntoOrigen = null
      posicion[0] = 0
      posicion[1] = 0
      eventBus.$emit('changeCoords')
    })
    eventBus.$on('borrarParadaInput', (type) => {
      this.graphicsLayer.removeAll()
      console.log('Borrando parada de ', type)
      eventBus.$emit('changeCoords')
      if (type === 'destino') {
        this.paradaDestino = null
        this.graphicsLayer2.graphics.pop()
      } else {
        this.paradaOrigen = null
        this.graphicsLayer2.graphics.shift()
      }
    })
    eventBus.$on('dibujarParadaInput', (parada, type) => {
      this.graphicsLayer.removeAll()
      console.log('parada añadida', parada)
      if (trackWidget.tracking) {
        this.stopTracking(false)
      }
      eventBus.$emit('changeCoords')
      if (type === 'destino') {
        posicion[2] = 0
        posicion[3] = 0
        this.paradaDestino = parada
        if (this.graphicsLayer2.graphics.length > 1) {
          this.graphicsLayer2.graphics.pop()
        }
      } else {
        if ((posicion[0] && posicion[1]) || this.paradaOrigen) {
          this.graphicsLayer2.graphics.shift()
        }
        this.puntoOrigen = null
        this.paradaOrigen = parada
        posicion[0] = 0
        posicion[1] = 0
      }
      const symbol = new CIMSymbol({
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
                          [
                            10.5,
                            18
                          ],
                          [
                            11.74,
                            17.94
                          ],
                          [
                            12.98,
                            17.75
                          ],
                          [
                            14.14,
                            17.46
                          ],
                          [
                            15.15,
                            17.08
                          ],
                          [
                            15.95,
                            16.63
                          ],
                          [
                            16.53,
                            16.13
                          ],
                          [
                            16.88,
                            15.58
                          ],
                          [
                            17,
                            15
                          ],
                          [
                            17,
                            5
                          ],
                          [
                            16,
                            5
                          ],
                          [
                            16,
                            3.5
                          ],
                          [
                            15.85,
                            3.15
                          ],
                          [
                            15.5,
                            3
                          ],
                          [
                            14.5,
                            3
                          ],
                          [
                            14.15,
                            3.15
                          ],
                          [
                            14,
                            3.5
                          ],
                          [
                            14,
                            5
                          ],
                          [
                            7,
                            5
                          ],
                          [
                            7,
                            3.5
                          ],
                          [
                            6.85,
                            3.15
                          ],
                          [
                            6.5,
                            3
                          ],
                          [
                            5.5,
                            3
                          ],
                          [
                            5.15,
                            3.15
                          ],
                          [
                            5,
                            3.5
                          ],
                          [
                            5,
                            5
                          ],
                          [
                            4,
                            5
                          ],
                          [
                            4,
                            15
                          ],
                          [
                            4.12,
                            15.58
                          ],
                          [
                            4.47,
                            16.13
                          ],
                          [
                            5.05,
                            16.63
                          ],
                          [
                            5.85,
                            17.08
                          ],
                          [
                            6.86,
                            17.46
                          ],
                          [
                            8.02,
                            17.75
                          ],
                          [
                            9.26,
                            17.94
                          ],
                          [
                            10.5,
                            18
                          ]
                        ],
                        [
                          [
                            7,
                            16
                          ],
                          [
                            7,
                            15
                          ],
                          [
                            14,
                            15
                          ],
                          [
                            14,
                            16
                          ],
                          [
                            7,
                            16
                          ]
                        ],
                        [
                          [
                            7,
                            6.5
                          ],
                          [
                            7,
                            7.5
                          ],
                          [
                            6.86,
                            7.86
                          ],
                          [
                            6.5,
                            8
                          ],
                          [
                            5.5,
                            8
                          ],
                          [
                            5.14,
                            7.86
                          ],
                          [
                            5,
                            7.5
                          ],
                          [
                            5,
                            6.5
                          ],
                          [
                            5.15,
                            6.15
                          ],
                          [
                            5.5,
                            6
                          ],
                          [
                            6.5,
                            6
                          ],
                          [
                            6.85,
                            6.15
                          ],
                          [
                            7,
                            6.5
                          ]
                        ],
                        [
                          [
                            16,
                            6.5
                          ],
                          [
                            16,
                            7.5
                          ],
                          [
                            15.86,
                            7.86
                          ],
                          [
                            15.5,
                            8
                          ],
                          [
                            14.5,
                            8
                          ],
                          [
                            14.15,
                            7.86
                          ],
                          [
                            14,
                            7.5
                          ],
                          [
                            14,
                            6.5
                          ],
                          [
                            14.15,
                            6.15
                          ],
                          [
                            14.5,
                            6
                          ],
                          [
                            15.5,
                            6
                          ],
                          [
                            15.85,
                            6.15
                          ],
                          [
                            16,
                            6.5
                          ]
                        ],
                        [
                          [
                            16,
                            9
                          ],
                          [
                            16,
                            14
                          ],
                          [
                            5,
                            14
                          ],
                          [
                            5,
                            9
                          ],
                          [
                            16,
                            9
                          ]
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
                          color: [
                            0,
                            0,
                            0,
                            255
                          ]
                        },
                        {
                          type: 'CIMSolidFill',
                          enable: true,
                          color: [
                            88,
                            89,
                            91,
                            255
                          ]
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
                size: 18.5,
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
                          [
                            0,
                            5
                          ],
                          [
                            0.87,
                            4.92
                          ],
                          [
                            1.71,
                            4.7
                          ],
                          [
                            2.5,
                            4.33
                          ],
                          [
                            3.21,
                            3.83
                          ],
                          [
                            3.83,
                            3.21
                          ],
                          [
                            4.33,
                            2.5
                          ],
                          [
                            4.7,
                            1.71
                          ],
                          [
                            4.92,
                            0.87
                          ],
                          [
                            5,
                            0
                          ],
                          [
                            4.92,
                            -0.87
                          ],
                          [
                            4.7,
                            -1.71
                          ],
                          [
                            4.33,
                            -2.5
                          ],
                          [
                            3.83,
                            -3.21
                          ],
                          [
                            3.21,
                            -3.83
                          ],
                          [
                            2.5,
                            -4.33
                          ],
                          [
                            1.71,
                            -4.7
                          ],
                          [
                            0.87,
                            -4.92
                          ],
                          [
                            0,
                            -5
                          ],
                          [
                            -0.87,
                            -4.92
                          ],
                          [
                            -1.71,
                            -4.7
                          ],
                          [
                            -2.5,
                            -4.33
                          ],
                          [
                            -3.21,
                            -3.83
                          ],
                          [
                            -3.83,
                            -3.21
                          ],
                          [
                            -4.33,
                            -2.5
                          ],
                          [
                            -4.7,
                            -1.71
                          ],
                          [
                            -4.92,
                            -0.87
                          ],
                          [
                            -5,
                            0
                          ],
                          [
                            -4.92,
                            0.87
                          ],
                          [
                            -4.7,
                            1.71
                          ],
                          [
                            -4.33,
                            2.5
                          ],
                          [
                            -3.83,
                            3.21
                          ],
                          [
                            -3.21,
                            3.83
                          ],
                          [
                            -2.5,
                            4.33
                          ],
                          [
                            -1.71,
                            4.7
                          ],
                          [
                            -0.87,
                            4.92
                          ],
                          [
                            0,
                            5
                          ]
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
                          // COLOR DEL BORDE
                          color: [
                            0,
                            0,
                            0,
                            255
                          ]
                        },
                        {
                          type: 'CIMSolidFill',
                          enable: true,
                          // COLOR DE RELLENO
                          color: [
                            0,
                            222,
                            185,
                            70
                          ]
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
      const point = {
        type: 'point',
        longitude: parada.gps._long,
        latitude: parada.gps._lat
      }
      const mediaInfos = []
      // Get parada images
      for (const image of parada.fotos) {
        mediaInfos.push({
          value: {
            sourceURL: image
          }
        })
      }
      const popupTemplate = {
        title: '{Name}',
        content: [
          {
            type: 'fields',
            fieldInfos: [
              {
                fieldName: 'Cercanos',
                label: 'Lugares Cercanos'
              },
              {
                fieldName: 'Referencia'
              }
            ]
          },
          {
            type: 'media',
            mediaInfos
          }
        ]
      }
      const attributes = {
        Name: 'Parada de Bus ' + parada.nombre,
        Cercanos: parada.lugaresCercanos,
        Referencia: parada.referencia
      }
      if (type === 'origen') {
        this.graphicsLayer2.graphics.unshift(new Graphic({
          geometry: point,
          symbol,
          attributes,
          popupTemplate
        }))
        posicion[0] = 0
        posicion[1] = 0
        this.view.goTo({
          center: [parada.gps._long, parada.gps._lat]
        }).catch(error => {
          if (error.name !== 'AbortError') {
            console.error(error)
          }
        })
      } else {
        this.graphicsLayer2.graphics.push(new Graphic({
          geometry: point,
          symbol,
          attributes,
          popupTemplate
        }))
        posicion[2] = 0
        posicion[3] = 0
      }
    })
    eventBus.$on('updatePosGPS', (coords) => {
      this.posGPS = coords
    })
    eventBus.$on('stopLoading', () => {
      this.stopTextLoading()
    })
    eventBus.$on('DrawRecorrido1', (paradasDestino, paradas) => {
      this.graphicsLayer.removeAll()
      this.drawParadasRecorrido(paradasDestino)
      this.drawParadasRestantes(paradas)
    })
    eventBus.$on('DrawRecorrido2', (paradasRuta1, paradasRuta2) => {
      this.graphicsLayer.removeAll()
      this.drawParadasRecorrido(paradasRuta1)
      this.drawParadasRecorrido(paradasRuta2)
    })
  }
}
</script>

<style scoped>
@import '~@arcgis/core/assets/esri/themes/light/main.css';
</style>
