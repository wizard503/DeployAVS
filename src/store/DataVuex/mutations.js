export const actualizarGPS = (state, gps) => {
  state.posGPS = gps
}

export const updateMapCoords = (state, coords) => {
  state.mapCoords = coords
}

export const FAVORITE_DESTINO = (state, index) => {
  state.destinos[index].isFavorite = !state.destinos[index].isFavorite
}

export const FAVORITES_ADD_DOC = (state, index, id) => {
  state.destinos[index].docRefId = id
}
