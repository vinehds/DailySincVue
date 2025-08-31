<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <el-button type="primary" size="small" @click="$emit('add-member')">
        + Adicionar Developer
      </el-button>
    </div>

    <ul class="member-list">
      <li v-for="member in members" :key="member.id" class="member-item">
        <span>{{ member.name }}</span>
        <div class="member-actions">
          <el-button type="success" size="mini" @click="$emit('edit-member', member)">Editar</el-button>
          <el-button type="danger" size="mini" @click="$emit('delete-member', member.id)">Excluir</el-button>
        </div>
      </li>
    </ul>
  </aside>
</template>

<script>
export default {
  name: "DeveloperSidebar",
  props: {
    members: {
      type: Array,
      required: true
    }
  }
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  background: linear-gradient(180deg, #203a43, #2c5364);
  color: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  margin-bottom: 20px;
}

.member-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.member-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 6px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}
</style>
