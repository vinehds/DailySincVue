// src/stores/auth.js
import { defineStore } from "pinia";
import api from "../services/api";

/**
 * store de autenticação:
 * - guarda token em localStorage (chave access_token)
 * - expõe user e role quando possível
 */
export const useAuthStore = defineStore("auth", {
    state: () => ({
        accessToken: localStorage.getItem("access_token") || null,
        user: null, // pode conter { email, role, ... }
    }),
    getters: {
        isAuthenticated: (state) => !!state.accessToken,
        userRole: (state) => (state.user ? state.user.role : null),
    },
    actions: {
        setToken(token) {
            this.accessToken = token;
            if (token) localStorage.setItem("access_token", token);
            else localStorage.removeItem("access_token");
        },
        setUser(user) {
            this.user = user;
        },
        async login({ email, password }) {
            const resp = await api.post("/auth/login", { email, password });
            // assume resp.data.accessToken ou resp.data.token
            const token = resp.data.accessToken || resp.data.token || null;
            if (!token) throw new Error("Token não recebido do servidor");
            this.setToken(token);

            // tentar buscar dados do usuário (se endpoint existir)
            try {
                // exemplo: /auth/me ou /users/me
                const meResp = await api.get("/auth/me");
                this.setUser(meResp.data);
            } catch (err) {
                // se não existir endpoint, tentamos decodificar token (opcional)
                // para simplificar não decodificamos aqui — o backend pode retornar user no login
                if (resp.data.user) this.setUser(resp.data.user);
            }
            return resp;
        },
        async register({ email, password, role }) {
            const resp = await api.post("/auth/register", { email, password, role });
            return resp;
        },
        logout() {
            this.setToken(null);
            this.setUser(null);
        },
    },
});
