<template>
  <div id="editPop" >
    <div class="flex-container modelContent">
      <div class="flex-two modal-body modal-body-style background-eff3f7 relative">
        <div :key="index" v-for="(item,index) in jsonList"
             class="item group_simple left_group_simple animate item-active">
          <div class="flex-container flex-jus-sb">
            <h3 class="test_tittle">{{item.text}}</h3>
            <a-icon @click="deleteFun(0,index)" type="delete"/>
          </div>
          <p class="left_p">共<span class="test_num">{{jsonList.length}}</span>题 ，共 <span class="all_fraction" sort="0.238683019116938">{{item.totalScore}}</span>分数</p>
          <p class="left_p">每题分数<input type="text" v-model="item.totalScore" name="test_peer_score">分</p>
        </div>
        <div class="info-board">
          <div class="total">
            <p class="margin-b-10">总题数：<span class="test_total">{{test_total}}</span>题</p>
            <p class="padd-b-10">当前总分：<span class="total_score">0</span>分</p>
          </div>
        </div>
      </div>
      <div class="flex-eight background-eff3f7 modal-body-style margin-l-30 questions-board">
        <a-input class="text-center" :value="'山水多所得'" placeholder="点击输入试卷名称"/>
        <div class="group_simple margin-r-10 margin-l-10 margin-top20 margin-b-20" :key="index"
             v-for="(item,index) in jsonList">
          <div class="questions-group group_title flex-container flex-align-c   margin-top20 margin-b-20">
            <a-input v-model="item.text" name="test_tittle" class="margin-r-10" style="width: 260px"/>
            <div class="extract-box-tit">
              <span class="questionTypeText">{{item.label}}</span>
              <a-button @click="selectAdd(item,index)" class="margin-l-10 margin-r-10" type="primary" ghost>选择试题
              </a-button>
            </div>
            <div class="right_disoeder">
              <!--              question_disorder-->
              <a-checkbox>试题乱序</a-checkbox>
              <!--              options_disorder-->
              <a-checkbox>选项乱序</a-checkbox>
              <!--              less_choice_confirm-->
              <a-checkbox>漏选给分
                <a-tooltip placement="topLeft" title="打开漏选给分后，学员仅选中部分正确选项时，将根据选项数/正确选项总数计算该学员的本题得分。选中错误选项将不得分">
                  <a-icon type="question-circle"/>
                </a-tooltip>
              </a-checkbox>
            </div>
          </div>
          <div class="group_questionShow">
            <div class="empty_q_tip" v-if="item.bizContent && item.bizContent.length == 0">当前题型还是空空如也，点击按钮添加试题！</div>
            <div class="manual-cont">


              <div class="flex-container">
                <div class="leftContent">
                  <div class="m-example questions" v-if="item.key == '1' || item.key == '2'" :key="childIndex" v-for="(childItem,childIndex) in item.bizContent">
                    <div class="flex-container flex-jus-sb">
                      <div class="contentTitle">{{childItem.question}}</div>
                      <a-icon  @click="deleteFun(1,index,childIndex)" type="delete"/>
                    </div>
                    <div class="flex-container flex-align-c flex-jus-sb">
                      <div>
                        <div :class="getIndex(childItem.test_ans_right, answerIndex) ?'correctAnswer' : ''"
                             class="flex-container flex-align-c forContent" :key="answerIndex"
                             v-for="(answer,answerIndex) in setAnswer(childItem)">
                          <span class="icon">{{A_Z[answerIndex+1]}}</span>
                          <p class="margin-l-20">{{answer['answer'+(answerIndex+1)]}}</p>
                        </div>
                        <div class="">答案：{{childItem.test_ans_right}}</div>
                        <div class="">解析：{{childItem.analysis}}</div>
                      </div>
                      <div class="rightInput">
                        <span class="m-example-score ">分数<a-input-number class="margin-l-5 margin-r-5" v-model="item['questionScores'+(childIndex+1)]" :min="0"/>分</span>
                      </div>
                    </div>
                  </div>
                  <!--                <div v-if="item.type == '2'" :key="childIndex" v-for="(childItem,childIndex) in item.bizContent"></div>-->
                  <div class="m-example questions" v-if="item.key == '3'" :key="childIndex" v-for="(childItem,childIndex) in item.bizContent">
                    <div class="flex-container flex-jus-sb">
                      <div class="contentTitle">{{childItem.question}}</div>
                      <a-icon  @click="deleteFun(1,index,childIndex)" type="delete"/>
                    </div>
                    <div class="forContent " :class="childItem.test_ans_right.indexOf('正确') === 0 ? 'correctAnswer' :''">
                      <a-icon type="check"/>
                      正确
                    </div>
                    <div class="forContent " :class="childItem.test_ans_right.indexOf('错误') === 0 ? 'correctAnswer' :''">
                      <a-icon type="close"/>
                      错误
                    </div>
                    <div class="">答案：{{childItem.test_ans_right}}</div>
                    <div class="">解析：{{childItem.analysis}}</div>
                  </div>
                  <div class="m-example questions" v-if="item.key == '4' || item.key == '5'" :key="childIndex" v-for="(childItem,childIndex) in item.bizContent">
                    <div class="flex-container flex-jus-sb">
                      <div class="contentTitle">{{childItem.question}}</div>
                      <a-icon  @click="deleteFun(1,index,childIndex)" type="delete"/>
                    </div>
                    <div class="">答案：{{childItem.test_ans_right}}</div>
                    <div class="">解析：{{childItem.analysis}}</div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div class="ipt-questions-box ipt-questions-box-w com-drop buttonLeft default_create_q_model">
          <div class="create_q_contain flex-container flex-jus-c flex-align-c" v-show="!isButtonShow"
               @mouseover="hoverMouse(true)">
            <a-icon type="plus-circle"/>
            <p class="create_q_group_text">创建新的大题</p>
          </div>
          <div v-show="isButtonShow" class="create_q_contain flex-container flex-jus-c flex-align-c"
               @mouseleave="hoverMouse(false)">
            <a-button @click="addData(index,item)" v-if="item.key !='0'" class="margin-l-10" type="primary" :key="index" ghost
                      v-for="(item,index) in arrList">{{item.label}}
            </a-button>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-nine flex-container flex-align-c flex-jus-e margin-top-10">
      <a-button class="margin-r-5" type="primary" ghost>预览</a-button>
<!--      <a-button class="margin-r-5" type="primary" ghost>下载</a-button>-->
      <a-button class="margin-r-5" type="primary" @click="addShow1=true" ghost>添加试题</a-button>
      <a-button class="margin-r-5" type="primary" ghost>试卷分类</a-button>
      <a-button type="primary" >保存</a-button>
    </div>
    <!--    选择试题-->
    <a-modal :footer="null" :maskClosable="false" centered
             title="选择试题" destroyOnClose
             wrapClassName="editPopClass"
             width="73%"
             :visible="addShow"
             @cancel="addShow=false"
    >
      <div class="flex-container margin-b-10">
        <div class="flex-container flex-align-c flex-jus-c margin-r-10">
          试题分类:
          <a-select class="margin-l-5" style="width: 120px">
            <a-select-option value="jack">Jack</a-select-option>
          </a-select>
        </div>
        <div class=" flex-container flex-align-c flex-jus-c margin-r-10">
          试题难度
          <a-select v-model="testDifficult" @change="onSelect" class="margin-l-5" style="width: 80px">
            <a-select-option v-for="item in arrList1" :key="item.key" :value="item.key">{{item.label}}</a-select-option>
          </a-select>
        </div>
        <div class="flex-container flex-align-c flex-jus-c margin-r-15">
          创建时间:
          <a-range-picker class="margin-l-5" @change="onChangeDate"/>
        </div>
        <a-button class="margin-r-15" type="primary" @click="reset()" ghost>重置</a-button>
        <a-button class="margin-r-15" type="primary" @click="getData()">搜索</a-button>
        <a-button class="margin-r-15" type="primary" @click="clone()">关闭</a-button>
        <a-button type="primary" @click="saveData()">保存</a-button>
      </div>
      <a-spin :spinning="spinning" tip="正在请求数据,请稍等....">
        <a-table

          :rowKey="rowFun"
          :rowSelection="rowSelection"
          ref="table"
          size="small"
          :pagination="{
                    current:current,
                    showQuickJumper:true,
                    defaultPageSize:pageSize,
                    total:total,
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '30', '40'], // 每页数量选项
                }"
          :columns="columns" :dataSource="data" :scroll="{y: 300}">
        </a-table>
      </a-spin>
    </a-modal>

    <a-modal :footer="null" :maskClosable="false"
             title="新增试题"
             wrapClassName="addStClass"
             width="73%"
             :visible="addShow1"
             @cancel="addShow1=false"
    >
      <addComponent :arr-list="arrList" :arr-list1="arrList1"/>
    </a-modal>
  </div>
</template>

<script>
    import addComponent from '@/views/administration/testQuestions/add/wangAdd'
    const columns = [
        {title: '题型', width: 100, dataIndex: 'type', key: 'type'},
        {title: '分类', width: 150, dataIndex: 'classification', key: 'classification'},
        {title: '试题内容', dataIndex: 'content', key: 'content', width: 150},
        {title: '难度', dataIndex: 'difficult', key: 'difficult', width: 150},
        {title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 80},
    ];
    export default {
        name: "editPop",
        inject: ['getReaciveNameFromParent', 'arrList1'],
        data() {
            return {
                columns,
                judgement: {
                    '对': "正确",
                    '错': "错误",
                },
                data: [],
                jsonData: [],
                selectData: [],
                total: 0,
                testDifficult: '',
                testStartTime: '',
                testEndTime: '',
                tableHeight: 0,
                current: 1,
                pageSize: 10,
                selectIndex: undefined,
                selectobj: {},
                isButtonShow: false,
                addShow: false,
                addShow1: false,
                spinning: false,
                jsonList: [],
            }
        },
        computed: {
            reactiveNameFromParent() {
                return this.getReaciveNameFromParent()
            },
            rowSelection() {
                const {selectedRowKeys} = this;
                return {
                    onChange: (selectedRowKeys, selectedRows) => {
                        this.selectData = selectedRows
                    },
                    getCheckboxProps: record => ({
                        props: {
                            defaultChecked :false,
                        },
                    }),
                };
            },
            test_total(){
                this.jsonList.reduce(function (num, currentValue, currentIndex, arr) {
                    if(currentValue.bizContent){
                        return num+=currentValue.bizContent.length
                    }
                },0)
            },
        },
        components: {
             addComponent
        },
        methods: {
            getIndex(code,index){
                if(this.A_ZCode[code.split('')[index]] == index ? true : false){
                    return  true
                }else {
                    for (let i = 0; i <code.split('').length ; i++) {
                        var retCode =this.A_ZCode[code.split('')[i]] == index ? true : false
                    }
                    return retCode
                }
            },
            setAnswer(items) {
                var arr = [], arr1 = [];
                for (let item in items) {
                    arr.push(item);
                }
                for (let i = 0; i < arr.sort().length; i++) {
                    if (arr[i].indexOf('answer') == 0) {
                        arr1.push({
                            [arr[i]]: items[arr[i]]
                        })
                    }
                }
                return arr1
            },
            clone() {
                this.addShow = false;
                this.selectobj = {};
                this.selectIndex = undefined;
            },
            onSelect(key) {
                this.testDifficult = key;
                this.getData()
            },
            saveData() {
                var ids = this.selectData.reduce(function (obj, currentValue, currentIndex, arr) {
                    return obj += `${currentValue.id},`
                }, '');
                this.$post('/baseinfo/admin/load_datas', {'ids': ids.substr(ids, ids.length - 1)}).then(json => {
                    if (json.data && json.data.code == 10000) {
                        this.jsonList[this.selectIndex]['bizContent'] = json.data.bizContent
                    } else {
                        this.$message.error('没查询到题目');
                    }
                })
                this.addShow = false;
            },
            hoverMouse(type) {
                this.isButtonShow = type
            },
            deleteFun(type,index,childIndex) {
                if(type == 0){
                    this.jsonList.splice(index,1)
                }else {
                    this.jsonList[index].bizContent.splice(childIndex,1)
                    this.$forceUpdate()
                }
            },
            addData(index, item) {
                this.jsonList.push({...item})
            },
            reset() {
                this.testStartTime = '';
                this.testEndTime = '';
                this.testDifficult = '';
                this.current = 1;
                this.pageSize = 10;
            },
            selectAdd(item, index) {
                this.selectIndex = index
                this.addShow = true;
                this.selectobj = item;
                this.reset()
                this.$nextTick(() => {
                    this.getData()
                })
            },
            onChangeDate(date, dateString) {
                this.testStartTime = dateString[0]
                this.testEndTime = dateString[1]
                this.getData()
            },
            getData() {
                var token = {
                    "current": this.current,
                    "rowCount": this.pageSize,
                    testType: this.selectobj.key,
                    testDifficult: this.testDifficult,
                    testClassification: '',
                    testStartTime: this.testStartTime,
                    testEndTime: this.testEndTime,
                    testTypeCount: 0,
                }
                this.$post('/baseinfo/admin/showtestqm_grid', token).then(json => {
                    if (json.data.code == 10000) {
                        this.data = json.data.bizContent.rows;
                        this.total = json.data.bizContent.total;
                        this.spinning = false;
                    }
                })
            },
        },
        mounted() {

        },
        created() {
        },
    }
</script>

<style scoped lang="stylus">
  #editPop {
    height: 100%;
    overflow: auto;
    .modelContent{
      height: calc(100% - 42px);
    }
    .background-eff3f7 {
      background-color #eff3f7
    }

    .modal-body-style {
      background: #eff3f7;
      overflow auto;
      border-radius: 4px;
      background-clip: padding-box;
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.10);
    }

    .modal-body {
      .group_simple {
        padding 15px 20px 10px 20px
        margin-bottom: 10px;

        .test_tittle {
          display: inline-block;
          max-width: 100px;
          word-wrap: break-word;
          margin: 0px 14px;
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: #3A3E51;
          margin-left: 0;
          margin-top: 10px;
        }

        .left_p {
          margin-top: 10px;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #6D717C;
          margin-left: 0;

          span {
            color: #1A8CFE;
            margin: 0 10px;
          }
        }

        input {
          margin: 0 10px;
          border: 1px solid #D8D8D8;
          border-radius: 4px;
          width: 56px;
          padding 0 5px;
          outline none
        }
      }

      .item-active {
        border: 1px solid #1A8CFE;
        box-shadow: 0 0 10px 0 rgba(47, 124, 219, 0.30)
      }

      .info-board {
        background-color: #fff;
        border-radius: 4px;

        .total {
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: #3A3E51;
          text-align: left;
          padding: 16px 0 0 20px;

          .test_total, .total_score {
            color: #1A8CFE;
            margin: 0 10px;
          }
        }
      }
    }

    .questions-board {
      .ipt-questions-box {
        height: 160px;
        padding: 0;
        width: calc(100% - 40px);
        margin: 20px;
        border: 1px solid #DEDEDE;
        border-radius: 4px;
        text-align: center;
        position: relative;

        .create_q_contain {
          height 100%
          cursor pointer
        }
      }

      .empty_q_tip {
        height: 83px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #C1C1CB;
        letter-spacing: 0;
        text-align: center;
        line-height: 83px;
        background-color #ffffff;
      }

      .manual-cont {
        .leftContent {
          width 100%;

          .questions{
            background: unset;
            padding: 0;
            margin: 20px 30px 20px 30px;
            border-bottom: 1px solid #ffffff;
            border-radius: unset;
            padding-bottom: 10px;
          }
          .contentTitle {
            word-wrap: break-word;
            font-weight: bold;
            word-break: normal;
            font-size: 16px;
            margin-bottom: 20px;
          }

          .icon {
            border: 1px solid #C1C1CB;
            text-align: center;
            width: 20px;
            height: 20px;
            font-size: 14px;
            font-style: unset;
            border-radius: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .forContent {
            min-height: 20px;
            margin-bottom: 21px;
          }

          .correctAnswer {
            color: #1A8CFE;

            .icon {
              color: #fff;
              background-color: #1A8CFE;
              border-color: #1A8CFE;
            }
          }
        }

      }
    }
  }
</style>
