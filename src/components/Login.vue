<!-- src/components/Login.vue -->
<template>

  <div class="headerPage">
    <header class="login-header">
      <h1 class="app-title">DailySinc</h1>
      <p class="app-subtitle">Gestão inteligente do seu time</p>
    </header>
  </div>
  <div class="login-page">

    <!-- Overlay com textura -->
    <div class="login-overlay"></div>

    <!-- Card centralizado -->
    <div class="auth-layout">
      <div class="auth-card card">
        <h2 style="margin-bottom: 1rem;">Entrar</h2>

        <form @submit.prevent="onSubmit" novalidate>
          <!-- Email -->
          <label for="email">Email</label>
          <input
              id="email"
              v-model="email"
              type="email"
              class="input"
              required
              aria-required="true"
              aria-label="Email"
              style="width: 90%;"
          />
          <div v-if="errors.email" class="text-muted" style="color: var(--color-danger)">
            {{ errors.email }}
          </div>

          <!-- Senha -->
          <label for="password" style="margin-top: 0.75rem;">Senha</label>
          <input
              id="password"
              v-model="password"
              type="password"
              class="input"
              minlength="6"
              required
              aria-required="true"
              aria-label="Senha"
              style="width: 90%;"
          />
          <div v-if="errors.password" class="text-muted" style="color: var(--color-danger)">
            {{ errors.password }}
          </div>

          <!-- Botões -->
          <div style="display:flex; gap: 0.5rem; margin-top: 1rem;">
            <button class="btn btn-primary" :disabled="loading" type="submit">
              {{ loading ? "Entrando..." : "Entrar" }}
            </button>
          </div>

          <!-- Erro do servidor -->
          <div
              v-if="serverError"
              class="text-muted"
              style="color: var(--color-danger); margin-top: 0.75rem;"
          >
            {{ serverError }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";

const email = ref("");
const password = ref("");
const loading = ref(false);
const errors = ref({});
const serverError = ref(null);

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

function validate() {
  errors.value = {};
  if (!email.value) errors.value.email = "Email é obrigatório.";
  else if (!/^\S+@\S+\.\S+$/.test(email.value)) errors.value.email = "Email inválido.";
  if (!password.value) errors.value.password = "Senha é obrigatória.";
  else if (password.value.length < 6) errors.value.password = "Senha deve ter ao menos 6 caracteres.";
  return Object.keys(errors.value).length === 0;
}

async function onSubmit() {
  serverError.value = null;
  if (!validate()) return;
  loading.value = true;
  try {
    const resp = await auth.login({ email: email.value, password: password.value });
    const redirect = route.query.redirect || "/dashboard";
    router.push(redirect);
  } catch (err) {
    serverError.value = err.response?.data?.message || err.message || "Erro ao efetuar login.";
    auth.logout();
  } finally {
    loading.value = false;
  }
}

/* 🔥 log quando a página monta */
onMounted(() => {
  auth.logout()
});
</script>


<style scoped>

.login-page {
  height: 65dvh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  position: relative;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.login-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.15;
  pointer-events: none;
}

/* Header */
.login-header {
  justify-content: start;
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
}

.app-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.app-subtitle {
  font-size: 1rem;
  opacity: 0.85;
  margin: 0.25rem 0 0;
}

/* Layout do card */
.auth-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
  position: relative;
  z-index: 1;
  width: 100%;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  color: #000;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}

/* Labels */
label {
  display:block;
  margin-top: 0.5rem;
  font-weight: var(--fw-medium);
  margin-bottom: 0.25rem;
}

.headerPage{
  color: #FFF;
  display: flex;
  justify-content: center;
}
</style>
