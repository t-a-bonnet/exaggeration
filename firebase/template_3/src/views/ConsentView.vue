<template>
  <v-container>
    <h1>Consent Form</h1>
    <p>This is study is supported by the University of Oxford. The data will be collected anonymously. It will later be released in an open-source manner for use by other researchers or commercial entities under the CC BY-ShareAlike license. While all efforts have been made to remove obscenities and hate-speech from the materials, participants are warned that these are social media comments and by nature may contain strong views about various topics. Participants will not be asked to share their own personal views about these topics.</p>
    <br>
    <p>By proceeding with the task, you acknowledge that:</p>
    <br>
    <ol style="margin-left: 17px;">
      <li>You have been informed about the nature of this study and understand that the judgments you provide about the texts will be used as part of a research dataset.</li>
      <li>The dataset created using your judgements will be used for academic 	research purposes and may be shared with other researchers for further analysis.</li>
      <li>Participation is voluntary, and you are free to withdraw at any point by 	discontinuing your participation in the task, without providing any reason or facing any consequences.</li>
      <li>The dataset created from your responses will not include any personal or 	identifiable information.</li>
      <li>You will not be asked to provide any sensitive or special category data as defined by the UK General Data Protection Regulation (GDPR).</li>
      <li>By continuing to the platform and completing the task, you are giving your implied consent to participate in this research under these terms.</li>
    </ol>
    <br>
    <p>If you agree to proceed, please click 'I consent'</p>
    <p>Otherwise, click 'I do not consent'</p>
    <v-btn @click="goBack" color="primary" class="mr-2 mt-4">Back <v-icon>arrow_back</v-icon></v-btn>
    <v-btn @click="agree" color="success" class="mr-2 mt-4">I Consent <v-icon>check_circle</v-icon></v-btn>
    <v-btn @click="disagree" color="error" class="mt-4">I Do Not Consent <v-icon>cancel</v-icon></v-btn>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter();
import Swal from "sweetalert2";

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/");
  }
};

const agree = () => {
  router.push("/instructions")
}

const disagree = () => {
  Swal.fire({
    title: 'Consent Declined',
    icon: 'info',
    text: 'You may now close the browser'
  })
}

</script>