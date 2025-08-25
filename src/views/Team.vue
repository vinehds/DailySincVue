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
  height: 100vh;              /* ocupa a tela inteira */
  display: flex;
  justify-content: center;    /* centraliza na horizontal */
  align-items: center;        /* centraliza na vertical */
  flex-direction: column;     /* garante que fiquem em coluna */
}
</style>
