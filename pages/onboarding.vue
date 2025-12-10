<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const onboardingStep = ref(0)
const firstName = ref('')
const lastName = ref('')

const nextStep = () => {
  onboardingStep.value = Math.min(onboardingStep.value + 1, 3)
}

const prevStep = () => {
  onboardingStep.value = Math.max(onboardingStep.value - 1, 0)
}

const setAvailability = (value: boolean) => {
  if (auth.availability !== value) auth.toggleAvailability()
}

const complete = () => {
  if (firstName.value.trim().length || lastName.value.trim().length) {
    auth.setProfile({
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim()
    })
  }
  if (process.client) localStorage.setItem('onboardingCompleted', 'true')
  router.push('/')
}

const skip = () => {
  if (process.client) localStorage.setItem('onboardingCompleted', 'true')
  router.push('/')
}
</script>

<template>
  <section class="space-y-8 pt-4">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Bienvenue</p>
        <h1 class="text-3xl font-bold text-white">Découvre PICKY</h1>
        <p class="text-base text-slate-300">
          Carte temps réel pour connecter conducteurs et auto-stoppeurs. Quelques étapes pour démarrer.
        </p>
      </div>
      <button
        class="text-sm text-slate-400 transition hover:text-white"
        type="button"
        @click="skip"
      >
        Passer
      </button>
    </div>

    <div class="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-xl">
      <div class="space-y-4">
        <h2 class="text-2xl font-bold text-white" v-if="onboardingStep === 0">Le principe</h2>
        <h2 class="text-2xl font-bold text-white" v-else-if="onboardingStep === 1">Choisis ton rôle</h2>
        <h2 class="text-2xl font-bold text-white" v-else-if="onboardingStep === 2">Rends-toi visible</h2>
        <h2 class="text-2xl font-bold text-white" v-else>Complète ton profil</h2>

        <p class="text-slate-300" v-if="onboardingStep === 0">
          Active la géolocalisation pour voir qui est autour de toi et afficher tes propres trajets.
        </p>

        <div v-else-if="onboardingStep === 1" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            class="rounded-2xl border px-4 py-4 text-left transition"
            :class="auth.role === 'Driver' ? 'border-emerald-400 bg-emerald-500/10 text-white' : 'border-white/10 bg-slate-800 text-slate-200'"
            @click="auth.setRole('Driver')"
          >
            <p class="font-semibold">Conducteur</p>
            <p class="text-sm text-slate-300">Propose tes trajets et tes dispos.</p>
          </button>
          <button
            type="button"
            class="rounded-2xl border px-4 py-4 text-left transition"
            :class="auth.role === 'Hitchhiker' ? 'border-cyan-300 bg-cyan-500/10 text-white' : 'border-white/10 bg-slate-800 text-slate-200'"
            @click="auth.setRole('Hitchhiker')"
          >
            <p class="font-semibold">Auto-stoppeur</p>
            <p class="text-sm text-slate-300">Trouve un conducteur proche.</p>
          </button>
        </div>

        <div v-else-if="onboardingStep === 2" class="space-y-3">
          <p class="text-slate-300">Indique si tu es disponible dès maintenant.</p>
          <div class="flex flex-wrap items-center gap-3">
            <button
              type="button"
              class="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:brightness-110"
              :class="auth.availability ? '' : 'opacity-70'"
              @click="setAvailability(true)"
            >
              Disponible
            </button>
            <button
              type="button"
              class="rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 ring-1 ring-white/10 transition hover:bg-slate-700"
              :class="!auth.availability ? '' : 'opacity-70'"
              @click="setAvailability(false)"
            >
              Pas dispo
            </button>
          </div>
        </div>

        <div v-else class="space-y-3">
          <p class="text-slate-300">Optionnel mais utile pour les échanges.</p>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div class="space-y-1">
              <label class="text-sm text-slate-400">Prénom</label>
              <input
                v-model="firstName"
                type="text"
                class="w-full rounded-xl bg-slate-800 px-3 py-2 text-white ring-1 ring-white/10 focus:outline-none focus:ring-emerald-400"
                placeholder="Alex"
              />
            </div>
            <div class="space-y-1">
              <label class="text-sm text-slate-400">Nom</label>
              <input
                v-model="lastName"
                type="text"
                class="w-full rounded-xl bg-slate-800 px-3 py-2 text-white ring-1 ring-white/10 focus:outline-none focus:ring-emerald-400"
                placeholder="Favre"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 flex items-center justify-between text-sm text-slate-400">
        <div class="flex items-center gap-2">
          <span
            v-for="n in 4"
            :key="n"
            class="h-2 w-2 rounded-full"
            :class="n - 1 === onboardingStep ? 'bg-emerald-400' : 'bg-slate-600'"
          />
        </div>
        <div class="flex items-center gap-2">
          <button
            v-if="onboardingStep > 0"
            type="button"
            class="rounded-full px-3 py-1.5 text-slate-200 ring-1 ring-white/10 transition hover:bg-slate-800"
            @click="prevStep"
          >
            Précédent
          </button>
          <button
            v-if="onboardingStep < 3"
            type="button"
            class="rounded-full bg-emerald-500 px-4 py-2 font-semibold text-slate-950 transition hover:brightness-110"
            @click="nextStep"
          >
            Continuer
          </button>
          <button
            v-else
            type="button"
            class="rounded-full bg-emerald-500 px-4 py-2 font-semibold text-slate-950 transition hover:brightness-110"
            @click="complete"
          >
            Terminer
          </button>
        </div>
      </div>
    </div>
  </section>
</template>


