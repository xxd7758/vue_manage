<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 图表区 -->
    <div ref="chart" style="width: 600px; height: 400px"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import _ from "lodash";
export default {
  name: "Reports",
  data() {
    return {
      // 合并对象
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#ccc",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLine: { show: true },
            axisTick: { show: true },
          },
        ],
      },
    };
  },
  created() {},
  mounted() {
    this.getReportList(); //要获取dom
  },
  methods: {
    async getReportList() {
      const chart = this.$refs.chart;
      const myChart = echarts.init(chart);
      let { data: res } = await this.$http.get("reports/type/1");
      // console.log(res);
      if (res.meta.status != 200)
        return this.$message.error("获取报表数据失败");
      //原来xAixs对象本身有属性  要合并的身上也有   ----结果值还是为原来那个的值
      // const option = Object.assign(res.data, this.options);
      const result = _.merge(res.data, this.options);
      myChart.setOption(result);
    },
  },
};
</script>

<style>
</style>