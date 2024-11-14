<template>
  <Transition name="fade">
    <div v-if="show" class="tutorial-overlay">
      <div class="tutorial-content">
        <div class="tutorial-step">
          <h3>{{ currentStep.title }}</h3>
          <p>{{ currentStep.content }}</p>
        </div>
        <div class="tutorial-controls">
          <button 
            v-if="currentStepIndex > 0" 
            @click="previousStep"
          >上一步</button>
          <button 
            v-if="currentStepIndex < steps.length - 1" 
            @click="nextStep"
          >下一步</button>
          <button 
            v-else 
            @click="complete"
          >开始游戏</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  show: boolean;
  steps: Array<{ title: string; content: string }>;
}>();

const emit = defineEmits<{
  (e: 'complete'): void;
}>();

const currentStepIndex = ref(0);
const currentStep = computed(() => props.steps[currentStepIndex.value]);

const nextStep = () => {
  if (currentStepIndex.value < props.steps.length - 1) {
    currentStepIndex.value++;
  }
};

const previousStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--;
  }
};

const complete = () => {
  emit('complete');
};
</script>

<style scoped>
.tutorial-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.tutorial-content {
  background: white;
  padding: 30px;
  border-radius: 16px;
  max-width: 80%;
  width: 400px;
  text-align: center;
}

/* ... 其他样式 ... */
</style> 