import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

//sweetalert CSS
import 'sweetalert2/dist/sweetalert2.min.css'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, md } from 'vuetify/iconsets/md'
const vuetify = createVuetify({
    icons: {
        defaultSet: 'md',
        aliases,
        sets: {
            md,
        },
    },
})

//firebase
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "REPLACE",
  authDomain: "REPLACE",
  databaseURL: "REPLACE",
  projectId: "REPLACE",
  storageBucket: "REPLACE",
  messagingSenderId: "REPLACE",
  appId: "REPLACE"
};
initializeApp(firebaseConfig);

//pinia
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(createPersistedState({
    storage: sessionStorage,
}))

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(vuetify)
app.mount('#app')
