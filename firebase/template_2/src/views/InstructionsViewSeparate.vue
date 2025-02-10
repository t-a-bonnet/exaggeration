<template>
    <v-container>
        <InstructionsComponent :numberOfPages="1" :hideButtons="true">
            <template #0>
                <h1>Overview</h1>
                <br>
                <p>
                    This study investigates how people reason using words and phrases.  One important type of evidence is people’s ability to complete sentences. Large Language Models (such as chatbots) are trained by attempting to produce meaningful and logical continuations of text. In this experiment, we are trying to learn more about what kind of continuations people produce, and how they well match the guesses provided by LLMs. 
                </p>
                <br>
                <h1>Instructions</h1>
                <br>
                <p>
                    You will see short sequences of a social media post (UserA) and a reply (UserB). UserB’s reply is cut off and your first task is to produce a word or phrase that would complete it.  For many of the posts, many different phrases are equally good. Don’t worry about figuring out the best choice. Type the first idea that comes into your mind for a grammatical and coherent completion of UserB’s post.  
                </p>
                <br>
                <p>
                    After you have typed your guess, you will see an interaction that is the same, except that the missing material has already been filled in. The new choice is underlined. Your job is to rate how similar in meaning the provided word or phrase is to what you suggested, using the slider bar. Low similarity is on the left and high similarity is on the right. 
                </p>
                <br>
                <h2>Similarity</h2>
                <br>
                <strong>Scale:</strong> Low | 0 ... 6 | High
                <br>
                <p>
                    Use the top value of 6 if your guess is exactly the same as the text provided.  Use 0 if the two have very little relationship. Use the values in between for cases in which the two have related, but not identical, meanings.   
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
                    <img src="/images/template_2_example_1_task_1.png" alt="Example 1 Image 1" class="size-1"/>
                    <div class="divider"></div>
                    <img src="/images/template_2_example_1_task_2.png" alt="Example 1 Image 2" class="size-1"/>
                </div>
                <br>
                <hr class="image-divider"/>
                <br>
                <h3>Example 2</h3>
                <br>
                <div class="image-container">
                    <img src="/images/template_2_example_2_task_1.png" alt="Example 2 Image 1" class="size-2"/>
                    <div class="divider"></div>
                    <img src="/images/template_2_example_2_task_2.png" alt="Example 2 Image 2" class="size-3"/>
                </div>
                <br>
                <hr class="image-divider"/>
                <br>
                <h3>Example 3</h3>
                <br>
                <div class="image-container">
                    <img src="/images/template_2_example_3_task_1.png" alt="Example 3 Image 1" class="size-1"/>
                    <div class="divider"></div>
                    <img src="/images/template_2_example_3_task_2.png" alt="Example 3 Image 2" class="size-1"/>
                </div>
                <br>
            </template>
        </InstructionsComponent>
    </v-container>
</template>

<script setup>
import InstructionsComponent from "@/components/InstructionsComponent.vue";

</script>

<style scoped>
.center-text {
    text-align: center; /* Centers the heading */
}

.image-container {
    display: flex;
    justify-content: center; /* Center the images horizontally */
    align-items: center;
    gap: 20px; /* Adds space between images */
}

.image-container img {
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

/* Specific sizes for images */
.size-1 {
    max-width: 50% !important; /* Moderate size for main images */
    height: auto !important;
}

.size-2 {
    max-width: 40% !important; /* Slightly smaller */
    height: auto !important;
}

.size-3 {
    max-width: 38% !important; /* Smallest size */
    height: auto !important;
}
</style>