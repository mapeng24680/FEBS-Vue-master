<template>
  <div class="exam_mgr_new">
    <div class="flex-container flex-align-c margin-b-10">
      <a-Button type="primary" class="margin-r-5" @click="addFun()">添加试题</a-Button>
      <a-dropdown class="margin-r-5" placement="bottomCenter">
        <a-button>试题查重</a-button>
        <a-menu slot="overlay" @click="handleMenuClick">
          <a-menu-item v-for="item in arrList" :key="item.key">{{item.label}}</a-menu-item>
        </a-menu>
      </a-dropdown>
      <a-Button @click="handleUpdate" type="primary" class="margin-r-5">批量更新</a-Button>
      <a-Button type="primary" class="margin-r-5">删除</a-Button>
      <a-Button @click="showModal" type="primary" class="margin-r-5">管理试题分类</a-Button>
      <div class="margin-r-5 flex-container flex-align-c">
        创建人
        <a-input style="width: 200px" placeholder="请输入试题或选项内容"/>
      </div>
      <div class="margin-r-5">
        考试分类
        <a-select style="width: 80px" @change="handleChange">
          <a-select-option value="jack">Jack</a-select-option>
          <a-select-option value="lucy">Lucy</a-select-option>
        </a-select>
      </div>
      <div class="margin-r-5">
        试题类型
        <a-select  style="width: 120px" @change="handleChangeType">
          <a-select-option v-for="item in arrList" v-if="item.key !='0'" :key="item.key" :value="item.key">
            {{item.label}}
          </a-select-option>
        </a-select>
      </div>
      <div class="margin-r-5">
        试题难度
        <a-select style="width: 80px" @change="handleChange">
          <a-select-option v-for="item in arrList1" :key="item.key" :value="item.key">{{item.label}}</a-select-option>
        </a-select>
      </div>
    </div>
    <a-table :rowKey="rowFun"
             :rowSelection="rowSelection"
             :columns="columns"
             :dataSource="data"
             :scroll="{y: 300 }"
    >
      <div class="expandBox" slot="expandedRowRender" :key="record.id" slot-scope="record">
        <div class="leftContent">
          <div class="item">
            <div class="keyTitle">题干</div>
            <div class="keyValue">{{record.content}}</div>
          </div>
          <div>
            <div class="item">
              <div class="keyTitle"></div>
              <div class="keyValue">{{record.options.split('|')[0]}}</div>
            </div>
            <div class="item">
              <div class="keyTitle"></div>
              <div class="keyValue">{{record.options.split('|')[1]}}</div>
            </div>
            <div class="item">
              <div class="keyTitle"></div>
              <div class="keyValue">{{record.options.split('|')[2]}}&nbsp;</div>
            </div>
          </div>
        </div>
        <div class="rightContent">
          <div class="item">
            <div class="keyTitle">答案</div>
            <div class="keyValue">{{record.answer}}</div>
          </div>
          <div class="item">
            <div class="keyTitle">解析</div>
            <div class="keyValue">{{record.analysis}}</div>
          </div>
          <div class="item">
            <div class="keyTitle">难度</div>
            <div class="keyValue">{{record.difficult}}</div>
          </div> <!----></div>
      </div>
      <template slot="edit" slot-scope="text,record">
        <a-icon title="编辑" @click="editPop(text,record.id)" type="edit"/>
        <a-icon type="delete"/>
      </template>
    </a-table>

    <!-- 管理考试分类 -->
    <a-modal
      title="管理考试分类"
      :visible="visible"
      @ok="handleOk"
      @cancel="visible=false"
    >
      <p></p>
    </a-modal>

    <a-modal
      title="批量更新"
      :visible="visiblePop"
      @ok="handlePopUpdate"
      @cancel="visiblePop=false"
    >
      <div class="flex-container flex-align-c margin-b-15">
        <p>试题分类：</p>
        <a-button type="primary" ghost>请选择</a-button>
      </div>
      <div class="flex-container flex-align-c margin-b-15">
        <p>试题难度：</p>
        <a-radio-group :options="options" @change="onChange1"/>
      </div>
      <div class="flex-container flex-align-c">
        <p>答案乱序：</p>
        <a-radio-group :disabled="disable" :options="options1" @change="onChange1"/>
        <a-tooltip>
          <template slot="title">
            答案乱序仅限填空题批量更新使用，其他题型无法进行此操作
          </template>
          <a-icon type="question-circle"/>
        </a-tooltip>
      </div>
    </a-modal>
    <a-modal title="试题编辑" centered :footer="null" :maskClosable="false"
             v-model="editPopShow"
             @ok="handlePopEdit"
             width="73%"
             @cancel="editPopShow=false">
      <a-spin :spinning="spinning">
      <wangEditor :arr-list="arrList" :arr-list1="arrList1" :editor-obj="EditorObj"></wangEditor>
      </a-spin>
    </a-modal>
<!--  新增试题-->
    <a-modal :footer="null" :maskClosable="false"
      title="新增试题"
             width="73%"
      :visible="addShow"
      @ok="handleAddFun"
      @cancel="addShow=false"
    >
      <addComponent :arr-list="arrList" :arr-list1="arrList1" :editor-obj="EditorObj"/>
    </a-modal>
  </div>
</template>
<script>
    import {mapState, mapMutations} from 'vuex'
    import wangEditor from './edit/wangEditor'
    import addComponent from './add/index'

    const columns = [
        {
            title: "题型",
            width: 100,
            dataIndex: "type",
            key: "type",
        },
        {title: "分类", width: 150, dataIndex: "classification", key: "classification"},
        {title: "试题内容", dataIndex: "content", key: "content", width: 700},
        {title: "难度", dataIndex: "difficult", key: "difficult", width: 80},
        {title: "创建人", dataIndex: "creater", key: "creater", width: 100},
        {title: "创建时间", dataIndex: "createTime", key: "createTime", width: 150},
        {
            title: "操作",
            dataIndex: "edit",
            key: "7",
            align: "center",
            scopedSlots: {
                // filterDropdown: "filterDropdown",
                filterIcon: "filterIcon",
                customRender: "edit"
            }
        }
    ];
    export default {
        data() {
            return {
                columns,
                value: [],
                editId: '',
                EditorObj: {},
                data: [],
                editPopShow: false,
                addShow: false,
                visible: false,
                spinning: false,
                disable: true,
                key: '',
                type: '',
                selectedRows: [],
                visiblePop: false,
                arrList: [
                    {'key': '0', label: '全选'},
                    {'key': '1', label: '单选题'},
                    {'key': '2', label: '多选题'},
                    {'key': '3', label: '判断题'},
                    {'key': '4', label: '填空题'},
                    {'key': '5', label: '问答题'},
                    // {'key': '6', label: '组合题'},
                    // {'key': '7', label: '录音题'},
                ],
                arrList1: [
                    {'key': 'simple', label: '简单'},
                    {'key': 'middle', label: '普通'},
                    {'key': 'hard', label: '困难'},
                ],
                options: [
                    {label: 'Apple', value: '0'},
                    {label: 'Pear', value: '1'},
                    {label: 'Orange', value: '2'},
                ],
                options1: [
                    {label: '开启', value: '0'},
                    {label: '关闭', value: '1'},
                ],
            };
        },
        components: {
            wangEditor,addComponent
        },
        created() {
            this.getData()
        },
        provide(){
            return {
                arrList1: this.arrList1,
                arrList: this.arrList,
                EditorObj: this.EditorObj,
            }
        },
        methods: {
            rowFun(record) {
                return record.id
            },
            onChange1(event) {

            },
            editPop(obj, id) {
                this.spinning=true;
                this.$get(`/baseinfo/admin/load_data?&id=${id}`).then(json => {
                    if (json.data.code == 10000) {
                        this.$set(this,'EditorObj',json.data.bizContent)
                        this.editPopShow = true;
                        this.spinning=false;
                        this.$forceUpdate()
                    }
                })
            },
            handlePopEdit() {

            },
            handleAddFun(){

            },
            addFun(){
                this.addShow=true;
                this.EditorObj={};
            },
            getData(key) {
                var token = `{"methodName":"showTestqmGrid","token":"${this.ksx.token}","userId":"${this.ksx.user.id}","jsonParam":{"checkDup":${this.key || '0'},"simpleSearch":false,"advancedSearch":false,"isSearching":false,"rowCount":10,"current":1,"searchKey":"","advancedSearchKey":{"creater":"","classification":"","type":"${this.type}","difficult":"","testLabel":""}}}`
                this.$post('/baseinfo/admin/excute', token).then(json => {
                    if (json.data.code == 200) {
                        this.data = json.data.data.bizContent.rows
                    }
                })
            },
            handleMenuClick({key}) {
                this.key = key;
                this.getData()
            },
            showModal() {
                this.visible = true;
            },
            handleOk() {

            },
            onSearch() {
            },
            handleChange() {
            },
            handleChangeType(value) {
                this.type = value
                this.getData()
            },
            handleUpdate() {
                this.visiblePop = true;
            },
            handlePopUpdate() {
                this.visiblePop = false;
            },
        },
        computed: {
            rowSelection() {
                const {selectedRowKeys} = this;
                return {
                    onChange: (selectedRowKeys, selectedRows) => {
                        this.selectedRows = selectedRows
                        console.log(
                            `selectedRowKeys: ${selectedRowKeys}`,
                            "selectedRows: ",
                            selectedRows
                        );
                    }
                };
            },
            ...mapState({
                ksx: state => state.account.ksx
            }),
        }
    };
</script>
<style lang="stylus">
  .exam_mgr_new {
    .expandBox {
      width: 100%;
      box-sizing: border-box;
      padding: 20px 70px 5px 100px;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-direction: row;
      flex-direction: row;
      -ms-flex-pack: justify;
      justify-content: space-between;

      .leftContent, .rightContent {
        width: calc((100% - 60px) / 2);

        .item {
          display: flex;
          -ms-flex-direction: row;
          flex-direction: row;
          margin-bottom: 15px;

          .keyTitle {
            width: 38px;
            font-size: 14px;
            color: #b4b6bd;
            margin-right: 20px;
          }
        }
      }
    }

    .ant-table-row-expand-icon {
      margin-right 0 !important
    }
  }
  .margin-left-54 {
    margin-left: 54px
  }
</style>
