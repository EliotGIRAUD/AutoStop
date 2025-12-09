<script setup lang="ts">
import type { Component } from 'vue'
import { LayoutDashboard, LogIn, MapPinned, UserRound } from 'lucide-vue-next'

interface NavItem {
  label: string
  to: string
  icon: Component
}

const route = useRoute()

const navItems: NavItem[] = [
  { label: 'Carte', to: '/', icon: MapPinned },
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Profil', to: '/profile/1', icon: UserRound },
  { label: 'Login', to: '/login', icon: LogIn }
]

const isActive = (path: string) => route.path.startsWith(path)
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <div class="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.08),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(8,145,178,0.08),transparent_32%)]" />
    <div class="relative mx-auto max-w-screen-md px-4 pb-24 pt-6">
      <slot />
    </div>
    <nav class="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-slate-900/90 backdrop-blur">
      <div class="mx-auto flex max-w-screen-md items-center justify-between px-6 py-3">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex flex-1 flex-col items-center gap-1 text-xs font-semibold transition"
          :class="isActive(item.to) ? 'text-emerald-400' : 'text-slate-300'"
        >
          <component :is="item.icon" class="h-6 w-6" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

