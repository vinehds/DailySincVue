<template>
  <div class="main-layout">
    <!-- Menu Lateral -->
    <aside class="sidebar">
      <ul>
        <li>Dashboard</li>
        <li>Relatórios</li>
        <li>Configurações</li>
      </ul>
    </aside>

    <!-- Container principal -->
    <el-container class="content-container">
      <el-main>
        <!-- 🔹 Filtros acima do card -->
        <div class="filters">

          <div style="display: flex;  gap: 30px">
            <el-date-picker
                style="width: 200px"
                v-model="selectedDate"
                type="date"
                placeholder="Selecione a data"
                class="rounded"
            />

            <el-select v-model="selectedValue" placeholder="Selecione valores"
                       class="rounded"
                        style="width: 200px">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </div>

          <el-button type="primary" class="rounded" @click="buscarDados">
            Gerar resumo
          </el-button>
        </div>

        <!-- 🔹 Card -->
        <div class="card-container">
          <router-view />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedDate: null,
      selectedValue: null,
      options: [
        { value: "1", label: "Valor 1" },
        { value: "2", label: "Valor 2" },
        { value: "3", label: "Valor 3" },
      ],
    };
  },
  methods: {
    buscarDados() {
      console.log("Data:", this.selectedDate, "Valor:", this.selectedValue);
    },
  },
};
</script>

<style scoped>
/* Fundo segue o body */
body {
  background: #f5f6fa;
}

.main-layout {
  display: flex;
  min-height: 100vh;
  background: inherit;
  padding: 40px;
}

/* Sidebar arredondada */
.sidebar {
  width: 200px;
  background: linear-gradient(180deg, #2c5364, #203a43, #0f2027);
  color: white;
  padding: 20px;
  margin: 12px;
  border-radius: 20px;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);
  font-family: "Inter", sans-serif;
  height: 450px;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar li {
  padding: 10px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.3s;
}
.sidebar li:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* Container principal */
.content-container {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

/* Card arredondado */
.card-container {
  background: #e0e0e0;
  border-radius: 20px;
  padding: 24px;
  min-height: 350px;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  margin-top: 20px;
  max-height: 500px;
}

/* Filtros acima do card */
.filters {
  display: flex;
  gap: 16px;
  justify-content: space-between;

  max-width: 850px;
}

/* Bordas arredondadas globais */
.rounded,
.el-button,
.el-input,
.el-select,
.el-date-picker {
  border-radius: 12px !important;
  background: linear-gradient(180deg, #2c5364, #203a43, #0f2027);
  border: none;
}
</style>
