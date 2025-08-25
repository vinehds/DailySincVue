<template>
  <div class="container">
    <!-- 🔹 TopBar -->
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
        <el-menu-item index="/teste" class="item">🧪 Teste</el-menu-item>
      </el-menu>
    </header>

    <!-- 🔹 Carrossel de Cards -->
    <section class="carousel-section">
      <el-carousel
          height="300px"
          type="card"
          interval="0"
          indicator-position="outside"
          arrow="always"
          class="carousel"
      >
        <el-carousel-item v-for="(card, index) in cards" :key="index" class="item-card">
          <div class="card">
            <p>{{ card.description }}</p>
          </div>
        </el-carousel-item>
      </el-carousel>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const cards = ref([
  { description: "Visão geral dos indicadores." },
  { description: "Gerencie seus times facilmente." },
  { description: "Crie relatórios em segundos." },
  { description: "Personalize sua experiência." },
  { description: "Mantenha-se atualizado." }
]);

// Estado para armazenar dados do backend
const backendData = ref(null);

onMounted(async () => {
  try {
    const response = await axios.get("http://localhost:8080/teams");

    console.log(response);

    backendData.value = response.data;
    cards.value = response.data;
  } catch (error) {
    console.error("Erro ao buscar dados do backend:", error);
  }
});
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

.item-card {
  background: transparent !important;
}


.menu {
  border-bottom: none !important;
  display: flex;
  justify-content: center;
  font-family: "Inter", sans-serif;
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

.el-menu-item.is-active {
  background: rgba(0, 198, 255, 0.15) !important;
  font-weight: 600;
  border-radius: 12px;
}

.carousel{
  background-color: #b7111100;
}

.carousel-section {
  margin-top: 40px;
  width: 80%;
  max-width: 1200px;
  background: transparent !important;
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

.card {
  width: 200px;
  height: 260px;
  background: linear-gradient(180deg, #203a43, #2c5364);
  border-radius: 18px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
  color: #FFF;
  padding: 20px;
  text-align: center;
  font-family: "Inter", sans-serif;
  transition: transform 0.3s ease;
}

.carousel ::v-deep(.el-carousel__item) {
  background: transparent !important;
  box-shadow: none !important;
}

.carousel ::v-deep(.el-carousel__card) {
  background: transparent !important;
}

.card:hover {
  transform: translateY(-3px);
}
</style>
