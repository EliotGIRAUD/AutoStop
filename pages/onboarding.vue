<script setup lang="ts">
import { computed, ref } from "vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();

const onboardingStep = ref(0)
const firstName = ref('')
const lastName = ref('')
const totalSteps = 4

const progressValue = computed(() => onboardingStep.value + 1)
const progressWidth = computed(() => `${(progressValue.value / totalSteps) * 100}%`)

const nextStep = () => {
  onboardingStep.value = Math.min(onboardingStep.value + 1, 3);
};

const prevStep = () => {
  onboardingStep.value = Math.max(onboardingStep.value - 1, 0);
};

const setAvailability = (value: boolean) => {
  if (auth.availability !== value) auth.toggleAvailability();
};

const goToSignup = () => {
  if (process.client) localStorage.setItem('onboardingCompleted', 'true')
  router.push('/signup')
}

const goToLogin = () => {
  if (process.client) localStorage.setItem('onboardingCompleted', 'true')
  router.push('/login')
}

const complete = () => {
  if (firstName.value.trim().length || lastName.value.trim().length) {
    auth.setProfile({
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
    });
  }
  if (process.client) localStorage.setItem("onboardingCompleted", "true");
  router.push("/");
};

const skip = () => {
  if (process.client) localStorage.setItem("onboardingCompleted", "true");
  router.push("/");
};
</script>

<template>
  <section class="min-h-dvh bg-white text-slate-900">
    <div class="mx-auto flex min-h-dvh max-w-3xl flex-col px-6 pb-14 pt-6">
      <header class="flex items-center justify-between">
        <div class="w-14">
          <button
            v-if="onboardingStep > 0"
            type="button"
            class="text-lg font-semibold text-slate-500 transition hover:text-slate-700"
            @click="prevStep"
            aria-label="Précédent"
          >
            ←
          </button>
        </div>
        <span class="text-sm font-semibold text-slate-400">{{ progressValue }} / {{ totalSteps }}</span>
        <button type="button" class="text-base font-semibold text-slate-500" @click="skip">Passer</button>
      </header>

      <div v-if="onboardingStep === 0" class="flex flex-1 flex-col items-center gap-8 pt-4">
        <img src="/onboarding/Anywhere_you_are_1.svg" alt="Onboarding étape 1" class="w-full max-w-[420px]" />

    <div class="relative mx-auto max-w-4xl space-y-8 px-4 sm:px-6">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="h-2 flex-1 rounded-full bg-slate-800">
          <div class="h-full rounded-full bg-gradient-to-r from-primary-400 to-cyan-400 transition-all" :style="{ width: progressWidth }" />
        </div>
      </div>

      <div v-else-if="onboardingStep === 1" class="flex flex-1 flex-col items-center gap-8 pt-4">
        <img src="/onboarding/At_anytime_2.svg" alt="Onboarding étape 2" class="w-full max-w-[420px]" />

        <div class="space-y-3 text-center">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">Bienvenue</p>
          <h1 class="text-3xl font-bold leading-tight text-white sm:text-4xl">Prêt(e) à rejoindre PICKY ?</h1>
          <p class="text-base text-slate-300 sm:text-lg">Une courte expérience pour configurer ton rôle, ta dispo et ton profil. Tu peux passer à tout moment.</p>
        </div>

        <div class="mt-auto flex justify-center pb-6">
          <button
            type="button"
            class="w-full rounded-full bg-primary-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110 sm:w-auto"
            @click="startExperience"
          >
            <svg viewBox="0 0 120 120" class="h-full w-full">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#fde7d2" stroke-width="8" />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#EB5D1F"
                stroke-width="8"
                stroke-linecap="round"
                stroke-dasharray="180 360"
                transform="rotate(-90 60 60)"
              />
              <circle cx="60" cy="60" r="34" fill="#EB5D1F" />
              <path
                d="M55 60h14m0 0l-5-5m5 5l-5 5"
                stroke="white"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div v-else-if="onboardingStep === 2" class="flex flex-1 flex-col items-center gap-8 pt-4">
        <img src="/onboarding/3.svg" alt="Onboarding étape 3" class="w-full max-w-[420px]" />

        <div class="space-y-3 text-center">
          <h1 class="text-3xl font-black text-slate-900">En route</h1>
          <p class="text-base leading-relaxed text-slate-500">
            Planifie ou accepte un trajet en un geste. Reste visible pour les conducteurs tout autour de toi.
          </p>
        </div>

        <div class="mt-auto flex justify-center pb-6">
          <button
            type="button"
            class="relative h-24 w-24 transition hover:scale-105 focus:outline-none"
            @click="nextStep"
            aria-label="Continuer"
          >
            <svg viewBox="0 0 120 120" class="h-full w-full">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#EB5D1F" stroke-width="4" />
              <circle cx="60" cy="60" r="44" fill="none" stroke="#EB5D1F" stroke-width="4" />
              <circle cx="60" cy="60" r="34" fill="#EB5D1F" />
              <text x="60" y="64" text-anchor="middle" fill="white" font-size="20" font-weight="600">Go</text>
            </svg>
          </button>
        </div>
      </div>

      <div v-else class="grid gap-4 rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-2xl backdrop-blur sm:p-8 lg:grid-cols-[1fr_280px]">
        <div class="space-y-5">
          <div class="space-y-2">
            <h2 class="text-2xl font-bold text-white" v-if="onboardingStep === 0">Le principe</h2>
            <h2 class="text-2xl font-bold text-white" v-else-if="onboardingStep === 1">Choisis ton rôle</h2>
            <h2 class="text-2xl font-bold text-white" v-else-if="onboardingStep === 2">Rends-toi visible</h2>
            <h2 class="text-2xl font-bold text-white" v-else>Complète ton profil</h2>

            <p class="text-slate-300" v-if="onboardingStep === 0">Active la géolocalisation pour voir qui est autour de toi et afficher tes propres trajets.</p>
          </div>

          <div v-if="onboardingStep === 1" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              class="w-full rounded-2xl border px-4 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[0_12px_30px_rgba(235,93,31,0.1)]"
              :class="auth.role === 'Driver' ? 'border-primary-400 bg-primary-500/10 text-white' : 'border-white/10 bg-slate-800 text-slate-200'"
              @click="auth.setRole('Driver')"
            >
              <p class="font-semibold">Conducteur</p>
              <p class="text-sm text-slate-300">Propose tes trajets et tes dispos.</p>
            </button>
            <button
              type="button"
              class="w-full rounded-2xl border px-4 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/10"
              :class="auth.role === 'Hitchhiker' ? 'border-cyan-300 bg-cyan-500/10 text-white' : 'border-white/10 bg-slate-800 text-slate-200'"
              @click="auth.setRole('Hitchhiker')"
            >
              <p class="font-semibold">Auto-stoppeur</p>
              <p class="text-sm text-slate-300">Trouve un conducteur proche.</p>
            </button>
          </div>

          <div v-else-if="onboardingStep === 2" class="space-y-4">
            <p class="text-slate-300">Indique si tu es disponible dès maintenant.</p>
            <div class="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                class="flex-1 rounded-full bg-primary-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
                :class="auth.availability ? '' : 'opacity-80'"
                @click="setAvailability(true)"
              >
                Disponible
              </button>
              <button
                type="button"
                class="flex-1 rounded-full bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-100 ring-1 ring-white/10 transition hover:bg-slate-700"
                :class="!auth.availability ? '' : 'opacity-70'"
                @click="setAvailability(false)"
              >
                Pas dispo
              </button>
            </div>
          </div>

          <div v-else-if="onboardingStep === 3" class="space-y-4">
            <p class="text-slate-300">Optionnel mais utile pour les échanges.</p>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div class="space-y-1">
                <label class="text-sm text-slate-400">Prénom</label>
                <input
                  v-model="firstName"
                  type="text"
                  class="w-full rounded-xl bg-slate-800 px-3 py-2 text-white ring-1 ring-white/10 focus:outline-none focus:ring-primary-400"
                  placeholder="Alex"
                />
              </div>
              <div class="space-y-1">
                <label class="text-sm text-slate-400">Nom</label>
                <input
                  v-model="lastName"
                  type="text"
                  class="w-full rounded-xl bg-slate-800 px-3 py-2 text-white ring-1 ring-white/10 focus:outline-none focus:ring-primary-400"
                  placeholder="Favre"
                />
              </div>
            </div>
          </div>
        </div>

        <aside class="rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-inner sm:p-5">
          <p class="text-sm font-semibold text-white">Au programme</p>
          <ul class="mt-3 space-y-3 text-sm text-slate-300">
            <li class="flex items-start gap-2">
              <span class="mt-1 h-2 w-2 rounded-full bg-primary-400" />
              <span>Active ta position pour voir qui est proche.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1 h-2 w-2 rounded-full bg-cyan-300" />
              <span>Choisis ton rôle et rends-toi visible.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1 h-2 w-2 rounded-full bg-white/70" />
              <span>Ajoute ton nom pour des échanges plus simples.</span>
            </li>
          </ul>
          <div class="mt-4 rounded-xl bg-slate-800/70 p-3 text-xs text-slate-400">Astuce : tu peux revenir à tout moment changer ton statut ou ton rôle depuis la carte.</div>
        </aside>

        <div class="lg:col-span-2">
          <div class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-2">
            <div class="flex items-center gap-2 text-sm text-slate-400">
              <span v-for="n in 4" :key="n" class="h-2 w-2 rounded-full" :class="n - 1 === onboardingStep ? 'bg-primary-400' : 'bg-slate-600'" />
            </div>
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <button
                v-if="onboardingStep > 0"
                type="button"
                class="w-full rounded-full px-4 py-2 text-sm font-semibold text-slate-200 ring-1 ring-white/10 transition hover:bg-slate-800 sm:w-auto"
                @click="prevStep"
              >
                Précédent
              </button>
              <button
                v-if="onboardingStep < 3"
                type="button"
                class="w-full rounded-full bg-primary-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110 sm:w-auto"
                @click="nextStep"
              >
                Continuer
              </button>
              <button
                v-else
                type="button"
                class="w-full rounded-full bg-primary-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110 sm:w-auto"
                @click="complete"
              >
                Terminer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="hidden"></div>
    </div>
  </section>
</template>
