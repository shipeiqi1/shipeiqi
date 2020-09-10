<template>
  <div class="post-detail">
    <div class="header">
      <div class="left" @click="$router.back()">
        <span class="iconfont iconjiantou2"></span>
      </div>
      <div class="center">
        <span class="iconfont iconnew"></span>
      </div>
      <div class="right">
        <div class="followed" v-if="post.has_follow" @click="unfollow">已关注</div>
        <div class="follow" v-else @click="follow">关注</div>
      </div>
    </div>
    <div class="content">
      <div class="title">{{post.title}}</div>
      <div class="name">
        <span>{{post.user.nickname}}</span>
        <span>{{post.user.create_date | time}}</span>
      </div>
      <div class="info" v-if="post.type===1" v-html="post.content"></div>
      <video v-else :src="getUrl(post.content)" controls autoplay muted></video>

      <div class="buttons">
        <div class="good" @click="like" :class="{active:post.has_like}">
          <span class="iconfont icondianzan"></span>
          <span>{{post.like_length||0}}</span>
        </div>
        <div class="share">
          <span class="iconfont iconweixin"></span>
          <span>微信</span>
        </div>
      </div>
    </div>
    <!-- 评论 -->
    <div class="comment-list">
      <h3>精彩跟帖</h3>
      <hm-comment
        :comment="comment"
        v-for="comment in commentList"
        :key="comment.id"
        @reply="onReply"
      ></hm-comment>
    </div>

    <!-- textarea栏 -->
    <div class="footer-textarea" v-if="isShowTextarea">
      <textarea ref="textarea" v-model="content" :placeholder="'回复:' + nickname"></textarea>
      <van-button type="primary" @click="pubish">发送</van-button>
    </div>
    <!-- 下边栏 -->
    <div class="footer">
      <div class="search">
        <input type="text" placeholder="回复" @focus="onfocus" />
      </div>
      <span class="iconfont iconpinglun-">
        <i>20</i>
      </span>
      <span class="iconfont iconshoucang" @click="star" :class="{now:post.has_star}"></span>
      <span class="iconfont iconfenxiang"></span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      post: {
        user: {}
      },
      commentList: [],
      // 是否显示textarea
      isShowTextarea: false,
      content: '',
      nickname: '',
      replyId: ''
    }
  },
  //   请求数据
  created() {
    this.getInfo()
    // 获取文章的评论列表
    this.getCommentList()

    // 给bus注册自定义事件
    this.$bus.$on('reply', this.onReply)
  },
  destroyed() {
    console.log('detail销毁')
  },
  methods: {
    noLodin() {
      // 判断是否登录
      const token = localStorage.getItem('token')
      if (!token) {
        // 没有登录
        this.$router.push({
          path: '/login',
          query: {
            back: true
          }
        })
        // 代表没有登录
        return true
      } else {
        return false
      }
    },
    async getInfo() {
      // 获取路由传输的id,路由定义的时候要用动态的参数
      //   如果多个路由都要渲染同一个页面,就可以使用动态的路由参数
      //   配置的时候不要把路由写死
      const { id } = this.$route.params
      //   发送axios请求,请求对应id的文章
      const res = await this.$axios.get(`/post/${id}`)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.post = data
        // console.log(this.post)
      }
    },
    // 定义一个把html转换为text的方法
    // 1.先创建一个标签div
    // 2.把html结构给到div的innerHtml
    // 3.ruturn div的innerText
    getUrl(url) {
      const div = document.createElement('div')
      div.innerHTML = url
      return div.innerText
    },
    // 关注
    async follow() {
      // 如果未登录就直接跳转到登录页面
      if (this.noLodin()) return
      // 登录就发送ajax请求,进行关注或者取关
      const res = await this.$axios.get(`/user_follows/${this.post.user.id}`)
      if (res.data.statusCode === 200) {
        this.$toast.success('关注成功')
        this.getInfo()
      }
    },
    // 取消关注
    async unfollow() {
      const res = await this.$axios.get(`/user_unfollow/${this.post.user.id}`)
      if (res.data.statusCode === 200) {
        this.$toast.success('取消关注')
        this.getInfo()
      }
    },
    // 点赞和取消
    async like() {
      /*
    1.判断是否登录
    2.如果没有登录,也需要跳转到登录页
    3.如果登陆了,发送请求进行点赞
    */
      if (this.noLodin()) return
      const res = await this.$axios.get(`/post_like/${this.post.id}`)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getInfo()
      }
    },
    // 收藏
    async star() {
      if (this.noLodin()) return
      const res = await this.$axios.get(`/post_star/${this.post.id}`)
      if (res.data.statusCode === 200) {
        this.$toast.success(res.data.message)
        this.getInfo()
      }
    },
    // 请求文章的评论列表
    async getCommentList() {
      const id = this.$route.params.id
      const res = await this.$axios.get(`/post_comment/${id}`)
      if (res.data.statusCode === 200) {
        this.commentList = res.data.data
      }
    },
    // 点击显示textarea
    async onfocus() {
      // 显示textarea框
      this.isShowTextarea = true
      // 等待DOM更新
      await this.$nextTick()
      // 让textarta自动获取焦点
      this.$refs.textarea.focus()
    },
    // 点击发送按钮发送axios请求
    async pubish() {
      // 发送请求携带文章id,和评论内容,和回复的id
      const res = await this.$axios.post(`/post_comment/${this.post.id}`, {
        content: this.content,
        parent_id: this.replyId
      })
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        // 提示用户
        this.$toast.success(message)
        // 发送请求重新渲染页面
        this.getCommentList()
        // 清空数据
        this.content = ''
        this.replyId = ''
        this.nickname = ''
        // 隐藏textarea
        this.isShowTextarea = false
      }
    },
    // 获取子组件的id和nikename绑定回复的名字和文章
    async onReply(id, nickname) {
      console.log('父组件', id, nickname)
      this.isShowTextarea = true
      await this.$nextTick()
      this.$refs.textarea.focus()

      // 回显nickname
      this.nickname = '@' + nickname
      this.replyId = id
    }
  }
}
</script>

<style lang="less" scoped>
.comment-list {
  h3 {
    text-align: center;
    padding: 10px 0;
  }
}
.header {
  display: flex;
  padding: 0 10px;
  border-bottom: 1px solid #ccc;
  height: 50px;
  align-items: center;
  .left {
    span {
      line-height: 50px;
    }
  }
  .center {
    flex: 1;
    span {
      font-size: 50px;
    }
  }
  .right {
    font-size: 14px;
    div {
      width: 60px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      border-radius: 15px;
    }
    .followed {
      border: 1px solid #ccc;
    }
    .follow {
      color: #fff;
      background-color: #f00;
    }
  }
}
.active {
  border-color: red;
  color: red;
}
.content {
  padding: 10px;
  .title {
    font-weight: 700;
    font-size: 18px;
  }
  .name {
    font-size: 14px;
    color: #666;
    margin: 10px 0;
    span:first-child {
      margin-right: 20px;
    }
  }

  .info {
    font-size: 14px;
    /deep/ img {
      width: 100%;
    }
  }
  video {
    width: 100%;
  }
  .buttons {
    padding: 20px 0;
    display: flex;
    justify-content: space-around;
    > div {
      width: 120px;
      height: 40px;
      line-height: 40px;
      border-radius: 20px;
      border: 1px solid #ccc;
      text-align: center;
      font-size: 16px;
      .iconfont {
        font-size: 18px;
        margin-right: 5px;
      }
      .iconweixin {
        color: lime;
      }
    }
  }
}
.footer {
  display: flex;
  width: 100%;
  height: 50px;
  border-top: 1px solid #ccc;
  position: fixed;
  bottom: 0;
  align-items: center;
  justify-content: space-around;
  background-color: #fff;
  .iconfont {
    font-size: 24px;
  }
  .now {
    color: red;
  }
  .iconpinglun- {
    position: relative;
    i {
      position: absolute;
      right: -5px;
      top: 0;
      font-size: 10px;
      background-color: red;
      color: #fff;
      padding: 0 3px;
      border-radius: 5px;
      font-style: normal;
    }
  }
  .search {
    width: 180px;
    padding-right: 10px;
    input {
      width: 100%;
      height: 30px;
      border-radius: 15px;
      padding-left: 15px;
      font-size: 14px;
      background-color: #ddd;
    }
  }
}
.post-detail {
  padding-bottom: 50px;
}
.footer-textarea {
  width: 100%;
  height: 100px;
  display: flex;
  position: fixed;
  z-index: 999;
  bottom: 0;
  padding: 10px;
  align-items: flex-end;
  background-color: #ffffff;
  border-top: 1px solid #ccc;
  justify-content: space-around;
  textarea {
    width: 260px;
    height: 80px;
    background-color: #ccc;
    border-radius: 5px;
    border: none;
    padding: 10px;
    font-size: 14px;
  }
}
</style>
