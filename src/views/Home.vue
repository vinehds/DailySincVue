<template>
  <el-container class="app-container">
    <div class="main-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <span v-if="teamsItens.length === 0">Nenhum time cadastrado</span>
        <ul>
          <li
              v-for="(item, index) in teamsItens"
              :key="index"
              :class="{ active: teamSelected === item.id }"
              @click="selectMenu(item.id)"
          >
            {{ item.teamName }}
          </li>
        </ul>
      </aside>

      <!-- Conteúdo principal -->
      <el-container class="content-container">
        <!-- Filtros -->
        <section class="filters">
          <el-form :inline="true" label-position="top" class="filters-form">
            <el-form-item label="Filtrar por Data">
              <el-date-picker
                  v-model="selectedDate"
                  type="date"
                  placeholder="Selecione a data"
                  class="input-date"
                  format="DD/MM/YYYY"
                  @change="buscarDados"
              />
            </el-form-item>

            <el-form-item label="Filtrar por Dev">
              <el-select
                  v-model="devsSelected"
                  placeholder="Devs"
                  class="input-select"
                  collapse-tags
                  clearable
                  multiple
                  @change="handleSelectChange"
              >
                <el-option label="Todos" value="all" />
                <el-option
                    v-for="item in devsFiltered"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-form>

          <el-button type="info" class="btn-action" @click="abrirResumo">
            Gerar resumo
          </el-button>
        </section>

        <!-- Cards -->
        <section class="card-container">
          <div v-if="dailiesFiltered.length === 0" class="no-data">
            Nenhuma daily encontrada
          </div>
          <div v-else class="card-scroll">
            <article
                v-for="(daily, index) in dailiesFiltered"
                :key="daily.id"
                class="daily-item"
                @click="openDaily(index)"
            >
              <header class="author">Autor ID: {{ daily.authorId }}</header>
              <p class="text"><b>Ontem:</b> {{ daily.lastDayLog }}</p>
              <p class="text"><b>Hoje:</b> {{ daily.nextDayPlan }}</p>
              <footer class="time">{{ daily.date }}</footer>
            </article>
          </div>
        </section>

        <!-- Modal Daily -->
        <el-dialog
            v-model="showModal"
            width="600px"
            :show-close="false"
            class="daily-dialog"
        >
          <template #header>
            <div class="dialog-header">
              <el-button
                  class="daily-btn-index"
                  :icon="ArrowLeft"
                  circle
                  @click="prevDaily"
                  :disabled="isFirstDaily"
                  aria-label="Daily anterior"
              />
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
              />
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
                  class="input-response"
              />
            </div>
          </transition>

          <template #footer>
            <el-button type="danger" @click="showModal = false">Fechar</el-button>
            <el-button type="primary" @click="enviarResposta">
              Enviar resposta
            </el-button>
          </template>
        </el-dialog>
      </el-container>
    </div>

    <!-- Modal Resumo -->
    <el-dialog
        v-model="showResumo"
        width="700px"
        class="resumo-dialog"
        lock-scroll="false"
    >
      <template #header>
        <div class="dialog-header">
          <span class="dialog-title">Resumo das Dailies</span>
          <el-button size="small" type="success" @click="copiarResumo">
            📋 Copiar
          </el-button>
        </div>
      </template>

      <div class="resumo-content">
        <pre>{{ resumoTexto }}</pre>
      </div>

      <template #footer>
        <el-button type="primary" @click="showResumo = false">Fechar</el-button>
      </template>
    </el-dialog>
  </el-container>
</template>

<script>
import api from "@/services/api"; // usa a instância com interceptor
import { ArrowRight, ArrowLeft } from "@element-plus/icons-vue";
import { useAuthStore } from "@/stores/auth";

export default {
  components: { ArrowRight, ArrowLeft },
  data() {
    return {
      // NÃO usa URL_API local — usa api.baseURL
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
        // Exemplo de endpoint: /dailies/{id}/response
        // Se seu backend tem outro caminho, ajuste aqui.
        await api.post(`/dailies/${currentDaily.id}/response`, {
          message: this.dailyResponse,
        });
        this.$message.success("Resposta enviada com sucesso!");
        this.dailyResponse = "";
        this.showModal = false;
      } catch (error) {
        console.error("Erro ao enviar resposta:", error);
        const msg =
            error.response?.data?.message || error.message || "Erro ao enviar resposta";
        this.$message.error(msg);
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
        this.devsSelected = this.devsFiltered.map((d) => d.id);
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
      this.devsSelected = this.devsFiltered.map((d) => d.id);
      this.dailyFilter(this.devsSelected);
    },

    async getDailys(date) {
      try {
        const formattedDate = this.formatDateToDDMMYYYY(new Date(date));
        const resp = await api.get(`/dailies/byDate?date=${formattedDate}`);
        this.dailys = resp.data || [];
        this.dailyFilter(this.devsSelected);
      } catch (error) {
        console.error("Erro ao buscar dailys:", error);
        const msg =
            error.response?.data?.message || error.message || "Erro ao buscar dailys";
        // se 401 intercept já redirecionou; aqui só exibir
        this.$message.error(msg);
      }
    },

    formatDateToDDMMYYYY(date) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },

    async initPage() {
      const auth = useAuthStore();
      // se não autenticado, redireciona para /login
      if (!auth.isAuthenticated) {
        // redireciona para login
        this.$message.warning("Você precisa entrar para acessar esta página.");
        this.$router.push({ path: "/login", query: { redirect: this.$route.fullPath } });
        return;
      }

      try {
        const teamsResp = await api.get("/teams");
        this.teamsItens = teamsResp.data || [];

        if (this.teamsItens.length === 0) return;

        const firstTeamId = this.teamsItens[0].id;
        this.teamSelected = firstTeamId;

        const devsResp = await api.get("/developers");
        this.devs = devsResp.data || [];

        this.devsFilter(firstTeamId);
        this.devsSelected = this.devsFiltered.map((d) => d.id);

        const today = new Date();
        const formattedDate = this.formatDateToDDMMYYYY(today);
        const dailiesResp = await api.get(`/dailies/byDate?date=${formattedDate}`);
        this.dailys = dailiesResp.data || [];
        this.dailyFilter(this.devsSelected);
      } catch (error) {
        console.error("Erro no init:", error);
        const msg = error.response?.data?.message || error.message || "Erro no init";
        this.$message.error(msg);
      }
    },

    devsFilter(teamId) {
      this.devsFiltered = this.devs.filter((dev) => dev.teamId === teamId);
    },

    dailyFilter(ids) {
      this.dailiesFiltered = this.dailys.filter((daily) => ids.includes(daily.authorId));
    },

    abrirResumo() {
      if (!this.dailiesFiltered.length) {
        this.$message.warning("Nenhuma daily encontrada para gerar o resumo!");
        return;
      }
      this.resumoTexto = this.dailiesFiltered
          .map((d) => {
            const dev = this.devs.find((x) => x.id === d.authorId);
            return `👤 ${dev ? dev.name : "Desconhecido"} (${d.date})\n- Ontem: ${
                d.lastDayLog
            }\n- Hoje: ${d.nextDayPlan}\n`;
          })
          .join("\n");
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
      return ArrowLeft;
    },
    ArrowRight() {
      return ArrowRight;
    },
    isLastDaily() {
      return this.currentIndex === this.dailiesFiltered.length - 1;
    },
    isFirstDaily() {
      return this.currentIndex === 0;
    },
  },
};
</script>

<style scoped>
/* (mantive exatamente seu CSS original) */
/* ... cole aqui todo o CSS do seu arquivo original (o mesmo que você já tem) ... */

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

/* ----------- Animações ----------- */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* ----------- Layout principal ----------- */
.app-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.main-layout {
  display: flex;
  flex: 1;
  padding: 1rem;
  gap: 1rem;
}
.sidebar {
  height: 80vh;
  flex: 0 0 220px;
  background: linear-gradient(180deg, #2c5364, #203a43, #0f2027);
  color: white;
  padding: 1rem;
  border-radius: 16px;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);
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

/* ----------- Filtros ----------- */
.filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1rem;
  gap: 1rem;
}
.filters-form {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}
.input-date,
.input-select {
  width: 250px;
  border-radius: 12px;
}
.btn-action {
  background: #2c5364;
  border: none;
  border-radius: 12px;
  padding: 0.6rem 1.2rem;
}

.btn-action:hover {
  cursor: pointer;
  color: #FFF;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.35);
  background-color: #294f5b;
}

/* ----------- Cards ----------- */
.card-container {
  background: #fff;
  border-radius: 20px;
  padding: 1rem;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  min-height: 0;
  max-height: 69vh;
  margin-top: 0.5rem;
}
.no-data {
  text-align: center;
  color: #666;
  padding: 2rem;
}
.card-scroll {
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}
.daily-item {
  background: #f7f7f7;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
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

/* ----------- Dialogs ----------- */
.daily-dialog .dialog-header,
.resumo-dialog .dialog-header {
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
}
.input-response {
  margin-top: 1rem;
}
.resumo-content {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 12px;
  max-height: 50vh;
  overflow-y: auto;
  white-space: pre-wrap;
  font-family: "Courier New", monospace;
  font-size: 0.95rem;
  line-height: 1.5;
}

/* ----------- Botões no modal ----------- */
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
}

/* ----------- Responsividade ----------- */
@media (max-width: 1024px) {
  .main-layout {
    flex-direction: column;
  }
  .sidebar {
    height: 5vh;
    flex-direction: row;
    flex: 0 0 auto;
    width: 90%;
    overflow-x: auto;
  }
  .sidebar ul {
    display: flex;
    gap: 1rem;
  }
}
@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
  }
  .filters-form {
    width: 100%;
  }
  .input-date,
  .input-select {
    width: 100%;
  }
  .card-scroll {
    grid-template-columns: 1fr;
  }
}
</style>
