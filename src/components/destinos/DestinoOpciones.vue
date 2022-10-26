
<template>
  <div class="full-width results">
    <div v-if="!recorridos1Bus.length && !recorridos2Bus.length" class="container">
      <q-img  src="../../assets/destinos_not_found.webp"
          style="width: 100%; max-width: 620px; height: auto; margin: 0 auto;"
        >
          <div class="absolute-top q-mt-lg text-subtitle1 text-center">
            No hay recorridos disponibles
          </div>
    </q-img>
    </div>
    <!-- Resultados con 1 bus -->
    <div v-if="recorridos1Bus.length" class="header-results text-overline q-mb-sm q-px-lg q-pt-md shadow-2">
      Recorridos con 1 Bus
    </div>
    <div  class="shadow-5 box" rounded>
      <div v-for="ruta in this.recorridos1Bus" :key="ruta.id"  class="q-ma-xs col-12">
        <detallesRecorridos1Bus :ruta="ruta"/>
      </div>
    </div>
    <!-- Resultados con 2 buses -->
    <div v-if="recorridos2Bus.length" class="header-results text-overline q-mb-sm q-px-lg q-pt-md shadow-2">
      Recorridos con 2 Buses
    </div>
    <div  class="shadow-5 box" rounded>
      <div  v-for="recorrido in this.recorridos2Bus" :key="recorrido.id" class="q-ma-xs col-12">
        <detallesRecorridos2Buses :recorrido="recorrido"/>
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from 'app/src/eventBus'
import detallesRecorridos2Buses from 'src/components/destinos/detallesRecorridos2Buses.vue'
import detallesRecorridos1Bus from 'src/components/destinos/detallesRecorridos1Bus.vue'

export default {
  name: 'destinoFavorito',
  components: { detallesRecorridos2Buses, detallesRecorridos1Bus },
  data () {
    return {
      recorridos1Bus: [],
      recorridos2Bus: [],
      LRutas: [],
      LParadas: []
    }
  },
  methods: {
    CalcularDistanciaLatLon (Lat1, Lon1, Lat2, Lon2) {
    /*
    * Utilizamos dos coordenadas como parametro para realizar el calculo
    * Declaramos el radio de la Tierra para realizar los calculos
    */
      const RadioTierra = 6378.137
      const DistLat = this.DistanciaLatLon((Lat2 - Lat1))
      const DistLon = this.DistanciaLatLon((Lon2 - Lon1))
      const a = Math.sin(DistLat / 2) * Math.sin(DistLat / 2) + Math.cos(this.DistanciaLatLon(Lat1)) * Math.cos(this.DistanciaLatLon(Lat2)) * Math.sin(DistLon / 2) * Math.sin(DistLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const DistanciaEntreCoordenadas = RadioTierra * c * 1000
      return DistanciaEntreCoordenadas
    },
    DistanciaLatLon (LatLon) {
      const ValorObtenido = LatLon
      const Distancia = ValorObtenido * Math.PI / 180
      return Distancia
    },
    orderByDistPA2 (arrayRecorridos) {
      // si 2 recorridos nos dejan a la misma distancia entonces vamos a buscar el que tenga la distancia de la parada de bajada1 hacia la parada de abordaje del segundo bus
      for (let recorrido = 1; recorrido < arrayRecorridos.length; recorrido++) {
        for (let i = 0; i < (arrayRecorridos.length - recorrido); i++) {
          if (arrayRecorridos[i].distPD === arrayRecorridos[i + 1].distPD) {
            if (arrayRecorridos[i].distParadaAbordaje2 > arrayRecorridos[i + 1].distParadaAbordaje2) {
              const aux = arrayRecorridos[i]
              arrayRecorridos[i] = arrayRecorridos[i + 1]
              arrayRecorridos[i + 1] = aux
            }
          }
        }
      }

      // Luego los ordenamos por el tiempo de recorrido
      for (let recorrido = 1; recorrido < arrayRecorridos.length; recorrido++) {
        for (let i = 0; i < (arrayRecorridos.length - recorrido); i++) {
          if (arrayRecorridos[i].distParadaAbordaje2 === arrayRecorridos[i + 1].distParadaAbordaje2) {
            if (arrayRecorridos[i].tiempoTotal > arrayRecorridos[i + 1].tiempoTotal) {
              const aux = arrayRecorridos[i]
              arrayRecorridos[i] = arrayRecorridos[i + 1]
              arrayRecorridos[i + 1] = aux
            }
          }
        }
      }

      return arrayRecorridos
    },
    orderByTime (arrayRecorridos) {
      for (let recorrido = 1; recorrido < arrayRecorridos.length; recorrido++) {
        for (let i = 0; i < (arrayRecorridos.length - recorrido); i++) {
          if (arrayRecorridos[i].distPD === arrayRecorridos[i + 1].distPD) {
            if (arrayRecorridos[i].tiempoTotal > arrayRecorridos[i + 1].tiempoTotal) {
              const aux = arrayRecorridos[i]
              arrayRecorridos[i] = arrayRecorridos[i + 1]
              arrayRecorridos[i + 1] = aux
            }
          }
        }
      }

      return arrayRecorridos
    },
    EncontrarDestino1Bus (paradasArray) {
      const rutasEncontradas = [] // array donde se guardarán todas las rutas que el usuario puede tomar para realizar su recorrido
      const recorridos = ['ida', 'vuelta']

      console.log('Paradas cercanas encontradas')
      console.log('Origen:  ')
      console.log(paradasArray[0])
      console.log('Destino:  ')
      console.log(paradasArray[1])

      // hacemos el procesod de busqueda en ambos sentidos (ida y vuelta)
      for (const i of recorridos) {
        console.log('Reocrrido de  ' + i)

        // Iteramos en cada ruta
        for (const j of this.LRutas) {
          console.log('\n\n\tRuta ' + j.nombre)
          let posicionParadaOrigen = 0
          let posicionParadaDestino = 0
          let hasParadaOrigen = false
          let hasParadaDestino = false
          let distanciaParadaFin = 0
          let distanciaParadaIni = 0

          // Iteranmos en cada una de las paradas del recorrido en el iterador i
          for (const parada of paradasArray[0]) {
            if (j[i].paradas.map(parada => parada.nombre).includes(parada.nombre)) {
              posicionParadaOrigen = j[i].paradas.map(parada => parada.nombre).indexOf(parada.nombre)
              distanciaParadaIni = parada.distancia
              hasParadaOrigen = true
              break
            }
          }
          for (const parada of paradasArray[1]) {
            if (j[i].paradas.map(parada => parada.nombre).includes(parada.nombre)) {
              posicionParadaDestino = j[i].paradas.map(parada => parada.nombre).indexOf(parada.nombre)
              distanciaParadaFin = parada.distancia
              hasParadaDestino = true
              break
            }
          }
          if (hasParadaOrigen && hasParadaDestino) {
            if (posicionParadaOrigen < posicionParadaDestino) {
              console.log('\n\n\t\t\tAñadiendo ruta ' + j.nombre)
              j.tiempoRecorrido = ((+j[i].tiempo) / j[i].paradas.length) * j[i].paradas.slice(posicionParadaOrigen, posicionParadaDestino + 1).length
              j.distParadaInicio = distanciaParadaIni
              j.nameParadaIni = j[i].paradas[posicionParadaOrigen].nombre
              j.nameParadaFin = j[i].paradas[posicionParadaDestino].nombre
              j.distParadaFin = distanciaParadaFin
              j.paradasDestino = j[i].paradas.slice(posicionParadaOrigen, posicionParadaDestino + 1)
              j.paradas = j[i].paradas.filter(parada => !j.paradasDestino.map(parada => parada.nombre).includes(parada.nombre))
              rutasEncontradas.push(j)
            }
          }
        }
      }
      console.log('Rutas encontradasssssssss')
      console.log(rutasEncontradas)
      eventBus.$emit('updateHeightMap', (rutasEncontradas.length > 0) ? 50 : 81, (rutasEncontradas.length > 0) ? 45 : 68)
      eventBus.$emit('showPublicidad', (rutasEncontradas.length > 0))
      return rutasEncontradas
    },
    EncontrarParadasCercanas (Lat1, Lon1, Lat2, Lon2, paradaOrigen, paradaDestino) {
    /*
    * Este metodo lo utilizaremos para encontrar si con las coordenadas proporcionadas
    * de punto de partida y punto de llegada, ubicamos las paradas más cercanas en la
    * partida y la llegada
    * Lat1 y Lon1 son las coordenadas del punto de partida
    * Lat2 y Lon2 son las coordenadas del punto de llegada
    */
      console.log('paradas recibidas de inputs: ')
      console.log('Origen: ', paradaOrigen)
      console.log('Destino: ', paradaDestino)

      // Array pàra guardar las paradas cercanas, en la primera posición se guardarán las cercanas al punto de origen y en la segunda posicion las cercanas al punto de destino
      const ParadasEncontradas = [[], []]
      if (paradaOrigen) {
        if (paradaDestino) {
          // iteramos a traves de cada parada
          ParadasEncontradas[0].push(paradaOrigen)
          ParadasEncontradas[1].push(paradaDestino)
        } else {
          ParadasEncontradas[0].push(paradaOrigen)
          for (const parada of this.LParadas) {
            const DistanciaDP = this.CalcularDistanciaLatLon(Lat2, Lon2, parada.gps._lat, parada.gps._long)

            // Comprobando que la parada esté en el rango determinado en el proyecto
            if (DistanciaDP <= 500) {
              parada.value = null
              parada.distancia = DistanciaDP
              ParadasEncontradas[1].push(parada)
            }
          }
        }
      } else {
        if (paradaDestino) {
          // iteramos a traves de cada parada
          ParadasEncontradas[1].push(paradaDestino)
          for (const parada of this.LParadas) {
            const DistanciaOP = this.CalcularDistanciaLatLon(Lat1, Lon1, parada.gps._lat, parada.gps._long)

            // Comprobando que la parada esté en el rango determinado en el proyecto

            if (DistanciaOP <= 500) {
              parada.value = null
              parada.distancia = DistanciaOP
              ParadasEncontradas[0].push(parada)
            }
          }
        } else {
          // iteramos a traves de cada parada
          for (const parada of this.LParadas) {
            const DistanciaOP = this.CalcularDistanciaLatLon(Lat1, Lon1, parada.gps._lat, parada.gps._long)
            const DistanciaDP = this.CalcularDistanciaLatLon(Lat2, Lon2, parada.gps._lat, parada.gps._long)

            // Comprobando que la parada esté en el rango determinado en el proyecto

            if (DistanciaOP <= 500) {
              parada.value = null
              parada.distancia = DistanciaOP
              ParadasEncontradas[0].push(parada)
            }
            if (DistanciaDP <= 500) {
              parada.value = null
              parada.distancia = DistanciaDP
              ParadasEncontradas[1].push(parada)
            }
          }
        }
      }

      // Ordenamos
      ParadasEncontradas.forEach(punto => punto.sort((a, b) => {
        return a.distancia - b.distancia
      }))
      return ParadasEncontradas
    },
    EncontrarDestino2Bus (paradasArray) {
      /*
      * Función para buscar las rutas de Bus que pasan por la parada cercana al punto de llegada
      * paradasArray[1] es la parada mas cercana encontrada al punto de destino
      */
      const rutasDestinoEncontradas = [] // array donde se guardarán todas las rutas que el usuario puede tomar en el punto de origen
      const rutasOrigenEncontradas = [] // array donde se guardarán todas las rutas que pasan por el punto de destino
      let recorridos2Buses = [] // array donde se guardarán todos los recorridos con 2 buses que puede hacer el usuario para llegar a su destino
      const recorridos = ['ida', 'vuelta']

      //  ____________________________________________________________________________________________
      // |                                                                                            |
      // | SI QUIEREN VER LAS PARADAS CERCANAS ENCONTRADAS QUE PASAN POR EL PUNTO DE ORIGEN Y DESTINO |
      // |                                                                                            |
      // | ___________________________________________________________________________________________|

      /*
      console.log('Paradas cercanas al origen')
      console.log(paradasArray[0].map(parada => parada.nombre))
      console.log('Paradas cercanas al destino')
      console.log(paradasArray[1].map(parada => parada.nombre))
      */

      // Paradas que pasan por el punto de origen
      for (const i of recorridos) {
        // console.log('Reocrrido de  ' + i)
        // Iteramos en cada ruta
        for (const j of this.LRutas) {
          // console.log('\n\n\tRuta ' + j.nombre)
          let hasParadaOrigen = false
          let posicionParadaOrigen = 0
          let distancia1 = 0
          let distancia2 = 0

          // Comprobando si tiene parada cercana al origen
          if (paradasArray[0][0].value) {
            console.log('PARADA DE ORIGEN PROVENIENTE DE UN INPUT')
            // Iteranmos en cada una de las paradas del recorrido en el iterador i
            for (let k = 0; k < j[i].paradas.length; k++) {
              if (paradasArray[0][0].nombre === j[i].paradas[k].nombre) {
                posicionParadaOrigen = k
                hasParadaOrigen = true
                break
              }
            }
          } else {
            // Iteranmos en cada una de las paradas del recorrido en el iterador i
            for (let k = 0; k < j[i].paradas.length; k++) {
              for (let l = 0; l < paradasArray[0].length; l++) {
                if (paradasArray[0][l].nombre === j[i].paradas[k].nombre) {
                  if (distancia1 === 0) {
                    distancia1 = paradasArray[0][l].distancia
                    posicionParadaOrigen = k
                    hasParadaOrigen = true
                  } else {
                    distancia2 = paradasArray[0][l].distancia
                    if (distancia1 > distancia2) {
                      distancia1 = distancia2
                      posicionParadaOrigen = k
                    }
                  }
                  break
                }
              }
            }
          }
          if (hasParadaOrigen) {
          // console.log('\n\n\t\t\tAñadiendo ruta ' + j.nombre)
            rutasOrigenEncontradas.push({
              id: j.id,
              nombre: j.nombre,
              recorrido: i,
              precios: j.precios,
              frecuencia: j.frecuencia,
              paradasObj: j[i].paradas,
              distancia: distancia1,
              tiempoPorParada: (j[i].tiempo) / j[i].paradas.length,
              paradaCercanaPuntoOrigen: j[i].paradas[posicionParadaOrigen],
              paradasName: j[i].paradas.map(parada => parada.nombre),
              posicionParadaOrigenCercana: j[i].paradas.map(parada => parada.nombre).indexOf(j[i].paradas[posicionParadaOrigen].nombre)
            })
          }
        }
      }

      for (const i of recorridos) {
        // console.log('Reocrrido de  ' + i)

        // Iteramos en cada ruta
        for (const j of this.LRutas) {
          // console.log('\n\n\tRuta ' + j.nombre)
          let hasParadaDestino = false
          let posicionParadaDestino = 0
          let paradaDestinoCercana = ''
          let distancia1 = 0
          let distancia2 = 0

          // Iteranmos en cada una de las paradas del recorrido en el iterador i
          // Si la ruta ya tiene ambas paradas cercanas, salimos
          // console.log('\n\n\t\tComprobando si la parada ' + j[i].paradas[k].nombre + ' de la ruta ' + j.nombre + ' está cercana a algun punto del recorrido')
          // console.log('\n\n\t\t\t\tComprobando en las paradas cercanas al punto de destino')
          if (paradasArray[1][0].value) {
            console.log('PARADA DE DESTINO PROVENIENTE DE UN INPUT')
            for (let k = 0; k < j[i].paradas.length; k++) {
              if (paradasArray[1][0].nombre === j[i].paradas[k].nombre) {
                hasParadaDestino = true
                posicionParadaDestino = k
                paradaDestinoCercana = paradasArray[1][0].nombre
                distancia1 = 0
                break
              }
            }
          } else {
            for (let k = 0; k < j[i].paradas.length; k++) {
              for (let l = 0; l < paradasArray[1].length; l++) {
                if (paradasArray[1][l].nombre === j[i].paradas[k].nombre) {
                  if (distancia1 === 0) {
                    distancia1 = paradasArray[1][l].distancia
                    posicionParadaDestino = k
                    paradaDestinoCercana = paradasArray[1][l].nombre
                    hasParadaDestino = true
                  } else {
                    distancia2 = paradasArray[1][l].distancia
                    if (distancia1 > distancia2) {
                      distancia1 = distancia2
                      posicionParadaDestino = k
                      paradaDestinoCercana = paradasArray[1][l].nombre
                    }
                  }
                  break
                }
              }
            }
          }
          if (hasParadaDestino) {
            // console.log('\n\n\t\t\tAñadiendo ruta ' + j.nombre)
            rutasDestinoEncontradas.push({
              id: j.id,
              nombre: j.nombre,
              recorrido: i,
              precios: j.precios,
              frecuencia: j.frecuencia,
              tiempoPorParada: (j[i].tiempo) / j[i].paradas.length,
              distancia: distancia1,
              paradasObj: j[i].paradas,
              posicion: posicionParadaDestino,
              paradaDestinoCercana,
              paradasName: j[i].paradas.slice(0, posicionParadaDestino + 1).map(parada => parada.nombre)
            })
          }
        }
      }

      for (const paradasRuta of rutasOrigenEncontradas.map(ruta => ruta.paradasObj)) {
        for (let posicion = 0; posicion < paradasRuta.length; posicion++) {
          paradasRuta[posicion].paradasCercanas = []
          for (const parada of this.LParadas) {
            if (paradasRuta.map(parada => parada.nombre).includes(parada.nombre)) {
              continue
            } else {
              const DistanciaOP = this.CalcularDistanciaLatLon(paradasRuta[posicion].gps._lat, paradasRuta[posicion].gps._long, parada.gps._lat, parada.gps._long)

              // Comprobando que la parada esté en el rango determinado

              if (DistanciaOP <= 500 && DistanciaOP >= 0) {
                parada.distancia = DistanciaOP
                paradasRuta[posicion].paradasCercanas.push({
                  nombre: parada.nombre,
                  distancia: DistanciaOP,
                  gps: parada.gps
                })
              }
            }
          }
          paradasRuta[posicion].paradasCercanas.sort((a, b) => {
            return a.distancia - b.distancia
          })
        }
      }

      //  _________________________________________________________________________________
      // |                                                                                 |
      // | SI QUIEREN VER LAS RUTAS ENCONTRADAS QUE PASAN POR EL PUNTO DE ORIGEN Y DESTINO |
      // |                                                                                 |
      // | _______________________________________________________________________________ |

      /* _________________________________________________________________________________________
      // |                                                                                         |
      // | SI QUIEREN VER LAS PARADAS CERCANAS A CADA PARADA DE LAS RUTAS DE ORIGEN ENCONTRADAS    |
      // |                                                                                         |
      // | ________________________________________________________________________________________|

      for (const ruta of rutasOrigenEncontradas) {
        for (const parada of ruta.paradasObj) {
          console.log('Parada ' + parada.nombre)
          console.log('\n\tParadas Cercanas\n')
          for (const paradaCercana of parada.paradasCercanas) {
            console.log('\t\tParada ' + paradaCercana.nombre + ' - distancia: ' + paradaCercana.distancia)
          }
        }
      }
      */
      console.log('Origennnnn')
      console.log(rutasOrigenEncontradas)
      console.log('Destinoooo')
      console.log(rutasDestinoEncontradas)
      // Cada ruta que tiene paradas cercanas en punto origen

      const rutasDestinoNames = rutasDestinoEncontradas.map(ruta => ruta.nombre)
      for (const rutaOrigen of rutasOrigenEncontradas) {
        console.log('\n\n_________________________________________________________________________________________________________________________________')
        console.log('\nObteniendo Transbordos para Ruta ' + rutaOrigen.nombre + ' - pos: ' + rutaOrigen.posicionParadaOrigenCercana + '\n\n')
        // por cada parada de esa ruta
        const recorridosPorRuta = []
        for (const paradaRuta of (rutasDestinoNames.includes(rutaOrigen.nombre)) ? rutaOrigen.paradasObj.slice(rutaOrigen.posicionParadaOrigenCercana + 1, rutasDestinoEncontradas[rutasDestinoNames.indexOf(rutaOrigen.nombre)].posicion) : rutaOrigen.paradasObj.slice(rutaOrigen.posicionParadaOrigenCercana + 2)) {
          let recorridosPorParada = []
          // por cada parada cercana de esa parada
          console.log('\n\tParada ' + paradaRuta.nombre + ' - pos dentro del recorrido: ' + rutaOrigen.paradasName.indexOf(paradaRuta.nombre))
          for (const paradaCercana of paradaRuta.paradasCercanas) {
            // por cada ruta que pasa cerca del punto de destino
            console.log('\n\t\tParada cercana ' + paradaCercana.nombre)
            for (const rutaDestino of rutasDestinoEncontradas) {
              //
              console.log('\n\t\t\tBuscando en ruta de destino ' + rutaDestino.nombre + '.....')
              if (rutaDestino.paradasName.includes(paradaCercana.nombre)) {
                if (this.CalcularDistanciaLatLon(rutaOrigen.paradaCercanaPuntoOrigen.gps._lat, rutaOrigen.paradaCercanaPuntoOrigen.gps._long, paradaCercana.gps._lat, paradaCercana.gps._long) <= paradaCercana.distancia) {
                  continue
                } else {
                  if (rutaDestino.nombre === rutaOrigen.nombre && rutaDestino.recorrido === rutaOrigen.recorrido) {
                    continue
                  } else {
                  //
                    if (rutaDestino.paradasName.indexOf(paradaCercana.nombre) >= rutaDestino.paradasName.indexOf(rutaDestino.paradaDestinoCercana)) {
                      continue
                    } else {
                      if (rutaDestino.posicion - rutaDestino.paradasName.indexOf(paradaCercana.nombre) >= 2) {
                        // Calculando el tiempo recorrido en la ruta de origen
                        let posicion = rutaOrigen.paradasName.indexOf(paradaRuta.nombre) // posicion de la parada donde se baja la ruta 1
                        const nParadasRecorridasRuta1 = posicion - rutaOrigen.posicionParadaOrigenCercana // total de paradas recorridas en la ruta 1
                        const tiempoRecorridoRuta1 = nParadasRecorridasRuta1 * rutaOrigen.tiempoPorParada

                        // Calculando el tiempo recorrido en la ruta de destino
                        posicion = rutaDestino.paradasName.indexOf(paradaCercana.nombre) // posicion de la parada donde se aborda la ruta 2
                        const nParadasRecorridasRuta2 = rutaDestino.posicion - posicion // total de paradas recorridas en la ruta 2
                        console.log('Numero de paradas para la ruta 2 : ', nParadasRecorridasRuta2)
                        const tiempoRecorridoRuta2 = nParadasRecorridasRuta2 * rutaDestino.tiempoPorParada

                        console.log('\n\t\t\t Añadiendo recorrido')
                        recorridosPorParada.push({
                          id: rutaOrigen.id + rutaDestino.id,
                          recorridoRuta1: rutaOrigen.recorrido,
                          recorridoRuta2: rutaDestino.recorrido,
                          frecuenciaRuta1: rutaOrigen.frecuencia,
                          preciosRuta1: rutaOrigen.precios,
                          paradasRuta1: rutaOrigen.paradasObj.slice(rutaOrigen.paradasName.indexOf(rutaOrigen.paradaCercanaPuntoOrigen.nombre), rutaOrigen.paradasName.indexOf(paradaRuta.nombre) + 1), // array de todas las paradas de recorrido para la ruta 1, posteriormente se estará renderizando estas paradas en el mapa
                          nombreRecorrido: rutaOrigen.nombre + '  con  ' + rutaDestino.nombre,
                          paradaAbordaje1: rutaOrigen.paradaCercanaPuntoOrigen.nombre, // Parada donde se toma el primer bus
                          distParadaAbordaje1: rutaOrigen.distancia.toFixed(2), // Distancia del punto de origen hacia la parada de abordaje del primer bus
                          ruta1: rutaOrigen.nombre, // Primer Ruta de Bus a abordar
                          paradaBajada1: paradaRuta.nombre, // Parada a bajarse de la ruta 1,
                          tiempoRuta1: tiempoRecorridoRuta1, // tiempo de recorrido hecho en la ruta 1
                          paradasRuta2: rutaDestino.paradasObj.slice(rutaDestino.paradasName.indexOf(paradaCercana.nombre), rutaDestino.paradasName.indexOf(rutaDestino.paradaDestinoCercana) + 1),
                          paradaAbordaje2: paradaCercana.nombre, // Parada donde se toma el segundo bus
                          distParadaAbordaje2: paradaCercana.distancia.toFixed(2), // Distancia de la parada de bajada1 hacia la parada de abordaje del segundo bus
                          ruta2: rutaDestino.nombre, // Segunda Ruta de Bus a abordar
                          frecuenciaRuta2: rutaDestino.frecuencia,
                          preciosRuta2: rutaDestino.precios,
                          paradaBajada2: rutaDestino.paradaDestinoCercana, // Parada a bajarse de la ruta 2
                          tiempoRuta2: tiempoRecorridoRuta2, // tiempo de recorrido hecho en la ruta 2
                          distPD: rutaDestino.distancia.toFixed(2), // Distancia de la parada de bajada2 hacia el punto de destino
                          tiempoTotal: (tiempoRecorridoRuta1 + tiempoRecorridoRuta2).toFixed(2)

                        })
                      }
                    // console.log('\n\t\t\t  ________________________________________________________________________________________________________________________\n')
                    // console.log('\t\t\t |                                                                                                                          ')
                    // console.log('\t\t\t |  1 - Caminar ' + rutaOrigen.distancia + ' metros hasta la parada ' + rutaOrigen.paradaCercanaPuntoOrigen.nombre)
                    // console.log('\t\t\t |  2 - Abordar la Ruta ' + rutaOrigen.nombre + ' en el recorrido de ' + rutaOrigen.recorrido)
                    // console.log('\t\t\t |  3 - Bajarse en ' + paradaRuta.nombre)
                    // console.log('\t\t\t |           Tiempo por parada: ' + rutaOrigen.tiempoPorParada)
                    // console.log('\t\t\t |           Paradas recorridas: ' + nParadasRecorridasRuta1)
                    // console.log('\t\t\t |           Tiempo total: ' + tiempoRecorridoRuta1)
                    // console.log('\t\t\t |  4 - Caminar ' + paradaCercana.distancia + ' metros hasta la parada ' + paradaCercana.nombre)
                    // console.log('\t\t\t |  5 - Abordar Ruta ' + rutaDestino.nombre + ' en recorrido de ' + rutaDestino.recorrido)
                    // console.log('\t\t\t |  6 - Bajarse en ' + rutaDestino.paradaDestinoCercana)
                    // console.log('\t\t\t |           Tiempo por parada: ' + rutaDestino.tiempoPorParada)
                    // console.log('\t\t\t |           Paradas recorridas: ' + nParadasRecorridasRuta2)
                    // console.log('\t\t\t |           Tiempo total: ' + tiempoRecorridoRuta2)
                    // console.log('\t\t\t |  7 - Caminar ' + rutaDestino.distancia + ' metros hasta tu punto de destino')
                    // console.log('\t\t\t |  Distancia total: ' + (rutaOrigen.distancia + paradaCercana.distancia + rutaDestino.distancia))
                    // console.log('\t\t\t |__________________________________________________________________________________________________________________________\n')
                    }
                  }
                }
              } else {
                console.log('\t\t\tLa ruta no pasa por la parada ' + paradaCercana.nombre)
              }
            }
          }

          if (recorridosPorParada.length > 0) {
            // ordenamos por la distancia del punto de destino a la que deja cada recorrido encontrado
            recorridosPorParada.sort((a, b) => {
              return a.distPD - b.distPD
            })

            recorridosPorParada = this.orderByDistPA2(recorridosPorParada)
            console.log('\n\n\tOpciones de recorridos por parada ordenados')
            console.log(recorridosPorParada)
            recorridosPorRuta.push(recorridosPorParada[0])
          } else {
            continue
          }
        }

        // Si se encontraron recorridos en la actual ruta se ordenan
        if (recorridosPorRuta.length > 0) {
          // Primero se ordenan para saber cuales son los que dejan mas cerca
          recorridosPorRuta.sort((a, b) => {
            return a.distPD - b.distPD
          })
          console.log('\n\nOpciones de recorridos por ruta ordenados')
          console.log(recorridosPorRuta)
          recorridos2Buses.push(recorridosPorRuta[0])
        }
        console.log('\n_________________________________________________________________________________________________________________________________')
        // console.log('\n')
        // console.log('Ruta ' + rutaOrigen.nombre)
        // for (const recorrido of recorridosPorRuta) {
        // console.log('\n')
        // console.log('\t\t\t |  1 - Caminar ' + recorrido.distParadaAbordaje1 + ' metros hasta la parada ' + recorrido.paradaAbordaje1)
        // console.log('\t\t\t |  2 - Abordar la Ruta ' + recorrido.ruta1 + ' en el recorrido de ' + recorrido.recorridoRuta1)
        // console.log('\t\t\t |  3 - Bajarse en ' + recorrido.paradaBajada1)
        // console.log('\t\t\t |  4 - Caminar ' + recorrido.distParadaAbordaje2 + ' metros hasta la parada ' + recorrido.paradaAbordaje2)
        // console.log('\t\t\t |  5 - Abordar Ruta ' + recorrido.ruta2 + ' en recorrido de ' + recorrido.recorridoRuta2)
        // console.log('\t\t\t |  6 - Bajarse en ' + recorrido.paradaBajada2)
        // console.log('\t\t\t |  7 - Caminar ' + recorrido.distPD + ' metros hasta tu punto de destino')
        // console.log('\t\t\t |  Distancia total: ' + (recorrido.distPD + recorrido.distParadaAbordaje2 + recorrido.distParadaAbordaje1))
        // }
      }
      // Comprobamos si hay recorridos de 2 buses disponibles
      if (recorridos2Buses.length > 0) {
        recorridos2Buses.sort((a, b) => {
          return a.distPD - b.distPD
        })

        recorridos2Buses = this.orderByTime(recorridos2Buses)
        console.log('Opciones de recorridos ordenados')
        console.log(recorridos2Buses)
      }
      return recorridos2Buses
    },
    clonarParadas () {
      // clonamos las paradas al local data
      this.LParadas = this.paradas.map((parada) => {
        const elemento = Object.assign({}, parada)
        elemento.id = parada.id
        return elemento
      })
    },
    clonarRutas () {
      // clonamos las paradas al local data
      this.LRutas = this.rutas.map((ruta) => {
        const elemento = Object.assign({}, ruta)
        elemento.id = ruta.id
        return elemento
      })
    },
    showDestinosNotFound () {
      this.$q.notify({
        message: 'Opps',
        caption: 'No encontramos recorridos disponibles a tu destino',
        position: 'center',
        color: 'orange-9',
        icon: 'running_with_errors'
      })
    }
  },
  computed: {
    mapCoords () {
      return this.$store.getters['DataVuex/getMapCoords']
    },
    rutas () {
      return this.$store.state.DataVuex.rutas
    },
    paradas () {
      return this.$store.state.DataVuex.paradas
    }
  },
  /*
    * Si las coordenadas en Vuex cambian, se procede a realizar una busqueda nueva
  */
  watch: {
    paradas () {
      this.clonarParadas()
    },
    rutas () {
      this.clonarRutas()
    }
  },
  mounted () {
    this.clonarParadas()
    this.clonarRutas()
  },
  created () {
    eventBus.$on('changeCoords', () => {
      this.recorridos1Bus = []
      this.recorridos2Bus = []
    })
    eventBus.$on('search', (paradaOrigen, paradaDestino) => {
      this.recorridos1Bus = []
      this.recorridos2Bus = []
      this.recorridos1Bus = this.EncontrarDestino1Bus(this.EncontrarParadasCercanas(this.mapCoords[0], this.mapCoords[1], this.mapCoords[2], this.mapCoords[3], paradaOrigen, paradaDestino))

      this.recorridos2Bus = this.EncontrarDestino2Bus(this.EncontrarParadasCercanas(this.mapCoords[0], this.mapCoords[1], this.mapCoords[2], this.mapCoords[3], paradaOrigen, paradaDestino))
      if (this.recorridos2Bus.length === 0 && this.recorridos1Bus.length === 0) {
        this.showDestinosNotFound()
      }
    })
  }
}
</script>

<style scoped>
.container {
  width: 96%;
  max-width: 520px;
  margin: 0 auto;
}

img {
  width: 100%;
  height: auto;
  box-shadow: 20px 10px;
}
.header-results {
  align-items: center;
}
.box {
  border-radius: 1rem;
  background: #4568dc;
  background: -webkit-linear-gradient(to right, #4568dc, #b06ab3);
  background: linear-gradient(to right, #4568dc, #b06ab3);
}
</style>
