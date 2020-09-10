<template>
  <!-- 头部 -->
  <div class="user">
    <div class="header" @click="$router.push('/user-edit')">
      <div class="avatar">
        <img :src="base + user.head_img" alt />
      </div>
      <div class="info">
        <i class="iconfont" :class="user.gender === 1?'iconxingbienan':'iconxingbienv'"></i>
        <span>{{user.nickname}}</span>
        <div class="time">{{user.create_date | time}}</div>
      </div>
      <div class="arrow">
        <span class="iconfont iconjiantou1"></span>
      </div>
    </div>
    <hm-navitem to="/my-fillow">
      <template>我的关注</template>
      <template #content>关注的内容</template>
    </hm-navitem>
    <hm-navitem to="/my-comment">
      <template>我的跟帖</template>
      <template #content>跟帖/回复</template>
    </hm-navitem>
    <hm-navitem to="/my-star">
      <template>我的收藏</template>
      <template #content>文章/视频</template>
    </hm-navitem>
    <hm-navitem @click="$router.push('/user-edit')">
      <template>设置</template>
    </hm-navitem>
    <div class="but">
      <van-button
        type="warning"
        block
        round
        color="linear-gradient(to right, #a8edea,#fed6e3)"
        @click="fn"
      >退出</van-button>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    base() {
      return this.$axios.defaults.baseURL
    }
  },
  async created() {
    const userId = localStorage.getItem('userId')
    // console.log(token, userId)
    const res = await this.$axios.get(`/user/${userId}`)
    const { statusCode, data } = res.data
    if (statusCode === 200) {
      this.user = data
    }
  },
  data() {
    return {
      user: ''
    }
  },
  methods: {
    async fn() {
      // 弹框提示~~await开始等一个数据可能是会失败的,try可以处理错误
      try {
        await this.$dialog.confirm({
          title: '退出登录',
          message: '温馨提示:退出后不可访问个人中心'
        })
        // 点击取消, await没有等到数据,抛出错误,catch方法处理
      } catch {
        // 阻止代码运行
        return this.$toast('取消退出')
      }
      // 说明点了确定
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      this.$router.push('/login')
      this.$toast.success('退出成功')
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  height: 80px;
  align-items: center;
  border-bottom: 3px solid #ccc;
  .avatar {
    margin: 0 10px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .info {
    flex: 10;
    .iconxingbienan {
      color: skyblue;
    }
    .iconxingbienv {
      color: pink;
    }
    .time {
      margin-top: 6px;
      color: #666;
    }
  }
  .arrow {
    flex: 1;
  }
}
.but {
  padding: 15px;
}
</style>
