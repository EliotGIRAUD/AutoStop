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

        <div class="space-y-3 text-center">
          <h1 class="text-3xl font-black text-slate-900">Où que tu sois</h1>
          <p class="text-base leading-relaxed text-slate-500">
            Trouve ou propose un trajet en quelques secondes. Active ta position et découvre qui est prêt à partir près de toi.
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
              <circle cx="60" cy="60" r="50" fill="none" stroke="#fde7d2" stroke-width="8" />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#EB5D1F"
                stroke-width="8"
                stroke-linecap="round"
                stroke-dasharray="90 360"
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

      <div v-else-if="onboardingStep === 1" class="flex flex-1 flex-col items-center gap-8 pt-4">
        <img src="/onboarding/At_anytime_2.svg" alt="Onboarding étape 2" class="w-full max-w-[420px]" />

        <div class="space-y-3 text-center">
          <h1 class="text-3xl font-black text-slate-900">À tout moment</h1>
          <p class="text-base leading-relaxed text-slate-500">
            Choisis ton rôle et rends-toi visible quand tu es prêt. Tu peux changer d’avis à tout instant depuis l’appli.
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

      <div v-else-if="onboardingStep === 3" class="flex flex-1 flex-col items-center gap-8 pt-4">
        <img src="/onboarding/Welcome_Screen_4.svg" alt="Onboarding étape 4" class="w-full max-w-[420px]" />

        <div class="space-y-3 text-center">
          <h1 class="text-3xl font-black text-slate-900">Bienvenue à bord</h1>
          <p class="text-base leading-relaxed text-slate-500">
            Crée ton compte ou connecte-toi pour rejoindre la communauté PickUp et commencer tes trajets.
          </p>
        </div>

        <div class="mt-auto flex w-full max-w-md flex-col gap-4 pb-8">
          <button
            type="button"
            class="w-full rounded-full bg-orange-500 px-6 py-4 text-base font-semibold text-white shadow-lg transition hover:brightness-110"
            @click="goToSignup"
          >
            Créer un compte
          </button>
          <button
            type="button"
            class="w-full rounded-full border-2 border-orange-500 px-6 py-4 text-base font-semibold text-orange-500 transition hover:bg-orange-50"
            @click="goToLogin"
          >
            Se connecter
          </button>
        </div>
      </div>

      <div v-else class="hidden"></div>
    </div>
  </section>
</template>
