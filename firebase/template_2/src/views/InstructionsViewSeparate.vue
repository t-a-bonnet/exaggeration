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
                    You will see short sequences of a social media post (User A) and a reply (User B). User B’s reply is cut off and your first task is to produce a word or phrase that would complete it.  For many of the posts, many different phrases are equally good. Don’t worry about figuring out the best choice. Type the first idea that comes into your mind for a grammatical and coherent completion of User B’s post.  
                </p>
                <br>
                <p>
                    After you have typed your guess, you will see an interaction that is the same, except that the missing material has already been filled in. The new choice is underlined. Your job is to rate how similar in meaning the provided word or phrase is to what you suggested, using the slider bar. Low similarity is on the left and high similarity is on the right. 
                </p>
                <br>
                <h2>Similarity</h2>
                <br>
                <strong>Scale:</strong> Low | 1 ... 5 | High
                <br>
                <p>
                    Use the top value of 5 if your guess is exactly the same as the text provided.  Use 0 if the two have very little relationship. Use the values in between for cases in which the two have related, but not identical, meanings.   
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
                    <strong>User A:</strong> At the end of Rue des Francs-Bourgeois is what many consider to be the most handsome residential square in Paris, the Place des Vosges, with its stone and red brick facades. 
                </p>
                <br>
                <p>
                    <strong>User B:</strong> However, it’s not the most handsome residential square in Europe, because ... 
                </p>
                <br>
                <p>
                    <strong>Completion:</strong> the Georgian squares in London are even nicer.
                </p>
                <br>
                <p>
                    <strong>User A:</strong> At the end of Rue des Francs-Bourgeois is what many consider to be the most handsome residential square in Paris, the Place des Vosges, with its stone and red brick facades.
                </p>
                <br>
                <p>
                    <strong>User B:</strong> However, it’s not the most handsome residential square in Europe, because Grosvenor Square in London is even more beautiful.
                </p>
                <br>
                <p>
                    <strong>Similarity:</strong>
                    Low | 0 .... 5 | High 
                </p>
                <br>
                <p>
                    <strong>Answer:</strong> 3.5
                </p>
                <br>
                <h3>Example 2</h3>
                <br>
                <p>
                    <strong>User A:</strong> The word Aswan actually means trade or market in ancient Egyptian, signifying its most pre-eminent activity.
                </p>
                <br>
                <p>
                    <strong>User B:</strong> So, the meaning of the word “Aswan” has not really changed, assuming that the city of Aswan ...
                </p>
                <br>
                <p>
                    <strong>Completion:</strong> is still a center for trade.
                </p>
                <br>
                <p>
                    <strong>User A:</strong> The word “Aswan” actually means trade or market in ancient Egyptian, signifying its most pre-eminent activity.
                </p>
                <br>
                <p>
                    <strong>User B:</strong> So, the meaning of the word Aswan has not really changed, assuming that the city of Aswan still has a market.
                </p>
                <br>
                <p>
                    <strong>Similarity:</strong> 
                    Low | 0 .... 5 | High 
                </p>
                <br>
                <p>
                    <strong>Answer:</strong> 4.5
                </p>
                <br>
                <h3>Example 3</h3>
                <br>
                <p>
                    <strong>User A:</strong> According to the Veteran’s Administration executive we interviewed, the town hall meetings helped improve his customer satisfaction levels because veterans expressed their concerns that were most important to them, gained direct access to the VBA employees working on their benefit claims, and were better able to understand the claims process. 
                </p>
                <br>
                <p>
                    <strong>User B:</strong> However, the meetings were not entirely a success because ....
                </p>
                <br>
                <p>
                    <strong>Completion:</strong> some of the staff members were subjected to stalking afterwards.  
                </p>
                <br>
                <p>
                    <strong>User A:</strong> According to the Veteran’s Administration executive we interviewed, the town hall meetings helped improve his customer satisfaction levels because veterans expressed their concerns that were most important to them, gained direct access to the VBA employees working on their benefit claims, and were better able to understand the claims process.
                </p>
                <br>
                <p>
                    <strong>User B:</strong> However, the meetings were not entirely a success because the staff complained about how much time they took up. 
                </p>
                <br>
                <p>
                    <strong>Similarity:</strong> 
                    Low | 0 .... 5 | High 
                </p>
                <br>
                <p>
                    <strong>Answer:</strong> 2.2
                </p>
                <br>
            </template>
        </InstructionsComponent>
    </v-container>
</template>

<script setup>
import InstructionsComponent from "@/components/InstructionsComponent.vue";

</script>