<template>
  <v-container fluid class="d-flex align-center justify-center" style="min-height: 100vh;">
    <div v-if="loading" class="d-flex justify-center mt-10">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>

    <div v-else class="d-flex flex-column align-center">
      <template v-if="stage === 1">
        <v-container class="d-flex flex-column align-center">
          <v-row class="justify-center" style="width: 60%;" v-if="currentItem">
            <v-col cols="2" class="text-right">
              <strong>User A:</strong>
            </v-col>
            <v-col cols="10">
              <p v-html="currentItem.user_a_original"></p>
            </v-col>
          </v-row>

          <v-row class="justify-center" style="width: 60%;" v-if="currentItem">
            <v-col cols="2" class="text-right">
              <strong>User B:</strong>
            </v-col>
            <v-col cols="10">
              <p v-html="currentItem.user_b_gemma_no_instructions"></p>
            </v-col>
          </v-row>
        </v-container>

        <v-container class="d-flex flex-column align-center">
          <!-- Coherence Rating -->
          <v-row class="justify-center" style="width: 60%; margin-top: 20px;">
            <v-col cols="12" class="text-center">
                <h4>Rate Coherence</h4>
                <div class="slider-container">
                  <v-slider v-model="coherenceRating"
                      min="1"
                      max="5"
                      step="1"
                      show-ticks="always"
                      class="slider-with-labels">
                  </v-slider>
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

          <!-- Agreement Rating -->
          <v-row class="justify-center" style="width: 60%; margin-top: 20px;">
            <v-col cols="12" class="text-center">
                <h4>Rate Agreement</h4>
                <div class="slider-container">
                  <v-slider v-model="agreementRating"
                      min="1"
                      max="5"
                      step="1"
                      show-ticks="always"
                      class="slider-with-labels">
                  </v-slider>
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

          <!-- New Content Rating -->
          <v-row class="justify-center" style="width: 60%; margin-top: 20px;">
            <v-col cols="12" class="text-center">
                <h4>Rate Amount of New Content</h4>
                <div class="slider-container">
                  <v-slider v-model="newContentRating"
                      min="1"
                      max="5"
                      step="1"
                      show-ticks="always"
                      class="slider-with-labels">
                  </v-slider>
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

          <v-btn 
            @click="nextItem" 
            class="mt-2" 
            color="primary"
          >
            Next 
            <v-icon>chevron_right</v-icon>
          </v-btn>

          <!-- View Instructions Button -->
          <v-btn @click="openInstructions" class="mt-2" color="secondary">
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

const data = ref([]);
const currentIndex = ref(0);
const currentItem = ref(null);
const coherenceRating = ref(null);
const agreementRating = ref(null);
const newContentRating = ref(null);
const loading = ref(true);
const stage = ref(1);
const router = useRouter();

const openInstructions = () => {
  window.open('/instructions-separate', '_blank', 'width=800,height=600');
};

const loadCSV = async () => {
  const response = await fetch("/items_job_3.csv");
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

const nextItem = () => {
  if (currentIndex.value < data.value.length - 1) {
      currentIndex.value++;
      currentItem.value = data.value[currentIndex.value];
      coherenceRating.value = null;
      agreementRating.value = null;
      newContentRating.value = null;
  } else {
      router.push("/end");
  }
};

onMounted(loadCSV);
</script>

<style scoped>
.slider-container {
display: flex;
flex-direction: column;
align-items: center;
width: 80%;
margin: 0 auto;
margin-bottom: 0px;
}

.slider-with-labels {
width: 275px;
margin-bottom: 0px;
}

.tick-labels {
display: flex;
justify-content: center;
gap: 58px;
margin-top: 0px;
margin-bottom: 20px;
position: relative;
width: 100%;
}

.tick-label {
font-size: 1rem;
color: #000;
text-align: center;
position: relative;
margin-top: -40px;
bottom: -6px;
}

.mt-2 {
margin-top: 50px;
margin-bottom: 30px;
}
</style>