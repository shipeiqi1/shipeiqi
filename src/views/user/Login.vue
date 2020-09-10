<template>
  <div>
    <hm-header>登录</hm-header>
    <hm-logo></hm-logo>
    <!-- 账号密码 -->
    <van-form @submit="Submitlogin">
      <van-field
        v-model="username"
        name="用户名"
        label="账号"
        placeholder="请输入账号"
        :rules="rules.username"
      />
      <van-field
        v-model="password"
        type="password"
        name="密码"
        label="密码"
        placeholder="请输入密码"
        :rules="rules.password"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
    <!-- 跳转登录页面 -->
    <p class="tips">
      没有账号?去
      <router-link to="./register">注册</router-link>
    </p>
  </div>
</template>

<script>
export default {
  // 接收注册数据
  created() {
    console.log(this.$route)
    const { username, password } = this.$route.params
    this.username = username
    this.password = password
  },
  data() {
    return {
      username: '',
      password: '',
      // 验证规则
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'onChange' },
          {
            pattern: /^\d{5,11}$/,
            message: '输昵称,你输尼玛呢???',
            trigger: 'onChange'
          }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'onChange' },
          {
            pattern: /^\d{3,12}$/,
            message: '输密码,你输尼玛呢???',
            trigger: 'onChange'
          }
        ]
      }
    }
  },
  methods: {
    async Submitlogin() {
      const res = await this.$axios.post('/login', {
        username: this.username,
        password: this.password
      })
      // console.log(res)
      // 解构后台数据
      const { statusCode, message, data } = res.data
      // 判断状态码,不等200就rutern出去
      if (statusCode !== 200) return this.$toast(message)
      // 状态码成功执行提示登录成功,并跳转个人首页
      // 保存token和id到本地
      localStorage.setItem('token', data.token)
      localStorage.setItem('userId', data.user.id)
      this.$toast(message)
      this.$router.push('/user')
    }
  }
}
</script>

<style lang="less">
.tips {
  margin: 0 15px;
  text-align: right;
  font-size: 16px;
  a {
    color: coral;
  }
}
</style>
