<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";

definePageMeta({ layout: "default" });
const auth = useAuthStore();
const primary = "#EB5D1F";
const icon = (file: string) => `/profil/${file}`;

const displayName = computed(() => {
  const first = (auth as any)?.profile?.firstName ?? "";
  const last = (auth as any)?.profile?.lastName ?? "";
  const name = `${first} ${last}`.trim();
  return name || "Profil";
});

const goToEdit = () => navigateTo("/profile/1");
</script>

<template>
  <section class="mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-6 bg-white px-5 pb-10 pt-10 text-slate-900 sm:px-8">
    <h1 class="text-center text-2xl font-black">Profil</h1>

    <div class="relative overflow-hidden rounded-full bg-[#EB5D1F] px-5 py-4 text-white shadow-lg">
        <div class="flex items-center gap-4">
            <div class="h-14 w-14 overflow-hidden rounded-full bg-white/40 backdrop-blur">
                <img src="/profil/profile.svg" alt="Profil" class="h-full w-full object-contain" />
            </div>
            <div class="flex-1">
                <p class="text-lg font-black truncate">{{ displayName }}</p>
                <p class="text-sm opacity-90">@{{ displayName.toLowerCase().replaceAll(' ', '') }}</p>
            </div>
            <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
            @click="goToEdit"
            >
                <span class="text-xl">›</span>
            </button>
        </div>
    </div>

    <div class="space-y-4">
      <div class="rounded-2xl border border-slate-100 bg-white shadow-md shadow-slate-200/50">
        <ul class="divide-y divide-slate-100">
          <li>
            <button
              type="button"
              class="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-slate-50"
              @click="goToEdit"
            >
                <span class="flex h-10 w-10 items-center justify-center rounded-full bg-[#EB5D1F]/10 text-[#EB5D1F]">
                    <img :src="icon('profile.svg')" alt="" class="h-5 w-5" />
                </span>
              <div class="flex-1">
                <p class="text-base font-semibold">Mes informations</p>
                <p class="text-sm text-slate-500">Modifier vos informations</p>
              </div>
              <span class="text-slate-400">›</span>
            </button>
          </li>
          <li>
            <div class="flex w-full items-center gap-3 px-4 py-4">
                <span class="flex h-10 w-10 items-center justify-center rounded-full bg-[#EB5D1F]/10 text-[#EB5D1F]">
                    <img :src="icon('lock.svg')" alt="" class="h-5 w-5" />
                </span>
              <div class="flex-1">
                <p class="text-base font-semibold">Face ID / Touch ID</p>
                <p class="text-sm text-slate-500">Gérez la sécurité de votre appareil</p>
              </div>
              <label class="inline-flex items-center">
                <input type="checkbox" class="sr-only peer" checked />
                <span
                  class="relative block h-6 w-11 rounded-full bg-slate-200 transition peer-checked:bg-[#EB5D1F] after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition after:content-[''] peer-checked:after:translate-x-[20px]"
                />
              </label>
            </div>
          </li>
          <li>
            <div class="flex w-full items-center gap-3 px-4 py-4">
                <span class="flex h-10 w-10 items-center justify-center rounded-full bg-[#EB5D1F]/10">
                    <img :src="icon('protect.svg')" alt="" class="h-5 w-5" />
                </span>
              <div class="flex-1">
                <p class="text-base font-semibold">Authentification à deux facteurs</p>
                <p class="text-sm text-slate-500">Renforcez la sécurité de votre compte</p>
              </div>
              <span class="text-slate-400">›</span>
            </div>
          </li>
          <li>
            <button
              type="button"
              class="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-slate-50"
              @click="navigateTo('/login')"
            >
              <span class="flex h-10 w-10 items-center justify-center rounded-full bg-[#EB5D1F]/10 text-[#EB5D1F]">
                <img :src="icon('out.svg')" alt="" class="h-5 w-5" />
              </span>
              <div class="flex-1">
                <p class="text-base font-semibold text-[#EB5D1F]">Se déconnecter</p>
                <p class="text-sm text-slate-500">Vous pourrez toujours vous re-connecter</p>
              </div>
              <span class="text-slate-400">›</span>
            </button>
          </li>
        </ul>
      </div>

      <div class="rounded-2xl border border-slate-100 bg-white shadow-md shadow-slate-200/50">
        <ul class="divide-y divide-slate-100">
          <li>
            <button type="button" class="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-slate-50">
              <span class="flex h-10 w-10 items-center justify-center rounded-full bg-[#EB5D1F]/10 text-[#EB5D1F]">
                <img :src="icon('cloche.svg')" alt="" class="h-5 w-5" />
              </span>
              <div class="flex-1">
                <p class="text-base font-semibold">Aide & support</p>
              </div>
              <span class="text-slate-400">›</span>
            </button>
          </li>
          <li>
            <button type="button" class="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-slate-50">
              <span class="flex h-10 w-10 items-center justify-center rounded-full bg-[#EB5D1F]/10 text-[#EB5D1F]">
                <img :src="icon('hearth.svg')" alt="" class="h-5 w-5" />
              </span>
              <div class="flex-1">
                <p class="text-base font-semibold">A propos</p>
              </div>
              <span class="text-slate-400">›</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

