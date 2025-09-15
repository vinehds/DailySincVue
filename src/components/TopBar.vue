<template>
  <div class="container">
    <header class="topbar">
      <el-menu
          :default-active="$route.path"
          mode="horizontal"
          router
          background-color="transparent"
          text-color="#ecf0f1"
          active-text-color="#00C6FF"
          class="menu"
      >
        <el-menu-item index="/home" class="item">🏠 Home</el-menu-item>
        <el-menu-item index="/team" class="item">👥 Teams</el-menu-item>
        <el-menu-item index="/dev" class="item">👨‍💻 Devs</el-menu-item>
      </el-menu>
    </header>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";

export default {
  methods: {useAuthStore},
  data() {
  },

}

</script>

<style scoped>

.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.topbar {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

.menu {
  border-bottom: none !important;
  display: flex;
  justify-content: center;
  font-size: 15px;
  font-weight: 500;

  background: linear-gradient(90deg, #0f2027, #203a43, #2c5364);
  border-radius: 18px;
  padding: 6px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  width: auto;
  min-width: 500px;
}

.item {
  border-radius: 12px;
  margin: 0 6px;
  padding: 0 18px !important;
  transition: all 0.3s ease;
}

.item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #00e0ff !important;
}


.carousel-section >>> .el-carousel__mask {
  background-color: transparent;
}

.carousel ::v-deep(.el-carousel__item) {
  background: transparent !important;
  display: flex;
  justify-content: center;
  align-items: center;
}



.carousel ::v-deep(.el-carousel__item) {
  background: transparent !important;
  box-shadow: none !important;
}

.carousel ::v-deep(.el-carousel__card) {
  background: transparent !important;
}


</style>
