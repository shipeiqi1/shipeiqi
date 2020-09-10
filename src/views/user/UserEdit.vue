<template>
  <div class="user-edit">
    <hm-header>编辑资料</hm-header>
    <div class="avatar">
      <img :src="$axios.defaults.baseURL+user.head_img" />
      <van-uploader :after-read="afterRead" />
    </div>
    <hm-navitem @click="nicknameShow">
      <template>昵称</template>
      <template #content>{{user.nickname}}</template>
    </hm-navitem>
    <hm-navitem @click="ispasswordShow">
      <template>密码</template>
      <template #content>******</template>
    </hm-navitem>
    <hm-navitem @click="genderShow">
      <template>性别</template>
      <template #content>{{user.gender === 1 ? '男' : '女'}}</template>
    </hm-navitem>
    <!-- 渲染dialog组件 -->
    <!-- 昵称框 -->
    <van-dialog v-model="nikenameShow" title="编辑昵称" show-cancel-button @confirm="updatanikename">
      <van-cell-group>
        <van-field v-model="nickname" ref="nikename" />
      </van-cell-group>
    </van-dialog>
    <!-- 密码框 -->
    <van-dialog v-model="passwordShow" title="修改密码" show-cancel-button @confirm="updatapassword">
      <van-cell-group>
        <van-field v-model="password" ref="password" />
      </van-cell-group>
    </van-dialog>
    <!-- 性别 -->
    <van-dialog v-model="isgenderShow" title="修改性别" show-cancel-button @confirm="updatagender">
      <van-radio-group v-model="gender">
        <van-cell-group>
          <van-cell title="男" clickable @click="gender = 1">
            <template #right-icon>
              <van-radio :name="1" />
            </template>
          </van-cell>
          <van-cell title="女" clickable @click="gender = 0">
            <template #right-icon>
              <van-radio :name="0" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-dialog>
    <!-- 剪裁的模态框 -->
    <div class="mask" v-show="maskShow">
      <van-button type="primary" class="crop" @click="crop">裁剪</van-button>
      <van-button type="danger" class="cancel" @click="maskShow = false">取消</van-button>
      <VueCropper ref="aa" :img="img" autoCrop autoCropWidth="100" autoCropHeight="100" fixed></VueCropper>
    </div>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
export default {
  components: {
    VueCropper
  },
  data() {
    return {
      user: '',
      nikenameShow: false,
      nickname: '',
      passwordShow: false,
      password: '',
      isgenderShow: false,
      gender: 1,
      maskShow: false,
      img: ''
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    // 封装axios请求,用来渲染数据
    async getUserInfo() {
      const userId = localStorage.getItem('userId')
      const res = await this.$axios.get(`/user/${userId}`)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.user = data
      }
    },
    // 封装修改请求
    async updateUser(data) {
      const userId = localStorage.getItem('userId')
      const res = await this.$axios.post(`/user_update/${userId}`, data)
      if (res.data.statusCode === 200) {
        this.getUserInfo()
        this.$toast.success('修改成功')
      }
    },
    // 显示修改昵称的弹出框
    async nicknameShow() {
      this.nikenameShow = true
      this.nickname = this.user.nickname
      // 等待Dom更新
      await this.$nextTick()
      // 自动获取焦点
      this.$refs.nikename.focus()
    },
    // 修改昵称
    async updatanikename() {
      this.updateUser({
        nickname: this.nickname
      })
    },
    // 显示修改密码框
    async ispasswordShow() {
      this.passwordShow = true
      this.password = this.user.password
      // 等待Dom更新
      await this.$nextTick()
      // 自动获取焦点
      this.$refs.password.focus()
    },
    // 修改密码
    async updatapassword() {
      this.updateUser({
        password: this.password
      })
    },
    // 显示修改性别
    genderShow() {
      this.isgenderShow = true
      this.gender = this.user.gender
    },
    // 修改性别
    updatagender() {
      this.updateUser({
        gender: this.gender
      })
    },
    // 判断图片类型
    isImg(name) {
      if (
        name.endsWith('.gif') ||
        name.endsWith('.jpg') ||
        name.endsWith('.png') ||
        name.endsWith('.jpeg')
      ) {
        return true
      } else {
        return false
      }
    },
    afterRead(file) {
      // 效验图片的类型和大小,如果满足,才可以上传
      // console.log(file)
      if (!this.isImg(file.file.name)) {
        return this.$toast.fail('请上传图片')
      }
      if (file.file.size >= 200 * 1024) {
        return this.$toast.fail('上传的图片太大')
      }
      // 显示剪裁框
      this.maskShow = true
      console.log(file.content)
      // 设置剪裁的图片
      this.img = file.content
    },
    // 剪切按钮
    crop() {
      this.$refs.aa.getCropBlob(async blob => {
        // console.log(blob)
        // 获取剪裁好的图片
        // 注意通过ajax上传文件,请求体不能直接是一个普通对象,必须是一个formData对象
        // 创建一个空的formData对象
        const fd = new FormData()
        // 给formData对象添加上传的文件
        fd.append('file', blob)
        const res = await this.$axios.post('/upload', fd)
        const { statusCode, data } = res.data
        if (statusCode === 200) {
          // console.log(data)
          this.updateUser({
            head_img: data.url
          })
        }
        // 隐藏剪裁框
        this.maskShow = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.van-field {
  border: 1px solid #ccc;
  margin: 15px 0;
}
.van-dialog {
  padding: 10px;
}
.avatar {
  height: 80px;
  width: 80px;
  margin: 25px auto;
  border-radius: 50%;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
  }
  .van-uploader {
    position: absolute;
    left: 50%;
    top: 70px;
    transform: translate(-50%);
    width: 100px;
    height: 100px;
    opacity: 0;
  }
}
.mask {
  width: 100%;
  height: 100%;
  background-color: aqua;
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  .crop,
  .cancel {
    position: fixed;
    top: 0;
    z-index: 1;
  }
  .cancel {
    right: 0;
  }
}
</style>
