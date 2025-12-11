<script setup lang="ts">
import { computed } from "vue";
import { Heart, ThumbsDown, ThumbsUp } from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth";

type HistoryItem = {
  id: string;
  name: string;
  note?: string;
};

const auth = useAuthStore();

const hitchhikerHistory: HistoryItem[] = [
  { id: "1", name: "Guy-Charles", note: "vous a recuperer 3 fois" },
  { id: "2", name: "Camille", note: "vous a recuperer 2 fois" },
  { id: "3", name: "Alexandre", note: "vous a recuperer 1 fois" },
  { id: "4", name: "Julie", note: "vous a recuperer 1 fois" },
  { id: "5", name: "Sophie", note: "vous a recuperer 1 fois" },
];

const driverHistory: HistoryItem[] = [
  { id: "6", name: "Guy-Charles", note: "vous avez recuperer 2 fois" },
  { id: "7", name: "Nicolas", note: "vous avez recuperer 1 fois" },
  { id: "8", name: "Emma", note: "vous avez recuperer 1 fois" },
  { id: "9", name: "Léa", note: "vous avez recuperer 1 fois" },
  { id: "10", name: "Louis", note: "vous avez recuperer 1 fois" },
];

const currentList = computed(() => (auth.role === "Driver" ? driverHistory : hitchhikerHistory));
const roleLabel = computed(() => (auth.role === "Driver" ? "Conducteur" : "Passager"));

const switchRole = (role: "Driver" | "Hitchhiker") => {
  auth.setRole(role);
};
</script>

<template>
  <section class="space-y-6">
    <header class="space-y-4 text-center">
      <h1 class="text-3xl font-bold text-black">En tant que</h1>
      <div class="mx-auto flex w-full max-w-md gap-3 px-4">
        <button
          type="button"
          class="flex-1 rounded-full px-4 py-3 text-base font-semibold shadow-[0_10px_26px_rgba(0,0,0,0.16)] ring-1 transition"
          :class="auth.role === 'Hitchhiker' ? 'bg-orange-500 text-white ring-orange-300' : 'bg-white text-slate-900 ring-slate-200'"
          @click="switchRole('Hitchhiker')"
        >
          Passager
        </button>
        <button
          type="button"
          class="flex-1 rounded-full px-4 py-3 text-base font-semibold shadow-[0_10px_26px_rgba(0,0,0,0.12)] ring-1 transition"
          :class="auth.role === 'Driver' ? 'bg-orange-500 text-white ring-orange-300' : 'bg-white text-slate-900 ring-slate-200'"
          @click="switchRole('Driver')"
        >
          Conducteur
        </button>
      </div>
      <p class="text-sm text-black">
        {{ auth.role === "Driver" ? "Personnes que vous avez prises." : "Personnes qui vous ont pris en stop." }}
      </p>
    </header>

    <div class="space-y-3 px-4">
      <div
        v-for="item in currentList"
        :key="item.id"
        class="flex items-center justify-between rounded-2xl border border-orange-200 bg-white px-4 py-3 shadow-[0_10px_22px_rgba(0,0,0,0.08)]"
      >
        <div class="flex items-center gap-3">
          <div class="h-12 w-12 rounded-full border border-dashed border-slate-200 bg-slate-100" />
          <div>
            <p class="text-base font-semibold text-slate-900">{{ item.name }}</p>
            <p class="text-sm text-slate-500" v-if="item.note">{{ item.note }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-orange-300 text-orange-500 transition hover:bg-orange-50"
            aria-label="Favori"
          >
            <ThumbsDown class="h-5 w-5" />
          </button>
          <button
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-orange-300 text-orange-500 transition hover:bg-orange-50"
            aria-label="Favori"
          >
            <ThumbsUp class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
