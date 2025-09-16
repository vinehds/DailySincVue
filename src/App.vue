<template xmlns="http://www.w3.org/1999/html">
  <div class="geral">
    <el-container style="flex-direction: column; height: 100%">
      <topBar class="topbar" v-if="isLoggedIn" />
      <el-main class="main-content">
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import TopBar from "@/components/TopBar.vue";
import Team from "@/views/Team.vue";
import {useAuthStore} from "@/stores/auth.js";

export default {
  components: { TopBar, ListagemTimes: Team },
  computed: {
    isLoggedIn() {
      const auth = useAuthStore();
      return auth.isAuthenticated;
    }
  }

};
</script>

<style>

.topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  z-index: 1000;
}

html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: hidden;
}

body {
  background: #313131;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  color: #333;
}

.el-container {
  height: 100%;
  overflow: hidden;
}

.el-main {
  flex: 1;
  overflow: hidden;
  margin-top: 60px; /* espaço da topbar fixa */
}

/* 🔥 animação fade-in/fade-out */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
