import { createRouter, createWebHistory } from 'vue-router'
import TopBar from '../components/TopBar.vue'
import Team from "@/views/Team.vue";
import Home from "@/views/Home.vue";

const routes = [
    { path: '/home', name: 'Home', component: Home },
    { path: '/team', name: 'Team', component: Team },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router