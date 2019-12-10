<template>
  <div class="manual">
    <wangEditor :arr-list.sync="arrList" :arr-list1.sync="arrList1"></wangEditor>
  </div>
</template>
<!--手动录入-->
<script>
    import wangEditor from '../edit/wangEditor'
    import {mapState, mapMutations} from 'vuex'
    export default {
        name: "manual",
        inject: ['arrList1', 'arrList'],
        data() {
            return {}
        },
        watch: {},
        computed: {
            EditorObj:{
                get(){
                    return this.$store.state.account.editWang
                },
                set(v){},
            }
        },
        components: {
            wangEditor
        },
    }
</script>

<style scoped lang="stylus">

</style>
