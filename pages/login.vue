<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from '#imports'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const identifier = ref('')
const password = ref('')
const showPassword = ref(false)

const handleSubmit = () => {
  const currentProfile = (auth as any).profile ?? {}
  auth.setRole('Hitchhiker')
  auth.setProfile({
    firstName: currentProfile.firstName || 'Utilisateur',
    lastName: currentProfile.lastName || '',
    email: identifier.value,
    phone: '',
    age: null,
    photo: ''
  } as any)
  if (process.client) localStorage.setItem('onboardingCompleted', 'true')
  router.push('/dashboard')
}
</script>

<template>
  <section class="mx-auto flex min-h-dvh max-w-sm flex-col gap-8 bg-white px-5 py-10 text-slate-900">
    <div class="space-y-2 text-center">
      <h1 class="text-2xl font-black">Connectez-vous</h1>
    </div>

    <div class="space-y-4">
      <label class="block">
        <span class="sr-only">Email ou numéro de téléphone</span>
        <input
          v-model="identifier"
          type="text"
          placeholder="Email ou numéro de téléphone"
          class="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none"
        />
      </label>

      <label class="block relative">
        <span class="sr-only">Mot de passe</span>
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Mot de passe"
          class="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 pr-12 text-base text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none"
        />
        <button
          type="button"
          class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
          @click="showPassword = !showPassword"
          aria-label="Afficher le mot de passe"
        >
          👁️
        </button>
      </label>

      <div class="text-right text-sm font-semibold text-orange-500">Mot de passe oublié ?</div>

      <button
        type="button"
        class="w-full rounded-full bg-orange-500 px-4 py-4 text-base font-semibold text-white shadow-lg transition hover:brightness-110"
        @click="handleSubmit"
      >
        Se connecter
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
          <span>Se connecter avec Gmail</span>
        </button>
        <button
          type="button"
          class="flex w-full items-center justify-center gap-3 rounded-full border border-slate-300 px-4 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-50"
        >
          <img src="/onboarding/Facebook.svg" alt="Facebook" class="h-5 w-5" />
          <span>Se connecter avec Facebook</span>
        </button>
        <button
          type="button"
          class="flex w-full items-center justify-center gap-3 rounded-full border border-slate-300 px-4 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-50"
        >
          <img src="/onboarding/Apple.svg" alt="Apple" class="h-5 w-5" />
          <span>Se connecter avec Apple</span>
        </button>
      </div>

      <p class="pt-2 text-center text-sm text-slate-700">
        Pas de compte ?
        <NuxtLink to="/signup" class="font-semibold text-orange-500"> Inscrivez-vous</NuxtLink>
      </p>
    </div>
  </section>
</template>

