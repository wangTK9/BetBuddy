<template>
  <div v-if="poll" class="pinned-poll"> <!-- Only render if poll is defined -->
    <div class="pinned-poll-header">
      <h3>Bình chọn đã ghim</h3>
      <button @click="removePinnedPoll">Xóa</button>
    </div>
    <div class="pinned-poll-content">
      <h4>{{ poll.question }}</h4>
      <ul>
        <li v-for="(option, index) in poll.options" :key="index">
          {{ option.text }}
        </li>
      </ul>
      <p>Thời gian hết hạn: {{ formattedExpirationTime }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'; // Thêm import computed

const props = defineProps({
  poll: Object,
});

const emit = defineEmits();

const formattedExpirationTime = computed(() => {
  if (!props.poll || !props.poll.expirationTime) return ''; // Check if poll exists
  const date = new Date(props.poll.expirationTime);
  return date.toLocaleString();
});

const removePinnedPoll = () => {
  emit('removePinnedPoll', props.poll); // Emit sự kiện để xóa
};
</script>

<style scoped>
.pinned-poll {
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px 0;
}

.pinned-poll-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pinned-poll-header button {
  background-color: red;
  color: white;
  border: none;
  cursor: pointer;
}

.pinned-poll-header button:hover {
  background-color: darkred;
}

.pinned-poll-content h4 {
  font-size: 1.2em;
}

.pinned-poll-content ul {
  list-style-type: none;
  padding-left: 0;
}
</style>
