<template>
  <section class="developers-section">
    <!-- Título -->
    <h2 class="page-title">Gerenciamento de Desenvolvedores</h2>

    <!-- Barra de ações -->
    <div class="actions-container">
      <!-- Filtro por time -->
      <el-select
          v-model="selectedTeamId"
          placeholder="Filtrar por time"
          clearable
          class="team-filter"
      >
        <el-option label="Sem time" value="no-team" />
        <el-option
            v-for="team in teams"
            :key="team.id"
            :label="team.teamName"
            :value="team.id"
        />
      </el-select>

      <!-- Botão para adicionar -->
      <el-button class="btnAdd" type="success" @click="openAddModal">
        + Adicionar Desenvolvedor
      </el-button>
    </div>

    <!-- Tabela -->
    <el-table
        v-if="filteredDevelopers.length > 0"
        :data="paginatedDevelopers"
        border
        stripe
        class="dev-table"
    >
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="name" label="Nome" min-width="180" />
      <el-table-column prop="email" label="Email" min-width="180" />
      <el-table-column prop="department" label="Departamento" min-width="140" />
      <el-table-column
          prop="userRole"
          label="Nível de Acesso"
          min-width="140"
      />

      <!-- Exibe o nome do time -->
      <el-table-column label="Time" min-width="160">
        <template #default="scope">
          {{ getTeamName(scope.row.teamId) }}
        </template>
      </el-table-column>

      <el-table-column label="Ações" width="180">
        <template #default="scope">
          <el-button
              size="small"
              type="primary"
              @click="openEditModal(scope.row)"
          >Editar</el-button
          >
          <el-button
              size="small"
              type="danger"
              @click="deleteDeveloper(scope.row.id)"
          >Excluir</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- Paginação -->
    <div class="pagination" v-if="filteredDevelopers.length > pageSize">
      <el-pagination
          background
          layout="prev, pager, next"
          :total="filteredDevelopers.length"
          :page-size="pageSize"
          style="justify-content: center"
          v-model:current-page="currentPage"
      />
    </div>

    <!-- Caso não tenha desenvolvedores -->
    <div v-if="filteredDevelopers.length === 0" class="empty-message">
      Nenhum desenvolvedor encontrado
    </div>

    <!-- Modal de Adição/Edição -->
    <el-dialog
        v-model="editDialogVisible"
        :title="isAdding ? 'Adicionar Desenvolvedor' : 'Editar Desenvolvedor'"
        width="500px"
    >
      <el-form :model="editForm" label-width="140px">
        <el-form-item label="Nome">
          <el-input v-model="editForm.name" />
        </el-form-item>

        <el-form-item label="Email">
          <el-input v-model="editForm.email" />
        </el-form-item>

        <el-form-item label="Departamento">
          <el-select v-model="editForm.department" placeholder="Selecione">
            <el-option label="WEB_DEVELOPER" value="WEB_DEVELOPER" />
            <el-option label="DESK_DEVELOPER" value="DESK_DEVELOPER" />
            <el-option label="OTHER" value="OTHER" />
          </el-select>
        </el-form-item>

        <el-form-item label="Responsabilidade">
          <el-select v-model="editForm.userRole" placeholder="Selecione">
            <el-option label="MEMBER" value="MEMBER" />
            <el-option label="TECHLEAD" value="TECHLEAD" />
            <el-option label="ADMIN" value="ADMIN" />
          </el-select>
        </el-form-item>

        <!-- Seleção dinâmica do time -->
        <el-form-item label="Equipe">
          <el-select v-model="editForm.teamId" placeholder="Selecione o time">
            <el-option
                v-for="team in teams"
                :key="team.id"
                :label="team.teamName"
                :value="team.id"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="editDialogVisible = false">Cancelar</el-button>
        <el-button
            v-if="!isAdding"
            type="danger"
            @click="deleteDeveloper(editForm.id)"
        >Excluir</el-button
        >
        <el-button type="primary" @click="saveEdit">
          {{ isAdding ? "Adicionar" : "Salvar" }}
        </el-button>
      </template>
    </el-dialog>
  </section>
</template>

<script>
import api from "@/services/api"; // usa a instância já configurada com interceptors

export default {
  data() {
    return {
      developers: [],
      teams: [],
      editDialogVisible: false,
      isAdding: false,
      editForm: {
        id: null,
        name: "",
        email: "",
        teamId: null,
        department: "",
        userRole: "",
      },
      // paginação
      currentPage: 1,
      pageSize: 5,
      tableHeight: 300,
      selectedTeamId: null,
    };
  },
  computed: {
    filteredDevelopers() {
      if (this.selectedTeamId === null) {
        return this.developers;
      } else if (this.selectedTeamId === "no-team") {
        return this.developers.filter((dev) => !dev.teamId);
      } else {
        return this.developers.filter((dev) => dev.teamId === this.selectedTeamId);
      }
    }
    ,
    paginatedDevelopers() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredDevelopers.slice(start, start + this.pageSize);
    },
  },
  methods: {
    async getDevelopers() {
      try {
        const response = await api.get("/developers");
        this.developers = response.data || [];
      } catch (error) {
        console.error("Erro ao buscar desenvolvedores:", error);
        const msg =
            error.response?.data?.message ||
            error.message ||
            "Erro ao buscar desenvolvedores";
        this.$message.error(msg);
        this.developers = [];
      }
    },

    async getTeams() {
      try {
        const response = await api.get("/teams");
        this.teams = response.data || [];
      } catch (error) {
        console.error("Erro ao buscar times:", error);
        const msg =
            error.response?.data?.message || error.message || "Erro ao buscar times";
        this.$message.error(msg);
        this.teams = [];
      }
    },

    getTeamName(teamId) {
      const team = this.teams.find((t) => t.id === teamId);
      return team ? team.teamName : "Sem time";
    },

    async saveEdit() {
      try {
        if (this.isAdding) {
          await api.post("/developers", this.editForm);
          this.$message.success("Desenvolvedor adicionado com sucesso!");
        } else {
          await api.put(`/developers/${this.editForm.id}`, this.editForm);
          this.$message.success("Desenvolvedor atualizado com sucesso!");
        }
        this.editDialogVisible = false;
        await this.getDevelopers();
      } catch (error) {
        console.error("Erro ao salvar:", error);
        const msg =
            error.response?.data?.message || error.message || "Erro ao salvar";
        this.$message.error(msg);
      }
    },

    async deleteDeveloper(id) {
      this.$confirm("Deseja realmente excluir esse cadastro?").then(
          async () => {
            try {
              await api.delete(`/developers/${id}`);
              this.$message.success("Desenvolvedor deletado com sucesso!");
              await this.getDevelopers();
              this.editDialogVisible = false;
            } catch (error) {
              console.error("Erro ao deletar desenvolvedor:", error);
              const msg =
                  error.response?.data?.message || error.message || "Erro ao deletar";
              this.$message.error(msg);
            }
          }
      );
    },

    openAddModal() {
      this.isAdding = true;
      this.editForm = {
        id: null,
        name: "",
        email: "",
        teamId: null,
        department: "",
        userRole: "",
      };
      this.editDialogVisible = true;
    },

    openEditModal(dev) {
      this.isAdding = false;
      this.editForm = { ...dev };
      this.editDialogVisible = true;
    },

    adjustTableForScreen() {
      const screenHeight = window.innerHeight;
      if (screenHeight >= 1080) {
        this.pageSize = 10;
        this.tableHeight = 500;
      } else {
        this.pageSize = 5;
        this.tableHeight = 300;
      }
    },
  },
  mounted() {
    this.getDevelopers();
    this.getTeams();
    this.adjustTableForScreen();
    window.addEventListener("resize", this.adjustTableForScreen);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.adjustTableForScreen);
  },
};
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: hidden;
}
.page-title {
  color: #ffffff;
  text-align: center;
  margin-top: 50px;
}

.actions-container {
  margin: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 93%;
}

.team-filter {
  min-width: 200px;
  max-width: 300px;
  margin-top: 20px;
  margin-left: 50px;
}

.dev-table {
  width: 90%;
  margin: 0 auto 20px auto;
  border-radius: 10px;
  background-color: #8f8f8f;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  border-style: none;
}

:deep(.el-table__header-wrapper th) {
  background: linear-gradient(180deg, #203a43, #2c5364);
  color: #fff;
  font-weight: 600;
  font-size: 0.95rem;
}

/* Linhas com efeito hover */
:deep(.el-table__row:hover) {
  background-color: rgba(41, 79, 91, 0.08);
  transition: background-color 0.25s ease;
}

/* Botões da tabela */
:deep(.el-button--primary) {
  background-color: #294f5b;
  border: none;
}
:deep(.el-button--primary:hover) {
  background-color: #203a43;
}
:deep(.el-button--danger) {
  background-color: #c0392b;
  border: none;
}
:deep(.el-button--danger:hover) {
  background-color: #962d22;
}

.empty-message {
  text-align: center;
  color: #ffffff;
  font-weight: bold;
  margin: 50px 0;
}

:deep(.el-pagination.is-background .el-pager li.is-active) {
  background-color: #294f5b !important;
  color: #fff !important;
  border-color: #294f5b !important;
}

.btnAdd {
  margin-bottom: -25px;
}
</style>
