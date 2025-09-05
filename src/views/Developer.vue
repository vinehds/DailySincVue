<template>
  <section class="developers-section">
    <!-- Título -->
    <h2 class="page-title">Gerenciamento de Desenvolvedores</h2>

    <!-- Tabela -->
    <el-table
        v-if="developers.length > 0"
        :data="developers"
        border
        stripe
        class="dev-table"
    >
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="name" label="Nome" min-width="180" />
      <el-table-column prop="department" label="Departamento" min-width="140" />
      <el-table-column prop="responsability" label="Responsabilidade" min-width="140" />
      <el-table-column prop="teamId" label="Team ID" width="100" />
      <el-table-column
          prop="dailiesId"
          label="Dailies"
          min-width="160"
          :formatter="(row) => row.dailiesId.join(', ')"
      />
      <el-table-column label="Ações" width="180">
        <template #default="scope">
          <el-button
              size="small"
              type="primary"
              @click="openEditModal(scope.row)"
          >Editar</el-button>
          <el-button
              size="small"
              type="danger"
              @click="deleteDeveloper(scope.row.id)"
          >Excluir</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Caso não tenha desenvolvedores -->
    <div v-else class="empty-message">
      Nenhum desenvolvedor cadastrado
    </div>

    <!-- Botão para adicionar -->
    <div class="add-dev-container">
      <el-button type="success" @click="openAddModal">
        + Adicionar Desenvolvedor
      </el-button>
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

        <el-form-item label="Departamento">
          <el-input v-model="editForm.department" />
        </el-form-item>

        <el-form-item label="Responsabilidade">
          <el-select v-model="editForm.responsability" placeholder="Selecione">
            <el-option label="MEMBER" value="MEMBER" />
            <el-option label="LEADER" value="LEADER" />
            <el-option label="MANAGER" value="MANAGER" />
          </el-select>
        </el-form-item>

        <el-form-item label="Equipe (teamId)">
          <el-input-number v-model="editForm.teamId" :min="1" />
        </el-form-item>

        <el-form-item label="Dailies (IDs)">
          <el-select v-model="editForm.dailiesId" multiple placeholder="Selecione os IDs">
            <el-option
                v-for="id in availableDailies"
                :key="id"
                :label="`Daily ${id}`"
                :value="id"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="editDialogVisible = false">Cancelar</el-button>
        <el-button v-if="!isAdding" type="danger" @click="deleteDeveloper(editForm.id)">Excluir</el-button>
        <el-button type="primary" @click="saveEdit">
          {{ isAdding ? 'Adicionar' : 'Salvar' }}
        </el-button>
      </template>
    </el-dialog>
  </section>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      URL_API: "http://localhost:8080",
      developers: [],
      availableDailies: [1, 2, 3, 4, 5],
      editDialogVisible: false,
      isAdding: false,
      editForm: {
        id: null,
        name: "",
        teamId: null,
        dailiesId: [],
        department: "",
        responsability: "MEMBER"
      }
    };
  },
  methods: {
    async getDevelopers() {
      try {
        const response = await axios.get(`${this.URL_API}/developers`);
        this.developers = response.data || [];
      } catch (error) {
        console.error("Erro ao buscar desenvolvedores:", error);
        this.developers = [];
      }
    },

    async saveEdit() {
      try {
        if (this.isAdding) {
          await axios.post(`${this.URL_API}/developers`, this.editForm);
          this.$message.success("Desenvolvedor adicionado com sucesso!");
        } else {
          await axios.put(`${this.URL_API}/developers/${this.editForm.id}`, this.editForm);
          this.$message.success("Desenvolvedor atualizado com sucesso!");
        }
        this.editDialogVisible = false;
        await this.getDevelopers();
      } catch (error) {
        console.error("Erro ao salvar:", error);
        this.$message.error("Erro ao salvar desenvolvedor");
      }
    },

    async deleteDeveloper(id) {
      try {
        await axios.delete(`${this.URL_API}/developers/${id}`);
        this.$message.success("Desenvolvedor deletado com sucesso!");
        await this.getDevelopers();
        this.editDialogVisible = false;
      } catch (error) {
        console.error("Erro ao deletar desenvolvedor:", error);
        this.$message.error("Erro ao deletar");
      }
    },

    openAddModal() {
      this.isAdding = true;
      this.editForm = { id: null, name: "", teamId: null, dailiesId: [], department: "", responsability: "MEMBER" };
      this.editDialogVisible = true;
    },

    openEditModal(dev) {
      this.isAdding = false;
      this.editForm = { ...dev };
      this.editDialogVisible = true;
    }
  },
  mounted() {
    this.getDevelopers();
  }
};
</script>

<style scoped>
.page-title {
  color: #ffffff;
  text-align: center;
  margin-bottom: 20px;
}

.dev-table {
  width: 90%;
  margin: 0 auto 20px auto;
  border-radius: 12px;
  overflow: hidden;
  font-family: "Inter", sans-serif;
  background-color: #fff; /* fundo clean */
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1); /* sombra suave */
}

/* Cabeçalho mais destacado */
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

.add-dev-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
