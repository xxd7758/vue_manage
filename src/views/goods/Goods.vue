<template>
  <div>
    <!-- 商品列表 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体 -->
    <el-card>
      <!-- 头部 搜索 添加 -->
      <el-row :gutter="20">
        <el-col :span="8" :offset="0">
          <el-input
            v-model="queryInfo.query"
            placeholder="请输入内容"
            size="normal"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button
          ></el-input>
        </el-col>
        <el-col :span="4" :offset="0">
          <el-button type="primary" size="default" @click="goAddpage"
            >添加商品</el-button
          ></el-col
        >
      </el-row>
      <!-- table 表格渲染 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column label="商品名称" prop="goods_name" width="600">
        </el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price">
        </el-table-column>
        <el-table-column label="数量" prop="goods_number"> </el-table-column>
        <el-table-column label="创建时间" width="160">
          <template slot-scope="{ row, $index }">
            {{ row.add_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="{ row, $index }">
            <el-tag v-if="!row.is_promote" type="info">未通过</el-tag>
            <el-tag v-else type="success">已通过</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="{ row, $index }">
            <!-- 编辑 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click=""
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        style="text-align: center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Goods",
  data() {
    return {
      // table 请求对象
      queryInfo: {
        query: "", //查询参数 keyword
        pagenum: 1, //当前页码
        pagesize: 5, //页容量
      },
      goodsList: [], //商品列表数据
      total: 0, //总页码
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    //获取商品列表数据
    async getGoodsList() {
      let { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      // console.log(res);
      if (res.meta.status != 200)
        return this.$message.error("获取商品列表数据失败");

      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },
    // 分页器 改变页容量
    handleSizeChange(limit) {
      this.queryInfo.pagesize = limit;
      this.getGoodsList();
    },
    // 分页器 改变当前页
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getGoodsList();
    },
    // 删除 商品
    async removeById(row) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let { data: res } = await this.$http.delete(`goods/${row.goods_id}`);
          if (res.meta.status != 200) return this.$message.error("删除失败");
          this.$message.success("删除成功");
          this.getGoodsList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //跳转 到添加商品 页面
    goAddpage() {
      this.$router.push("/goods/add");
    },
  },
};
</script>

<style>
</style>