<template>
  <span ref="element" class="animated-number">{{ displayedValue }}</span>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

defineOptions({ name: 'AnimatedNumber' })

const props = defineProps({
  value: { type: Number, default: 0 },
  duration: { type: Number, default: 900 },
})

const element = ref(null)
const displayedValue = ref(0)
let observer
let frame

function animate() {
  const start = performance.now()
  const from = displayedValue.value
  const step = (now) => {
    const progress = Math.min(1, (now - start) / props.duration)
    const eased = 1 - Math.pow(1 - progress, 3)
    displayedValue.value = Math.round(from + (props.value - from) * eased)
    if (progress < 1) frame = requestAnimationFrame(step)
  }
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(step)
}

function handleVisibility(entry) {
  if (entry.isIntersecting) {
    animate()
  } else if (entry.boundingClientRect.top < window.innerHeight) {
    cancelAnimationFrame(frame)
    displayedValue.value = 0
  }
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    displayedValue.value = props.value
    return
  }
  observer = new IntersectionObserver(([entry]) => handleVisibility(entry), {
    threshold: 0.4,
    rootMargin: '0px 0px -8% 0px',
  })
  observer.observe(element.value)
})

watch(
  () => props.value,
  (value) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) displayedValue.value = value
  },
)

onBeforeUnmount(() => {
  observer?.disconnect()
  cancelAnimationFrame(frame)
})
</script>
