<script setup lang="ts">
import { computed, ref } from "vue";
import type { Component } from "vue";
import { Car, HeartHandshakeIcon, HouseIcon, LayoutDashboard, LogIn, MapPinned, ThumbsUp, UserRound } from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth";

interface NavItem {
  label: string;
  to: string;
  icon: Component;
}

const auth = useAuthStore();
const route = useRoute();
const isMapPage = computed(() => route.path === "/");
const isOnboarding = computed(() => route.path.startsWith("/onboarding"));

const isLoggedIn = computed(() => auth.isAuthenticated || Boolean(auth.profile.firstName));
const showStatusSheet = ref(false);

const navItems = computed<NavItem[]>(() => [
  { label: "Carte", to: "/", icon: HouseIcon },
  { label: "Dashboard", to: "/dashboard", icon: HeartHandshakeIcon },
  {
    label:"Profil",
    to:"/profile",
    icon: UserRound,
  },
]);

const isActive = (path: string) => {
  if (path === "/") return route.path === "/";
  return route.path === path || route.path.startsWith(`${path}/`);
};

const emitOpenStop = () => {
  window.dispatchEvent(new CustomEvent("open-stop-panel"));
};

const handleStopClick = () => {
  if (auth.role === "Driver") {
    showStatusSheet.value = !showStatusSheet.value;
    return;
  }
  emitOpenStop();
};

const setAvailability = (value: boolean) => {
  auth.availability = value;
  showStatusSheet.value = false;
};
</script>

<template>
  <div class="flex min-h-dvh flex-col overflow-hidden bg-slate-100 text-slate-900">
    <div class="relative flex-1 overflow-hidden">
      <div :class="isMapPage ? 'h-full' : 'mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 pb-24 pt-6'">
        <slot />
      </div>
    </div>
    <nav v-if="!isOnboarding" class="pointer-events-none fixed inset-x-0 bottom-4 flex justify-center">
      <div class="flex items-center gap-3">
        <div class="pointer-events-auto flex items-center gap-3 rounded-full bg-white px-2 py-2 text-orange-700 shadow-xl shadow-[0_10px_26px_rgba(235,93,31,0.2)]">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex h-12 w-12 items-center justify-center rounded-full text-lg transition"
            :class="isActive(item.to) ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/30' : 'bg-white text-orange-700  hover:bg-orange-50'"
          >
            <span class="sr-only">{{ item.label }}</span>
            <component :is="item.icon" class="h-6 w-6" />
          </NuxtLink>
        </div>
        <div class="bg-white rounded-full p-2">
          <button
            type="button"
            class="pointer-events-auto flex h-12 items-center justify-center rounded-full bg-primary-500 px-4 text-sm font-semibold text-white shadow-lg shadow-[#f3a989]/30 transition hover:bg-primary-500]"
            @click="handleStopClick"
          >
            <component :is="auth.role === 'Driver' ? Car : ThumbsUp" :class="['h-6 w-6', auth.role === 'Driver' ? '' : 'rotate-12']" aria-hidden="true" />
            <span class="sr-only">Faire du stop</span>
          </button>
        </div>
      </div>
    </nav>
    <div
      v-if="showStatusSheet && auth.role === 'Driver'"
      class="pointer-events-auto fixed bottom-24 left-1/2 z-30 w-[min(90vw,320px)] -translate-x-1/2 rounded-2xl bg-white p-4 text-slate-900 shadow-2xl ring-1 ring-slate-200"
    >
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide text-primary-600">Statut</p>
          <p class="text-lg font-semibold text-slate-900">
            {{ auth.availability ? "Disponible" : "Hors ligne" }}
          </p>
        </div>
        <button
          type="button"
          class="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
          @click="showStatusSheet = false"
          aria-label="Fermer"
        >
          ✕
        </button>
      </div>
      <div class="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          class="rounded-xl border px-3 py-2 text-sm font-semibold transition"
          :class="auth.availability ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'"
          @click="setAvailability(true)"
        >
          Disponible
        </button>
        <button
          type="button"
          class="rounded-xl border px-3 py-2 text-sm font-semibold transition"
          :class="!auth.availability ? 'border-slate-500 bg-slate-100 text-slate-800' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'"
          @click="setAvailability(false)"
        >
          Hors ligne
        </button>
      </div>
    </div>
  </div>
</template>
