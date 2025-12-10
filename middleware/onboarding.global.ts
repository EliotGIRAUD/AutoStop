export default defineNuxtRouteMiddleware(to => {
  if (process.server) return
  const done = localStorage.getItem('onboardingCompleted')
  if (!done && to.path !== '/onboarding') {
    return navigateTo('/onboarding')
  }
})

