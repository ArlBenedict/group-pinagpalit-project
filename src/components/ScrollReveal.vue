<template>
  <div ref="element" class="scroll-reveal" :class="{ 'is-visible': isVisible }">
    <slot />
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const element = ref(null)
const isVisible = ref(false)
let observer

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    isVisible.value = true
    return
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true
      } else if (entry.boundingClientRect.top < window.innerHeight) {
        isVisible.value = false
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  )
  observer.observe(element.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>
