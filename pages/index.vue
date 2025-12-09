<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import usersData from '@/data/users.json'

type RiderRole = 'Driver' | 'Hitchhiker'

interface UserLocation {
  lat: number
  lng: number
}

interface User {
  id: string
  name: string
  role: RiderRole
  bio: string
  location: UserLocation
  destination: string
  vehicle?: string
  availability: boolean
  rating: number
  languages: string[]
  ridesCompleted: number
}

type MapboxModule = typeof import('mapbox-gl')

const mapContainer = ref<HTMLDivElement | null>(null)
const map = ref<import('mapbox-gl').Map | null>(null)
let mapbox: MapboxModule | null = null
const users = usersData as User[]

const config = useRuntimeConfig()

const driverCount = computed(() => users.filter(user => user.role === 'Driver').length)
const hitchhikerCount = computed(() => users.filter(user => user.role === 'Hitchhiker').length)
const availableCount = computed(() => users.filter(user => user.availability).length)

const setMarkers = () => {
  if (!map.value || !mapbox) return

  users.forEach(user => {
    const markerEl = document.createElement('div')
    markerEl.className = `flex h-10 w-10 items-center justify-center rounded-full shadow-xl ring-2 transition hover:scale-110 ${
      user.role === 'Driver'
        ? 'bg-emerald-500 ring-emerald-200/60'
        : 'bg-cyan-500 ring-cyan-200/60'
    }`
    markerEl.innerHTML = '<div class="h-2 w-2 rounded-full bg-white"></div>'

    const popupContent = `<div class="space-y-1">
      <p class="text-sm font-semibold text-slate-900">${user.name}</p>
      <p class="text-xs text-slate-600">${user.role === 'Driver' ? 'Conducteur' : 'Auto-stoppeur'} · ${
        user.destination
      }</p>
      <a class="mt-2 inline-block text-xs font-semibold text-emerald-600" href="/profile/${user.id}">Voir le profil</a>
    </div>`

    const popup = new mapbox.Popup({ offset: 12 }).setHTML(popupContent)

    new mapbox.Marker({ element: markerEl, anchor: 'center' })
      .setLngLat([user.location.lng, user.location.lat])
      .setPopup(popup)
      .addTo(map.value)
  })
}

onMounted(async () => {
  const token = config.public.mapboxToken
  if (!token || !mapContainer.value) return

  mapbox = await import('mapbox-gl')
  await import('mapbox-gl/dist/mapbox-gl.css')
  mapbox.accessToken = token

  map.value = new mapbox.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mranderson741/cmiynfmfw000301s5hnesemfa',
    center: [0.62, 44.205],
    zoom: 10.3
  })

  map.value.addControl(
    new mapbox.NavigationControl({
      visualizePitch: true
    }),
    'top-right'
  )

  map.value.on('load', () => {
    map.value?.resize()
    setMarkers()
  })
  map.value.on('error', event => {
    console.error('Mapbox error', event?.error)
  })
})

onBeforeUnmount(() => {
  map.value?.remove()
})
</script>

<template>
  <section class="space-y-6">
    <div>
      <header class="space-y-2">
        <p class="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">AutoStop rural</p>
        <h1 class="text-3xl font-bold leading-tight text-white">Connecter conducteurs et auto-stoppeurs.</h1>
        <p class="text-base text-slate-300">Carte temps réel, profils publics et disponibilités locales.</p>
        <div class="mt-4 grid grid-cols-3 gap-3 text-center text-sm font-semibold">
          <div class="rounded-2xl bg-slate-900/70 px-3 py-3 ring-1 ring-white/10">
            <p class="text-lg text-emerald-400">{{ driverCount }}</p>
            <p class="text-slate-400">Conducteurs</p>
          </div>
          <div class="rounded-2xl bg-slate-900/70 px-3 py-3 ring-1 ring-white/10">
            <p class="text-lg text-cyan-300">{{ hitchhikerCount }}</p>
            <p class="text-slate-400">Auto-stoppeurs</p>
          </div>
          <div class="rounded-2xl bg-slate-900/70 px-3 py-3 ring-1 ring-white/10">
            <p class="text-lg text-white">{{ availableCount }}</p>
            <p class="text-slate-400">Disponibles</p>
          </div>
        </div>
      </header>

      <ClientOnly>
        <div class="overflow-hidden rounded-3xl border border-white/10 bg-slate-900">
          <div
            v-if="config.public.mapboxToken"
            ref="mapContainer"
            class="h-[calc(100vh-theme(spacing.16))] w-full"
          />
        <div v-else class="p-6 text-center text-slate-300">
          Ajouter un jeton Mapbox public dans NUXT_PUBLIC_MAPBOX_TOKEN.
          </div>
        </div>
      </ClientOnly>
    </div>
  </section>
</template>

