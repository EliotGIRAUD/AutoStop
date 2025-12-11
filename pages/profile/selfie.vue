<script setup lang="ts">
definePageMeta({ layout: 'blank' })
const router = useRouter()
const route = useRoute()

const selfie = ref<{ name: string; url: string } | null>(null)

const handleVerify = () => {
  const returnPath = (process.client && localStorage.getItem('profileReturnPath')) || '/profile/1'
  if (process.client) localStorage.setItem('profileVerificationStatus', 'pending')
  router.push(returnPath)
}

const goBack = () => router.back()

const handleSelfieFile = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  const url = URL.createObjectURL(file)
  selfie.value = { name: file.name, url }
  if (process.client) {
    localStorage.setItem('profileSelfieName', file.name)
    localStorage.setItem('profileSelfieUrl', url)
  }
}

onMounted(() => {
  if (process.client) {
    const name = localStorage.getItem('profileSelfieName')
    const url = localStorage.getItem('profileSelfieUrl')
    if (name) selfie.value = { name, url: url || '' }
  }
})
</script>

<template>
  <section class="mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-8 bg-white px-5 pb-14 pt-10 text-slate-900 sm:px-8">
    <header class="flex items-center gap-3">
      <button type="button" class="inline-flex items-center gap-2 text-base font-semibold text-slate-600" @click="goBack">
        <span class="text-lg">←</span>
        <span>Retour</span>
      </button>
    </header>

    <div class="space-y-2 text-center">
      <h1 class="text-2xl font-black text-slate-900">Téléchargez une photo de vous tenant votre pièce d'identité.</h1>
      <p class="text-base leading-relaxed text-slate-500">
        Nous comparerons votre selfie avec votre document.
      </p>
    </div>

    <div class="space-y-4">
      <p class="text-base font-semibold text-slate-900">Veuillez vous assurer que :</p>
      <ul class="space-y-3 text-base text-slate-800">
        <li class="flex items-start gap-3">
          <span class="text-[#EB5D1F]">✔</span>
          <span>Prendre la photo sous un bon éclairage.</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="text-[#EB5D1F]">✔</span>
          <span>Il n'y a pas de reflet sur la carte d'identité.</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="text-[#EB5D1F]">✔</span>
          <span>Les détails sont mis en évidence.</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="text-[#EB5D1F]">✔</span>
          <span>L'identifiant ne couvre pas votre visage.</span>
        </li>
      </ul>
    </div>

    <div class="rounded-xl border border-[#EB5D1F]/30 px-4 py-6 text-center text-[#EB5D1F]">
      <label class="flex w-full flex-col items-center gap-3 py-4">
        <input type="file" accept="image/*" capture="user" class="hidden" @change="handleSelfieFile" />
        <div v-if="selfie" class="flex w-full items-center justify-between rounded-lg bg-gradient-to-br from-orange-50 to-white px-3 py-2 text-left">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-50 text-[#EB5D1F]">
              <span class="text-sm">ID</span>
            </div>
            <span class="max-w-[180px] truncate text-sm font-semibold text-slate-900">{{ selfie.name }}</span>
          </div>
          <button type="button" class="text-[#EB5D1F] text-lg" @click.stop="selfie = null">🗑️</button>
        </div>
        <div v-else class="space-y-3">
          <div class="text-2xl">⭱</div>
          <p class="text-base font-semibold text-[#EB5D1F]">Prendre un selfie avec mon appareil.</p>
        </div>
      </label>
    </div>

    <div class="pt-2">
      <button
        type="button"
        class="w-full rounded-full bg-[#EB5D1F] px-4 py-4 text-base font-semibold text-white shadow-lg transition hover:brightness-110"
        @click="handleVerify"
      >
        Vérifier
      </button>
    </div>
  </section>
</template>

