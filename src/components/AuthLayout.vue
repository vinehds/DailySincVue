<!-- src/components/AuthLayout.vue -->
<template>
  <div class="auth-layout">
    <div class="auth-card card">
      <slot />
    </div>
  </div>
</template>

<script setup>
// Layout simples que aplica o card e centraliza
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  padding: var(--space-lg);
  background: #313131;
}
.auth-card {
  width: 100%;
  max-width: 420px;
  margin-top: -10%
}
</style>
