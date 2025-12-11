<script setup lang="ts">
definePageMeta({ layout: 'blank' })
const router = useRouter()
const route = useRoute()

const side = computed(() => (route.query.side === 'verso' ? 'verso' : 'recto'))

const close = () => router.back()

const capture = () => {
  if (process.client) {
    localStorage.setItem('captureSide', side.value)
    localStorage.setItem('captureName', `Photo_${side.value}.png`)
    localStorage.setItem('captureUrl', '')
  }
  router.back()
}
</script>

<template>
  <section class="relative mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-8 bg-black px-5 pb-12 pt-8 text-white sm:px-8">
    <header class="flex items-center justify-between">
      <button type="button" class="text-2xl font-semibold" @click="close">×</button>
    </header>

    <div class="flex flex-1 flex-col items-center gap-6">
      <div class="w-full rounded-2xl border-2 border-white/70 bg-black/40 p-1">
        <div class="h-[200px] w-full rounded-xl bg-black" />
      </div>

      <div class="space-y-2 text-center">
        <h1 class="text-2xl font-semibold">
          Prenez une photo du {{ side === 'verso' ? 'verso' : 'recto' }} de votre document.
        </h1>
        <p class="text-sm text-white/80">Veuillez vous assurer que le document tient dans la case ci-dessus.</p>
      </div>

      <div class="pt-6">
        <button
          type="button"
          class="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-black text-white transition hover:scale-105"
          @click="capture"
        >
          <span class="h-12 w-12 rounded-full bg-[#EB5D1F]" />
        </button>
      </div>
    </div>
  </section>
</template>

