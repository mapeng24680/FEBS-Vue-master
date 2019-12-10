<template>
  <div>
    <a-modal :title="showContent.title" v-model="visible" @ok="handleOk" @cancel="cancleClick" width="40%" centered='centered'>
      <div>{{showContent.content}}</div>
      <div>{{showContent.tips}}</div>
    </a-modal>
  </div>
</template>
<script>
  export default {
    props:['showContent'],
    name:'CommitExam',
    data() {
      return {
        visible: true,
      };
    },
    methods: {
      handleOk(e) {
        this.$emit("sureCommitExam");
      },
      cancleClick() {
          this.$emit("closeDialog");
      }
    },
  };
</script>

<style lang="less" scoped>
div {
    color: #c9c1c1;
    font-size: 15px;
}
</style>