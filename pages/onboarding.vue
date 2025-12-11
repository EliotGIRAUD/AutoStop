<script setup lang="ts">
import { computed, ref } from "vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();

const showIntro = ref(true);
const onboardingStep = ref(0);
const firstName = ref("");
const lastName = ref("");
const totalSteps = 4;

const progressValue = computed(() => (showIntro.value ? 0 : onboardingStep.value + 1));
const progressWidth = computed(() => `${(progressValue.value / totalSteps) * 100}%`);

const startExperience = () => {
  showIntro.value = false;
};

const nextStep = () => {
  onboardingStep.value = Math.min(onboardingStep.value + 1, 3);
};

const prevStep = () => {
  onboardingStep.value = Math.max(onboardingStep.value - 1, 0);
};

const setAvailability = (value: boolean) => {
  if (auth.availability !== value) auth.toggleAvailability();
};

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
  <section class="relative overflow-hidden pt-6 pb-36 sm:pt-8 sm:pb-28">
    <div class="pointer-events-none absolute inset-0" />

    <div class="relative mx-auto max-w-4xl space-y-8 px-4 sm:px-6">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="h-2 flex-1 rounded-full bg-slate-800">
          <div class="h-full rounded-full bg-gradient-to-r from-primary-400 to-cyan-400 transition-all" :style="{ width: progressWidth }" />
        </div>
        <span class="text-xs font-semibold text-slate-400">{{ progressValue }} / {{ totalSteps }}</span>
      </div>

      <div v-if="showIntro" class="space-y-6 rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur sm:p-10">
        <div class="space-y-3 text-center">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">Bienvenue</p>
          <h1 class="text-3xl font-bold leading-tight text-white sm:text-4xl">Prêt(e) à rejoindre PICKY ?</h1>
          <p class="text-base text-slate-300 sm:text-lg">Une courte expérience pour configurer ton rôle, ta dispo et ton profil. Tu peux passer à tout moment.</p>
        </div>
        <div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            class="w-full rounded-full bg-primary-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110 sm:w-auto"
            @click="startExperience"
          >
            Commencer l'expérience
          </button>
          <button
            type="button"
            class="w-full rounded-full px-5 py-3 text-sm font-semibold text-slate-200 ring-1 ring-white/10 transition hover:bg-slate-800 sm:w-auto"
            @click="skip"
          >
            Passer
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
    </div>
  </section>
</template>
