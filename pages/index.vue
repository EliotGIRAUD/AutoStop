<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import usersData from '@/data/users.json'
import { useAuthStore } from '@/stores/auth'

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

const users = usersData as User[]
const auth = useAuthStore()
const mapCenter = ref<[number, number]>([6.1294, 45.8992])
const currentPosition = ref<[number, number] | null>(null)

const config = useRuntimeConfig()

const driverCount = computed(() => users.filter(user => user.role === 'Driver').length)
const hitchhikerCount = computed(() => users.filter(user => user.role === 'Hitchhiker').length)
const availableCount = computed(() => users.filter(user => user.availability).length)
const filteredUsers = computed(() => {
  if (auth.role === 'Hitchhiker') return users.filter(user => user.role === 'Driver' && user.availability)
  if (auth.role === 'Driver') return users.filter(user => user.role === 'Hitchhiker' && user.availability)
  return users.filter(user => user.availability)
})
const mapOptions = computed(() => ({
  style: 'mapbox://styles/mranderson741/cmiynfmfw000301s5hnesemfa',
  center: mapCenter.value,
  zoom: 12.1
}))

const locate = () => {
  if (!navigator?.geolocation) return
  navigator.geolocation.getCurrentPosition(
    position => {
      const coords: [number, number] = [position.coords.longitude, position.coords.latitude]
      currentPosition.value = coords
      mapCenter.value = coords
    },
    () => {},
    { enableHighAccuracy: true, maximumAge: 60000, timeout: 8000 }
  )
}

onMounted(() => {
  locate()
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
          <div class="relative rounded-3xl border border-white/10 bg-slate-900">
            <MapboxMap
              v-if="config.public.mapboxToken"
              map-id="main-map"
              class="relative h-[calc(100vh-theme(spacing.16))] w-full overflow-hidden rounded-3xl"
              :options="mapOptions"
            >
              <MapboxGeolocateControl position="top-left" :options="{ trackUserLocation: true, showAccuracyCircle: false }" />
              <MapboxDefaultMarker
                v-if="currentPosition"
                marker-id="current-position"
                :lnglat="currentPosition"
                :options="{ anchor: 'center' }"
              >
                <template #marker>
                  <div class="relative flex h-10 w-10 items-center justify-center">
                    <span class="absolute inline-flex h-10 w-10 animate-ping rounded-full bg-emerald-400/30" />
                    <span class="relative flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-white/60">
                      <span class="h-2 w-2 rounded-full bg-white" />
                    </span>
                  </div>
                </template>
              </MapboxDefaultMarker>
              <MapboxDefaultMarker
                v-for="user in filteredUsers"
                :key="user.id"
                :marker-id="`user-${user.id}`"
                :lnglat="[user.location.lng, user.location.lat]"
                :options="{ anchor: 'center' }"
              >
                <template #marker>
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-full shadow-xl ring-2 transition hover:scale-110"
                    :class="user.role === 'Driver' ? 'bg-emerald-500 ring-emerald-200/60' : 'bg-cyan-500 ring-cyan-200/60'"
                  >
                    <div class="h-2 w-2 rounded-full bg-white"></div>
                  </div>
                </template>
                <MapboxDefaultPopup :popup-id="`popup-${user.id}`" :lnglat="[user.location.lng, user.location.lat]">
                  <div class="min-w-[200px] space-y-3 rounded-2xl bg-white p-4 shadow-xl">
                    <div class="flex items-start gap-3">
                      <div
                        class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full ring-2"
                        :class="user.role === 'Driver' ? 'bg-emerald-100 ring-emerald-300' : 'bg-cyan-100 ring-cyan-300'"
                      >
                        <span class="text-lg font-bold" :class="user.role === 'Driver' ? 'text-emerald-600' : 'text-cyan-600'">
                          {{ user.name.charAt(0).toUpperCase() }}
                        </span>
                      </div>
                      <div class="min-w-0 flex-1">
                        <h3 class="truncate text-base font-bold text-slate-900">{{ user.name }}</h3>
                        <div class="mt-1 flex items-center gap-2">
                          <span
                            class="inline-flex rounded-full px-2 py-0.5 text-xs font-semibold"
                            :class="user.role === 'Driver' ? 'bg-emerald-100 text-emerald-700' : 'bg-cyan-100 text-cyan-700'"
                          >
                            {{ user.role === 'Driver' ? 'Conducteur' : 'Auto-stoppeur' }}
                          </span>
                          <div class="flex items-center gap-1">
                            <svg class="h-3.5 w-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span class="text-xs font-semibold text-slate-700">{{ user.rating }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="space-y-2 border-t border-slate-200 pt-3">
                      <div class="flex items-center gap-2 text-sm text-slate-600">
                        <svg class="h-4 w-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span class="truncate font-medium">{{ user.destination }}</span>
                      </div>
                      <div v-if="user.role === 'Driver' && user.vehicle" class="flex items-center gap-2 text-sm text-slate-600">
                        <svg class="h-4 w-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        <span class="truncate">{{ user.vehicle }}</span>
                      </div>
                      <div class="flex items-center gap-2 text-xs text-slate-500">
                        <svg class="h-3.5 w-3.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{{ user.ridesCompleted }} trajets effectués</span>
                      </div>
                    </div>
                    <NuxtLink
                      :to="`/profile/${user.id}`"
                      class="block w-full rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:brightness-110 focus:outline-none"
                    >
                      Voir le profil
                    </NuxtLink>
                  </div>
                </MapboxDefaultPopup>
              </MapboxDefaultMarker>
              <button
                type="button"
                class="absolute bottom-4 right-4 rounded-full bg-white/90 p-3 shadow-lg ring-1 ring-slate-200 transition hover:shadow-xl focus:outline-none"
                @click="locate"
              >
                <svg class="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v2m0 8v2m6-6h-2M8 12H6m9 0a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </MapboxMap>
            <div v-if="!config.public.mapboxToken" class="p-6 text-center text-slate-300">
              Ajouter un jeton Mapbox public dans NUXT_PUBLIC_MAPBOX_TOKEN.
            </div>
          </div>
        </ClientOnly>
      </div>
    </section>
  </template>