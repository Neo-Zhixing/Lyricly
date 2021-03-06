import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

import { auth } from '@/plugins/firebase'
import spotify from './spotify'

Vue.config.devtools = true

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: state => ({
    user: state.user,
    spotify: {
      accessToken: state.spotify.accessToken,
      accessTokenExpires: state.spotify.accessTokenExpires,
    },
  }),
})

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: auth.currentUser,
    title: 'Gather Play',
  },
  mutations: {
    changeAuthState (state, user) {
      state.user = user
    },
    updateTitle (state, title) {
      state.title = title
    }
  },
  plugins: [
    vuexLocal.plugin,
  ],
})

store.registerModule('spotify', spotify(store))

auth.onAuthStateChanged(user => {
  store.commit('changeAuthState', user)
  if (!user) {
    store.commit('spotify/updateToken', null)
  }
})

export default store
