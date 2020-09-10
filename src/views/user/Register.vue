<template>
  <div>
    <hm-header>注册</hm-header>
    <hm-logo></hm-logo>
    <!-- 注册 -->
    <van-form @submit="onSubmit">
      <van-field
        v-model="user.username"
        name="用户名"
        label="账号"
        placeholder="请输入你的账号"
        :rules="[{ required: true, message: '账户不能为空', trigger: 'onChange'  },
             { pattern: /^\d{3,12}$/, message: '输账户,你输尼玛呢???', trigger: 'onChange' }]"
      />
      <van-field
        v-model="user.nickname"
        label="昵称"
        placeholder="请输入你的昵称"
        :rules="[{ required: true, message: '账户不能为空', trigger: 'onChange'  },
             { pattern: /^\d{3,12}$/, message: '输账户,你输尼玛呢???', trigger: 'onChange' }]"
      />
      <van-field
        v-model="user.password"
        type="password"
        label="密码"
        placeholder="请输入密码"
        :rules="[{ required: true, message: '账户不能为空', trigger: 'onChange'  },
             { pattern: /^\d{3,12}$/, message: '输账户,你输尼玛呢???', trigger: 'onChange' }]"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
    <!-- 跳转登录页面 -->
    <p class="skip">
      已有账户!去
      <router-link to="./login">登录</router-link>
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: '',
        password: '',
        nickname: ''
      }
    }
  },
  methods: {
    async onSubmit() {
      const res = await this.$axios.post('/register', this.user)
      const { message, statusCode } = res.data
      if (statusCode !== 200) return this.$toast(message)
      // this.$router.push(
      //   `/login?username=${this.user.username}&password=${this.user.password}`
      // )
      this.$router.push({
        name: 'login',
        params: this.user
      })
    }
  }
}
</script>

<style lang="less">
.skip {
  margin: 0 15px;
  text-align: right;
  font-size: 16px;
  a {
    color: coral;
  }
}
</style>
