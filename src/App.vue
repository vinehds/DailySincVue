<template xmlns="http://www.w3.org/1999/html">
  <div class="geral">
    <el-container style="flex-direction: column; height: 100%">
      <topBar class="topbar"/>
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

.topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px; /* altura da sua barra */
  z-index: 1000; /* garante que fique por cima */
}

/* largura da barra */
html::-webkit-scrollbar,
body::-webkit-scrollbar {
  width: 10px; /* pode ajustar */
}

/* trilho (fundo do scroll) */
html::-webkit-scrollbar-track,
body::-webkit-scrollbar-track {
  background: #1a1a1a; /* cinza escuro */
}

/* parte que se move (thumb) */
html::-webkit-scrollbar-thumb,
body::-webkit-scrollbar-thumb {
  background: #000; /* preto */
  border-radius: 8px;
}

/* hover no thumb */
html::-webkit-scrollbar-thumb:hover,
body::-webkit-scrollbar-thumb:hover {
  background: #333; /* preto mais claro */
}

/* Firefox */
html, body {
  scrollbar-width: thin; /* fino */
  scrollbar-color: #333 #333; /* thumb | track */
}


html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;

  overflow-x: hidden;
}


body {
  background: #313131;
  overflow-x: hidden;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  color: #333;
}
</style>

<style>
.el-container,
.el-main {
  background: transparent !important;
}
</style>
