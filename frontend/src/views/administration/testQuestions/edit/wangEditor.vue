<template>
  <div id="wangEditor">
    <div class="flex-container">
      <div class="flex-container flex-align-c margin-b-15 margin-r-15">
        <p>试题分类：</p>
        <a-button type="primary" ghost>请选择</a-button>
      </div>
      <div class="margin-r-15">
        试题类型
        <a-select v-model="EditorObj.type" style="width: 120px" @change="handleChangeType">
          <a-select-option v-for="item in arrList" v-if="item.key !='0'" :key="item.key" :value="item.key">
            {{item.label}}
          </a-select-option>
        </a-select>
      </div>
      <div class="margin-r-15">
        试题难度
        <a-select v-model="EditorObj.difficult" style="width: 80px" @change="handleChange">
          <a-select-option v-for="item in arrList1" :key="item.key" :value="item.key">{{item.label}}</a-select-option>
        </a-select>
      </div>
    </div>
    <div class="descPanel">
      <div class="flex-container">
        <div class="tip">题干</div>
        <div class="intro">这里填写题目描述</div>
      </div>
      <div ref="question" class="questions_add wangEditor-container wangEditor-txt"></div>
    </div>
    <checkBoxAndRadioEdit v-if="EditorObj.type == '1' || EditorObj.type == '2'"></checkBoxAndRadioEdit>
    <judgment v-if="EditorObj.type == '3' "></judgment>
    <completion v-if="EditorObj.type == '4' "></completion>
    <question v-if="EditorObj.type == '5' "></question>
    <div class="descPanel">
      <div class="flex-container">
        <div class="tip">解析</div>
        <div class="intro">这里填写该问题对应的答案解释</div>
      </div>
      <div ref="analysis" class="questions_add wangEditor-container wangEditor-txt"></div>
    </div>
    <a-button class="margin-top-10 margin-left-54" style="width: 95%" type="link" @click="saveFun()" block>全部保存
    </a-button>
  </div>
</template>
<script>
    import E from "wangEditor";
    import checkBoxAndRadioEdit from './checkBoxAndRadioEdit' //单选多选组件
    import judgment from './judgment' //判断页面组件
    import completion from './completion' //填空题组件
    import question from './question' //问答题组件
    import {mapState, mapMutations} from 'vuex'

    export default {
        name: "wangEditor",
        data() {
            return {
                editor: null,
                editor1: null,
            };
        },
        components: {
            checkBoxAndRadioEdit, judgment, completion, question
        },

        watch: {},
        computed: {
            EditorObj: {
                get() {
                    return this.$store.state.account.editWang
                },
                set(v) {
                },
            }
        },
        // catchData是一个类似回调函数，来自父组件，当然也可以自己写一个函数，主要是用来获取富文本编辑器中的html内容用来传递给服务端
        props: {
            arrList1: {
                type: Array,
            },
            arrList: {
                type: Array,
            },
        },
        mounted() {
            this.editor = new E(this.$refs.question);
            this.editor1 = new E(this.$refs.analysis);
            // 编辑器的事件，每次改变会获取其html内容
            var that = this.editor, self = this;
            this.editor.customConfig.onblur = (html) => {
                that.$toolbarElem[0].style.display = 'none';
                that.$textElem[0].parentElement.classList.add('active')
            };
            this.editor.customConfig.onfocus = function () {
                that.$toolbarElem[0].style.display = 'flex';
                that.$textElem[0].parentElement.classList.remove('active')
            }
            this.editor.customConfig.onchange = (html) => {
                self.EditorObj.question = html
                self.setEdit(self.EditorObj)
            };
            this.editor1.customConfig.onchange = (html) => {
                self.EditorObj.analysis = html
                self.setEdit(self.EditorObj)
            };
            var that1 = this.editor1
            this.editor1.customConfig.onblur = html => {
                that1.$toolbarElem[0].style.display = 'none';
                that1.$textElem[0].parentElement.classList.add('active')
            };
            this.editor1.customConfig.onfocus = function () {
                that1.$toolbarElem[0].style.display = 'flex'
                that1.$textElem[0].parentElement.classList.remove('active')
            }
            this.editor.customConfig.menus = [
                // 菜单配置
                'head', // 标题
                'bold', // 粗体
                'fontSize', // 字号
                'fontName', // 字体
                'italic', // 斜体
                'underline', // 下划线
                'strikeThrough', // 删除线
                'foreColor', // 文字颜色
                'backColor', // 背景颜色
                'link', // 插入链接
                'list', // 列表
                'justify', // 对齐方式
                'quote', // 引用
                'image', // 插入图片
                'table', // 表格
                'video', // 视频
                'fileUpload', // 插入代码
            ];

            this.editor1.customConfig.menus = this.editor.customConfig.menus;
            this.editor.create(); // 创建富文本实例
            this.editor1.create(); // 创建富文本实例
            this.editor.$textElem[0].parentElement.classList.add('active')
            this.editor1.$textElem[0].parentElement.classList.add('active')
            this.editor.txt.html(this.EditorObj.question)
            this.editor1.txt.html(this.EditorObj.analysis)
        },
        methods: {
            ...mapMutations({
                setEdit: 'account/setEdit'
            }),
            handleChangeType(value) {
                this.EditorObj.type = value;
                this.setEdit(this.EditorObj)
            },
            handleChange(value) {
                this.EditorObj.difficult = value;
                this.setEdit(this.EditorObj)
            },
            saveFun() {
                if(!this.EditorObj.question){
                    this.$message.error('题目描述不能为空');
                }
                this.$post('/baseinfo/admin/addtestqm', this.EditorObj).then(json => {

                })
            },
        },
    }
</script>
<style lang="stylus">
  #wangEditor {
    .active {
      height: 37px !important;
      border-top 1px solid #ccc !important
    }

    .w-e-toolbar {
      display none
    }

    .descPanel {
      margin-bottom: 40px;

      .tip {
        padding: 5px 14px;
        background: #A9B3BF;
        font-size: 12px;
        margin-right: 12px;
        color: #fff;
        display: inline-block;
      }

      .intro {
        color: #A9B3BF;
        vertical-align: middle;
      }

      .wangEditor-container {
        margin-top: 15px;
        border-radius: 2px;
        margin-left: 55px;
        width: 95%;
      }

      .keyRight {
        width: 95%;
        vertical-align: middle;
        display: inline-block;
        margin-top: 15px;
      }
    }

    .anticon-close {
      width: 17px;
      height: 17px;
      right: -4px;
      z-index: 99999;
      position: absolute;
      top: 50%;
      text-align: center;
      line-height: 18px;
    }
  }
</style>
