<template>
  <div class="exam_mgr_new">
    <div class="flex-container flex-align-c margin-b-10">
      <a-Button type="primary" class="margin-r-5" icon="plus-square">创建考试</a-Button>
      <a-Button type="primary" class="margin-r-5" icon="appstore">管理考试分类</a-Button>
      <div class="margin-r-5 flex-container flex-align-c">
        搜索
        <a-input @keyup.enter="getData()" v-model="paperName" class="margin-l-5" style="width: 200px"
                 placeholder="请输入试题或选项内容"/>
      </div>
      <div>
        考试分类
        <a-select defaultValue="lucy" style="width: 120px" @change="handleChange">
          <a-select-option value="jack">Jack</a-select-option>
          <a-select-option value="lucy">Lucy</a-select-option>
        </a-select>
      </div>
    </div>
    <a-spin :spinning="spinning" tip="正在请求数据,请稍等....">
    <a-table  :rowKey="rowFun"
             ref="table"
             :pagination="{
                    current:current,
                    showQuickJumper:true,
                    defaultPageSize:pageSize,
                    total:total,
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '30', '40'], // 每页数量选项
                }"
             :columns="columns" :dataSource="data" :scroll="{y: tableHeight}">
      <template slot="edit" slot-scope="text,record">
        <a-icon type="folder-open" @click="editPop(text,record.id,0)" title="预览"/>
        <a-icon title="编辑" @click="editPop(text,record.id,1)" type="edit"/>
        <a-popconfirm
          v-if="data.length"
          @confirm="() => deletePop(text,record.id)"
        >
          <a-icon slot="icon" type="question-circle-o" style="color: red"/>
          <template slot="title">
            <div class="message-box__title">确定要删除选中的试题吗?</div>
            <p class="message-box__message">同时删除试卷中关联的试题</p>
          </template>
          <a-icon type="delete"  title="删除"/>
        </a-popconfirm>
        <a-icon type="copy" @click="copy(text,record.id)" title="复制试卷"/>
        <a-icon type="file-add" title="创建考试"/>
      </template>
    </a-table>
    </a-spin>

    <a-modal :footer="null" :maskClosable="false" centered
             :title="editObj.isShow=='1'?'编辑试题':'新增试题'"
             wrapClassName="paper_mgr_newEditClass"
             width="73%"
             :visible="addShow"
             @cancel="addShow=false"
    >
      <editIndex/>
    </a-modal>
  </div>
</template>
<script>
    import {mapState, mapMutations} from 'vuex'
    import {TableHeight} from '@/utils/common'
    import editIndex from './edit/index'
    const columns = [
        {title: '名称', width: 100, dataIndex: 'paperName', key: 'paperName'},
        {title: '试卷分类', width: 150, dataIndex: 'paperStyleName', key: 'paperStyleName'},
        {title: '组卷方式', dataIndex: 'paperType', key: 'paperType', width: 150},
        {title: '限制每题时长', dataIndex: 'perTimeRestrict', key: 'perTimeRestrict', width: 150},
        {title: '总分', dataIndex: 'totalScore', key: 'totalScore', width: 80},
        {title: '创建人', dataIndex: 'createUserName', key: 'createUserName', width: 150},
        {title: '创建时间', dataIndex: 'modifiedTime', key: 'modifiedTime', width: 150},
        {
            title: '操作',
            key: 'operation',
            width: 200,
            scopedSlots: {customRender: 'edit'},
        },
    ];

    export default {
        data() {
            return {
                data:[],
                total: 0,
                tableHeight: 0,
                pageSize: 10,
                current: 1,
                paperName:'',
                editObj:{
                    id:'',
                    isShow:'',
                },
                paperStyle:'',
                spinning:false,
                addShow:false,
                columns,
                arrList1: [
                    {'key': 'simple', label: '简单'},
                    {'key': 'middle', label: '普通'},
                    {'key': 'hard', label: '困难'},
                ],
            }
        },
        components:{
            editIndex
        },
        mounted(){
            this.getData()
            this.tableHeight = TableHeight(this.$refs.table.$el, 126);
            let that = this;
            window.onresize = function () {
                that.tableHeight = TableHeight(that.$refs.table.$el, 126)
            };
        },
        provide() {
            return {
                getReaciveNameFromParent: () => this.editObj,
                arrList1:this.arrList1
            }
        },
        methods: {
            handleChange() {
            },
            onChange() {
            },
            editPop(text,id,isShow){
                this.editObj={
                    id:id,
                    'isShow':isShow
                }
                this.addShow=true
            },
            deletePop(text,id){
                this.$get(`/examadmin/admin/paper/del/${id}`).then(json => {
                    if (json.data.code == 10000) {
                        this.$message.success('复制成功');
                        this.getData();
                    }
                })
            },
            copy(text,id){
                this.$post('/examadmin/admin/paper_copy', {paperInfoId:id}).then(json => {
                    if (json.data.code == 10000) {
                        this.$message.success('复制成功');
                        this.getData();
                    }
                })
            },
            getData() {
                this.spinning=true;
                var token = {
                    "current":this.current,
                    "rowCount":this.pageSize,
                    "paperName":this.paperName,
                    "paperStyle":this.paperStyle
                }
                this.$post('/examadmin/admin/paper/mgr_grid', token).then(json => {
                    if (json.data.code == 10000) {
                        this.data = json.data.bizContent.rows;
                        this.total = json.data.bizContent.total;
                        this.spinning=false;
                    }
                })
            },
        },
        computed: {

        }
    }
</script>
<style lang="stylus" >
  .exam_mgr_new {
    width: 100%;
  }
  .paper_mgr_newEditClass {
    .ant-modal {
      height: 90%;
      overflow: hidden;

      .ant-modal-content {
        height: 100%;

        .ant-modal-body {
          height: calc(100% - 55px);

          .addClass {
            height: 100%;

            .ant-tabs {
              height: 100%;
              overflow-y: auto;
              .ant-tabs-content {
                height: calc(100% - 55px);
              }
            }
          }
        }
      }
    }
  }
</style>
