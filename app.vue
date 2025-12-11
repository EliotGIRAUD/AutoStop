<script setup lang="ts">
import { onMounted, ref } from "vue";

const showSplash = ref(true);

onMounted(() => {
  const timeout = setTimeout(() => {
    showSplash.value = false;
  }, 2500);
  return () => clearTimeout(timeout);
});
</script>

<template>
  <div class="relative min-h-dvh">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <Transition name="fade">
      <div
        v-if="showSplash"
        class="pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-white px-6"
      >
        <img src="/Logo.svg" alt="Logo PickUp" class="w-48 sm:w-64" />
        <div class="w-48 sm:w-64">
          <div class="h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div class="h-full w-1/3 animate-progress rounded-full bg-orange-500" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes progress {
  0% {
    transform: translateX(-120%);
  }
  50% {
    transform: translateX(20%);
  }
  100% {
    transform: translateX(140%);
  }
}

.animate-progress {
  animation: progress 1.2s ease-in-out infinite;
}
</style>

