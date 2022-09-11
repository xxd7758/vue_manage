<template>
  <el-container class="home_container">
    <el-header>
      <span>后台管理系统</span>
      <el-button type="info" size="default" @click="logOut">退出</el-button>
    </el-header>
    <el-container class="">
      <el-aside :width="!isCollapse ? '200px' : '64px'">
        <!-- 收起导航栏 -->
        <div
          style="
            line-height: 30px;
            text-align: center;
            background: #4a5064;
            color: #fff;
          "
          @click="changeCollapse"
        >
          <i v-if="isCollapse" class="el-icon-d-arrow-left"></i>
          <i v-else class="el-icon-d-arrow-right"></i>
        </div>
        <el-menu
          router
          unique-opened
          background-color="#333744"
          text-color="#fff"
          active-text-color="yellow"
          :collapse="isCollapse"
          :collapse-transition="false"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="'/' + item.path"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconObj[item.id]" class="icon"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + item2.path"
              v-for="item2 in item.children"
              :key="item2.id"
            >
              <span>{{ item2.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main> <router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      menuList: [],
      // 图标
      iconObj: {
        125: "iconfont icon-icon_user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      // 是否折叠
      isCollapse: false,
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    // 退出登录
    logOut() {
      window.sessionStorage.removeItem("token");
      this.$router.push("/login");
    },
    // 获取左侧全部菜单
    async getMenuList() {
      let { data: res } = await this.$http.get("/menus");
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("getMenuList error");
      this.menuList = res.data;
    },
    // 折叠/展开
    changeCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;

  .el-header {
    background-color: #373d41;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
  }
  .el-aside {
    background-color: #333744;
    border-right: none;
    ::v-deep .el-submenu__title {
      width: 200px;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
.icon {
  margin-right: 10px;
}
</style>>