<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home', name: '' }"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 提示文字 -->
      <el-alert
        show-icon
        title="添加商品信息 "
        type="info"
        center
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :active="active * 1" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tabs -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- before-leave 阻止标签页的切换 -->
        <el-tabs
          v-model="active"
          tab-position="left"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" size="normal" prop="goods_name">
              <el-input
                v-model="addForm.goods_name"
                placeholder=""
                size="normal"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="商品价格" size="normal" prop="goods_price">
              <el-input
                v-model="addForm.goods_price"
                placeholder=""
                type="number"
                size="normal"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" size="normal" prop="goods_number">
              <el-input
                v-model="addForm.goods_number"
                type="number"
                placeholder=""
                size="normal"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" size="normal" prop="goods_weight">
              <el-input
                v-model="addForm.goods_weight"
                placeholder=""
                type="number"
                size="normal"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" size="normal" prop="good_cat">
              <el-cascader
                v-model="checkedKeys"
                :options="categoryList"
                :props="{ label: 'cat_name', value: 'cat_id' }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              size="normal"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  class="checkbox_mar"
                  border
                  :label="item2"
                  v-for="(item2, i) in item.attr_vals"
                  :key="i"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              size="normal"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input
                v-model="item.attr_vals"
                size="normal"
                clearable
                @change=""
              ></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="header_token"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"> </quill-editor>
            <!-- 添加商品按钮 -->
            <br />
            <el-button type="primary" size="default" @click="addGoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- img预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="imgVisible"
      width="50%"
      @close=""
    >
      <img :src="img_url" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Add",
  data() {
    return {
      active: "0", //steps labs 的步骤结点
      //添加商品信息对象
      addForm: {
        goods_name: "", //商品名称
        goods_price: "", //商品价格
        goods_number: "", //商品数量
        goods_weight: "", //商品重量
        goods_cat: [], //商品分类
        pics: [], //图片临时路径
        goods_introduce: "", //商品描述 介绍
        attrs: [], //参数 属性数组对象
      },
      // 校验规则
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品总量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      // 分类数据
      categoryList: [],
      checkedKeys: [], //选中的分类 路径id 数组
      manyTableData: [], //参数列表数据
      onlyTableData: [], //属性列表数据
      uploadUrl: "http://127.0.0.1:8888/api/private/v1/upload",
      // 为upload 请求 配置token 请求头
      header_token: { Authorization: window.sessionStorage.getItem("token") },
      img_url: "", //图片在线地址
      imgVisible: false, //图片预览对话框
    };
  },
  created() {
    this.getCategoryList();
  },
  methods: {
    // 获取全部商品分类数据
    async getCategoryList() {
      let { data: res } = await this.$http.get("categories");
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取分类数据失败");
      this.categoryList = res.data;
    },
    // 级联选择器 选中项变化 触发
    handleChange() {
      // console.log(13);
    },
    // 切换标签 时 添加跳转验证
    beforeTabLeave(activeName, oldActiveName) {
      // console.log(activeName, oldActiveName);
      if (oldActiveName == 0 && this.checkedKeys.length === 0) {
        // console.log(123);
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    // 点击切换tabs 时触发
    async tabClicked() {
      // 访问动态参数 面板 step2
      if (this.active == "1") {
        let { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" },
          }
        );
        // console.log(res);
        if (res.meta.status != 200)
          return this.$message.error("获取参数列表失败");
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length == 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyTableData = res.data;
      }
      // 访问静态属性  step3
      else if (this.active == "2") {
        let { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" },
          }
        );
        if (res.meta.status != 200)
          return this.$message.error("获取属性列表失败");
        this.onlyTableData = res.data;
      }
    },
    handlePreview(file) {
      // console.log(file);
      const img_url = file.response.data.url;
      // console.log(img_url);
      this.img_url = img_url;
      this.imgVisible = true;
    },
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      // const i = this.addForm.pics.findIndex((item) => item.pic == filePath);
      // this.addForm.pics.splice(i, 1);
      this.addForm.pics = this.addForm.pics.filter(
        (item) => item.pic !== filePath
      );
    },
    // 图片上传成功
    handleSuccess(response) {
      console.log(response);
      // if(response.meta.status!=200) return this.$message.error()
      this.$message.success("图片上传成功");
      const picInfo = { pic: response.data.tmp_path };
      this.addForm.pics.push(picInfo);
    },
    // 添加商品
    addGoods() {
      this.$refs.addFormRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return this.$message.error("请添加必要的表单项");
        // 整理参数
        // 分类id 数组转换成 ‘，’ 拼接字符串
        this.addForm.goods_cat = this.checkedKeys.join(",");
        // this.$http.post("goods", {});
        // 处理动态参数
        this.addForm.attrs = [];
        this.manyTableData.forEach((item) => {
          const newData = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          };
          this.addForm.attrs.push(newData);
        });
        //处理静态属性
        this.onlyTableData.forEach((item) => {
          const newData = { attr_id: item.attr_id, attr_value: item.attr_vals };
          this.addForm.attrs.push(newData);
        });
        const { data: res } = await this.$http.post("goods", this.addForm);
        console.log(res);
        if (res.meta.status !== 201) return this.$message.error("添加商品失败");
        this.$message.success("添加商品成功");
      });
    },
  },
  computed: {
    cateId() {
      return this.checkedKeys[this.checkedKeys.length - 1];
    },
  },
};
</script>

<style scoped>
.el-steps {
  margin: 10px;
}
::v-deep .el-step__title {
  font-size: 14px;
}
.checkbox_mar {
  margin: 0 10px 0 0 !important;
}
</style>