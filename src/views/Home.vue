<template>
  <div class="main-layout">
    <aside class="sidebar">
      <ul>
        <li
            v-for="(item, index) in menuItems"
            :key="index"
            :class="{ active: selectedMenu === item.value }"
            @click="selectMenu(item.value)"
        >
          {{ item.label }}
        </li>
      </ul>
    </aside>

    <el-container class="content-container">
      <el-main>
        <div class="filters">
          <div style="display: flex; gap: 30px" class="teste">
            <el-date-picker
                style="width: 200px; padding-left: 10px"
                v-model="selectedDate"
                type="date"
                placeholder="Selecione a data"
                class="rounded"
                format="DD/MM/YYYY"
            />

            <el-select
                v-model="selectedValue"
                placeholder="Devs"
                class="modern-input"
                style="width: 200px"
                multiple
                collapse-tags
                clearable
                @change="handleSelectChange"
            >
              <el-option label="Selecionar todos" value="all" />
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </div>

          <el-button
              type="primary"
              class="rounded"
              @click="buscarDados"
              style="margin-right: 20px"
          >
            Gerar resumo
          </el-button>
        </div>

        <!-- CARD CONTAINER -->
        <div class="card-container">
          <div class="card-scroll">
            <div
                v-for="(daily, index) in dailys"
                :key="index"
                class="daily-item"
                @click="openDaily(index)"
            >
              <div class="author">{{ daily.author }}</div>
              <div class="text">{{ daily.text }}</div>
              <div class="time">{{ daily.time }}</div>
            </div>
          </div>
        </div>

        <!-- MODAL PARA EXPANSÃO -->
        <el-dialog
            v-model="showModal"
            width="600px"
            :show-close="false"
            class="daily-dialog"
        >
          <template #header>
            <div class="dialog-header">
              <el-button
                  icon="ArrowLeft"
                  circle
                  @click="prevDaily"
                  :disabled="currentIndex === 0"
              />
              <span class="dialog-title">
                {{ dailys[currentIndex]?.author }} - {{ dailys[currentIndex]?.time }}
              </span>
              <el-button
                  icon="ArrowRight"
                  circle
                  @click="nextDaily"
                  :disabled="currentIndex === dailys.length - 1"
              />
            </div>
          </template>

          <div class="dialog-content">
            <p>{{ dailys[currentIndex]?.text }}</p>
          </div>

          <template #footer>
            <el-button type="danger" @click="showModal = false">Fechar</el-button>
          </template>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedDate: null,
      selectedValue: [],
      options: [
        { value: "1", label: "Dev 1" },
        { value: "2", label: "Dev 2" },
        { value: "3", label: "Dev 3" },
      ],
      dailys: [
        { author: "Dev 1", text: "Ontem finalizei a feature X", time: "09:15" },
        { author: "Dev 2", text: "Hoje vou focar em bug Y", time: "09:17" },
        { author: "Dev 3", text: "Estou bloqueado no serviço Z", time: "09:20" },
        { author: "Dev 4", text: "Testando integração com API", time: "09:25" },
      ],
      showModal: false,
      currentIndex: 0,

      menuItems: [
        { value: "dashboard", label: "Dashboard" },
        { value: "relatorios", label: "Relatórios" },
        { value: "config", label: "Configurações" },
      ],
      selectedMenu: "dashboard", // item inicial
    };
  },
  methods: {
    buscarDados() {
      console.log(
          "Data:",
          this.selectedDate,
          "Valor(es):",
          this.selectedValue
      );
    },
    handleSelectChange(val) {
      if (val.includes("all")) {
        this.selectedValue = this.options.map((o) => o.value);
      }
    },
    openDaily(index) {
      this.currentIndex = index;
      this.showModal = true;
    },
    nextDaily() {
      if (this.currentIndex < this.dailys.length - 1) {
        this.currentIndex++;
      }
    },
    prevDaily() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
    },
    selectMenu(value) {
      this.selectedMenu = value;
      console.log("Selecionado:", value);
    },
  },
};
</script>

<style scoped>
:root {
  font-family: "Poppins", sans-serif;
}
* {
  font-family: inherit !important;
}

.main-layout {
  display: flex;
  min-height: 100vh;
  background: inherit;
  padding: 40px;
}

.sidebar {
  width: 200px;
  background: linear-gradient(180deg, #2c5364, #203a43, #0f2027);
  color: white;
  padding: 20px;
  margin: 12px;
  border-radius: 20px;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);
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
  transition: background 0.3s, transform 0.2s;
}
.sidebar li:hover {
  background: rgba(255, 255, 255, 0.15);
}
.sidebar li.active {
  background: rgba(255, 255, 255, 0.3);
  font-weight: bold;
  transform: scale(1.03);
}
.filters{
  display: flex;
  justify-content: space-between;
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

.content-container {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.card-container {
  background: #fff;
  border-radius: 20px;  /* mantém o arredondamento */
  padding: 16px;
  width: 100%;
  margin-top: 30px;
  max-width: 850px;
  height: 370px;        /* altura fixa */
  box-shadow: 0 6px 16px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;     /* importante: esconde o scroll que sai da borda */
}

/* container interno com scroll */
.card-scroll {
  overflow-y: auto;
  flex: 1;              /* ocupa todo o espaço do card-container */
  padding-right: 8px;   /* espaço pro scroll não colar na borda */
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.daily-item {
  background: #f7f7f7;
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
}


.message {
  background: #f7f7f7;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}
.message:hover {
  transform: scale(1.02);
}
.author {
  font-weight: 600;
  margin-bottom: 4px;
  color: #2c5364;
}
.text {
  margin-bottom: 4px;
}
.time {
  font-size: 12px;
  color: #888;
  text-align: right;
}

.rounded,
.el-button,
.el-input,
.el-select,
.el-date-picker {
  border-radius: 12px !important;
  background: linear-gradient(180deg, #2c5364, #203a43, #0f2027);
  border: none;
  color: white;
}

/* Dialog */
.daily-dialog .dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dialog-title {
  font-weight: 600;
  font-size: 16px;
}
.dialog-content {
  padding: 16px;
  font-size: 14px;
}
</style>
