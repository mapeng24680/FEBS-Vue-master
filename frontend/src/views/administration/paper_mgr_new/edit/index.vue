<template>
    <div id="editIndex">
        <editPop v-if="reactiveNameFromParent.isShow == '1'"></editPop>
        <previewPaper v-if="reactiveNameFromParent.isShow == '0'"></previewPaper>
    </div>
</template>

<script>
  import editPop from "./editPop";
  import previewPaper from "./previewPaper";
    export default {
        name: "index",
        inject: ['getReaciveNameFromParent'],
        data(){
            return{

            }
        },
        computed: {
            reactiveNameFromParent () {
                return this.getReaciveNameFromParent()
            }
        },
        mounted(){
        },
        components:{
            editPop,previewPaper
        },
    }
</script>

<style scoped lang="stylus">
#editIndex{
  width: 100%;
  height 100%
  overflow hidden
}
</style>
