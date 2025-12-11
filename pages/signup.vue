<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from '#imports'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const fullName = ref('')
const email = ref('')
const phone = ref('')
const gender = ref('')
const countryCode = ref('+33')
const acceptTerms = ref(false)

const handleSubmit = () => {
  if (!acceptTerms.value) return
  const [firstName, ...rest] = fullName.value.trim().split(' ')
  const lastName = rest.join(' ').trim()
  auth.setRole('Hitchhiker')
  auth.setProfile({
    firstName: firstName ?? '',
    lastName,
    phone: `${countryCode.value} ${phone.value}`.trim(),
    age: null,
    photo: '',
    email: email.value.trim()
  } as any)
  if (process.client) localStorage.setItem('onboardingCompleted', 'true')
  router.push('/dashboard')
}
</script>

<template>
  <section class="mx-auto flex min-h-dvh max-w-md flex-col gap-8 bg-white px-5 py-8 text-slate-900">
    <div class="space-y-2 text-center">
      <h1 class="text-2xl font-black leading-snug">Créez votre compte Picky facilement</h1>
    </div>

    <div class="space-y-4">
      <label class="block">
        <span class="sr-only">Nom & Prénom</span>
        <input
          v-model="fullName"
          type="text"
          placeholder="Nom & Prénom"
          class="w-full rounded-xl border-2 border-orange-500/80 bg-white px-4 py-4 text-base font-semibold text-slate-900 placeholder:font-normal placeholder:text-slate-400 focus:border-orange-500 focus:outline-none"
        />
      </label>

      <label class="block">
        <span class="sr-only">Email</span>
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none"
        />
      </label>

      <div class="flex gap-3">
        <label class="relative w-24">
          <span class="sr-only">Indicatif</span>
          <select
            v-model="countryCode"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-4 text-base text-slate-900 focus:border-orange-500 focus:outline-none"
          >
            <option value="+33">🇫🇷 +33</option>
            <option value="+32">🇧🇪 +32</option>
            <option value="+41">🇨🇭 +41</option>
          </select>
        </label>
        <label class="flex-1">
          <span class="sr-only">Téléphone</span>
          <input
            v-model="phone"
            type="tel"
            placeholder="Numéro de téléphone"
            class="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none"
          />
        </label>
      </div>

      <label class="block">
        <span class="sr-only">Genre</span>
        <select
          v-model="gender"
          class="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-900 focus:border-orange-500 focus:outline-none"
        >
          <option value="" disabled>Genre</option>
          <option value="F">Femme</option>
          <option value="M">Homme</option>
          <option value="O">Autre / Préféré ne pas dire</option>
        </select>
      </label>

      <label class="flex items-start gap-3 rounded-xl bg-white text-sm text-slate-700">
        <input v-model="acceptTerms" type="checkbox" class="mt-1 h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400" />
        <span>
          En vous inscrivant, vous acceptez les <a href="#" class="text-orange-500 underline">conditions d'utilisation</a> et la
          <a href="#" class="text-orange-500 underline"> politique de confidentialité</a>.
        </span>
      </label>

      <button
        type="button"
        class="w-full rounded-full bg-orange-500 px-4 py-4 text-base font-semibold text-white shadow-lg transition hover:brightness-110"
        :class="!acceptTerms ? 'opacity-80' : ''"
        :disabled="!acceptTerms"
        @click="handleSubmit"
      >
        S'inscrire
      </button>

      <div class="flex items-center gap-3 text-sm text-slate-400">
        <span class="flex-1 border-t border-slate-200" />
        <span>ou</span>
        <span class="flex-1 border-t border-slate-200" />
      </div>

      <div class="space-y-3">
        <button
          type="button"
          class="flex w-full items-center justify-center gap-3 rounded-full border border-slate-300 px-4 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-50"
        >
          <img src="/onboarding/Gmail.svg" alt="Gmail" class="h-5 w-5" />
          <span>Inscrivez-vous avec Gmail</span>
        </button>
        <button
          type="button"
          class="flex w-full items-center justify-center gap-3 rounded-full border border-slate-300 px-4 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-50"
        >
          <img src="/onboarding/Facebook.svg" alt="Facebook" class="h-5 w-5" />
          <span>Inscrivez-vous avec Facebook</span>
        </button>
        <button
          type="button"
          class="flex w-full items-center justify-center gap-3 rounded-full border border-slate-300 px-4 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-50"
        >
          <img src="/onboarding/Apple.svg" alt="Apple" class="h-5 w-5" />
          <span>Inscrivez-vous avec Apple</span>
        </button>
      </div>

      <p class="pt-2 text-center text-sm text-slate-700">
        Vous avez déjà un compte ?
        <NuxtLink to="/login" class="font-semibold text-orange-500"> Connectez-vous.</NuxtLink>
      </p>
    </div>
  </section>
</template>

