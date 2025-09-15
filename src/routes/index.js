
import Team from "@/views/Team.vue";
import Home from "@/views/Home.vue";
import Developer from "@/views/Developer.vue";

// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import Dashboard from "../components/Dashboard.vue";
import { useAuthStore } from "../stores/auth";

/**
 * Défina meta.roles quando a rota requerer autorização por papel
 */
const routes = [
    { path: "/", redirect: "/dashboard" },
    { path: "/login", component: Login, meta: { public: true } },
    { path: "/register", component: Register, meta: { public: true } },
    { path: '/home', name: 'Home', component: Home,  meta: { requiresAuth: true }, },
    { path: '/team', name: 'Team', component: Team,  meta: { requiresAuth: true }, },
    { path: '/dev', name: 'Developer', component: Developer,  meta: { requiresAuth: true }, },
    {
        path: "/dashboard",
        component: Dashboard,
        meta: { requiresAuth: true }, // todos autenticados
    },
    {
        path: "/admin-area",
        component: Home,
        meta: { requiresAuth: true, roles: ["ADMIN", "TECHLEAD"] },
    },
    // fallback
    { path: "/:pathMatch(.*)*", redirect: "/dashboard" },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Guard global
router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore();

    // rota pública?
    if (to.meta.public) return next();

    // precisa de autenticação?
    if (to.meta.requiresAuth) {
        if (!auth.isAuthenticated) {
            return next({ path: "/login", query: { redirect: to.fullPath } });
        }
        // verifica roles se definido
        if (to.meta.roles && to.meta.roles.length > 0) {
            const role = auth.user?.role || auth.userRole;
            if (!role || !to.meta.roles.includes(role)) {
                // opcional: redirecionar para /dashboard com mensagem
                return next({ path: "/dashboard" });
            }
        }
    }
    return next();
});

export default router;
