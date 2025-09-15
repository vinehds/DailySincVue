<!-- src/components/Register.vue -->
<template>
  <AuthLayout>
    <h2>Registrar</h2>

    <form @submit.prevent="onSubmit" novalidate>
      <label for="email">Email</label>
      <input id="email" v-model="email" type="email" class="input" required />

      <label for="password" style="margin-top: 0.5rem;">Senha</label>
      <input id="password" v-model="password" type="password" class="input" required minlength="6" />

      <label for="role" style="margin-top: 0.5rem;">Role</label>
      <select id="role" v-model="role" class="input" aria-label="Selecione role">
        <option value="">Selecione...</option>
        <option value="ADMIN">ADMIN</option>
        <option value="TECHLEAD">TECHLEAD</option>
        <option value="MEMBER">MEMBER</option>
      </select>

      <div v-if="serverError" style="color: var(--color-danger); margin-top: .5rem;">{{ serverError }}</div>

      <div style="display:flex; gap: .5rem; margin-top: 1rem;">
        <button class="btn btn-primary" type="submit" :disabled="loading">{{ loading ? 'Registrando...' : 'Criar conta' }}</button>
        <router-link to="/login" class="btn" style="border:1px solid rgba(0,0,0,0.06)">Voltar</router-link>
      </div>
    </form>
  </AuthLayout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import AuthLayout from "./AuthLayout.vue";

const email = ref("");
const password = ref("");
const role = ref("");
const loading = ref(false);
const serverError = ref(null);
const auth = useAuthStore();
const router = useRouter();

function validate() {
  if (!email.value || !/^\S+@\S+\.\S+$/.test(email.value)) {
    serverError.value = "Email inválido.";
    return false;
  }
  if (!password.value || password.value.length < 6) {
    serverError.value = "Senha deve ter ao menos 6 caracteres.";
    return false;
  }
  if (!role.value) {
    serverError.value = "Selecione uma role.";
    return false;
  }
  serverError.value = null;
  return true;
}

async function onSubmit() {
  if (!validate()) return;
  loading.value = true;
  try {
    await auth.register({ email: email.value, password: password.value, role: role.value });
    // opcional: auto-login após registro (dependendo do backend)
    // redireciona para login
    router.push("/login");
  } catch (err) {
    serverError.value = err.response?.data?.message || err.message || "Erro ao registrar.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
h2 { margin-bottom: 0.75rem; font-size: var(--fs-xl); }
label { display:block; margin-bottom: 0.25rem; font-weight: var(--fw-medium); }
</style>
