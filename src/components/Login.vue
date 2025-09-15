<!-- src/components/Login.vue -->
<template>
  <AuthLayout>
    <h2 style="margin-bottom: 1rem;">Entrar</h2>

    <form @submit.prevent="onSubmit" novalidate>
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
      <div v-if="errors.email" class="text-muted" style="color: var(--color-danger)">{{ errors.email }}</div>

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
      <div v-if="errors.password" class="text-muted" style="color: var(--color-danger)">{{ errors.password }}</div>

      <div style="display:flex; gap: 0.5rem; margin-top: 1rem;">
        <button class="btn btn-primary" :disabled="loading" type="submit">
          {{ loading ? "Entrando..." : "Entrar" }}
        </button>

<!--        <router-link to="/register" class="btn" style="text-decoration: none; color: #0f2027">
          <button class="btn btn-primary" :disabled="loading" type="submit">

         </button>
        </router-link>-->
      </div>

      <div v-if="serverError" class="text-muted" style="color: var(--color-danger); margin-top: 0.75rem;">
        {{ serverError }}
      </div>
    </form>
  </AuthLayout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";
import AuthLayout from "./AuthLayout.vue";

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
    // Se backend retornar user no login, store já foi populada. Senão, poderia buscar /auth/me.
    // Redireciona para rota solicitada ou dashboard
    const redirect = route.query.redirect || "/dashboard";
    router.push(redirect);
  } catch (err) {
    // Exibir mensagem amigável (tenta mensagem do servidor)
    serverError.value = err.response?.data?.message || err.message || "Erro ao efetuar login.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
h2 { font-size: var(--fs-xl); margin: 0; }
label { display:block; margin-top: 0.5rem; font-weight: var(--fw-medium); margin-bottom: 0.25rem; }
</style>
