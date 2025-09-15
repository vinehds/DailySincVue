<!-- src/components/Dashboard.vue -->
<template>
  <div class="page">
    <header style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
      <h1>Dashboard</h1>
      <div>
        <span v-if="auth.user" style="margin-right: .75rem;">{{ auth.user.email }} ({{ auth.user.role }})</span>
        <button class="btn" @click="onLogout">Sair</button>
      </div>
    </header>

    <section class="card card">
      <h3>Área protegida</h3>
      <p class="text-muted">Somente usuários autenticados podem ver este conteúdo.</p>

      <div style="margin-top:1rem;">
        <button class="btn btn-primary" @click="fetchProtected">Chamar rota protegida</button>
      </div>

      <div v-if="response" style="margin-top:1rem;">
        <pre style="white-space:pre-wrap;">{{ response }}</pre>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import api from "../services/api";
const auth = useAuthStore();
const response = ref(null);

function onLogout() {
  auth.logout();
  window.location.href = "/login";
}

async function fetchProtected() {
  try {
    const resp = await api.get("/protected/example"); // exemplo
    response.value = JSON.stringify(resp.data, null, 2);
  } catch (err) {
    response.value = "Erro: " + (err.response?.data?.message || err.message);
  }
}
</script>

<style scoped>
h1 { margin:0; }
</style>
