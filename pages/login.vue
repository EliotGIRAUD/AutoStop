<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from '#imports'
import { useAuthStore } from '@/stores/auth'

type RiderRole = 'Driver' | 'Hitchhiker'

const auth = useAuthStore()
const router = useRouter()

const role = ref<RiderRole>(auth.role)
const phone = ref('')
const firstName = ref('')
const lastName = ref('')
const age = ref<number | null>(null)
const photo = ref('')

const handleSubmit = () => {
  auth.setRole(role.value)
  auth.setProfile({
    firstName: firstName.value,
    lastName: lastName.value,
    age: age.value,
    photo: photo.value,
    phone: phone.value
  })
  router.push('/dashboard')
}

const handlePhotoChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file || !file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = () => {
    photo.value = reader.result as string
  }
  reader.readAsDataURL(file)
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
        <label for="firstName" class="text-sm font-semibold text-slate-200">Prénom</label>
        <input
          id="firstName"
          v-model="firstName"
          type="text"
          placeholder="Jean"
          class="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
        />
      </div>

      <div class="space-y-2">
        <label for="lastName" class="text-sm font-semibold text-slate-200">Nom</label>
        <input
          id="lastName"
          v-model="lastName"
          type="text"
          placeholder="Dupont"
          class="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
        />
      </div>

      <div class="space-y-2">
        <label for="age" class="text-sm font-semibold text-slate-200">Âge</label>
        <input
          id="age"
          v-model.number="age"
          type="number"
          min="16"
          max="99"
          placeholder="30"
          class="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
        />
      </div>

      <div class="space-y-2">
        <label for="photo" class="text-sm font-semibold text-slate-200">Photo de profil</label>
        <input
          id="photo"
          type="file"
          accept="image/*"
          @change="handlePhotoChange"
          class="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-base text-white file:mr-4 file:rounded-xl file:border-0 file:bg-slate-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white focus:border-emerald-400 focus:outline-none"
        />
        <div v-if="photo" class="overflow-hidden rounded-2xl border border-white/10 bg-slate-800">
          <img :src="photo" alt="Prévisualisation" class="h-24 w-full object-cover" />
        </div>
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

