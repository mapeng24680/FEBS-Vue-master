<template>
  <div id="checkBoxAndRadioEdit">
    <div class="descPanel">
      <div class="flex-container">
        <div class="tip">选项</div>
        <div class="intro">单/多选题的选项范围从 2 到 20</div>
      </div>
      <div class="flex-container flex-align-c relative" :data-name="item['key'+(index+1)]" :key="index" v-for="(item,index) in keyA">
        <a-radio  :defaultChecked="item['key'+(index+1)] =='1' ? true : false" v-if="EditorObj.type=='1'" :style="radioStyle"
                 :value="item['key'+(index+1)]"></a-radio>
        <a-checkbox :defaultChecked="item['key'+(index+1)] =='1' ? true : false" v-if="EditorObj.type=='2'"
                    :style="radioStyle" :value="item['key'+(index+1)]"></a-checkbox>
        <div :ref="'question'+index" :id="'answer'+(index+1)" class="questions_add keyRight wangEditor-txt"></div>
        <a-icon v-if="index > 2" @click="deleteFun(index)" type="close"/>
      </div>
      <a-button class="margin-top-10 margin-left-54" style="width: 95%" type="link" @click="addFun()" block>添加一个选项
      </a-button>
    </div>
  </div>
</template>
<!--单选多选组件-->
<script>
    import E from "wangEditor";

    export default {
        name: "checkBoxAndRadioEdit",
        data() {
            return {
                keyA: [],
                radioStyle: {
                    display: 'block',
                    height: '30px',
                    width: '46px',
                    lineHeight: '30px',
                    marginTop: '15px',
                    textAlign: 'center',
                    marginRight: '8px'
                },
            }
        },
        props: {
            EditorObj: {
                type: Object,
            },

        },
        created() {
            //这里对数据进行重组
            var arr=[]
            for (let item in this.EditorObj) {
                arr.push(item);
            }
            for (let i = 0; i <arr.sort().length; i++) {
                if (arr[i].indexOf('key') == 0) {
                    this.keyA.push({
                        [arr[i]]: this.EditorObj[arr[i]]
                    })
                }
            }
        },
        mounted() {
            for (let i = 0; i < this.keyA.length; i++) {
                this.setEdit(i, this.EditorObj['answer' + (i + 1)])
            }
        },
        methods: {
            addFun() {
                this.keyA.push({})
                this.$nextTick(() => {
                    this.setEdit(this.keyA.length - 1, this.EditorObj['answer' + (this.keyA.length)])
                })
            },
            deleteFun(index) {
                this.keyA.splice(index, 1)
            },
            setEdit(index, answer) {
                let editor = new E(this.$refs['question' + index]);
                // 编辑器的事件，每次改变会获取其html内容
                var that = editor,self=this
                editor.customConfig.onblur = (html) => {
                    that.$toolbarElem[0].style.display = 'none';
                    that.$textElem[0].parentElement.classList.add('active')
                    self[that.$textElem[0].parentElement.parentElement.id]=html
                }
                editor.customConfig.onfocus = function () {
                    that.$toolbarElem[0].style.display = 'flex';
                    that.$textElem[0].parentElement.classList.remove('active')
                }
                editor.customConfig.menus = [
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
                editor.create(); // 创建富文本实例
                editor.$textElem[0].parentElement.classList.add('active')
                editor.txt.html(answer)
            },
        }
    }
</script>

<style scoped lang="stylus">

</style>
