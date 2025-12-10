<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { LngLatBounds } from "mapbox-gl";
import { useDebounceFn } from "@vueuse/core";
import usersData from "@/data/users.json";
import { useAuthStore } from "@/stores/auth";

type RiderRole = "Driver" | "Hitchhiker";

interface UserLocation {
  lat: number;
  lng: number;
}

interface User {
  id: string;
  name: string;
  role: RiderRole;
  bio: string;
  location: UserLocation;
  destination: string;
  vehicle?: string;
  availability: boolean;
  rating: number;
  languages: string[];
  ridesCompleted: number;
}

const users = usersData as User[];
const auth = useAuthStore();
const mapCenter = ref<[number, number]>([6.1294, 45.8992]);
const currentPosition = ref<[number, number] | null>(null);
const departure = ref("");
const destination = ref("");
const activePopupId = ref<string | null>(null);
const destinationCoords = ref<[number, number] | null>(null);
const suggestions = ref<{ label: string; coords: [number, number] }[]>([]);
const isLoadingSuggestions = ref(false);
const routeGeojson = ref<any | null>(null);
const activeDestination = ref<{ label: string; coords: [number, number] } | null>(null);
const isPaused = ref(false);

const config = useRuntimeConfig();
const mapRef = useMapboxRef("main-map");

const driverCount = computed(() => users.filter((user) => user.role === "Driver").length);
const hitchhikerCount = computed(() => users.filter((user) => user.role === "Hitchhiker").length);
const availableCount = computed(() => users.filter((user) => user.availability).length);
const filteredUsers = computed(() => {
  if (auth.role === "Hitchhiker") return users.filter((user) => user.role === "Driver" && user.availability);
  if (auth.role === "Driver") return users.filter((user) => user.role === "Hitchhiker" && user.availability);
  return users.filter((user) => user.availability);
});
const mapOptions = computed(() => ({
  style: "mapbox://styles/mranderson741/cmiynfmfw000301s5hnesemfa",
  center: mapCenter.value,
  zoom: 12.1,
}));

const showDestinations = ref(false);

const destinationIdeas = computed(() => {
  const counts = new Map<
    string,
    {
      drivers: number;
      hitchhikers: number;
    }
  >();

  filteredUsers.value.forEach((user) => {
    const current = counts.get(user.destination) ?? { drivers: 0, hitchhikers: 0 };
    if (user.role === "Driver") current.drivers += 1;
    else current.hitchhikers += 1;
    counts.set(user.destination, current);
  });

  return Array.from(counts.entries())
    .map(([destination, stats]) => ({ destination, ...stats }))
    .sort((a, b) => b.drivers + b.hitchhikers - (a.drivers + a.hitchhikers))
    .slice(0, 6);
});

const currentLocation = computed(() => {
  if (!currentPosition.value) return "";
  const [lng, lat] = currentPosition.value;
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
});

const closePopup = () => {
  activePopupId.value = null;
};

const locate = () => {
  if (!navigator?.geolocation) return;
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const coords: [number, number] = [position.coords.longitude, position.coords.latitude];
      currentPosition.value = coords;
      mapCenter.value = coords;
      if (!departure.value) departure.value = "Ma position";
    },
    () => {},
    { enableHighAccuracy: true, maximumAge: 60000, timeout: 8000 }
  );
};

const openDestinationPanel = () => {
  locate();
  if (currentLocation.value) departure.value = "Ma position";
  showDestinations.value = true;
  closePopup();
};

const fetchSuggestions = useDebounceFn(async (query: string) => {
  suggestions.value = [];
  destinationCoords.value = null;
  if (!query || !config.public.mapboxToken) return;
  isLoadingSuggestions.value = true;
  try {
    const proximity = (currentPosition.value ?? mapCenter.value).join(",");
    const response = await $fetch<any>("https://api.mapbox.com/geocoding/v5/mapbox.places/" + encodeURIComponent(query) + ".json", {
      params: {
        access_token: config.public.mapboxToken,
        proximity,
        autocomplete: true,
        language: "fr",
        limit: 5,
      },
    });
    suggestions.value = (response?.features ?? []).map((f: any) => ({
      label: f.place_name,
      coords: f.center as [number, number],
    }));
  } catch (error) {
    console.error("Geocoding error", error);
  } finally {
    isLoadingSuggestions.value = false;
  }
}, 300);

const selectSuggestion = (item: { label: string; coords: [number, number] }) => {
  destination.value = item.label;
  destinationCoords.value = item.coords;
  suggestions.value = [];
};

const submitDestination = async () => {
  const label = destination.value.trim();
  if (!label || !destinationCoords.value || !config.public.mapboxToken) return;
  activeDestination.value = { label, coords: destinationCoords.value };
  const from = currentPosition.value ?? mapCenter.value;
  const to = destinationCoords.value;
  try {
    const response = await $fetch<any>(`https://api.mapbox.com/directions/v5/mapbox/driving/${from.join(",")};${to.join(",")}`, {
      params: {
        geometries: "geojson",
        overview: "full",
        access_token: config.public.mapboxToken,
      },
    });
    const route = response?.routes?.[0]?.geometry;
    if (route) {
      routeGeojson.value = {
        type: "FeatureCollection",
        features: [{ type: "Feature", geometry: route, properties: {} }],
      };
      if (Array.isArray(route.coordinates)) {
        const bounds = new LngLatBounds();
        route.coordinates.forEach((coord: [number, number]) => bounds.extend(coord));
        mapRef.value?.fitBounds(bounds, { padding: 60, duration: 800 });
      }
    } else {
      console.warn("No route found", response);
    }
  } catch (error) {
    console.error("Directions error", error);
  }
  showDestinations.value = false;
};

const cancelRide = () => {
  activeDestination.value = null;
  routeGeojson.value = null;
  isPaused.value = false;
};

const newRideFromHere = () => {
  if (!activeDestination.value) return;
  locate();
  submitDestination();
};

const togglePauseOrResume = () => {
  if (!activeDestination.value) return;
  if (isPaused.value) {
    isPaused.value = false;
    newRideFromHere();
  } else {
    isPaused.value = true;
  }
};

onMounted(() => {
  locate();
});
</script>

<template>
  <section class="space-y-6">
    <div>
      <ClientOnly>
        <div class="relative h-[calc(100dvh-64px)] w-full overflow-hidden border border-white/10 bg-slate-900">
          <MapboxMap v-if="config.public.mapboxToken" map-id="main-map" class="relative h-full w-full overflow-hidden" :options="mapOptions">
            <MapboxGeolocateControl position="top-left" :options="{ trackUserLocation: true, showAccuracyCircle: false }" />
            <MapboxDefaultMarker
              v-for="user in filteredUsers"
              :key="user.id"
              :marker-id="`user-${user.id}`"
              :lnglat="[user.location.lng, user.location.lat]"
              :options="{ anchor: 'center' }"
            >
              <template #marker>
                <button
                  type="button"
                  class="flex h-10 w-10 items-center justify-center rounded-full shadow-xl ring-2 transition hover:scale-110 focus:outline-none"
                  :class="user.role === 'Driver' ? 'bg-emerald-500 ring-emerald-200/60' : 'bg-cyan-500 ring-cyan-200/60'"
                  @click="activePopupId = user.id"
                >
                  <span class="h-2 w-2 rounded-full bg-white"></span>
                </button>
              </template>
              <MapboxDefaultPopup
                :popup-id="`popup-${user.id}`"
                :lnglat="[user.location.lng, user.location.lat]"
                :options="{ closeButton: false, closeOnMove: false, maxWidth: '320px', offset: [0, 12] }"
                v-if="activePopupId === user.id"
              >
                <div class="flex w-[260px] max-w-[300px] flex-col gap-3 rounded-2xl">
                  <button
                    type="button"
                    class="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none"
                    @click="closePopup"
                    aria-label="Fermer"
                  >
                    <span class="text-lg leading-none">×</span>
                  </button>
                  <div class="flex items-start gap-3">
                    <div
                      class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full ring-2"
                      :class="user.role === 'Driver' ? 'bg-emerald-100 ring-emerald-300' : 'bg-cyan-100 ring-cyan-300'"
                    >
                      <span class="text-lg font-bold" :class="user.role === 'Driver' ? 'text-emerald-600' : 'text-cyan-600'">
                        {{ user.name.charAt(0).toUpperCase() }}
                      </span>
                    </div>
                    <div class="min-w-0 flex-1 space-y-2">
                      <div>
                        <h3 class="truncate text-base font-bold text-slate-900">{{ user.name }}</h3>
                        <div class="mt-1 flex items-center gap-2">
                          <span
                            class="inline-flex rounded-full px-2 py-0.5 text-xs font-semibold"
                            :class="user.role === 'Driver' ? 'bg-emerald-100 text-emerald-700' : 'bg-cyan-100 text-cyan-700'"
                          >
                            {{ user.role === "Driver" ? "Conducteur" : "Auto-stoppeur" }}
                          </span>
                          <div class="flex items-center gap-1">
                            <svg class="h-3.5 w-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                              />
                            </svg>
                            <span class="text-xs font-semibold text-slate-700">{{ user.rating }}</span>
                          </div>
                        </div>
                      </div>
                      <div class="space-y-2 border-t border-slate-200 pt-3">
                        <div class="flex items-center gap-2 text-sm text-slate-600">
                          <svg class="h-4 w-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
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
                    </div>
                  </div>
                  <NuxtLink
                    :to="`/profile/${user.id}`"
                    class="mt-1 block w-full rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:brightness-110 focus:outline-none"
                  >
                    Voir le profil
                  </NuxtLink>
                </div>
              </MapboxDefaultPopup>
            </MapboxDefaultMarker>
            <MapboxDefaultMarker v-if="currentPosition" marker-id="current-position" :lnglat="currentPosition" :options="{ anchor: 'center' }">
              <template #marker>
                <div class="relative flex h-10 w-10 items-center justify-center">
                  <span class="absolute inline-flex h-10 w-10 animate-ping rounded-full bg-emerald-400/30" />
                  <span class="relative flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-white/60">
                    <span class="h-2 w-2 rounded-full bg-white" />
                  </span>
                </div>
              </template>
            </MapboxDefaultMarker>
            <MapboxSource v-if="routeGeojson" source-id="route-source" :source="{ type: 'geojson', data: routeGeojson }">
              <MapboxLayer
                :layer="{
                  id: 'route-line',
                  type: 'line',
                  source: 'route-source',
                  paint: { 'line-color': '#10b981', 'line-width': 5, 'line-opacity': 0.8 },
                  layout: { 'line-cap': 'round', 'line-join': 'round' },
                }"
              />
            </MapboxSource>
            <MapboxDefaultMarker v-if="destinationCoords" marker-id="selected-destination" :lnglat="destinationCoords" :options="{ anchor: 'bottom' }" />
            <button
              type="button"
              class="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 transform rounded-full bg-white/90 px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg ring-1 ring-slate-200 transition hover:shadow-xl focus:outline-none"
              @click="openDestinationPanel"
            >
              Faire du stop
            </button>
            <Transition name="fade">
              <div
                v-if="activeDestination"
                class="absolute bottom-24 left-1/2 z-20 w-[min(90vw,480px)] -translate-x-1/2 transform rounded-2xl bg-white/95 p-4 text-slate-900 shadow-2xl ring-1 ring-slate-200 backdrop-blur"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="space-y-1">
                    <p class="text-xs font-semibold uppercase tracking-wide text-emerald-600">Trajet actif</p>
                    <p class="text-sm font-semibold text-slate-900">{{ activeDestination.label }}</p>
                    <p class="text-xs text-slate-500">Depuis {{ departure || "Ma position" }}</p>
                  </div>
                  <button
                    type="button"
                    class="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
                    @click="cancelRide"
                    aria-label="Fermer"
                  >
                    ✕
                  </button>
                </div>
                <div class="mt-3 flex gap-3">
                  <button type="button" class="flex-1 rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-300" @click="cancelRide">
                    Annuler
                  </button>
                  <button
                    type="button"
                    class="flex-1 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
                    @click="togglePauseOrResume"
                  >
                    {{ isPaused ? "Reprendre" : "Pause" }}
                  </button>
                </div>
              </div>
            </Transition>
            <Transition name="fade">
              <div
                v-if="showDestinations"
                class="absolute bottom-20 left-1/2 z-10 w-[min(90vw,480px)] -translate-x-1/2 transform rounded-2xl bg-white/95 p-4 shadow-2xl ring-1 ring-slate-200 backdrop-blur"
              >
                <form @submit.prevent="submitDestination" class="space-y-4">
                  <div>
                    <label class="mb-1 block text-sm font-medium text-slate-700">Départ</label>
                    <input
                      type="text"
                      v-model="departure"
                      class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-400 focus:ring focus:ring-emerald-100"
                      :placeholder="currentLocation ? 'Ma position' : 'Votre position actuelle...'"
                      :readonly="!!currentLocation"
                    />
                  </div>
                  <div>
                    <label class="mb-1 block text-sm font-medium text-slate-700">Destination / Direction</label>
                    <input
                      type="text"
                      v-model="destination"
                      class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-cyan-400 focus:ring focus:ring-cyan-100"
                      placeholder="Où voulez-vous aller ? (ville ou direction)"
                      required
                      @input="fetchSuggestions(destination)"
                      @focus="destination && fetchSuggestions(destination)"
                    />
                    <div v-if="suggestions.length || isLoadingSuggestions" class="mt-2 max-h-64 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg">
                      <div v-if="isLoadingSuggestions" class="px-3 py-2 text-sm text-slate-500">Recherche...</div>
                      <button
                        v-for="item in suggestions"
                        :key="item.label"
                        type="button"
                        class="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                        @click="selectSuggestion(item)"
                      >
                        {{ item.label }}
                      </button>
                      <div v-if="!isLoadingSuggestions && !suggestions.length" class="px-3 py-2 text-sm text-slate-500">Aucun résultat</div>
                    </div>
                  </div>
                  <div class="flex gap-3">
                    <button type="submit" class="flex-1 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600">
                      Demander un trajet
                    </button>
                    <button
                      type="button"
                      @click="showDestinations = false"
                      class="flex-1 rounded-lg bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            </Transition>
          </MapboxMap>
          <div v-if="!config.public.mapboxToken" class="p-6 text-center text-slate-300">Ajouter un jeton Mapbox public dans NUXT_PUBLIC_MAPBOX_TOKEN.</div>
        </div>
      </ClientOnly>
    </div>
  </section>
</template>
