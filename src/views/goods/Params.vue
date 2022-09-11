<template>
  <div>
    <!-- 分类参数 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体 -->
    <el-card>
      <!-- 提示文字 -->
      <el-alert
        title="注意只能选择最后一级分类作为参数值"
        type="warning"
        :closable="false"
        show-icon
      ></el-alert>
      <!-- 选择 商品分类 -->
      <div class="cate_choose">
        选择商品分类:
        <el-cascader
          :options="categoryList"
          v-model="selectedCate"
          :props="{ label: 'cat_name', value: 'cat_id' }"
          @change="handleChange"
        ></el-cascader>
      </div>
      <!-- 内容区 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="selectedCate.length == 0"
            size="mini"
            @click="dialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="{ row, $index }">
                <el-tag
                  v-if="row.attr_vals != ''"
                  type="primary"
                  size="normal"
                  closable
                  @close=""
                  >{{ row.attr_vals }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{ row, $index }">
                <!-- 修改 -->
                <el-button
                  type="primary"
                  size="mini"
                  @click="editParams(row)"
                  icon="el-icon-edit"
                  >修改</el-button
                >
                <!-- 删除 -->
                <el-button
                  type="danger"
                  size="mini"
                  @click="deleteParmas(row)"
                  icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="selectedCate.length == 0"
            size="mini"
            @click="dialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="{ row, $index }">
                <el-tag
                  v-if="row.attr_vals != ''"
                  type="primary"
                  size="normal"
                  closable
                  @close=""
                  >{{ row.attr_vals }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{ row, $index }">
                <!-- 修改 -->
                <el-button
                  type="primary"
                  size="mini"
                  @click="editParams(row)"
                  icon="el-icon-edit"
                  >修改</el-button
                >
                <!-- 删除 -->
                <el-button
                  type="danger"
                  size="mini"
                  @click="deleteParmas(row)"
                  icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      @close="addClosed"
    >
      <el-form
        :model="paramsForm"
        :rules="paramsRule"
        ref="paramsRef"
        label-width="80px"
        :inline="false"
        size="normal"
      >
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="paramsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addConfirm">确认</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数 对话框 -->
    <el-dialog
      :title="'修改' + dialogTitle"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editDialogForm"
        :rules="paramsRule"
        ref="editDialogRef"
        label-width="80px"
        :inline="false"
        size="normal"
      >
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="editDialogForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editConfirm">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Params",
  data() {
    return {
      categoryList: [], //商品分类数据
      selectedCate: [], //选择 商品分类Id
      activeName: "many", //默认 激活页签
      manyTableData: [], // 动态参数数据
      onlyTableData: [], // 静态数据数据
      dialogVisible: false, //添加 对话框
      paramsForm: { attr_name: "" }, //保存添加 参数
      paramsRule: {
        attr_name: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },
      editDialogVisible: false, //编辑对话框
      editDialogForm: { attr_name: "", cat_id: "", attr_id: "", attr_sel: "" }, //保存修改 参数 对象
    };
  },
  created() {
    this.getCategoryList();
  },
  methods: {
    // 获取分类数据
    async getCategoryList() {
      let { data: res } = await this.$http.get("categories");
      // console.log(res);
      if (res.meta.status != 200)
        return this.$message.error("获取分类数据失败");
      this.categoryList = res.data;
    },
    // tabs 切换
    handleClick() {
      // console.log(this.activeName);
      if (this.selectedCate.length != 0) {
        this.getParamsData();
      }
    },
    //选中分类 数据
    handleChange() {
      this.getParamsData();
    },
    // 获取参数列表数据
    async getParamsData() {
      const cat_id = this.selectedCate[this.selectedCate.length - 1];
      let { data: res } = await this.$http.get(
        `categories/${cat_id}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );
      // console.log(res);
      if (res.meta.status != 200)
        return this.$message.error("获取参数列表失败");
      // 数据分别存储
      if (this.activeName == "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    // 确认添加
    addConfirm() {
      this.$refs.paramsRef.validate(async (valid) => {
        if (!valid) return;
        const cat_id = this.selectedCate[this.selectedCate.length - 1];
        let { data: res } = await this.$http.post(
          `categories/${cat_id}/attributes`,
          {
            attr_name: this.paramsForm.attr_name,
            attr_sel: this.activeName,
          }
        );

        // console.log(res);
        if (res.meta.status !== 201)
          return this.$message.error("添加分类数据失败");
        this.getParamsData();
        this.dialogVisible = false;
      });
    },
    // 关闭 添加对话框
    addClosed() {
      this.$refs.paramsRef.resetFields();
    },
    // 编辑 参数
    editParams(row) {
      // console.log(row);
      this.editDialogForm = row;
      this.editDialogVisible = true;
    },
    // 确认修改对话框
    editConfirm() {
      this.$refs.editDialogRef.validate(async (valid) => {
        if (!valid) return;
        const { attr_name, cat_id, attr_id, attr_sel } = this.editDialogForm;
        // console.log(attr_sel);
        let { data: res } = await this.$http.put(
          `categories/${cat_id}/attributes/${attr_id}`,
          { attr_name, attr_sel }
        );
        if (res.meta.status != 200)
          return this.$message.error("修改分类参数失败");
        // console.log(res);
        this.$message.success("修改成功");
        this.getParamsData();
        this.editDialogVisible = false;
      });
    },
    // 关闭修改对话框
    editDialogClosed() {
      this.$refs.editDialogRef.resetFields();
    },
    deleteParmas(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // console.log(row);
          let { data: res } = await this.$http.delete(
            `categories/${row.cat_id}/attributes/${row.attr_id}`
          );
          // console.log(res);
          if (res.meta.status != 200)
            return this.$message.error("删除分类失败");
          this.getParamsData();
          this.$message.success("删除分类数据成功");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  computed: {
    // 动态 计算 对话框标题
    dialogTitle() {
      return this.activeName == "many" ? "动态参数" : "静态属性";
    },
  },
};
</script>

<style scoped>
.cate_choose {
  margin: 20px;
}
</style>