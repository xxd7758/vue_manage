<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8"
          ><el-input
            v-model="keyword"
            placeholder="请输入"
            size="normal"
            clearable
          >
            <el-button slot="append" icon="el-icon-search"></el-button
          ></el-input>
        </el-col>
        <el-col :span="4"
          ><el-button
            type="primary"
            size="default"
            @click="addDialogVisible = !addDialogVisible"
            >添加用户</el-button
          ></el-col
        >
      </el-row>
      <!-- 表格数据展示 -->
      <el-table :data="usersList" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column label="用户名" prop="username"> </el-table-column>
        <el-table-column label="电话" prop="mobile"> </el-table-column>
        <el-table-column label="邮箱" prop="email"> </el-table-column>
        <el-table-column label="角色" prop="role_name"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="{ row, $index }">
            <el-switch
              v-model="row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeUserState(row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row, $index }">
            <!-- 修改用户-->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editUser(row)"
            ></el-button>
            <!-- 删除用户 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(row)"
            ></el-button>
            <!-- 分配权限-->
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="assignRoles(row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="paramsInfo.pagenum"
        :page-size="paramsInfo.pagesize"
        :page-sizes="[1, 3, 5]"
        layout="total,sizes, prev, pager, next"
        :total="total"
        style="text-align: center"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      @closed="closeAddUser"
      :visible.sync="addDialogVisible"
      width="30%"
    >
      <el-form
        :model="addUserForm"
        ref="addUserRef"
        :rules="addUserRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="添加用户"
      @closed="closeEditUser"
      :visible.sync="editDialogVisible"
      width="30%"
    >
      <el-form
        :model="editUserForm"
        ref="editUserRef"
        :rules="addUserRules"
        label-width="100px"
      >
        <el-form-item label="用户名">
          <el-input disabled v-model="editUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="assignRolesDialogVisible"
      width="30%"
    >
      <p>当前用户: {{ userInfo.username }}</p>
      <p>当前的角色: {{ userInfo.role_name }}</p>
      <p>
        分配新角色:
        <el-select v-model="roleId" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAssignRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb();
      }
      cb(new Error("请输入合法的邮箱!"));
    };

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        // 合法的手机号
        return cb();
      }
      cb(new Error("请输入合法的手机号!"));
    };
    return {
      keyword: "",
      usersList: [],
      paramsInfo: {
        query: "", //查询参数可以为空
        pagenum: 1, //当前页码
        pagesize: 3, //每页显示条数
      },
      total: 0, //总条数
      addDialogVisible: false, //添加用户对话框显示/隐藏
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 添加用户校验规则
      addUserRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          { min: 3, max: 10, message: "长度在 3 到 10个字符", trigger: "blur" },
        ],
        email: [{ validator: checkEmail, trigger: "blur" }],
        mobile: [{ validator: checkMobile, trigger: "blur" }],
      },
      editDialogVisible: false, //修改用户对话框显示/隐藏
      // 修改用户 提交参数
      editUserForm: {
        id: "",
        email: "",
        mobile: "",
        rid: "",
        username: "",
      },
      //分配角色 的对话框
      assignRolesDialogVisible: false,
      // 当前用户信息
      userInfo: {},
      // 角色列表
      rolesList: [],
      roleId: "",
    };
  },
  created() {
    this.getUsersList();
    this.getRolesList();
  },
  methods: {
    // 获取用户列表
    async getUsersList() {
      let { data: res } = await this.$http.get("users", {
        params: this.paramsInfo,
      });
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("getUsersList error");
      this.usersList = res.data.users;
      this.total = res.data.total;
    },
    // 更改用户状态
    async changeUserState(row) {
      let { data: res } = await this.$http.put(
        `users/${row.id}/state/${row.mg_state}`
      );

      if (res.meta.status !== 200)
        return this.$message.error("changeUserState error");
      this.$message.success("更新用户状态成功");
    },
    // 修改页容量
    handleSizeChange(limit) {
      // console.log(limit);
      this.paramsInfo.pagesize = limit;
      this.getUsersList();
    },
    // 修改当前页
    handleCurrentChange(page) {
      // console.log(page);
      this.paramsInfo.pagenum = page;
      this.getUsersList();
    },
    //确认 添加用户
    confirmAddUser() {
      this.$refs.addUserRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return;
        const { username, password, email, mobile } = this.addUserForm;
        let { data: res } = await this.$http.post("users", {
          username,
          password,
          email,
          mobile,
        });
        if (res.meta.status !== 201)
          return this.$message.error("confirmAddUser error");
        this.getUsersList();
        this.$message.success(res.meta.msg);
        // console.log(res);
        this.addDialogVisible = false;
      });
    },
    // 关闭 添加用户
    closeAddUser() {
      this.$refs.addUserRef.resetFields();
    },
    // 编辑用户
    async editUser(row) {
      let { data: res } = await this.$http.get(`users/${row.id}`);
      console.log(res);
      if (res.meta.status == 200) {
        this.editUserForm = res.data;
        this.editDialogVisible = true;
      }
    },
    //关闭 编辑用户
    closeEditUser() {
      this.$refs.editUserRef.resetFields();
    },
    // 确认 更新用户
    confirmEditUser() {
      this.$refs.editUserRef.validate(async (valid) => {
        if (!valid) return;
        const { email, mobile } = this.editUserForm;
        let { data: res } = await this.$http.put(
          `users/${this.editUserForm.id}`,
          {
            email,
            mobile,
          }
        );
        // console.log(res);
        if (res.meta.status != 200)
          return this.$message.error("confirmEditUser");
        this.$message.success(res.meta.msg);
        this.editUserForm = res.data;
        this.getUsersList();
        this.editDialogVisible = false;
      });
    },
    // 删除用户
    async deleteUser(row) {
      let confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // console.log(confirmResult);
      if (confirmResult == "cancel") return this.$message.info("取消删除");
      // console.log(row);
      let { data: res } = await this.$http.delete(`users/${row.id}`);
      // console.log(res);
      if (res.meta.status != 200) return this.$message.error("删除失败");
      this.getUsersList();
      this.$message.success("删除成功");
    },
    // 分配角色
    assignRoles(userInfo) {
      // console.log(userInfo);
      this.userInfo = userInfo;
      this.assignRolesDialogVisible = true;
    },
    // 确认分配角色
    async confirmAssignRoles() {
      let { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.roleId,
        }
      );
      console.log(res);
      if (res.meta.status == 200) {
        this.getUsersList();
        this.assignRolesDialogVisible = false;
      }
    },
    // 获取角色列表
    async getRolesList() {
      let { data: res } = await this.$http.get("roles");

      if (res.meta.status == 200) this.rolesList = res.data;
    },
  },
};
</script>

<style>
</style>