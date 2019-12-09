<template>
  <div class="question">
    <div class="descPanel">
      <div class="flex-container" :align="setWords">
        <div class="tip">选项</div>
        <div class="intro">这里填写答案</div>
      </div>
        <div ref="question" class="questions_add keyRight margin-left-54 wangEditor-txt"></div>
    </div>
    <div class="descPanel">
      <div class="flex-container">
        <div class="tip">关键词</div>
        <div class="intro">这里添加答案关键词
          <a-tooltip placement="top" title="系统将自动根据关键字进行判分,每个核心词是普通词分数的2倍。并列关键词（或的关系）用 | 去分隔。">
            <a-icon type="question-circle"/>
          </a-tooltip>
        </div>
      </div>
      <div class="  margin-left-54 relative">
        <div class="key_block" v-if="textFor.length!=0">
          <div class="whole-word relative" :key="index" v-for="(item,index) in textFor" :class="item.key =='1' ?'key-word':''">
            <a-tooltip placement="top" >
            {{item.value}}
            <a-icon @click="deleteFun(index)" type="close"/>
              <template slot="title">
                <a-button @click="toggle(index,item.key)">{{item.key =='1' ?'切换为普通关键词':'切换为核心关键词'}}</a-button>
              </template>
            </a-tooltip>
          </div>
        </div>
         <div class="flex-align-c flex-container margin-top-10">
           <a-col :span="5" class="margin-r-10">
             <a-input  v-model="value"/>
           </a-col>
           <a-button @click="addFun(0)" type="primary" class="margin-r-10">普通关键词</a-button>
           <a-button @click="addFun(1)" type="danger">核心关键词</a-button>
         </div>
      </div>
    </div>
  </div>
</template>
<!--问答题组件-->
<script>
    import E from "wangEditor";

    export default {
        name: "question",
        data() {
            return {
                textFor:[],
                value:"",
                keyArr:[],
                arr:[],
            }
        },
        props: {
            EditorObj: {
                type: Object,
            },
        },
        computed:{
            setWords(){
                if(this.textFor.length!=0){
                    this.keyArr=[];
                    this.arr=[];
                    for(let i=0;i<this.textFor.length;i++){
                        if(this.textFor[i].key ==1){
                            this.keyArr.push(this.textFor[i].value)
                        }else {
                            this.arr.push(this.textFor[i].value)
                        }
                    }
                    this.$set(this.EditorObj,'normalWords',this.arr.join('#'))
                    this.$set(this.EditorObj,'keyWords',this.keyArr.join('#'))
                    this.$emit('updated:EditorObj',this.EditorObj)
                    this.$forceUpdate()
                }
            },
        },
        methods:{
            addFun(index){
                //key 0 == 普通 1=核心
                this.textFor.push({
                    key:index,
                    value:this.value
                })
                this.value='';
            },
            deleteFun(index){
                this.textFor.splice(index,1)
            },
            toggle(index,key){
                this.$set(this.textFor[index],'key',key=='0'?'1':'0')
            },
        },
        mounted() {
            let editor = new E(this.$refs['question']);
            // 编辑器的事件，每次改变会获取其html内容
            var that = editor,self=this
            editor.customConfig.onblur = (html) => {
                that.$toolbarElem[0].style.display = 'none';
                that.$textElem[0].parentElement.classList.add('active')
                self.answer1=html
            };
            editor.customConfig.onchange = (html) => {
            };
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
        }
    }
</script>

<style scoped lang="stylus">
  .question {
    .key_block {
      margin-top: 10px;
      border: 1px solid #C2CEDB;
      padding: 0 12px;
      width: 85%;
      border-radius: 4px;
      min-height: 41px;
      background-color: #fff;
      .whole-word{
        display: inline-block;
        background-color: #a9b3bf;
        color: #fff;
        border: 1px solid #878f98;
        padding: 2px;
        border-radius: 4px;
        margin: 7px 5px 5px 0;
      }
      .key-word{
        background-color: #FF7832;
        border: 1px solid rgba(0,0,0,0.19);
      }
      .anticon-close {
        position static !important
        margin-left: 5px;
        padding-right: 0;
        svg{
          font-size: 12px;
          cursor pointer;
        }
      }
  }
  }
</style>
