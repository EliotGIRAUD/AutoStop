<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from '#imports'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const fullName = ref('')
const phone = ref('')
const countryCode = ref('+33')
const email = ref('')
const address = ref('')
const city = ref('')
const gender = ref('')
const photo = ref<string | null>(null)
const verificationNotice = ref(false)

const goBack = () => {
  if (process.client) {
    const returnPath = localStorage.getItem('profileReturnPath') || '/profile'
    localStorage.removeItem('profileReturnPath')
    router.push(returnPath)
    return
  }
  router.push('/profile')
}

const handlePhoto = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file || !file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = () => {
    photo.value = reader.result as string
  }
  reader.readAsDataURL(file)
}

const handleVerify = () => {
  if (process.client) {
    localStorage.setItem('profileReturnPath', route.fullPath)
    localStorage.setItem('profileVerificationStatus', 'pending')
  }
  router.push('/profile/verify')
}

onMounted(() => {
  const profile = (auth as any)?.profile ?? {}
  const name = `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim()
  fullName.value = name || fullName.value
  email.value = profile.email ?? ''
  const phoneStr = profile.phone ?? ''
  phone.value = phoneStr.replace(/^\+?\d+\s*/, '')
  const codeMatch = phoneStr.match(/^\+?\d+/)
  if (codeMatch) countryCode.value = codeMatch[0]
  if (process.client) {
    verificationNotice.value = localStorage.getItem('profileVerificationStatus') === 'pending'
  }
})
</script>

<template>
  <section class="mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-8 bg-white px-5 pb-12 pt-10 text-slate-900 sm:px-8">
    <div class="text-center">
      <h1 class="text-2xl font-black">Profil</h1>
    </div>

    <div
      v-if="verificationNotice"
      class="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700"
    >
      Profil en cours de vérification.
    </div>

    <div class="flex flex-col items-center gap-4">
      <div class="relative h-36 w-36">
        <div class="h-full w-full overflow-hidden rounded-full bg-slate-100">
          <img v-if="photo" :src="photo" alt="Photo de profil" class="h-full w-full object-cover" />
          <div v-else class="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_30%,#f2f2f2,#e5e5e5)]">
            <img src="/profil/profile.svg" alt="Profil" class="h-12 w-12 object-contain opacity-60" />
          </div>
        </div>
        <label
          for="profilePhoto"
          class="absolute -bottom-1 -right-1 flex h-12 w-12 items-center justify-center rounded-full bg-[#EB5D1F] text-white shadow-lg ring-4 ring-white transition hover:brightness-110"
        >
          <span class="text-xl">📷</span>
          <input id="profilePhoto" type="file" accept="image/*" class="hidden" @change="handlePhoto" />
        </label>
      </div>
    </div>

    <div class="space-y-3">
      <label class="block">
        <span class="sr-only">Nom & Prénom</span>
        <input
          v-model="fullName"
          type="text"
          placeholder="Nom & Prénom"
          class="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none"
        />
      </label>

      <div class="flex gap-3">
        <label class="w-20">
          <span class="sr-only">Pays</span>
          <select
            v-model="countryCode"
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-4 text-base text-slate-900 focus:border-orange-500 focus:outline-none"
          >
            <option value="+33">🇫🇷</option>
            <option value="+32">🇧🇪</option>
            <option value="+41">🇨🇭</option>
          </select>
        </label>
        <label class="flex-1">
          <span class="sr-only">Téléphone</span>
          <input
            v-model="phone"
            type="tel"
            placeholder="Numéro de téléphone"
            class="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none"
          />
        </label>
      </div>

      <label class="block">
        <span class="sr-only">Email</span>
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none"
        />
      </label>

      <label class="block">
        <span class="sr-only">Adresse</span>
        <input
          v-model="address"
          type="text"
          placeholder="Adresse"
          class="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none"
        />
      </label>

      <label class="block relative">
        <span class="sr-only">Ville</span>
        <select
          v-model="city"
          class="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-4 text-base text-slate-900 focus:border-orange-500 focus:outline-none"
        >
          <option value="" disabled>Ville</option>
          <option value="Annecy">Annecy</option>
          <option value="Genève">Genève</option>
          <option value="Lyon">Lyon</option>
          <option value="Paris">Paris</option>
        </select>
        <span class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">⌄</span>
      </label>

      <label class="block relative">
        <span class="sr-only">Genre</span>
        <select
          v-model="gender"
          class="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-4 text-base text-slate-900 focus:border-orange-500 focus:outline-none"
        >
          <option value="" disabled>Genre</option>
          <option value="F">Femme</option>
          <option value="M">Homme</option>
          <option value="O">Autre / Préféré ne pas dire</option>
        </select>
        <span class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">⌄</span>
      </label>
    </div>

    <div class="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-between">
      <button
        type="button"
        class="w-full rounded-full border border-orange-500 px-6 py-3 text-base font-semibold text-orange-500 transition hover:bg-orange-50 sm:w-[45%]"
        @click="goBack"
      >
        Retour
      </button>
      <button
        type="button"
        class="w-full rounded-full bg-orange-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:brightness-110 sm:w-[45%]"
        @click="handleVerify"
      >
        Vérifier
      </button>
    </div>
  </section>
</template>
