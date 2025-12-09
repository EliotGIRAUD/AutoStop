<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from '#imports'
import { useAuthStore } from '@/stores/auth'

type RiderRole = 'Driver' | 'Hitchhiker'

const auth = useAuthStore()
const router = useRouter()

const role = ref<RiderRole>(auth.role)
const phone = ref('')

const handleSubmit = () => {
  auth.setRole(role.value)
  router.push('/dashboard')
}
</script>

<template>
  <section class="space-y-6">
    <header class="space-y-2">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Connexion</p>
      <h1 class="text-3xl font-bold text-white">Choisissez votre rôle.</h1>
      <p class="text-base text-slate-300">Simulation rapide pour tester le prototype.</p>
    </header>

    <div class="space-y-4 rounded-3xl border border-white/10 bg-slate-900 p-6">
      <div class="grid grid-cols-2 gap-3">
        <button
          type="button"
          class="rounded-2xl px-4 py-3 text-sm font-semibold ring-1 transition focus:outline-none"
          :class="
            role === 'Driver'
              ? 'bg-emerald-500 text-slate-900 ring-emerald-300'
              : 'bg-slate-800 text-slate-200 ring-white/10'
          "
          @click="role = 'Driver'"
        >
          Conducteur
        </button>
        <button
          type="button"
          class="rounded-2xl px-4 py-3 text-sm font-semibold ring-1 transition focus:outline-none"
          :class="
            role === 'Hitchhiker'
              ? 'bg-cyan-500 text-slate-900 ring-cyan-300'
              : 'bg-slate-800 text-slate-200 ring-white/10'
          "
          @click="role = 'Hitchhiker'"
        >
          Auto-stoppeur
        </button>
      </div>

      <div class="space-y-2">
        <label for="phone" class="text-sm font-semibold text-slate-200">Téléphone</label>
        <input
          id="phone"
          v-model="phone"
          type="tel"
          placeholder="06 00 00 00 00"
          class="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
        />
      </div>

      <button
        type="button"
        class="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3 text-base font-semibold text-slate-900 transition hover:brightness-110 focus:outline-none"
        @click="handleSubmit"
      >
        Continuer
      </button>
    </div>
  </section>
</template>

