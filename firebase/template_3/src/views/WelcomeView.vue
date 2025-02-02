<template>
  <v-container>
    <h1>Welcome! Thank you for choosing to participate in our study.</h1>
    <p>Please proceed to the next page where we provide information on how we will use the data we collect and ask for your consent.</p>
    <v-btn color="primary mt-4" @click="next" :disabled="store.pid == null || store.pid == ''">Next
      <v-icon>chevron_right</v-icon></v-btn>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { useStore } from "@/stores/store.js"
import Swal from "sweetalert2";
const router = useRouter();
const route = useRoute();
const store = useStore();

onMounted(async () => {
  if (route.query.pid == null || route.query.pid == "") {
    store.pid = null;
    Swal.fire({
      title: 'Missing participant ID',
      icon: 'error',
      text: 'Try reloading the page or contact the experimenter if this error persists.'
    })
    return;
  }

  store.pid = route.query.pid

})

const next = () => {
  router.push("/consent");

}
</script>