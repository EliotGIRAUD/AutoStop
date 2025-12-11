<script setup lang="ts">
definePageMeta({ layout: 'blank' })
const router = useRouter()

const goToUpload = () => {
  router.push('/profile/upload')
}
</script>

<template>
  <section class="mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-10 bg-white px-5 pb-14 pt-10 text-slate-900 sm:px-8">
    <header class="flex items-center gap-3">
      <NuxtLink to="/profile/1" class="inline-flex items-center gap-2 text-base font-semibold text-slate-600">
        <span class="text-lg">←</span>
        <span>Retour</span>
      </NuxtLink>
    </header>

    <div class="space-y-3 text-center">
      <h1 class="text-2xl font-black text-slate-900">ID Verification</h1>
      <p class="text-base leading-relaxed text-slate-500">
        Recevez un badge de vérification sur votre profil pour instaurer la confiance auprès des autres.
      </p>
    </div>

    <div class="space-y-8">
      <div class="space-y-3">
        <p class="text-base font-semibold text-slate-900">1. Sélectionnez votre pays</p>
        <label class="block relative">
          <select
            class="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-4 text-base text-slate-900 focus:border-orange-500 focus:outline-none"
          >
            <option value="">Pays</option>
            <option>France</option>
            <option>Belgique</option>
            <option>Suisse</option>
            <option>Canada</option>
          </select>
          <span class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">⌄</span>
        </label>
      </div>

      <div class="space-y-3">
        <p class="text-base font-semibold text-slate-900">2. Entrez votre nom tel qu'il apparaît sur votre pièce d'identité.</p>
        <input
          type="text"
          placeholder="Prénom"
          class="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Nom de famille"
          class="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none"
        />
      </div>
    </div>

    <div class="pt-2">
      <button
        type="button"
        class="w-full rounded-full bg-[#EB5D1F] px-4 py-4 text-base font-semibold text-white shadow-lg transition hover:brightness-110"
        @click="goToUpload"
      >
        Vérifier
      </button>
    </div>
  </section>
</template>

