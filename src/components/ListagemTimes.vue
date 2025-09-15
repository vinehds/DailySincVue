<template>
  <section class="carousel-section">

    <el-carousel v-if="teams.length > 0" height="300px" type="card" interval="0" indicator-position="outside"
                 arrow="always" class="carousel">
      <el-carousel-item
          v-for="(team, index) in teams"
          :key="index"
          class="item-card"
      >
        <div class="card" @click="openEditModal(team)">
          <h3 class="team-name">{{ team.teamName }}</h3>
          <p class="team-description">{{ team.description }}</p>
        </div>
      </el-carousel-item>
    </el-carousel>

    <div v-if="teams.length === 0" style="color: #ffffff; font-weight: bold; text-align: center; margin: 50px">
      Nenhuma equipe cadastrada
    </div>

    <div class="add-team-container">
      <el-button
          class="add-team-button"
          @click="openAddModal"
      >
        + Adicionar Time
      </el-button>
    </div>

    <el-dialog
        v-model="editDialogVisible"
        :title="isAdding ? 'Adicionar Time' : 'Editar Time'"
        width="500px"
    >
      <el-form :model="editForm" label-width="120px">
        <el-form-item label="Nome do Time">
          <el-input v-model="editForm.teamName" />
        </el-form-item>

        <el-form-item label="Descrição">
          <el-input type="textarea" v-model="editForm.description" />
        </el-form-item>

        <el-form-item label="Membros">
          <div v-if="editForm.membersId && editForm.membersId.length > 0">
            <el-tag
                v-for="memberId in editForm.membersId"
                :key="memberId"
                type="info"
                class="member-tag"
            >
              {{ getMemberName(memberId) }}
            </el-tag>
          </div>
          <div v-else style="color: #999; font-style: italic;">
            Nenhum membro associado
          </div>
        </el-form-item>

      </el-form>

      <template #footer>
        <el-button @click="editDialogVisible = false">Cancelar</el-button>
        <el-button @click="deleteTeam(editForm.id)" color="red" v-if="!isAdding"
                   :disabled="editForm.membersId.length > 0" >Deletar</el-button>
        <el-button type="primary" @click="saveEdit">
          {{ isAdding ? 'Adicionar' : 'Salvar' }}
        </el-button>
      </template>
    </el-dialog>

  </section>
</template>

<script>
import api from "@/services/api"; // instância com interceptor de token

export default {
  data() {
    return {
      teams: [],
      allMembers: [],
      editDialogVisible: false,
      isAdding: false,
      editForm: {
        id: null,
        teamName: "",
        description: "",
        membersId: []
      }
    };
  },
  methods: {
    getMemberName(id) {
      const member = this.allMembers.find(m => m.id === id);
      return member ? member.name : "Desconhecido";
    },

    async deleteTeam(teamID) {
      try {
        await api.delete(`/teams/${teamID}`);
        this.editDialogVisible = false;
        await this.getTeams();
        this.$message.success("Time deletado com sucesso!");
      } catch (error) {
        console.error("Erro ao deletar Equipe:", error);
        const msg = error.response?.data?.message || error.message || "Erro ao deletar equipe";
        this.$message.error(msg);
      }
    },

    async getTeams() {
      try {
        const response = await api.get("/teams");
        this.teams = response.data || [];
      } catch (error) {
        console.error("Erro ao buscar equipes:", error);
        const msg = error.response?.data?.message || error.message || "Erro ao buscar equipes";
        this.$message.error(msg);
        this.teams = [];
      }
    },

    async getMembers() {
      try {
        const response = await api.get("/developers");
        this.allMembers = response.data || [];
      } catch (error) {
        console.error("Erro ao buscar membros:", error);
        const msg = error.response?.data?.message || error.message || "Erro ao buscar membros";
        this.$message.error(msg);
      }
    },

    openEditModal(team) {
      this.isAdding = false;
      this.editForm = { ...team };
      this.editDialogVisible = true;
    },

    openAddModal() {
      this.isAdding = true;
      this.editForm = { id: null, teamName: "", description: "", membersId: [] };
      this.editDialogVisible = true;
    },

    async saveEdit() {
      try {
        if (this.isAdding) {
          await api.post("/teams", this.editForm);
          this.$message.success("Time adicionado com sucesso!");
        } else {
          await api.put(`/teams/${this.editForm.id}`, this.editForm);
          this.$message.success("Time atualizado com sucesso!");
        }
        this.editDialogVisible = false;
        await this.getTeams();
      } catch (error) {
        console.error("Erro ao salvar:", error);
        const msg = error.response?.data?.message || error.message || "Erro ao salvar time";
        this.$message.error(msg);
      }
    }
  },
  mounted() {
    this.getTeams();
    this.getMembers();
  }
};
</script>

<style scoped>
.member-actions el-button {
  margin-left: 5px;
}

.add-team-container {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}

.add-team-button {
  width: 150px;
  height: 45px;
  border-radius: 18px;
  background: #294f5b;
  color: #FFF;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.add-team-button:hover {
  cursor: pointer;
  color: #FFF;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.35);
  background-color: #294f5b;
}

.carousel{
  background-color: #b7111100;
}

.carousel-section {
  width: 80%;
  max-width: 1200px;
  background: transparent !important;
}

.card {
  width: 200px;
  height: 260px;
  background: linear-gradient(180deg, #203a43, #2c5364);
  border-radius: 18px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
  color: #FFF;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease;
}
.card:hover {
  transform: translateY(-3px);
}

.team-name {
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: auto;
  margin-bottom: auto;
}

.team-description {
  font-size: 0.9rem;
  opacity: 0.85;
  margin-bottom: 8px;
  font-style: italic;
}

.item-card {
  background: transparent !important;
}

.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.topbar {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

.menu {
  border-bottom: none !important;
  display: flex;
  justify-content: center;
  font-size: 15px;
  font-weight: 500;
  background: linear-gradient(90deg, #0f2027, #203a43, #2c5364);
  border-radius: 18px;
  padding: 6px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  width: auto;
  min-width: 500px;
}

.item {
  border-radius: 12px;
  margin: 0 6px;
  padding: 0 18px !important;
  transition: all 0.3s ease;
}

.item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #00e0ff !important;
}

.carousel-section >>> .el-carousel__mask {
  background-color: transparent;
}

.carousel ::v-deep(.el-carousel__item) {
  background: transparent !important;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel ::v-deep(.el-carousel__card) {
  background: transparent !important;
}

.member-tag {
  margin: 3px;
}
</style>
