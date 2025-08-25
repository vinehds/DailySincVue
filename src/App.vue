<template>
  <div class="geral">
    <el-container style="flex-direction: column; height: 100%">
      <TopBar />
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import TopBar from "@/components/TopBar.vue";

export default {
  components: { TopBar }
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
