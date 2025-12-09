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

export const useAuthStore = defineStore('auth', () => {
  const role = ref<RiderRole>('Hitchhiker')
  const availability = ref(true)
  const rides = ref<Ride[]>(ridesData as Ride[])

  const setRole = (value: RiderRole) => {
    role.value = value
  }

  const toggleAvailability = () => {
    availability.value = !availability.value
  }

  return {
    role,
    availability,
    rides,
    setRole,
    toggleAvailability
  }
})

