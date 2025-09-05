import { createRouter, createWebHistory } from 'vue-router'
import TopBar from '../components/TopBar.vue'
import Team from "@/views/Team.vue";
import Home from "@/views/Home.vue";
import Developer from "@/views/Developer.vue";

const routes = [
    { path: '/home', name: 'Home', component: Home },
    { path: '/team', name: 'Team', component: Team },
    { path: '/dev', name: 'Developer', component: Developer },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router