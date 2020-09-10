<template>
  <div class="navitem" @click="clickFn">
    <div class="left">
      <slot></slot>
    </div>
    <div class="content">
      <slot name="content"></slot>
    </div>
    <div class="right">
      <i class="iconfont iconjiantou1"></i>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    clickFn() {
      if (this.to) {
        this.$router.push(this.to)
      }
      this.$emit('click')
    }
  },
  props: {
    to: String
  }
}
</script>

<style lang="less" scoped>
.navitem {
  display: flex;
  align-items: center;
  height: 45px;
  border-bottom: 1px solid #ccc;
  margin-left: 10px;
  .left {
    font-size: 16px;
  }
  .content {
    flex: 1;
    text-align: right;
    color: #666;
  }
  .right {
    width: 30px;
    margin-left: 10px;
  }
}
</style>
