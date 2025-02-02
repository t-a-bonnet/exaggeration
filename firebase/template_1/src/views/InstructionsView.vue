<template>
    <v-container>
        <InstructionsComponent :numberOfPages="2" @instructions-complete="next()" :hideButtons="false">
            <template #0>
                <h1>Overview</h1>
                <br>
                <p>
                    This study investigates how people use and understand the meanings of words in context. One important type of evidence about word meanings is people’s ability to guess a missing word in a sentence. When Large Language Models (such as chatbots) are being trained, they also attempt to guess missing words, as a way to form useful representations of word meanings. In this experiment, we are trying to learn more about how predictable different types of words are, and how well human guesses match the guesses provided by LLMs. 
                </p>
            </template>
            <template #1>
                <h1>Instructions</h1>
                <br>
                <p>
                    You will see short sequences of a social media post (User A) and a reply (User B). A single word from the original posts is missing (at the location indicated by <strong>WORD</strong>, in bold capital letters). Your first job is to guess what this word is. Type into the box the first word that comes into your mind as a likely choice. For many of the posts, several different words are equally likely. Don’t worry about figuring out the best choice. Type the first word that comes into your mind. 
                </p>
                <br>
                <p>
                    After you have typed your guess, you will see an interaction that is the same, except that the missing word has already been filled in. The new choice is underlined. Your job is to rate how similar in meaning the provided word is to the one you guessed, using the slider bar. Low similarity is on the left and high similarity is on the right. 
                </p>
                <br>
                <h2>Similarity</h2>
                <br>
                <strong>Scale:</strong> Low | 1 ... 5 | High
                <br>
                <p>
                    Use the top value of 5 if you guessed exactly the same word as  the one provided.  Use 0 if the two words have very little relationship. Use the values in between for cases in which the two words have related, but not identical, meanings.  
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
                <p>
                    <strong>User A:</strong> Can we do something about spam mail? It could <strong>WORD</strong> shorten the time that USPS workers are out delivering. 
                </p>
                <br>
                <p>
                    <strong>User B:</strong> Impossible. The USPS makes a ton of money via mailing advertisements. I haven't checked, but I would not be so surprised to find that they make most of their money this way.
                </p>
                <br>
                <p>
                    <strong>Guess:</strong> definitely
                </p>
                <br>
                <p>
                    <strong>User A:</strong> Can we do something about spam mail? It could <u>probably</u> shorten the time that USPS workers are out delivering.
                </p>
                <br>
                <p>
                    <strong>User B:</strong> Impossible. The USPS makes a ton of money via mailing advertisements. I haven't checked, but I would not be so surprised to find that they make most of their money this way.
                </p>
                <br>
                <p>
                    <strong>Similarity:</strong>
                    Low | 0 .... 5 | High 
                </p>
                <br>
                <p>
                    <strong>Judgement:</strong> 4
                </p>
                <br>
                <h3>Example 2</h3>
                <br>
                <p>
                    <strong>User A:</strong> An F-16 burns between 5300 to 640000 pounds of fuel IN AN HOUR! When people say "vote with your pocketbook", governments and corporations smile. They know individuals cannot make the impact needed to turn climate change around. Regulation of industry is what we need, and we need it now. 
                </p>
                <br>
                <p>
                    <strong>User B:</strong> I don’t get how we have fuel efficiency standards for car manufacturers but not <strong>WORD</strong> manufacturers.
                </p>
                <br>
                <p>
                    <strong>Guess:</strong> other
                </p>
                <br>
                <p>
                    <strong>User A:</strong> An F-16 burns between 5300 to 640000 pounds of fuel IN AN HOUR! When people say "vote with your pocketbook", governments and corporations smile. They know individuals cannot make the impact needed to turn climate change around. Regulation of industry is what we need, and we need it now.
                </p>
                <br>
                <p>
                    <strong>User B:</strong> I don’t get how we have fuel efficiency standards for car manufacturers but not <u>airplane</u> manufacturers.
                </p>
                <br>
                <p>
                    <strong>Similarity:</strong> 
                    Low | 0 .... 5 | High 
                </p>
                <br>
                <p>
                    <strong>Judgement:</strong> 0
                </p>
                <br>
                <h3>Example 3</h3>
                <br>
                <p>
                    <strong>User A:</strong> Around 1500 b.c. a massive volcanic eruption at Santorini destroyed the whole Minoan civilization.
                </p>
                <br>
                <p>
                    <strong>User B:</strong> <strong>WORD</strong>, that was how the Akrotiri settlement was destroyed. 
                </p>
                <br>
                <p>
                    <strong>Guess:</strong> So
                </p>
                <br>
                <p>
                    <strong>User A:</strong> Around 1500 b.c. a massive volcanic eruption at Santorini destroyed the whole Minoan civilization.
                </p>
                <br>
                <p>
                    <strong>User B:</strong> <u>Apparently</u>, that was how the Akrotiri settlement was destroyed. 
                </p>
                <br>
                <p>
                    <strong>Similarity:</strong> 
                    Low | 0 .... 5 | High 
                </p>
                <br>
                <p>
                    <strong>Judgement:</strong> 3
                </p>
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