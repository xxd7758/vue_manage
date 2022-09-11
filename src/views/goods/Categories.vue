<template>
  <div>
    <!-- 商品分类 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <el-button type="primary" size="default" @click="addCategory"
        >添加分类</el-button
      >
      <tree-table
        class="treeTable"
        :data="categoryList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border
        index-text="#"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="{ row, $index }">
          <i
            class="el-icon-success"
            style="color: #90ee90"
            v-if="row.cat_deleted == false"
          ></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="rank" slot-scope="{ row, $index }">
          <el-tag v-if="row.cat_level == 0" size="normal">一级</el-tag>
          <el-tag v-if="row.cat_level == 1" type="success" size="normal"
            >二级</el-tag
          >
          <el-tag v-if="row.cat_level == 2" type="warning" size="normal"
            >三级</el-tag
          >
        </template>
        <!-- 操作 -->
        <template slot="operate" slot-scope="{ row, $index }">
          <el-button
            type="primary"
            size="mini"
            @click="editCategory(row)"
            icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            @click="deleteCategory(row)"
            icon="el-icon-edit"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="text-align: center"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类 对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCategoryVisible"
      width="30%"
      @close="closeAddCategory"
    >
      <el-form
        :model="addCategoryForm"
        ref="addCategoryFormRef"
        label-width="80px"
        :rules="addCategoryFormRule"
        :inline="false"
        size="normal"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCategoryForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            :options="cateList"
            v-model="selectedKeys"
            :props="{
              checkStrictly: true,
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
            }"
            @change="cateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="addCategoryVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAddCategory">确定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCategoryVisible"
      width="30%"
      @close="closeEditCategory"
    >
      <el-form
        :model="editCategoryForm"
        ref="editCategoryFormRef"
        :rules="addCategoryFormRule"
        label-width="80px"
        :inline="false"
        size="normal"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCategoryForm.cat_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="editCategoryVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCategory">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Categories",
  data() {
    return {
      // 商品分类数据
      categoryList: [],
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0, //总条数
      columns: [
        { label: "分类名称", prop: "cat_name" },
        {
          label: "是否有效",
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "rank",
        },
        {
          label: "操作",
          type: "template",
          template: "operate",
        },
      ],
      addCategoryVisible: false, //控制添加分类 对话框
      addCategoryForm: { cat_name: "", cat_pid: 0, cat_level: 0 },
      addCategoryFormRule: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 一级 二级 分类数据
      cateList: [],
      selectedKeys: [], //选中父级分类 id 数组
      editCategoryVisible: false, // 控制编辑分类对话框
      editCategoryForm: { cat_name: "", id: "" },
    };
  },
  created() {
    this.getCategoryList();
    this.getCateList();
  },
  methods: {
    //获取全部分类
    async getCategoryList() {
      let { data: res } = await this.$http.get("/categories", {
        params: this.queryInfo,
      });
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类失败");
      this.categoryList = res.data.result;
      this.total = res.data.total;
    },
    // 获取一级 二级分类
    async getCateList() {
      let { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取父级分类失败");
      // console.log(res.data);
      this.cateList = res.data;
    },
    // 添加分类
    addCategory() {
      this.addCategoryVisible = true;
    },
    // 级联选择器 数据变化
    cateChange() {
      console.log(this.selectedKeys);
      if (this.selectedKeys.length > 0) {
        this.addCategoryForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1];
        this.addCategoryForm.cat_level = this.selectedKeys.length;
      } else {
        this.addCategoryForm.cat_pid = 0;
        this.addCategoryForm.cat_level = 0;
      }
    },
    // 确定添加分类
    confirmAddCategory() {
      this.$refs.addCategoryFormRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return;

        let { data: res } = await this.$http.post(
          "categories",
          this.addCategoryForm
        );
        console.log(res);
        if (res.meta.status !== 201) return this.$message.error("添加失败");
        this.$message.success("添加成功");
        this.getCategoryList();
        this.getCateList();
        this.addCategoryVisible = false;
      });
    },
    // 关闭 添加分类 dialog
    closeAddCategory() {
      this.selectedKeys = [];
      this.addCategoryForm.cat_pid = 0;
      this.addCategoryForm.cat_level = 0;
      this.$refs.addCategoryFormRef.resetFields();
    },
    // 点击编辑按钮
    editCategory(row) {
      // console.log(row);
      this.editCategoryForm.cat_name = row.cat_name;
      this.editCategoryForm.id = row.cat_id;
      // console.log(this.editCategoryForm.cat_name);
      this.editCategoryVisible = true;
    },
    // 确认编辑分类
    confirmCategory() {
      this.$refs.editCategoryFormRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return;
        let { data: res } = await this.$http.put(
          `categories/${this.editCategoryForm.id}`,
          {
            cat_name: this.editCategoryForm.cat_name,
          }
        );
        console.log(res, this.editCategoryForm.cat_name);
        if (res.meta.status != 200) return this.$message.error("修改分类失败");
        this.getCategoryList();
        this.editCategoryVisible = false;
      });
    },
    // 关闭编辑分类
    closeEditCategory() {
      this.$refs.editCategoryFormRef.resetFields();
    },
    // 删除分类
    deleteCategory(row) {
      // console.log(row.cat_id);
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let { data: res } = await this.$http.delete(
            `categories/${row.cat_id}`
          );
          // console.log(res);
          if (res.meta.status !== 200) return this.$message.error("删除失败");
          this.getCategoryList();
          this.$message.success("删除成功");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 监听 当前页容量
    handleSizeChange(limit) {
      this.queryInfo.pagesize = limit;
      this.getCategoryList();
    },
    // 监听当前页 数据变化
    handleCurrentChange(page) {
      this.queryInfo.pagenum = page;
      this.getCategoryList();
    },
  },
};
</script>

<style scoped>
.treeTable {
  margin-top: 20px;
}
.el-cascader {
  width: 100%;
}
</style>