<template>
  <div class="judgment">
    <div class="descPanel">
      <div class="flex-container">
        <div class="tip">选项</div>
        <div class="intro">选择正确或者错误（默认正确）</div>
      </div>
      <div class="flex-container flex-align-c margin-left-54 relative">
        <div class="judgmentText margin-r-10" @click="onChange('key1','1')" :class="EditorObj.key1=='1' ? 'activeText':''">正确</div>
        <div class="judgmentText" @click="onChange('key2','1')" :class="EditorObj.key2=='1' ? 'activeText':''">错误</div>
      </div>
    </div>
  </div>
</template>
<!--判断页面组件-->
<script>
    import {mapState, mapMutations} from 'vuex'
    export default {
        name: "judgment",
        data() {
            return {}
        },
        computed:{
            EditorObj:{
                get(){
                    return this.$store.state.account.editWang
                },
                set(v){},
            }
        },
        methods: {
            ...mapMutations({
                setEdit: 'account/setEdit'
            }),
            onChange(name, value) {
                this.EditorObj['key2'] = '0';
                this.EditorObj['key1'] = '0';
                this.EditorObj[name] = value;
                this.setEdit(this.EditorObj)
            },
        },
    }
</script>

<style scoped lang="stylus">
  .judgment {
    .judgmentText {
      position: relative;
      display: inline-block;
      height: 32px;
      padding: 0 15px;
      color: rgba(0, 0, 0, 0.65);
      line-height: 30px;
      background: #fff;
      border: 1px solid #d9d9d9;
      border-top-width: 1.02px;
      cursor: pointer;
      transition: color 0.3s, background 0.3s, border-color 0.3s;
    }

    .activeText {
      color: #fff;
      background: #1890ff;
      border-color: #1890ff;
    }
  }
</style>
