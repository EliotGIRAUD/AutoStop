<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const filteredRides = computed(() => auth.rides.filter(ride => ride.role === auth.role))
</script>

<template>
  <section class="space-y-6">
    <header class="space-y-2">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Tableau de bord</p>
      <h1 class="text-3xl font-bold text-white">Statut et trajets.</h1>
      <p class="text-base text-slate-300">Activez votre disponibilité et suivez vos demandes.</p>
    </header>

    <div class="space-y-4 rounded-3xl border border-white/10 bg-slate-900 p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-slate-400">Statut</p>
          <p class="text-lg font-semibold text-white">
            {{ auth.availability ? 'Disponible' : 'Hors ligne' }}
          </p>
        </div>
        <button
          type="button"
          class="rounded-2xl px-4 py-2 text-sm font-semibold ring-1 transition focus:outline-none"
          :class="
            auth.availability
              ? 'bg-emerald-500 text-slate-900 ring-emerald-300'
              : 'bg-slate-800 text-white ring-white/10'
          "
          @click="auth.toggleAvailability"
        >
          {{ auth.availability ? 'Désactiver' : 'Activer' }}
        </button>
      </div>
      <div class="flex items-center justify-between">
        <p class="text-sm text-slate-400">Rôle actuel</p>
        <span
          class="rounded-full px-3 py-1 text-xs font-semibold"
          :class="auth.role === 'Driver' ? 'bg-emerald-500 text-slate-900' : 'bg-cyan-500 text-slate-900'"
        >
          {{ auth.role === 'Driver' ? 'Conducteur' : 'Auto-stoppeur' }}
        </span>
      </div>
    </div>

    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-white">Trajets</h2>
        <span class="text-sm text-slate-400">{{ filteredRides.length }} en cours</span>
      </div>
      <div class="space-y-3">
        <div
          v-for="ride in filteredRides"
          :key="ride.id"
          class="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-slate-400">{{ ride.origin }} → {{ ride.destination }}</p>
              <p class="text-base font-semibold text-white">{{ ride.time }}</p>
            </div>
            <span
              class="rounded-full px-3 py-1 text-xs font-semibold"
              :class="ride.status === 'confirmed' ? 'bg-emerald-500 text-slate-900' : ride.status === 'pending' ? 'bg-amber-400 text-slate-900' : 'bg-slate-200 text-slate-900'"
            >
              {{ ride.status === 'confirmed' ? 'Confirmé' : ride.status === 'pending' ? 'En attente' : 'Terminé' }}
            </span>
          </div>
          <p class="mt-2 text-xs text-slate-400">Places: {{ ride.seats }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

