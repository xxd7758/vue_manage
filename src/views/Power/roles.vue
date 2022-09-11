<template>
  <!--  角色列表 -->
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体部分  -->
    <el-card>
      <el-button
        type="primary"
        size="default"
        @click="addRolesDialogVisible = true"
        >添加角色</el-button
      >

      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="{ row, $index }">
            <!-- 一级权限 -->
            <el-row
              :gutter="20"
              class="bd_bottom vcenter"
              :class="{ bd_top: index1 == 0 }"
              v-for="(item1, index1) in row.children"
              :key="item1.id"
            >
              <el-col :span="6">
                <el-tag closable @close="deleteRoleRights(row, item1.id)">{{
                  item1.authName
                }}</el-tag>
              </el-col>
              <el-col :span="18">
                <!-- 二级权限 -->
                <el-row
                  v-for="(item2, index2) in item1.children"
                  class="vcenter"
                  :class="{ bd_top: index2 != 0 }"
                  :key="item2.id"
                >
                  <el-col :span="6"
                    ><el-tag
                      type="success"
                      closable
                      @close="deleteRoleRights(row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                  </el-col>
                  <el-col :span="18">
                    <!-- 三级权限 -->
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="deleteRoleRights(row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row, $index }">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRoles(row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRole(row)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="setRights(row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色 对话框-->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesDialogVisible"
      width="30%"
      @close="closeAddRole"
    >
      <el-form
        :model="addRoleForm"
        ref="addRoleFormRef"
        :rules="addRoleFormRules"
        label-width="80px"
        :inline="false"
        size="normal"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="addRolesDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAddRole">确定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色 对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRolesDialogVisible"
      width="30%"
      @closed="closeEditRole"
    >
      <el-form
        :model="roleInfo"
        label-width="80px"
        :rules="addRoleFormRules"
        ref="editRoleRef"
        :inline="false"
        size="normal"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限  对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="30%"
    >
      <span
        ><el-tree
          :data="rightsList"
          ref="treeRef"
          show-checkbox
          node-key="id"
          :props="defaultProps"
          default-expand-all
          :default-checked-keys="checkedArr"
        >
        </el-tree
      ></span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSetRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      rolesList: [],
      setRightDialogVisible: false, //分配权限 对话框
      rightsList: [], //树形权限列表
      //   树形控件配置对象
      defaultProps: { label: "authName", children: "children" },
      checkedArr: [], //树形选中权限
      roleId: 0, //选中角色id
      addRolesDialogVisible: false, //添加角色对话框
      addRoleForm: { roleName: "", roleDesc: "" },
      addRoleFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 2, max: 6, message: "长度2-6位", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { min: 3, max: 8, message: "长度3-8位", trigger: "blur" },
        ],
      },
      editRolesDialogVisible: false, //编辑角色对话框
      roleInfo: {}, //编辑角色信息
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      let { data: res } = await this.$http.get("/roles");
      //   console.log(res);
      if (res.meta.status != 200)
        return this.$message.error("getRolesList error");
      this.rolesList = res.data;
    },
    // 获取要全部三级权限  id
    getTreeRights(node, arr) {
      //   console.log(123);
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getTreeRights(item, arr);
      });
    },
    // 删除角色 指定权限 (tags)
    async deleteRoleRights(row, id) {
      //   console.log(row.id, id);
      let { data: res } = await this.$http.delete(
        `roles/${row.id}/rights/${id}`
      );
      if (res.meta.status != 200)
        return this.$message.error("deleteRoleRights error");
      this.getRolesList();
    },
    // 确认添加角色
    confirmAddRole() {
      this.$refs.addRoleFormRef.validate(async (valid) => {
        if (!valid) return;
        const { roleName, roleDesc } = this.addRoleForm;
        let { data: res } = await this.$http.post("roles", {
          roleName,
          roleDesc,
        });
        // console.log(res);
        if (res.meta.status != 201) return this.$message.error("添加角色 失败");
        this.getRolesList();
        this.addRolesDialogVisible = false;
        this.$message.success("添加角色成功");
      });
    },
    // 关闭 清空数据 校验
    closeAddRole() {
      this.$refs.addRoleFormRef.resetFields();
    },
    // 编辑角色
    editRoles(role) {
      this.roleInfo = role;
      // console.log(role);
      this.editRolesDialogVisible = true;
    },
    // 确认编辑角色
    confirmEditRoles() {
      this.$refs.editRoleRef.validate(async (valid) => {
        if (!valid) return;
        const { roleName, roleDesc } = this.roleInfo;
        let { data: res } = await this.$http.put(`roles/${this.roleInfo.id}`, {
          roleName,
          roleDesc,
        });
        // console.log(res);
        if (res.meta.status == 200) {
          this.getRolesList();
          this.editRolesDialogVisible = false;
          this.$message.success("修改角色成功");
        }
      });
    },
    //关闭 编辑角色
    closeEditRole() {
      this.$refs.editRoleRef.resetFields();
    },
    //删除角色
    deleteRole(row) {
      // console.log(row);
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let { data: res } = await this.$http.delete(`roles/${row.id}`);
          // console.log(res);
          if (res.meta.status !== 200) return this.$message.error("删除失败");
          this.$message.success("删除成功");
          this.getRolesList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 分配权限
    async setRights(row) {
      this.roleId = row.id;
      // row.id ----》表单渲染ID   roleID 角色Id
      // this.getRolesList();
      // let { data: result } = await this.$http.get(`roles/${row.id}`);
      // if (result.meta.status == 200) this.roleId = result.data.roleId;

      let { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status != 200)
        return this.$message.error("获取树形权限列表失败");
      this.rightsList = res.data;

      this.checkedArr = []; //清空
      this.getTreeRights(row, this.checkedArr);
      this.setRightDialogVisible = true;
    },
    // 确认 分配权限
    async confirmSetRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      console.log(keys);
      let { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: keys.join(","),
      });
      console.log(res);
      this.getRolesList();
      this.setRightDialogVisible = false;
    },
  },
};
</script>

<style scoped>
.vcenter {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 7px;
}
.bd_top {
  border-top: 1px solid #ccc;
}
.bd_bottom {
  border-bottom: 1px solid #ccc;
}
</style>