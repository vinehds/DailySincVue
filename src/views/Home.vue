<template>
  <div class="main-layout">
    <aside class="sidebar">
      <ul>
        <li
            v-for="(item, index) in menuItems"
            :key="index"
            :class="{ active: selectedMenu === item.id }"
            @click="selectMenu(item.id)"
        >
          {{ item.teamName }}
        </li>
      </ul>
    </aside>

    <el-container class="content-container">
      <el-main>
        <!-- FILTROS -->
        <div class="filters">
          <el-form :inline="true" label-position="top" style="display: flex; gap: 30px">

            <el-form-item label="Filtrar por Data">
              <el-date-picker
                  style="width: 200px; padding-left: 10px"
                  v-model="selectedDate"
                  type="date"
                  placeholder="Selecione a data"
                  class="rounded"
                  format="DD/MM/YYYY"
                  @change="buscarDados"
              />
            </el-form-item>

            <el-form-item label="Filtrar por Dev">
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
                <el-option label="Todos" value="all" />
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-button
                type="primary"
                class="rounded"
                @click="buscarDados"
                style="margin-top: 22px; margin-right: 20px"
            >
              Gerar resumo
            </el-button>
          </el-form>
        </div>


        <!-- LISTA DE DAILYS -->
        <div class="card-container">
          <div class="card-scroll">
            <div
                v-for="(daily, index) in dailys"
                :key="daily.id"
                class="daily-item"
                @click="openDaily(index)"
            >
              <div class="author">Autor ID: {{ daily.authorId }}</div>
              <div class="text"><b>Ontem:</b> {{ daily.lastDayLog }}</div>
              <div class="text"><b>Hoje:</b> {{ daily.nextDayPlan }}</div>
              <div class="time">{{ daily.date }}</div>
            </div>
          </div>
        </div>

        <!-- MODAL -->
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
              ><</el-button>
              <span class="dialog-title">
                Autor {{ dailys[currentIndex]?.authorId }} -
                {{ dailys[currentIndex]?.date }}
              </span>
              <el-button
                  icon="ArrowRight"
                  circle
                  @click="nextDaily"
                  :disabled="currentIndex === dailys.length - 1"
              >></el-button>
            </div>
          </template>

          <div class="dialog-content">
            <p><b>Ontem:</b> {{ dailys[currentIndex]?.lastDayLog }}</p>
            <p><b>Hoje:</b> {{ dailys[currentIndex]?.nextDayPlan }}</p>
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
import axios from "axios";

export default {
  data() {
    return {
      URL_API: "http://localhost:8080",

      selectedDate: null,
      selectedValue: [],
      options: [
        { value: "1", label: "Dev 1" },
        { value: "2", label: "Dev 2" },
        { value: "3", label: "Dev 3" },
      ],
      dailys: [],
      dailiesFiltered: [],
      showModal: false,
      currentIndex: 0,

      menuItems: [],

      selectedMenu: "dashboard",
    };
  },
  methods: {
    buscarDados() {
      if (!this.selectedDate) {
        this.$message.warning("Selecione uma data primeiro!");
        return;
      }
      this.getDailys(this.selectedDate);
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
    },

    async getTeams() {
      try {
        const response = await axios.get(this.URL_API.concat("/teams"));
        this.menuItems = response.data;
      } catch (error) {
        console.error("Erro ao buscar teams:", error);
      }
    },

    async getDailys(date) {
      try {
        const formattedDate = this.formatDateToDDMMYYYY(new Date(date));
        const resp = await axios.get(
            `${this.URL_API}/dailies/byDate?date=${formattedDate}`
        );
        this.dailys = resp.data;
      } catch (error) {
        console.error("Erro ao buscar dailys:", error);
      }
    },

    formatDateToDDMMYYYY(date) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },

    devFilter(){
      this.dailiesFiltered = this.dailys.filter(daily => {
        //authorId tem que ser igual ao id do dev selecionado

        //implementar busca aos devs
      })
    }
  },
  mounted() {
    this.getTeams();
    this.getDailys(new Date());
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
  margin-top: 2%;
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
  height: 490px;
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
  border-radius: 20px;
  padding: 16px;
  width: 100%;
  margin-top: 15px;
  max-width: 850px;
  height: 370px;
  box-shadow: 0 6px 16px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.card-scroll {
  overflow-y: auto;
  flex: 1;
  padding-right: 8px;
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
