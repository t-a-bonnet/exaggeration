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
                <p><strong>UserA:</strong> Yep, sheep can get under the panels and could predictably eat the wires.</p>
                <p><strong>UserB:</strong> It's definitely something to consider when planning solar installations, especially in rural areas. Sheep are curious creatures and will happily munch on anything new and shiny. Protecting the wiring is crucial to ensure the longevity and efficiency of the system.</p>
                <br>
                <p><strong>Coherence:</strong> 6</p>
                <p><strong>Level of Agreement:</strong> 6</p>
                <p><strong>Amount of New Content:</strong> 6</p>
                <br>

                <h3>Example 2</h3>
                <br>
                <p><strong>UserA:</strong> And a melting Thwaites Glacier causes rising sea levels which push the grounding line further inland causing more melting Thwaites and on and on...</p>
                <p><strong>UserB:</strong> It's like a long line of dominoes, when the first one topples, they all will topple.</p>
                <br>
                <p><strong>Coherence:</strong> 5</p>
                <p><strong>Level of Agreement:</strong> 6</p>
                <p><strong>Amount of New Content:</strong> 3</p>
                <br>

                <h3>Example 3</h3>
                <br>
                <p><strong>UserA:</strong> Eating shellfish isn't so good for eater, however. Fine in moderation, but they concentrate pollutants. People think of 'New England Clambakes', but you can't eat shellfish from most of NE waters.</p>
                <p><strong>UserB:</strong> I appreciate your nuance and attention to context when discussing dietary preferences. However, I disagree that feeding a local population with a plant-based diet isn't viable everywhere. With proper planning and infrastructure, we can maintain food security and support both human populations and wildlife conservation.</p>
                <br>
                <p><strong>Coherence:</strong> 0</p>
                <p><strong>Level of Agreement:</strong> 0</p>
                <p><strong>Amount of New Content:</strong> 3</p>
                <br>

                <h3>Example 4</h3>
                <br>
                <p><strong>UserA:</strong> I think the lack of engagement might be related to the enormity of the issue.</p>
                <p><strong>UserB:</strong> So if the issue would have been smaller we would have cared more? That's ridiculous.</p>
                <br>
                <p><strong>Coherence:</strong> 6</p>
                <p><strong>Level of Agreement:</strong> 2</p>
                <p><strong>Amount of New Content:</strong> 2</p>
                <br>

                <h3>Example 5</h3>
                <br>
                <p><strong>UserA:</strong> Air you can breathe, water you can drink, fish you can eat ... how is that too much to ask?</p>
                <p><strong>UserB:</strong> The Earth's resources are finite, not infinite. While clean air, water, and sustainable food sources are essential for human survival, our current consumption patterns are exceeding planetary boundaries. We need to shift towards responsible resource management and reduce our ecological footprint to ensure these necessities are available in the future.</p>
                <br>
                <p><strong>Coherence:</strong> 5</p>
                <p><strong>Level of Agreement:</strong> 6</p>
                <p><strong>Amount of New Content:</strong> 2</p>
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