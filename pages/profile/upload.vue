<script setup lang="ts">
definePageMeta({ layout: 'blank' })

const router = useRouter()
const docType = ref('')
const recto = ref<{ name: string; url: string } | null>(null)
const verso = ref<{ name: string; url: string } | null>(null)

const goBack = () => router.back()

const handleFile = (event: Event, side: 'recto' | 'verso') => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  const url = URL.createObjectURL(file)
  const payload = { name: file.name, url }
  if (side === 'recto') recto.value = payload
  else verso.value = payload
}

const removeFile = (side: 'recto' | 'verso') => {
  if (side === 'recto') recto.value = null
  else verso.value = null
}

const goToCapture = () => {
  const side = !recto.value ? 'recto' : 'verso'
  router.push(`/profile/capture?side=${side}`)
}

onMounted(() => {
  if (process.client) {
    const side = localStorage.getItem('captureSide')
    const name = localStorage.getItem('captureName')
    const url = localStorage.getItem('captureUrl')
    if (side && name) {
      const payload = { name, url: url || '' }
      if (side === 'recto') recto.value = payload
      if (side === 'verso') verso.value = payload
    }
    localStorage.removeItem('captureSide')
    localStorage.removeItem('captureName')
    localStorage.removeItem('captureUrl')
  }
})
</script>

<template>
  <section class="mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-10 bg-white px-5 pb-14 pt-10 text-slate-900 sm:px-8">
    <header class="flex items-center gap-3">
      <button type="button" class="inline-flex items-center gap-2 text-base font-semibold text-slate-600" @click="goBack">
        <span class="text-lg">←</span>
        <span>Retour</span>
      </button>
    </header>

    <div class="space-y-2 text-center">
      <h1 class="text-2xl font-black text-slate-900">Téléverser une preuve de votre identité</h1>
      <p class="text-base leading-relaxed text-slate-500">
        Veuillez choisir le type de document correspondant.
      </p>
    </div>

    <div class="space-y-8">
      <div class="space-y-3">
        <p class="text-base font-semibold text-slate-900">1. Sélectionnez votre type de document</p>
        <label class="relative block">
          <select
            v-model="docType"
            class="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-4 text-base text-slate-900 focus:border-[#EB5D1F] focus:outline-none"
          >
            <option value="" disabled>Type de document</option>
            <option>Permis de conduire</option>
            <option>Carte d'identité</option>
            <option>Passeport</option>
          </select>
          <span class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">⌄</span>
        </label>
      </div>

      <div class="space-y-4">
        <p class="text-base font-semibold text-slate-900">2. Téléversez votre pièce d'identité</p>

        <div class="space-y-3 rounded-xl border border-orange-300/80 px-3 py-3">
          <label class="block">
            <input type="file" accept="image/*,.pdf" class="hidden" @change="e => handleFile(e, 'recto')" />
            <div v-if="recto" class="flex items-center justify-between rounded-lg px-3 py-2">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-50 text-orange-500">
                  <span class="text-sm">ID</span>
                </div>
                <span class="max-w-[180px] truncate text-sm font-semibold text-slate-900">{{ recto.name }}</span>
              </div>
              <button type="button" class="text-orange-500" @click.stop="removeFile('recto')">🗑️</button>
            </div>
            <div
              v-else
              class="flex min-h-[70px] items-center justify-center rounded-lg border border-dashed border-orange-300 px-4 py-4 text-center text-orange-500 transition hover:border-orange-400"
            >
              <div class="space-y-1 text-sm font-semibold text-orange-500">
                <div class="text-lg">⭱</div>
                <p>Téléversez le recto de votre document.</p>
              </div>
            </div>
          </label>
        </div>

        <label
          class="flex min-h-[180px] items-center justify-center rounded-xl border border-slate-300 px-4 py-6 text-center text-[#EB5D1F] transition hover:border-[#EB5D1F]"
        >
          <input type="file" accept="image/*,.pdf" class="hidden" @change="e => handleFile(e, 'verso')" />
          <template v-if="verso">
            <div class="flex w-full items-center justify-between rounded-lg bg-gradient-to-br from-orange-50 to-white px-3 py-2">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-50 text-[#EB5D1F]">
                  <span class="text-sm">ID</span>
                </div>
                <span class="max-w-[180px] truncate text-sm font-semibold text-slate-900">{{ verso.name }}</span>
              </div>
              <button type="button" class="text-[#EB5D1F]" @click.stop="removeFile('verso')">🗑️</button>
            </div>
          </template>
          <template v-else>
            <div class="space-y-3">
              <div class="text-2xl">⭱</div>
              <p class="text-base font-semibold text-[#EB5D1F]">Téléversez le verso de votre document.</p>
            </div>
          </template>
        </label>
      </div>
    </div>

    <div class="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        class="w-full rounded-full border border-[#EB5D1F] px-4 py-4 text-base font-semibold text-[#EB5D1F] transition hover:bg-orange-50 sm:w-[48%]"
        @click="goToCapture"
      >
        Prendre une photo
      </button>
      <button
        type="button"
        class="w-full rounded-full bg-[#EB5D1F] px-4 py-4 text-base font-semibold text-white shadow-lg transition hover:brightness-110 sm:w-[48%]"
        @click="router.push('/profile/selfie')"
      >
        Vérifier
      </button>
    </div>
  </section>
</template>

