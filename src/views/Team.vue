<template>
  <div class="main-content">
    <el-container style="height: 50px; flex-direction: column">


      <el-main class="main-content" >
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>


<script>
import TopBar from "@/components/TopBar.vue";

export default {
  components: {
    TopBar
  }
}

</script>

<style scoped>


</style>
