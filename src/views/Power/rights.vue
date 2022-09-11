<template>
  <!-- 权限列表 -->
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 权限列表数据 -->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="{ row, $index }">
            <el-tag v-if="row.level == 0">一级</el-tag>
            <el-tag v-else-if="row.level == 1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Rights",
  data() {
    return {
      rightsList: [],
    };
  },
  created() {
    this.getRightList();
  },
  methods: {
    async getRightList() {
      let { data: res } = await this.$http.get(`rights/list`);
      // console.log(res);
      if (res.meta.status != 200)
        return this.$message.error("getRightList error");
      this.rightsList = res.data;
    },
  },
};
</script>

<style>
</style>