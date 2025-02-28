<template>
    <div class="vote-container" v-if="!isSubmitted">
      <h2>Vote</h2>
      <div class="vote-options">
        <div
          v-for="(option, index) in voteOptions"
          :key="index"
          :class="['option-wrapper', { selected: selectedOption === index }]"
          @click="vote(index)"
        >
          <div class="vote__content">{{ option }}</div>
        </div>
      </div>
  
      <div class="betting-input">
        <label for="betAmount">Enter bet amount:</label>
        <input
          type="number"
          id="betAmount"
          v-model.number="betAmount"
          min="1"
          placeholder="Enter bet amount..."
        />
        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
      </div>
  
      <button @click="submitVote">Submit Vote</button>
    </div>
  
    <div class="result-container" v-if="isSubmitted">
      <h2>Your Result</h2>
      <p class="highlight">You selected: {{ voteOptions[selectedOption] }}</p>
      <p>Bet amount: {{ betAmount }}</p>
      <p>
        Check results here:
        <a href="https://www.binance.com/vi/price/ethereum" target="_blank">Facebook</a>
      </p>
    </div>
  </template>
  
  <script setup>
import { ref, defineEmits } from "vue";

const voteOptions = ["Tăng 10% - 15%", "Giảm 10%"];
const selectedOption = ref(null);
const betAmount = ref(null);
const errorMsg = ref("");
const isSubmitted = ref(false);
const userTokens = ref(10); // Simulated token balance

const emits = defineEmits(["vote-submitted"]);

const vote = (index) => {
  selectedOption.value = index;
};

const submitVote = () => {
  errorMsg.value = "";

  if (selectedOption.value === null) {
    errorMsg.value = "Please select an option!";
    return;
  }
  if (!betAmount.value || betAmount.value <= 0) {
    errorMsg.value = "Please enter a valid bet amount!";
    return;
  }
  if (betAmount.value > userTokens.value) {
    errorMsg.value = "You don't have enough tokens to place this bet!";
    return;
  }

  isSubmitted.value = true;

  // Emit event with vote data to `ChatBox.vue`
  emits("vote-submitted", {
    choice: voteOptions[selectedOption.value],
    bet: betAmount.value
  });
};
</script>


  
  <style scoped>
  body {
    font-family: "Poppins", sans-serif;
    background: linear-gradient(135deg, #74ebd5, #acb6e5);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
  }
  .vote-container,
  .result-container {
    background: #ffffff;
    padding: 25px;
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    width: 320px;
    height: 500px;
    text-align: center;
    transition: transform 0.3s;
    margin-left: 250px;

   
  }
  .vote-container:hover,
  .result-container:hover {
    transform: scale(1.02);
  }
  h2 {
    color: #333;
    font-size: 22px;
    margin-bottom: 15px;
  }
  .vote-options {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  .option-wrapper {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 12px;
    border-radius: 8px;
    background: #f1f1f1;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: background 0.3s;
  }
  .option-wrapper:hover {
    background: #e0e0e0;
  }
  .selected {
    background: #0071c2 !important;
    color: white;
    font-weight: bold;
  }
  .betting-input {
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    gap: 7px;
  }
  .betting-input input {
    width: 100%;
    padding: 10px;
    font-size: 15px;
    border: 2px solid #ccc;
    border-radius: 8px;
    outline: none;
  }
  .betting-input input:focus {
    border-color: #0071c2;
  }
  .error {
    color: red;
    font-size: 14px;
    margin-top: 5px;
  }
  button {
    background: #0071c2;
    color: white;
    padding: 12px 18px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    width: 100%;
    margin-top: 15px;
    font-size: 16px;
  }
  button:hover {
    background: #005999;
  }

  .highlight {
    background: #ffeb3b;
    color: #333;
    font-weight: bold;
    padding: 10px;
    border-radius: 8px;
  }
  #betAmount{
    width: 93%;
  }
  </style>
  