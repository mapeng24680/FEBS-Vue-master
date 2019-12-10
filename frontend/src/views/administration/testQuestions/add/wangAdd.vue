<template>
    <div class="addClass">
      <a-tabs defaultActiveKey="1" @change="callback">
        <a-tab-pane tab="批量录入" key="1">
          <batch></batch>
        </a-tab-pane>
        <a-tab-pane tab="手动录入" key="2" >
        <manual></manual>
        </a-tab-pane>
        <a-tab-pane tab="Excel导入" key="3">
          <Excel></Excel>
        </a-tab-pane>
      </a-tabs>
    </div>
</template>

<script>
  import manual from './manual'
  import batch from './batch'
  import Excel from './Excel'
    export default {
        name: "addClass",
        inject :['arrList1','arrList'],
        data() {
            return {
            }
        },
        components:{
            manual,batch,Excel
        },
        created() {
        },
        mounted() {
        },
        methods:{
            callback(key) {
                console.log(key);
            },
        },
    }
</script>

<style scoped lang="stylus">
.addClass{

}
</style>
