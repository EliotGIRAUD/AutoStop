<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from '#imports'
import usersData from '@/data/users.json'
import ridesData from '@/data/rides.json'

type RiderRole = 'Driver' | 'Hitchhiker'
type RideStatus = 'pending' | 'confirmed' | 'completed'

interface User {
  id: string
  name: string
  role: RiderRole
  bio: string
  location: { lat: number; lng: number }
  destination: string
  vehicle?: string
  availability: boolean
  rating: number
  languages: string[]
  ridesCompleted: number
}

interface Ride {
  id: string
  userId: string
  role: RiderRole
  origin: string
  destination: string
  status: RideStatus
  time: string
  seats: number
}

const route = useRoute()
const router = useRouter()
const users = usersData as User[]
const rides = ridesData as Ride[]

const userId = computed(() => String(route.params.id))
const currentUser = computed(() => users.find(user => user.id === userId.value))
const userRides = computed(() => rides.filter(ride => ride.userId === userId.value))

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<template>
  <section v-if="currentUser" class="space-y-6">
    <div class="flex items-center justify-between">
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-100 ring-1 ring-white/10 transition hover:bg-slate-700 focus:outline-none"
        @click="goBack"
      >
        <span class="text-lg leading-none">←</span>
        <span>Retour</span>
      </button>
    </div>
    <header class="space-y-3">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Profil public</p>
      <div class="flex items-start justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-white">{{ currentUser.name }}</h1>
          <p class="text-base text-slate-300">{{ currentUser.bio }}</p>
        </div>
        <span
          class="rounded-full px-3 py-1 text-xs font-semibold"
          :class="
            currentUser.role === 'Driver'
              ? 'bg-emerald-500 text-slate-900'
              : 'bg-cyan-500 text-slate-900'
          "
        >
          {{ currentUser.role === 'Driver' ? 'Conducteur' : 'Auto-stoppeur' }}
        </span>
      </div>
    </header>

    <div class="grid grid-cols-1 gap-4 rounded-3xl border border-white/10 bg-slate-900 p-6 sm:grid-cols-2">
      <div class="space-y-2">
        <p class="text-sm text-slate-400">Destination</p>
        <p class="text-lg font-semibold text-white">{{ currentUser.destination }}</p>
      </div>
      <div class="space-y-2">
        <p class="text-sm text-slate-400">Langues</p>
        <p class="text-lg font-semibold text-white">{{ currentUser.languages.join(', ') }}</p>
      </div>
      <div class="space-y-2">
        <p class="text-sm text-slate-400">Trajets réalisés</p>
        <p class="text-lg font-semibold text-white">{{ currentUser.ridesCompleted }}</p>
      </div>
      <div class="space-y-2">
        <p class="text-sm text-slate-400">Note moyenne</p>
        <p class="text-lg font-semibold text-white">{{ currentUser.rating.toFixed(1) }}/5</p>
      </div>
      <div class="space-y-2">
        <p class="text-sm text-slate-400">Disponibilité</p>
        <p
          class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold"
          :class="
            currentUser.availability
              ? 'bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/40'
              : 'bg-slate-800 text-slate-300 ring-1 ring-white/10'
          "
        >
          <span class="h-2 w-2 rounded-full" :class="currentUser.availability ? 'bg-emerald-400' : 'bg-slate-500'" />
          {{ currentUser.availability ? 'Disponible' : 'Non disponible' }}
        </p>
      </div>
      <div class="space-y-2">
        <p class="text-sm text-slate-400">Véhicule</p>
        <p class="text-lg font-semibold text-white">
          {{ currentUser.vehicle && currentUser.vehicle.length > 0 ? currentUser.vehicle : 'Non renseigné' }}
        </p>
      </div>
    </div>

    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-white">Trajets associés</h2>
        <span class="text-sm text-slate-400">{{ userRides.length }} trajets</span>
      </div>
      <div class="space-y-3">
        <div
          v-for="ride in userRides"
          :key="ride.id"
          class="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900 px-4 py-3"
        >
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
      </div>
    </div>
  </section>
  <section v-else class="rounded-3xl border border-white/10 bg-slate-900 p-6 text-center text-slate-200">
    Profil introuvable.
  </section>
</template>

