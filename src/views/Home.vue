<script >
import TopBar from "@/components/TopBar.vue";

export default {
  components: {
    TopBar
  }
}
</script>

<template>
  <el-container style="height: 50px; flex-direction: column">

    <el-main class="main-content">
      <router-view />
    </el-main>
  </el-container>
</template>

<style scoped>

</style>