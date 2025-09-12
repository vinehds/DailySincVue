<template>
  <el-container class="container">
    <div class="main-layout">
      <aside class="sidebar">

        <span v-if="teamsItens.length === 0"> Nenhum time cadastrado</span>
        <ul>
          <li v-for="(item, index) in teamsItens" :key="index" :class="{ active: teamSelected === item.id }"
              @click="selectMenu(item.id)">
            {{ item.teamName }}
          </li>
        </ul>
      </aside>

      <el-container class="content-container">

        <div>
          <div class="filters">
            <div>
              <el-form :inline="true" label-position="top" style="display: flex; gap: 30px">

                <el-form-item label="Filtrar por Data">
                  <el-date-picker style="width: 200px; padding-left: 10px" v-model="selectedDate" type="date"
                                  placeholder="Selecione a data" class="rounded" format="DD/MM/YYYY" @change="buscarDados"/>
                </el-form-item>

                <el-form-item label="Filtrar por Dev">
                  <el-select v-model="devsSelected" placeholder="Devs" class="modern-input" style="width: 350px"
                             collapse-tags clearable @change="handleSelectChange" multiple>

                    <el-option label="Todos" value="all" />

                    <el-option v-for="item in devsFiltered" :key="item.id" :label="item.name" :value="item.id"/>

                  </el-select>
                </el-form-item>
              </el-form>
            </div>

              <el-button type="primary" class="rounded" @click="abrirResumo">
                Gerar resumo
              </el-button>

          </div>

          <div class="card-container">
            <div v-if="dailiesFiltered.length === 0">Nenhuma daily encontrada</div>
            <div class="card-scroll">

              <div v-for="(daily, index) in dailiesFiltered" :key="daily.id" class="daily-item" @click="openDaily(index)">
                <div class="author">Autor ID: {{ daily.authorId }}</div>
                <div class="text"><b>Ontem:</b> {{ daily.lastDayLog }}</div>
                <div class="text"><b>Hoje:</b> {{ daily.nextDayPlan }}</div>
                <div class="time">{{ daily.date }}</div>
              </div>

            </div>
          </div>

          <el-dialog v-model="showModal" width="600px" :show-close="false" class="daily-dialog">

            <template #header>
              <div class="dialog-header">
                <el-button
                    class="daily-btn-index"
                    :icon="ArrowLeft"
                    circle
                    @click="prevDaily"
                    :disabled="isFirstDaily"
                    aria-label="Daily anterior"
                >
                </el-button>

                <span class="dialog-title">
                Autor {{ dailiesFiltered[currentIndex]?.authorId }} -
                {{ dailiesFiltered[currentIndex]?.date }}
                </span>
                <el-button
                    class="daily-btn-index"
                    :icon="ArrowRight"
                    circle
                    @click="nextDaily"
                    :disabled="isLastDaily"
                    aria-label="Próxima daily"
                >
                </el-button>

              </div>
            </template>

            <transition name="fade-slide" mode="out-in">
              <div class="dialog-content" :key="currentIndex">
                <p><b>Ontem:</b> {{ dailiesFiltered[currentIndex]?.lastDayLog }}</p>
                <p><b>Hoje:</b> {{ dailiesFiltered[currentIndex]?.nextDayPlan }}</p>

                <el-input
                    v-model="dailyResponse"
                    type="textarea"
                    placeholder="Escreva sua resposta..."
                    rows="3"
                    class="mt-3"
                />
              </div>
            </transition>

            <template #footer>
              <el-button type="danger" @click="showModal = false">Fechar</el-button>
              <el-button type="primary" @click="enviarResposta">Enviar resposta</el-button>
            </template>
          </el-dialog>
        </div>

      </el-container>
    </div>
  </el-container>

  <el-dialog v-model="showResumo" width="700px" class="resumo-dialog" lock-scroll="false">
    <template #header>
      <div class="dialog-header">
        <span class="dialog-title">Resumo das Dailies</span>
        <el-button size="small" type="success" @click="copiarResumo">📋 Copiar</el-button>
      </div>
    </template>

    <div class="resumo-content">
      <pre>{{ resumoTexto }}</pre>
    </div>

    <template #footer>
      <el-button type="primary" @click="showResumo = false">Fechar</el-button>
    </template>
  </el-dialog>
</template>

<script>
import axios from "axios";
import { ArrowRight, ArrowLeft } from '@element-plus/icons-vue'


export default {
  components: {ArrowRight, ArrowLeft},
  data() {
    return {
      URL_API: "http://localhost:8080",
      selectedDate: null,
      devsSelected: [],
      dailys: [],
      devs: [],
      devsFiltered: [],
      dailiesFiltered: [],
      showModal: false,
      currentIndex: 0,
      teamsItens: [],
      showResumo: false,
      resumoTexto: "",
      dailyResponse: "",
      teamSelected: "dashboard",
    };
  },
  methods: {
    async enviarResposta() {
      const currentDaily = this.dailys[this.currentIndex];
      if (!currentDaily) return;

      try {
        this.$message.success("Resposta enviada com sucesso!");
        this.dailyResponse = "";
        this.showDialog = false;
      } catch (error) {
        console.error("Erro ao enviar resposta:", error);
        this.$message.error("Erro ao enviar resposta");
      }
    },

    buscarDados() {
      if (!this.selectedDate) {
        this.$message.warning("Selecione uma data primeiro!");
        return;
      }
      this.getDailys(this.selectedDate);
    },
    handleSelectChange(val) {

      if (val.includes("all")) {
        this.devsSelected = this.devsFiltered.map(d => d.id);
        this.dailyFilter(this.devsSelected);
        return;
      }

      this.dailyFilter(this.devsSelected);
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
      this.teamSelected = value;

      this.devsFilter(value);

      this.devsSelected = this.devsFiltered.map(d => d.id);

      this.dailyFilter(this.devsSelected);
    },

    async getDailys(date) {
      try {
        const formattedDate = this.formatDateToDDMMYYYY(new Date(date));
        const resp = await axios.get(
            `${this.URL_API}/dailies/byDate?date=${formattedDate}`
        );
        this.dailys = resp.data;
        this.dailyFilter(this.devsSelected);
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

    async initPage() {
      try {
        const teamsResp = await axios.get(this.URL_API.concat("/teams"));
        this.teamsItens = teamsResp.data;

        if (this.teamsItens.length === 0) return;

        const firstTeamId = this.teamsItens[0].id;
        this.teamSelected = firstTeamId;

        const devsResp = await axios.get(this.URL_API.concat("/developers"));
        this.devs = devsResp.data;

        this.devsFilter(firstTeamId);

        this.devsSelected = this.devsFiltered.map(d => d.id);

        const today = new Date();
        const formattedDate = this.formatDateToDDMMYYYY(today);
        const dailiesResp = await axios.get(
            `${this.URL_API}/dailies/byDate?date=${formattedDate}`
        );
        this.dailys = dailiesResp.data;

        this.dailyFilter(this.devsSelected);
      } catch (error) {
        console.error("Erro no init:", error);
      }
    },

    devsFilter(teamId) {
      this.devsFiltered = this.devs.filter(dev => dev.teamId === teamId);
    },

    dailyFilter(ids) {
      this.dailiesFiltered = this.dailys.filter(daily =>
          ids.includes(daily.authorId) // <- importante: daily tem authorId, não id do daily
      );
    },

    abrirResumo() {
      if (!this.dailiesFiltered.length) {
        this.$message.warning("Nenhuma daily encontrada para gerar o resumo!");
        return;
      }

      this.resumoTexto = this.dailiesFiltered.map(d => {
        const dev = this.devs.find(x => x.id === d.authorId);
        return `👤 ${dev ? dev.name : "Desconhecido"} (${d.date})\n- Ontem: ${d.lastDayLog}\n- Hoje: ${d.nextDayPlan}\n`;
      }).join("\n");

      this.showResumo = true;
    },

    async copiarResumo() {
      try {
        await navigator.clipboard.writeText(this.resumoTexto);
        this.$message.success("Resumo copiado para a área de transferência!");
      } catch (err) {
        console.error("Erro ao copiar:", err);
        this.$message.error("Falha ao copiar resumo!");
      }
    },
  },
  mounted() {
    this.initPage();
  },
  computed: {
    ArrowLeft() {
      return ArrowLeft
    },
    ArrowRight() {
      return ArrowRight
    },
    isLastDaily() {
      return this.currentIndex === this.dailiesFiltered.length - 1
    },
    isFirstDaily() {
      return this.currentIndex === 0
    }
  }

};
</script>


<style scoped>

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.fade-slide-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.fade-slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.daily-btn-index {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.daily-btn-index:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.daily-btn-index:active:not(:disabled) {
  transform: scale(0.9);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25) inset;
}
.daily-btn-index:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.resumo-dialog .dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.resumo-content {
  overflow: hidden;

  background: #f9f9f9;
  padding: 15px;
  border-radius: 12px;
  max-height: 50vh;
  overflow-y: auto;
  white-space: pre-wrap;
  font-family: "Courier New", monospace;
  font-size: 0.95rem;
  line-height: 1.5;
  scrollbar-width: none;
}

/* ----------- Layout principal responsivo ----------- */
.container {
  width: 95%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.main-layout {
  display: flex;
  flex: 1;
  padding: 1%;
  gap: 1rem;
  max-height: 100%;
}
.sidebar {
  flex: 0 0 15%;
  background: linear-gradient(180deg, #2c5364, #203a43, #0f2027);
  color: white;
  padding: 1rem;
  border-radius: 20px;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);
  max-height: 500px;
  overflow-y: auto;
}
.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sidebar li {
  padding: 0.8rem;
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

.content-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  margin-left: 25px;
  margin-top: 25px;
}
.card-container {
  background: #fff;
  border-radius: 20px;
  padding: 1rem;
  box-shadow: 0 6px 16px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  min-height: 0;
  margin: 5px 25px;
  max-height: 390px;
}
.card-scroll {
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 390px;
}
.daily-item {
  background: #f7f7f7;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  width: 850px;
}
.author {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2c5364;
}
.text {
  margin-bottom: 0.5rem;
}
.time {
  font-size: 0.8rem;
  color: #888;
  text-align: right;
}

/* ----------- Estilização de inputs/botões ----------- */
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

.rounded{
  margin-bottom: 15px;
  margin-right: 30px;
}

/* ----------- Dialogs ----------- */
.daily-dialog .dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dialog-title {
  font-weight: 600;
  font-size: 1rem;
}
.dialog-content {
  padding: 2%;
  font-size: 0.9rem;
  scrollbar-width: none;
  overflow-y: hidden;
}

/* ----------- Responsividade ----------- */
@media (max-width: 1024px) {
  .main-layout {
    flex-direction: column;
  }
  .sidebar {
    flex: 0 0 auto;
    width: 100%;
    display: flex;
    overflow-x: auto;
  }
  .sidebar ul {
    display: flex;
    gap: 1rem;
  }
}
@media (min-width: 768px) {
  .card-scroll {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}
@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
  }
  .filters .el-form {
    width: 95%;
  }
  .card-scroll {
    grid-template-columns: 1fr;
  }
}
</style>

