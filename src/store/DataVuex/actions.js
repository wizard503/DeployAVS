import { firestoreAction } from 'vuexfire'
import { db } from 'app/src/boot/db'

export const getAllParadas = firestoreAction(({ bindFirestoreRef }) => bindFirestoreRef('paradas', db.collection('paradas')))
export const getAllRutas = firestoreAction(({ bindFirestoreRef }) => bindFirestoreRef('rutas', db.collection('rutas')))

export const FAVORITE_DESTINO = ({ commit }, payload) => {
  commit('FAVORITE_DESTINO', payload.index)
}

export const ADD_DOC_FAVORITE = ({ commit }, payload) => {
  commit('FAVORITES_ADD_DOC', payload.index, payload.id)
}
