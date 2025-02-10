<template>
  <v-container>
    <h1>Welcome to the Sentence Completion Experiment!</h1>
    <br>
    <h2>Overview</h2>
    <p>
        This study investigates how people reason using words and phrases.  One important type of evidence is people’s ability to complete sentences. Large Language Models (such as chatbots) are trained by attempting to produce meaningful and logical continuations of text. In this experiment, we are trying to learn more about what kind of continuations people produce, and how they well match the guesses provided by LLMs.
    </p>
    <br>
    <h2>To participate</h2>
    <p>If you are interested in participating, please proceed to the next page where we provide information on how we will use the data we collect and ask for your consent. After that, you will have the opportunity to read the instructions and do the task.</p>
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