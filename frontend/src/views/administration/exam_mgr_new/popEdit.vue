<template>
    <a-modal
      title="管理考试分类"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="visible=false"
    >
      <p></p>
    </a-modal>
</template>
<script>
export default {
    data(){
        return{
        }
    },
    props:{
        visible:{
        }
    },
}
</script>
<style lang="stylus" scoped>

</style>