<template>
  <div class="login">
    <div class="login_content">
      <!-- 头像 -->
      <div class="login_logo">
        <img src="@/assets/avatar.png" />
      </div>
      <!-- form表单 -->
      <el-form
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
        label-width="80px"
        class="login_form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item class="login_btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm: { username: "admin", password: "123456" },
      // 表单校验规则
      loginFormRules: {
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
      },
    };
  },
  methods: {
    reset() {
      this.$refs.loginFormRef.resetFields();
      // console.log(123);
    },
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        const { username, password } = this.loginForm;
        if (!valid) return;
        let { data: res } = await this.$http.post("login", {
          username,
          password,
        });
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        //保存token到本地
        window.sessionStorage.setItem("token", res.data.token);
        this.$router.push("/home");
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  background-color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  .login_content {
    width: 500px;
    height: 300px;
    background-color: #fff;
    .login_logo {
      position: relative;
      img {
        width: 100px;
        height: 100px;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, -50%);
        border: 10px solid #fff;
        border-radius: 50%;
        background-color: #fff;
        box-shadow: 0 0 10px 2px #ddd;
      }
    }
    .login_form {
      margin-top: 100px;
      padding: 10px;
      .login_btns {
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>