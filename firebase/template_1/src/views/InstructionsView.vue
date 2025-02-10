<template>
    <v-container>
        <InstructionsComponent :numberOfPages="1" @instructions-complete="next()" :hideButtons="false">
            <template #0>
                <h1>Instructions</h1>
                <br>
                <p>
                    You will see short sequences of a social media post (UserA) and a reply (UserB). A single word from the original posts is missing (at the location indicated by a blank space _____. Your first job is to guess what this word is. Type into the box the first word that comes into your mind as a likely choice. For many of the posts, several different words are equally likely. Don’t worry about figuring out the best choice. Type the first word that comes into your mind. 
                </p>
                <br>
                <p>
                    After you have typed your guess, you will see an interaction that is the same, except that the missing word has already been filled in. The new choice is underlined. Your job is to rate how similar in meaning the provided word is to the one you guessed, using the slider bar. Low similarity is on the left and high similarity is on the right. 
                </p>
                <br>
                <h2>Similarity</h2>
                <br>
                <strong>Scale:</strong> Low | 0 ... 6 | High
                <br>
                <p>
                    Use the top value of 6 if you guessed exactly the same word as  the one provided. Use 0 if the two words have very little relationship. Use the values in between for cases in which the two words have related, but not identical, meanings.  
                </p>
                <br>
                <h2>Examples</h2>
                <br>
                <p>
                    You will now see some example items before continuing to the task itself. Other answers might be equally correct. You will be able to look at these instructions again if you want after seeing the example items.
                </p>
                <br>
                <h3>Example 1</h3>
                <br>
                <div class="image-container">
                    <img src="/images/template_1_example_1_task_1.png" alt="Example 1 Image 1" class="size-1"/>
                    <div class="divider"></div>
                    <img src="/images/template_1_example_1_task_2.png" alt="Example 1 Image 2" class="size-1"/>
                </div>
                <br>
                <hr class="image-divider"/>
                <br>
                <h3>Example 2</h3>
                <br>
                <div class="image-container">
                    <img src="/images/template_1_example_2_task_1.png" alt="Example 2 Image 1" class="size-1"/>
                    <div class="divider"></div>
                    <img src="/images/template_1_example_2_task_2.png" alt="Example 2 Image 2" class="size-1"/>
                </div>
                <br>
                <hr class="image-divider"/>
                <br>
                <h3>Example 3</h3>
                <br>
                <div class="image-container">
                    <img src="/images/template_1_example_3_task_1.png" alt="Example 3 Image 1" class="size-2"/>
                    <div class="divider"></div>
                    <img src="/images/template_1_example_3_task_2.png" alt="Example 3 Image 2" class="size-3"/>
                </div>
                <br>
            </template>
        </InstructionsComponent>
    </v-container>
</template>

<script setup>
import InstructionsComponent from "@/components/InstructionsComponent.vue";
import { useRouter } from 'vue-router';
const router = useRouter();


const next = () => {
    router.push("/experiment");
};

</script>

<style scoped>
.center-text {
    text-align: center; /* Centers the heading */
}

.image-container {
    display: flex;
    justify-content: center; /* Center the images horizontally */
    align-items: center;
    gap: 30px; /* Adds space between images */
}

.image-container img {
    max-width: 45%; /* Adjusts the image size */
    height: auto;
}

.divider {
    width: 1px;
    background-color: #000; /* Adds a vertical divider */
    height: 100%; /* Makes the divider stretch to the full height of the container */
}

.image-divider {
    border: none;
    border-top: 1px solid #ccc; /* Optional: Add a horizontal divider below each example */
    margin: 20px 0;
}

.size-1 {
  max-height: 60%;
  width: auto;
}

/* For smaller images (in Example 3), apply specific styles */
.size-2 {
    max-height: 30%; /* Make images smaller */
    width: 35%;
}

.size-3 {
    max-height: 35%; /* Make images smaller */
    width: 35%;
}
</style>