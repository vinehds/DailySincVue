import {createApp} from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from "@/routes/index.js";
import { createPinia } from "pinia";
import "./assets/theme.css";
import "element-plus/dist/index.css";

const app = createApp(App)


app.use(router)
app.use(ElementPlus)
const pinia = createPinia();
app.use(pinia);



app.mount('#app')