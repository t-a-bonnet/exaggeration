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
              <p v-html="highlightWORD(currentItem?.user_a_1)"></p>
            </v-col>
          </v-row>

          <v-row class="justify-center" style="width: 60%;">
            <v-col cols="2" class="text-right">
              <strong>User B:</strong>
            </v-col>
            <v-col cols="10">
              <p v-html="highlightWORD(currentItem?.user_b_1)"></p>
            </v-col>
          </v-row>

          <v-text-field 
            v-model="guess" 
            label="Your guess" 
            outlined 
            style="width: 20%; font-size: 1.2rem; margin-top: 20px;"
          ></v-text-field>

          <v-btn 
            @click="revealReplacement" 
            :disabled="!guess" 
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
          <!-- Reminder of the guessed word -->
          <v-row class="justify-center" style="width: 60%; margin-top: 20px;">
            <v-col cols="12" class="text-center">
              <h4>You guessed: <strong>{{ guess }}</strong></h4>
            </v-col>
          </v-row>

          <v-row class="justify-center" style="width: 60%;">
            <v-col cols="2" class="text-right">
              <strong>User A:</strong>
            </v-col>
            <v-col cols="10">
              <p v-html="formatBoldInBrackets(currentItem?.user_a_2)"></p>
            </v-col>
          </v-row>

          <v-row class="justify-center" style="width: 60%;">
            <v-col cols="2" class="text-right">
              <strong>User B:</strong>
            </v-col>
            <v-col cols="10">
              <p v-html="formatBoldInBrackets(currentItem?.user_b_2)"></p>
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
                  step="1"
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

const data = ref([]);
const currentIndex = ref(0);
const currentItem = ref(null);
const guess = ref("");
const similarityRating = ref(null);
const loading = ref(true);
const stage = ref(1);
const router = useRouter();

const loadCSV = async () => {
  const response = await fetch("/items_job_1.csv");
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

const highlightWORD = (text) => {
  return text ? text.replace(/\bWORD\b/g, "<strong>WORD</strong>") : "";
};

const formatBoldInBrackets = (text) => {
  return text ? text.replace(/<([^>]+)>/g, "<strong>$1</strong>") : "";
};

const revealReplacement = () => {
  stage.value = 2;
};

const nextItem = () => {
  if (currentIndex.value < data.value.length - 1) {
      currentIndex.value++;
      currentItem.value = data.value[currentIndex.value];
      guess.value = "";
      similarityRating.value = null;
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
  margin-bottom: 10px;
}

.mt-4 {
  margin-top: 10px;
  margin-bottom: 30px;
}
</style>