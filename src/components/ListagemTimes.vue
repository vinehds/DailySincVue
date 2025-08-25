<template>
  <section class="carousel-section">
    <el-carousel
        height="300px"
        type="card"
        interval="0"
        indicator-position="outside"
        arrow="always"
        class="carousel"
        !loop
    >
      <el-carousel-item v-for="(team, index) in teams" :key="index" class="item-card">
        <div class="card">
          <p>{{ team.description }}</p>
        </div>
      </el-carousel-item>
    </el-carousel>
  </section>
</template>

<script>

import axios from "axios";

export default {

  data() {
    return {
      URL_API: 'http://192.168.1.5:8080',
      teams: [],

    };
  },
  methods: {

    async getTeams(){
      try {
        const response = await axios.get(this.URL_API.concat("/teams"));

        console.log(response);

        this.teams = response.data;
      } catch (error) {
        console.error("Erro ao buscar dados do backend:", error);
      }
    }

  },
  mounted() {
    this.getTeams();
  }
};

</script>

<style scoped>

.carousel{
  background-color: #b7111100;
}

.carousel-section {
  margin-top: 40px;
  width: 80%;
  max-width: 1200px;
  background: transparent !important;
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
.card:hover {
  transform: translateY(-3px);
}
.item-card {
  background: transparent !important;
}

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