<template>
  <v-app>
    <div class="d-flex justify-center mt-5" v-if="routerLoadingStore.routerLoading == true">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>
    <RouterView v-else />
  </v-app>
</template>

<script setup>
import { useRouterLoadingStore } from "@/stores/routerLoadingStore.js"
const routerLoadingStore = useRouterLoadingStore();
</script>