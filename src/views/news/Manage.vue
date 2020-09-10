<template>
  <div class="manage">
    <hm-header>栏目管理</hm-header>
    <div class="content">
      <div class="active">
        <p>点击删除以下频道(必须保留4项以上)</p>
        <div class="list">
          <div
            class="item"
            v-for="item in activeList"
            :key="item.id"
            @click="delTab(item.id)"
          >{{item.name}}</div>
        </div>
      </div>
      <div class="deactive">
        <p>点击添加以下频道</p>
        <div class="list">
          <div
            class="item"
            v-for="item in deactiveList"
            :key="item.id"
            @click="addTab(item.id)"
          >{{item.name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  /*
    思路:
      1.发送axios请求,获取到所有的栏目,存放activeList
      2.渲染这些栏目
      3.点击激活的栏目,删除该栏目,并添加到未激活的数组中
      4.监听数据的变化,保存到localSrorage中
    */
  data() {
    return {
      // 存放本地的活跃的数据
      activeList: [],
      // 存放本地的不活跃的数据
      deactiveList: []
    }
  },
  // 在创建生命钩子中请求数据
  async created() {
    //   从本地获取数据
    const activeList = JSON.parse(localStorage.getItem('activeList'))
    const deactiveList = JSON.parse(localStorage.getItem('deactiveList'))
    // console.log(activeList)
    // console.log(deactiveList)
    // 进行判断,如果本地有数据优先渲染本地数据,并且阻止发送ajax请求
    if (activeList) {
      this.activeList = activeList
      this.deactiveList = deactiveList
      return
    }
    // 本地没有数据发送ajax请求获取全部数据
    const res = await this.$axios.get('./category')
    const { statusCode, data } = res.data
    if (statusCode === 200) {
      this.activeList = data
    }
  },
  methods: {
    //   绑定方法,点击对应项进行删除
    delTab(id) {
      if (this.activeList.length <= 4) return
      // 通过方法找到对应下标
      const index = this.activeList.findIndex(item => item.id === id)
      // 往未激活的栏目里添加当前点击的元素
      this.deactiveList.push(this.activeList[index])
      // 删除激活中点击的元素
      this.activeList.splice(index, 1)
    },
    addTab(id) {
      // 通过数组的方法find找到对应数组的下标
      const index = this.deactiveList.findIndex(item => item.id === id)
      this.activeList.push(this.deactiveList[index])
      this.deactiveList.splice(index, 1)
    }
  },
  //   监视数组中的数据变化
  watch: {
    activeList: {
      // 因为是数组,所以需要深度监控
      deep: true,
      handler(value) {
        //   当有数据变化,把数据存入本地
        localStorage.setItem('activeList', JSON.stringify(this.activeList))
        localStorage.setItem('deactiveList', JSON.stringify(this.deactiveList))
      }
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  padding: 15px;
  .active,
  .deactive {
    p {
      font-size: 14px;
      line-height: 35px;
    }
    .list {
      overflow: hidden;
      .item {
        border: 1px solid #ccc;
        float: left;
        margin: 5px;
        text-align: center;
        font-size: 14px;
        width: 56px;
        height: 24px;
        line-height: 24px;
        background-color: #eee;
      }
    }
  }
}
</style>
