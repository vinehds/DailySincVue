<template>
  <div class="main-content">
    <el-container class="content-container">
      <listagem-times />

      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import TopBar from "@/components/TopBar.vue";
import ListagemTimes from "@/components/ListagemTimes.vue";

export default {
  components: {
    ListagemTimes,
    TopBar
  }
}
</script>

<style scoped>
.content-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
