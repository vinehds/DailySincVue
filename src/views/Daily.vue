<template>
  <el-container class="dev-daily-container">
    <div class="dev-daily-layout">
      <!-- Formulário para escrever daily -->
      <section class="form-section">
        <h2>📌 Registrar Daily</h2>
        <el-form :model="dailyForm" label-position="top" class="daily-form">
          <el-form-item label="Ontem">
            <el-input
                type="textarea"
                v-model="dailyForm.lastDayLog"
                placeholder="O que você fez ontem?"
                rows="3"
            />
          </el-form-item>
          <el-form-item label="Hoje">
            <el-input
                type="textarea"
                v-model="dailyForm.nextDayPlan"
                placeholder="O que você vai fazer hoje?"
                rows="3"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="enviarDaily">Enviar</el-button>
            <el-button type="warning" @click="resetForm">Limpar</el-button>
          </el-form-item>
        </el-form>
      </section>

      <!-- Filtro e lista de dailies -->
      <section class="list-section">
        <h2>📖 Minhas Dailies</h2>
        <div class="filter-bar">
          <el-date-picker
              v-model="selectedDate"
              type="date"
              placeholder="Filtrar por data"
              format="DD/MM/YYYY"
              @change="buscarMinhasDailies"
          />
        </div>

        <div v-if="myDailies.length === 0" class="no-data">
          Nenhuma daily encontrada
        </div>
        <div v-else class="daily-list">
          <article
              v-for="daily in myDailies"
              :key="daily.id"
              class="daily-card"
          >
            <header class="daily-header">
              <span>{{ daily.date }}</span>
            </header>
            <p><b>Ontem:</b> {{ daily.lastDayLog }}</p>
            <p><b>Hoje:</b> {{ daily.nextDayPlan }}</p>
          </article>
        </div>
      </section>
    </div>
  </el-container>
</template>

<script>
import api from "@/services/api";
import { useAuthStore } from "@/stores/auth";

export default {
  data() {
    return {
      dailyForm: {
        lastDayLog: "",
        nextDayPlan: "",
      },
      selectedDate: null,
      myDailies: [],
    };
  },
  methods: {
    async enviarDaily() {
      const auth = useAuthStore();
      if (!auth.user) {
        this.$message.error("Usuário não autenticado!");
        return;
      }

      if (!this.dailyForm.lastDayLog || !this.dailyForm.nextDayPlan) {
        this.$message.warning("Preencha os campos antes de enviar!");
        return;
      }

      try {
        const payload = {
          authorId: auth.user.id,
          authorName: auth.user.name,
          date: new Date().toISOString().split("T")[0], // yyyy-MM-dd
          lastDayLog: this.dailyForm.lastDayLog,
          nextDayPlan: this.dailyForm.nextDayPlan,
        };

        await api.post("/dailies", payload);

        this.$message.success("Daily registrada com sucesso!");
        this.resetForm();
        this.buscarMinhasDailies();
      } catch (error) {
        console.error("Erro ao enviar daily:", error);
        this.$message.error("Erro ao registrar daily!");
      }
    },

    async buscarMinhasDailies() {
      const auth = useAuthStore();
      if (!auth.user) return;

      if (!this.selectedDate) {
        this.$message.warning("Selecione uma data!");
        return;
      }

      try {
        const formattedDate = this.formatDateToDDMMYYYY(new Date(this.selectedDate));
        const resp = await api.get(`/dailies/byDate?date=${formattedDate}`);

        // filtra apenas as dailies do usuário logado
        this.myDailies = (resp.data || []).filter(
            (d) => d.authorId === auth.user.id
        );
      } catch (error) {
        console.error("Erro ao buscar minhas dailies:", error);
        this.$message.error("Erro ao buscar suas dailies!");
      }
    },

    resetForm() {
      this.dailyForm.lastDayLog = "";
      this.dailyForm.nextDayPlan = "";
    },

    formatDateToDDMMYYYY(date) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },
  },
};
</script>

<style scoped>
.dev-daily-container {
  width: 100%;
  min-height: 100vh;
  padding: 1.5rem;
  background: #f0f2f5;
}

.dev-daily-layout {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

.form-section,
.list-section {
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.daily-form {
  margin-top: 1rem;
}

.filter-bar {
  margin-bottom: 1rem;
}

.daily-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.daily-card {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.daily-header {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2c5364;
}

.no-data {
  color: #666;
  text-align: center;
  padding: 2rem;
}

@media (max-width: 900px) {
  .dev-daily-layout {
    grid-template-columns: 1fr;
  }
}
</style>
