<template>
  <div class="completion ">
    <div class="descPanel">
      <div class="flex-container">
        <div class="tip">答案</div>
        <div class="intro">请填写每个填空的答案
          <a-tooltip placement="top">
            <template slot="title">
              <div class="answer-prompt">
                <span class="importent">同义词</span><br>
                同义词是答案的关键信息。填写后，系统可根据同义词自动判分。<span class="importent">一个答案有不同的答法，可加入多个同义词，满足其一即可得分。</span> （如：china 和
                CHINA）
              </div>
            </template>
            <a-icon type="question-circle"/>
          </a-tooltip>
        </div>
      </div>
      <div class=" margin-left-54 relative">
        <div class="keyFillContent" :key="index" :data-text="JSON.stringify(item)" v-for="(item,index) in keyA">
          <div class="input-group flex-container flex-align-c">
            <span class="input-group-addon">{{index+1}}</span>
            <div class="bootstrap-tagsinput">
              <span :key="childIndex" v-for="(value,key,childIndex) in item" class="relative">
                <span class="tag label label-info" :key="childIndexs"
                      v-for="(childItem,childIndexs) in value">{{childItem}}<a-icon @click="deleteFun($event,index,key,childIndexs)" type="close"/></span>
              </span>
              <input @keydown.delete="deleteFun($event,index)" @keyup.enter="addText($event,index)" type="text" placeholder="" size="1">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "completion",
        data() {
            return {
                keyA: [],
            }
        },
        created() {
            var arr=[]
            for (let item in this.EditorObj) {
                arr.push(item);
            }
            for (let i = 0; i <arr.sort().length; i++) {
                if (arr[i].indexOf('answer') == 0) {
                    this.keyA.push({
                        [arr[i]]: [].concat(this.EditorObj[arr[i]])
                    })
                }
            }
        },
        methods:{
            deleteFun(event,index,key,childIndex){
                if(key){
                    this.keyA[index][key].splice(childIndex,1)
                }else{
                      if(event.target.value == ''){
                          this.keyA[index]['answer'+(index+1)].splice(this.keyA[index]['answer'+(index+1)].length-1,1)
                      }
                }
                this.$forceUpdate();
                this.EditorObj[['answer'+(index+1)]]=this.keyA[index]['answer'+(index+1)].join('&&')
                this.$emit('updated:EditorObj',this.EditorObj)
            },
            addText(event,index){
                this.keyA[index]['answer'+(index+1)].push(event.target.value)
                event.target.value='';
                this.EditorObj[['answer'+(index+1)]]=this.keyA[index]['answer'+(index+1)].join('&&')
                this.$emit('updated:EditorObj',this.EditorObj)
            },
        },
        props: {
            EditorObj: {
                type: Object,
            },

        },
    }
</script>
<!--填空题组件-->
<style scoped lang="stylus">
  .completion {
    .importent {
      font-size: 12px;
      color: #1A8CFE;
    }

    .keyFillContent {
      margin-bottom: 15px;
      position: relative;

      .input-group {
        width: 100%;
        display table;

        .input-group-addon {
          background: #C2CEDB;
          width: 51px;
          font-size: 14px;
          font-weight: normal;
          line-height: 1;
          color: #9b9b9b;
          text-align: center;
          border: 1px solid #ccc;
          display table-cell;
          border-radius: 4px;
          border-bottom-right-radius: 0;
          border-top-right-radius: 0;
        }

        .bootstrap-tagsinput {
          width: 100%;
          border-radius: 0 4px 4px 0;
          background-color: #fff;
          border: 1px solid #ccc;
          box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
          display: inline-block;
          padding: 3px 6px;
          vertical-align: middle;
          max-width: 100%;
          line-height: 22px;
          cursor: text;
          height: auto;

          .label-info {
            background: #1A8CFE;
            display: inline;
            padding: .2em .6em .3em;
            font-size: 75%;
            font-weight: bold;
            line-height: 1;
            color: #fff;
            text-align: center;
            white-space: nowrap;
            vertical-align: baseline;
            border-radius: .25em;
            margin-right: 2px;

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

          input {
            border: none;
            box-shadow: none;
            outline: none;
            background-color: transparent;
            margin: 0;
            max-width: inherit;
            width: 100%;
          }
        }
      }
    }
  }
</style>
