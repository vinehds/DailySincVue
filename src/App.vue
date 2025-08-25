<template xmlns="http://www.w3.org/1999/html">
  <div class="geral">
    <el-container style="flex-direction: column; height: 100%">
      <topBar />
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import TopBar from "@/components/TopBar.vue";
import ListagemTimes from "@/components/ListagemTimes.vue";

export default {
  components: { TopBar, ListagemTimes },
};
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  background: #313131; /* garante o fundo escuro */
}
</style>

<style>
/* global overrides */
.el-container,
.el-main {
  background: transparent !important;
}
</style>
