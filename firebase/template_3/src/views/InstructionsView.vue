<template>
    <v-container>
        <!-- Instructions Component -->
        <InstructionsComponent :numberOfPages="1" @instructions-complete="next" :hideButtons="false">
            <!-- Overview page content -->
            <template #0>
                <h1>Instructions</h1>
                <br>
                <h2>1. Coherence</h2>
                <br>
                <p>
                    <strong>Scale:</strong> Low | 0 ... 6 | High
                </p>
                <br>
                <p>
                    Select 6 if UserB’s response is clear, relevant, and well connected to UserA’s post.
                </p>
                <p>
                    Select 0 if UserB’s response is not well connected to UserA’s post because it is unrelated, poorly structured, or incomprehensible.
                </p>
                <br>
                <h2>2. Level of Agreement</h2>
                <br>
                <p>
                    <strong>Scale:</strong> Low | 0 ... 6 | High
                </p>
                <br>
                <p>
                    Select 6 if UserB clearly agrees with or supports UserA.
                    <br>
                    Select 0 if UserB explicitly disagrees with or contradicts UserA.
                    <br>
                    Select 3 if UserB agrees with UserA in some respects but not others, or if it is unclear whether UserB agrees or disagrees with A.
                </p>
                <br>

                <h2>3. Amount of New Content</h2>
                <br>
                <p>
                    <strong>Scale:</strong> Low | 0 ... 6 | High
                </p>
                <br>
                <p>
                    Select 0 if UserB only acknowledges or summarizes UserA, adding little to no new information. This choice might even be appropriate if UserB uses a lot of words, provided that their post is shallow and uninformative.
                    <br>
                    Select 6 if UserB adds substantial new information, such as new facts, perspectives, or insights into their stance or feelings. This choice might be appropriate even if UserB’s turn is short, provided that it adds specific and relevant information.
                </p>
                <br>

                <h2>Guidelines</h2>
                <br>
                <p>
                    You may find that some judgments are more obvious than others. For example, if UserB is incoherent, it may seem unclear to you whether they agree or disagree. Don’t feel concerned about this or slow down your work. Just record the first judgment that comes into your mind.
                </p>
                <br>

                <h2>Examples</h2>
                <br>

                <h3>Example 1</h3>
                <br>
                <div class="image-container">
                    <img src="/images/template_3_example_1.png" alt="Example 1" class="example-image" />
                </div>
                <br>
                <hr class="image-divider" />
                <br>

                <h3>Example 2</h3>
                <br>
                <div class="image-container">
                    <img src="/images/template_3_example_2.png" alt="Example 2" class="example-image" />
                </div>
                <br>
                <hr class="image-divider" />
                <br>

                <h3>Example 3</h3>
                <br>
                <div class="image-container">
                    <img src="/images/template_3_example_3.png" alt="Example 3" class="example-image" />
                </div>
                <br>
                <hr class="image-divider" />
                <br>

                <h3>Example 4</h3>
                <br>
                <div class="image-container">
                    <img src="/images/template_3_example_4.png" alt="Example 4" class="small-example-image"/>
                </div>
                <br>
                <hr class="image-divider" />
                <br>

                <h3>Example 5</h3>
                <br>
                <div class="image-container">
                    <img src="/images/template_3_example_5.png" alt="Example 5" class="example-image" />
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

// Function to navigate to the next stage (experiment)
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
    margin-bottom: 20px; /* Added margin to avoid images being too close to each other */
}

.example-image {
    max-width: 50%; /* Standard size for most images */
    height: auto; /* Maintain aspect ratio */
    object-fit: contain; /* Ensures image content is not distorted */
}

.small-example-image {
    max-width: 40%; /* Significantly smaller size for Example 4 */
    height: auto; /* Maintain aspect ratio */
    object-fit: contain; /* Keeps image content intact */
}

.image-divider {
    border: none;
    border-top: 1px solid #ccc; /* Adds a horizontal divider below each example */
    margin: 20px 0;
}
</style>