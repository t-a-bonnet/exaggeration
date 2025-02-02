<template>
  <v-container fluid class="d-flex align-center justify-center" style="min-height: 100vh;">
    <div v-if="loading" class="d-flex justify-center mt-10">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>

    <div v-else class="d-flex flex-column align-center">
      <template v-if="stage === 1">
        <v-container class="d-flex flex-column align-center">
          <v-row class="justify-center" style="width: 60%;">
            <v-col cols="2" class="text-right">
              <strong>User A:</strong>
            </v-col>
            <v-col cols="10">
              <p v-html="currentItem?.user_a_original"></p>
            </v-col>
          </v-row>

          <v-row class="justify-center" style="width: 60%;">
            <v-col cols="2" class="text-right">
              <strong>User B:</strong>
            </v-col>
            <v-col cols="10">
              <p v-html="addEllipsis"></p>
            </v-col>
          </v-row>

          <v-text-field 
              v-model="completion" 
              label="Enter a word or phrase to complete User B’s reply" 
              outlined 
              style="width: 60%; font-size: 1.2rem; margin-top: 20px;"
          ></v-text-field>

          <v-btn 
            @click="revealReplacement" 
            :disabled="!completion" 
            class="mt-2" 
            color="primary"
          >
            Submit & Reveal 
            <v-icon>chevron_right</v-icon>
          </v-btn>

          <!-- View Instructions Button for Stage 1 -->
          <v-btn @click="openInstructions" class="mt-4" color="secondary">
            View Instructions
          </v-btn>

        </v-container>
      </template>

      <template v-else-if="stage === 2">
        <v-container class="d-flex flex-column align-center">
          <v-row class="justify-center" style="width: 60%; margin-top: 20px;">
            <v-col cols="12" class="text-center">
              <h4>Your completion: <strong>{{ completion }}</strong></h4>
            </v-col>
          </v-row>

          <v-row class="justify-center" style="width: 60%;">
            <v-col cols="2" class="text-right">
              <strong>User A:</strong>
            </v-col>
            <v-col cols="10">
              <p v-html="currentItem?.user_a_original"></p>
            </v-col>
          </v-row>

          <v-row class="justify-center" style="width: 60%;">
            <v-col cols="2" class="text-right">
              <strong>User B:</strong>
            </v-col>
            <v-col cols="10">
              <p v-html="combineFragments"></p>
            </v-col>
          </v-row>

          <v-row class="justify-center" style="width: 60%; margin-top: 20px;">
            <v-col cols="12" class="text-center">
              <h4>Rate Similarity</h4>
              <div class="slider-container">
                <v-slider
                  v-model="similarityRating"
                  min="1"
                  max="5"
                  step="0.1"
                  show-ticks="always"
                  class="slider-with-labels"
                ></v-slider>
              </div>
            </v-col>
          </v-row>

          <v-row class="justify-center" style="width: 60%; margin-top: 0px;">
            <v-col cols="12" class="text-center">
                <div class="tick-labels">
                  <span v-for="(label, index) in ['1', '2', '3', '4', '5']" :key="index" class="tick-label">
                    {{ label }}
                  </span>
                </div>
            </v-col>
          </v-row>
          
          <v-row class="justify-center" style="width: 60%; margin-top: 0px;">
            <v-col cols="12" class="text-center">
                <div class="slider-value">
                  <span>{{ similarityRating.toFixed(1) }}</span>
                </div>
            </v-col>
          </v-row>

          <v-btn 
            @click="nextItem" 
            class="mt-2" 
            color="primary"
          >
            Next 
            <v-icon>chevron_right</v-icon>
          </v-btn>

          <!-- View Instructions Button for Stage 2 -->
          <v-btn @click="openInstructions" class="mt-4" color="secondary">
            View Instructions
          </v-btn>
        </v-container>
      </template>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Papa from "papaparse";
import { useRouter } from "vue-router";
import { computed } from "vue";

const data = ref([]);
const currentIndex = ref(0);
const currentItem = ref(null);
const completion = ref("");
const similarityRating = ref(3); // Default value
const loading = ref(true);
const stage = ref(1);
const router = useRouter();

const addEllipsis = computed(() => {
    return (currentItem.value?.user_b_fragments || "") + " ...";
});

const combineFragments = computed(() => {
    const fragment = currentItem.value?.user_b_fragments || "";
    let completion = currentItem.value?.user_b_llama_completion || "";

    // Remove leading ellipsis if present
    completion = completion.replace(/^\.{3}\s*/, "");

    return `${fragment} <strong>${completion}</strong>`;
});

const loadCSV = async () => {
  const response = await fetch("/items_job_2.csv");
  const text = await response.text();

  Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
    complete: (result) => {
      data.value = result.data;
      currentItem.value = data.value[0];
      loading.value = false;
    }
  });
};

const revealReplacement = () => {
  stage.value = 2;
};

const nextItem = () => {
  if (currentIndex.value < data.value.length - 1) {
      currentIndex.value++;
      currentItem.value = data.value[currentIndex.value];
      completion.value = "";
      similarityRating.value = 3;
      stage.value = 1;
  } else {
      router.push("/end");
  }
};

const openInstructions = () => {
  window.open('/instructions-separate', '_blank', 'width=800,height=600');
};

onMounted(loadCSV);
</script>

<style scoped>
.slider-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 545px;
  margin: 0 auto;
  margin-bottom: 0px;
}

.slider-with-labels {
  width: 100%;
  margin-bottom: 0px;
}

.tick-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 0px;
  margin-bottom: 20px;
  position: relative;
  width: 100%;
}

.slider-value {
  font-size: 1.2rem;
  margin-top: -10px;
  margin-bottom: 20px;
  font-weight: bold;
}

.tick-label {
  font-size: 1rem;
  color: #000;
  text-align: center;
  position: relative;
  margin-top: -40px;
  bottom: -6px;
  width: 20%;
}

.mt-2 {
  margin-top: 50px;
  margin-bottom: 10px;
}

.mt-4 {
  margin-top: 10px;
  margin-bottom: 30px;
}
</style>