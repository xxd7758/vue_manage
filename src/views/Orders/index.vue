<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索框 -->
      <el-row>
        <el-col :span="8"
          ><el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button
              slot="append"
              icon="el-icon-search"
            ></el-button> </el-input
        ></el-col>
      </el-row>
      <!-- table表格 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column label="订单编号" prop="order_number">
        </el-table-column>
        <el-table-column label="订单价格" prop="order_price"> </el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="{ row }">
            <el-tag type="danger" v-if="row.pay_status == 0">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"> </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="{ row }">
            {{ row.create_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <!-- 修改地址 -->
            <el-button
              type="primary"
              size="mini"
              @click="showBox(row)"
              icon="el-icon-edit"
            ></el-button>
            <el-button
              type="success"
              size="mini"
              @click="showProgressBox(row)"
              icon="el-icon-location"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        style="text-align: center"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改 订单 对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="addressDialogClose"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="citydata"
            v-model="addressForm.address1"
            style="width: 100%"
            clearable
            filterable
            :props="{
              expandTrigger: 'hover',
            }"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="addressVisible = false">取消</el-button>
        <el-button type="primary" @click="">确定</el-button>
      </span>
    </el-dialog>
    <!-- 查看物流进度 对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressVisible"
      width="50%"
      @close=""
    >
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import citydata from "@/views/Orders/citydata";
export default {
  name: "Orders",
  data() {
    return {
      // 搜索请求参数
      queryInfo: {
        query: "", //keyword 查询参数
        pagenum: 1, //当前页码
        pagesize: 5, //每页显示条数
      },
      total: 0, //总条数
      orderList: [], //订单数据
      addressVisible: false, //修改 对话框
      addressForm: {
        address1: "", //省市区/县
        address2: "", //详细地址
      },
      addressFormRules: {
        address1: [
          { required: true, message: "请输入省市区/县", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
      },
      citydata, //城市数据 级联
      progressVisible: false, //物流信息
      progressInfo: [], //物流信息
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    // 获取订单 列表数据
    async getOrderList() {
      let { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      // console.log(res);
      if (res.meta.status != 200)
        return this.$message.error("获取订单数据失败");
      this.orderList = res.data.goods;
      this.total = res.data.total;
    },
    // 分页器 页容量
    handleSizeChange(limit) {
      this.queryInfo.pagesize = limit;
      this.getOrderList();
    },
    // 分页器 页面跳转
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getOrderList();
    },
    // 修改 订单数据
    showBox(row) {
      this.addressVisible = true;
    },
    // 关闭  修改 地址对话框 清空表单
    addressDialogClose() {
      this.$refs.addressFormRef.resetFields();
    },
    // 查看 物流信息
    async showProgressBox(row) {
      // 测试订单号 -----------接口返回数据失败
      // const id = `1106975712662/804909574412544580`;
      // let { data: res } = await this.$http.get(`/kuaidi/${id}`);
      // console.log(res);
      // if (res.meta.status != 200)
      //   return this.$message.error("获取订单号数据失败");
      // this.progressList = res.data;
      // 直接拿 文档数据 直接赋值
      this.progressInfo = [
        {
          time: "2018-05-10 09:39:00",
          ftime: "2018-05-10 09:39:00",
          context: "已签收,感谢使用顺丰,期待再次为您服务",
          location: "",
        },
        {
          time: "2018-05-10 08:23:00",
          ftime: "2018-05-10 08:23:00",
          context:
            "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
          location: "",
        },
        {
          time: "2018-05-10 07:32:00",
          ftime: "2018-05-10 07:32:00",
          context: "快件到达 [北京海淀育新小区营业点]",
          location: "",
        },
        {
          time: "2018-05-10 02:03:00",
          ftime: "2018-05-10 02:03:00",
          context:
            "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
          location: "",
        },
        {
          time: "2018-05-09 23:05:00",
          ftime: "2018-05-09 23:05:00",
          context: "快件到达 [北京顺义集散中心]",
          location: "",
        },
        {
          time: "2018-05-09 21:21:00",
          ftime: "2018-05-09 21:21:00",
          context: "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
          location: "",
        },
        {
          time: "2018-05-09 13:07:00",
          ftime: "2018-05-09 13:07:00",
          context: "顺丰速运 已收取快件",
          location: "",
        },
        {
          time: "2018-05-09 12:25:03",
          ftime: "2018-05-09 12:25:03",
          context: "卖家发货",
          location: "",
        },
        {
          time: "2018-05-09 12:22:24",
          ftime: "2018-05-09 12:22:24",
          context: "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
          location: "",
        },
        {
          time: "2018-05-08 21:36:04",
          ftime: "2018-05-08 21:36:04",
          context: "商品已经下单",
          location: "",
        },
      ];
      this.progressVisible = true;
    },
  },
};
</script>

<style>
</style>