import { ref } from 'vue'
import { defineStore } from 'pinia'
import ridesData from '@/data/rides.json'

type RiderRole = 'Driver' | 'Hitchhiker'
type RideStatus = 'pending' | 'confirmed' | 'completed'

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

interface Profile {
  firstName: string
  lastName: string
  age: number | null
  photo: string
  phone: string
  email: string
}

export const useAuthStore = defineStore('auth', () => {
  const role = ref<RiderRole>('Hitchhiker')
  const availability = ref(true)
  const rides = ref<Ride[]>(ridesData as Ride[])
  const isAuthenticated = ref(false)
  const profile = ref<Profile>({
    firstName: '',
    lastName: '',
    age: null,
    photo: '',
    phone: '',
    email: ''
  })

  const setRole = (value: RiderRole) => {
    role.value = value
  }

  const setProfile = (data: Partial<Profile>) => {
    profile.value = { ...profile.value, ...data }
  }

  const setAuthenticated = (value: boolean) => {
    isAuthenticated.value = value
  }

  const toggleAvailability = () => {
    availability.value = !availability.value
  }

  return {
    role,
    availability,
    rides,
    isAuthenticated,
    profile,
    setRole,
    setProfile,
    setAuthenticated,
    toggleAvailability
  }
})

