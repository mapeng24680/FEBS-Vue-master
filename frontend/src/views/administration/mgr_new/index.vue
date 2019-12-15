<template>
  <div class="exam_mgr_new" ref="mianId" @click="tapWindowClose" :loading="loading">
    <div class="mgr_new_head">
      <a-Button
        v-if="tabsDefault=='1'"
        @click="choseExamClick"
        type="primary"
        icon="plus-square"
      >选择考试</a-Button>
      <a-Button v-if="tabsDefault=='2'" @click="choseStuClick" type="primary" icon="plus-square">选择考生</a-Button>
      <a-Button type="primary" icon="export">导出</a-Button>
      <a-Button v-if="tabsDefault=='2'" type="primary" icon="delete">删除</a-Button>
      <a-Button
        v-if="tabsDefault=='1'"
        type="primary"
        @click="commitExamClick"
        icon="vertical-align-top"
      >批量交卷</a-Button>
      <!-- <a-Button v-if="tabsDefault=='1'" type="primary" icon="vertical-align-bottom">批量补考</a-Button> -->

      <a-popover v-if="tabsDefault=='1'" trigger="click" v-model="visible">
        <p style="height:30px" slot="content">修改部门</p>
        <p style="height:30px" @click="recoverExam" slot="content">恢复考试</p>
        <p style="height:30px" slot="content">导出附件链接</p>
        <p style="height:30px" slot="content">删除</p>
        <a-button type="primary">更多</a-button>
      </a-popover>

      <a-button
        v-if="tabsDefault=='1'"
        @click="advanceClick"
        class="moreSearch"
        type="primary"
        icon="search"
      >高级搜索</a-button>

      <a-input-search
        v-if="tabsDefault=='1'"
        class="searchBarClass"
        placeholder="请输入姓名、账号信息"
        style="width: 200px"
        @change="searchBarChange"
      />


    </div>
    <div>
      <a-tabs :defaultActiveKey="tabsDefault" @change="tabsCallback">
        <a-tab-pane tab="按开始查询批改" key="1"></a-tab-pane>
        <a-tab-pane tab="按考生查询批改" key="2"></a-tab-pane>
      </a-tabs>
      <div class="switchClass">
        按考试查询批改按考生查询批改考生信息对子管理员可见&nbsp;
        <a-tooltip placement="bottom" title="关闭后，所有子管理员不可见考生相关信息，同时无法进行导出、下载、按考生查询批改等相关功能">
          <a-icon type="question-circle" />
        </a-tooltip>
        <a-switch defaultChecked @change="switchChange" />
      </div>
      <a-table  :rowKey="rowFun" :columns="tabsDefault=='1' ? examColumns : stuColumns" :dataSource="data1" :pagination="pagination1"></a-table>

      <a-spin :spinning="loading">
        <a-table
          class="tableClass2"
          :columns="tabsDefault=='1' ? examResultCol :  stuResultCol"
          :dataSource="data2"
          size="small"
          :rowSelection="{onChange:onSelectChange,selectedRowKeys}"
          :scroll="{y: tableHeight}"
          :pagination="pagination"
          @change="tableChange"
        >
          <template slot="control" slot-scope="text, record">
            <a-tooltip>
              <template slot="title">判分</template>
              <a-icon type="solution" />
            </a-tooltip>
            <a-tooltip>
              <template slot="title">下载</template>
              <a-icon type="vertical-align-bottom" />
            </a-tooltip>
            <a-tooltip>
              <template slot="title">删除</template>
              <a-icon @click.stop="deleteTableData(record)" type="delete" />
            </a-tooltip>
          </template>
        </a-table>
      </a-spin>

      <advance-search class="moreSearch" v-if="showSearchDialog" :location="location"></advance-search>
      <chose-exam @closeDialog="closeDialog" @chosedExam="chosedExam" v-if="showChoseExam"></chose-exam>
      <chose-stu @closeDialog="closeDialog" @chosedStu="chosedStu" v-if="showChoseStu"></chose-stu>
      <commit-exam
        @closeDialog="closeDialog"
        :showContent="showContent"
        @sureCommitExam="sureCommitExam"
        v-if="showCommitExam"
      ></commit-exam>
    </div>
  </div>
</template>

<script>
import advanceSearch from "@/components/mgrNew/advancedSearch.vue";
import choseExam from "@/components/mgrNew/choseExam.vue";
import CommitExam from "@/components/mgrNew/commitExam.vue";
import choseStu from "@/components/mgrNew/choseStu.vue";

const examColumns = [
  { title: "考试名称", key: "1", dataIndex: "examName" },
  { title: "考试类型", key: "2", dataIndex: "examStyleName" },
  { title: "考试时间", key: "3", dataIndex: "examTime" }
];

const stuColumns = [
  { title: "账号", key: "1", dataIndex: "userName" },
  { title: "考生姓名", key: "2", dataIndex: "surname" },
  { title: "考生部门", key: "3", dataIndex: "departmentName" }
];

const examResultCol = [
  { title: "账号", key: "1", dataIndex: "phone", width: "10%" },
  { title: "用户名", key: "2", dataIndex: "surname", width: "10%" },
  {
    title: "身份认证状态",
    key: "3",
    dataIndex: "examVerifyStatus",
    width: "15%"
  },
  { title: "所属部门", key: "4", dataIndex: "depName", width: "10%" },
  { title: "分数", key: "5", dataIndex: "results", width: "5%" },
  { title: "及格", key: "6", dataIndex: "isPass", width: "5%" },
  { title: "是否为补考", key: "7", dataIndex: "isMakeup", width: "8%" },
  { title: "强制交卷", key: "8", dataIndex: "isForce", width: "8%" },
  { title: "交卷时间", key: "9", dataIndex: "modifyTime", width: "14%" },
  {
    title: "操作",
    key: "10",
    dataIndex: "control",
    scopedSlots: { customRender: "control" }
  }
];

const stuResultCol = [
  { title: "考试名", key: "1", dataIndex: "examName", width: "10%" },
  { title: "分类", key: "2", dataIndex: "examStyleName", width: "10%" },
  {
    title: "身份认证状态",
    key: "3",
    dataIndex: "examVerifyStatus",
    width: "17%"
  },
  { title: "分数", key: "5", dataIndex: "results", width: "5%" },
  { title: "及格", key: "6", dataIndex: "isPass", width: "5%" },
  { title: "是否为补考", key: "7", dataIndex: "isMakeup", width: "8%" },
  { title: "强制交卷", key: "8", dataIndex: "isForce", width: "8%" },
  { title: "交卷时间", key: "9", dataIndex: "modifyTime", width: "18%" },
  {
    title: "操作",
    key: "10",
    dataIndex: "control",
    scopedSlots: { customRender: "control" }
  }
];
const data1 = [];
const data2 = [];

export default {
  data() {
    return {
      visible: false,
      data1, //选择的试卷数据
      examColumns, //选择试卷头部
      stuColumns,

      data2,
      examResultCol,
      stuResultCol,
      loading: false,
      pagination1: false,
      showSearchDialog: false,
      showChoseExam: false,
      showChoseStu:false,
      showCommitExam: false,
      showContent: {},
      selectedRowKeys: [],
      location: {},
      tabsDefault: "1",
      tableHeight: 0,
// allowAddtestqm: 1
// allowAdminOpRecord: 1
// allowAdminOrderRecord: 1
// allowAdvancedSet: 1
// allowAnalysisCourse: 1
// allowAnalysisExam: 1
// allowAnalysisPerson: 1
// allowAppSet: 1
// allowCertificateCenter: 1
// allowCourseAdd: 1
// allowCourseManager: 1
// allowCourseShow: 1
// allowCustomProcess: 1
// allowDevInfoMgr: 1
// allowExamMgr: 1
// allowExamShow: 1
// allowExamineePayRecord: 1
// allowFileManager: 1
// allowFollowApp: 1
// allowLogoSetting: 1
// allowModify: 1
// allowPaperAdd: 1
// allowPaperMgr: 1
// allowPayCenter: 1
// allowPointRank: 1
// allowProcessShow: 1
// allowResultMgr: 1
// allowShowtestqm: 1
// allowSignUp: 1
// allowStudyRecord: 1
// allowSubAdminMgr: 1
// allowTransactionRecord: 1
// allowUserAdd: 1
// allowUserMgr: 1
// allowUserPaySet: 1
// allowUserReg: 1
// companyId: 0
// id: 0
// userId: 0
      AllRights: {},
      currentExam:{},
      author: ["已通过", "认证失败", "无认证信息", "通过，与用户信息不一致"],
      judje: ["否", "是"],
      pagination: {
        current: 1, //当前页数 v-model
        defaultCurrent: 1, //默认的当前页数
        defaultPageSize: 10, //每页显示几条数据
        showSizeChanger: true,
        total: data2.length, //总数
        pageSizeOptions: ["10", "20", "30", "40", "50"],
        showTotal: total => `共 ${data2.length} 条数据`
      }
    };
  },
  // watch: {
  //   searchPhrase(val) {
  //     this.searchPhrase = val
  //     this.resultData(this.currentExam.id);
  //     debugger
  //   },
  //   current(val) {
  //     console.log("current", val);
  //   }
  // },
  mounted() {
    let mainDom = this.$refs.mianId;
    this.tableHeight = mainDom.offsetHeight - 580 + "px";
    this.getAllRights();
  },
  components: {
    advanceSearch,
    choseExam,
    CommitExam,
    choseStu
  },
  methods: {
    tapWindowClose(event) {
      // var btn = document.querySelector(".moreSearch");
      // if (!btn.contains(event.target)) {
      //   this.showSearchDialog = false;
      // }
      // debugger;
    },
    deleteTableData(record){
      debugger
    },
    /**
     *  分页、排序、筛选变化时触发
     */
    tableChange(pagination, filters, sorter) {
      this.pagination = pagination;
    },
    //恢复考试
    recoverExam() {
      if (this.selectedRowKeys.length == 0) {
        this.$notification["warning"]({
          message: "提示",
          description: "请选择要恢复考试的考生成绩"
        });
        return false;
      }
      this.visible = false;
      this.showContent.title = "恢复考试";
      this.showContent.content =
        "恢复考试能够将考生已经提交的试卷恢复到提交前的状态，考生能够接着提交前的试卷继续答题，正在考试的考生试卷将无法被退回。请确认是否将选中的考生进行恢复考试操作。";
      this.showContent.tips = "";
      this.showCommitExam = true;
    },
    //批量交卷
    commitExamClick() {
      if (this.selectedRowKeys.length == 0) {
        this.$notification["warning"]({
          message: "提示",
          description: "请选择要交卷的考试"
        });
        return false;
      }
      this.showContent.title = "批量交卷";
      this.showContent.content =
        "批量交卷会立即结束考生答题，并进行交卷和判分处理，是否继续？";
      this.showContent.tips = "注：交卷结束后可进入消息中心查看交卷情况";
      this.showCommitExam = true;
    },
    //弹窗确定按钮
    sureCommitExam() {
      this.showCommitExam = false;
      this.loading = true;
      if (this.showContent.title == "批量交卷") {
        this.commitExamMethod();
      } else {
        this.recoverExamMethod();
      }
    },

    //批量交卷
    commitExamMethod() {
      var that = this;
      var examIds = [];
      for (var i = 0; i < this.selectedRowKeys.length; i++) {
        var index = this.selectedRowKeys[i];
        examIds.push(this.data2[index].id);
      }
      this.$post("/examadmin/exam/batch/force_submit", {
        examResultsIds: examIds
      })
        .then(r => {
          let data = r.data;
          console.log(data);
          that.loading = false;
          if (data.code == 10000) {
          } else {
            this.$notification["error"]({
              message: "提示",
              description: "网络错误"
            });
          }
        })
        .catch(e => {
          console.error(e);
          that.loading = false;
        });
    },
    //恢复考试
    recoverExamMethod() {
      var that = this;
      var examIds = [];
      var examInfoId = [];
      for (var i = 0; i < this.selectedRowKeys.length; i++) {
        var index = this.selectedRowKeys[i];
        examIds.push(this.data2[index].id);
        examInfoId.push(this.data2[index].examInfoId);
      }
      this.$post("examadmin/exam/back_exam_results", {
        examResultsIds: examIds,
        examInfoId: examInfoId
      })
        .then(r => {
          let data = r.data;
          console.log(data);
          that.loading = false;
          if (data.code == 0) {
            that.$notification["success"]({
              message: data.bizContent,
              description: "操作成功"
            });
          } else {
            this.$notification["error"]({
              message: "提示",
              description: "网络错误"
            });
          }
        })
        .catch(e => {
          console.error(e);
          that.loading = false;
        });
    },

    getAllRights() {
      var that = this;
      this.$post("/index/admin/getAllRights", {})
        .then(r => {
          let data = r.data;
          console.log(data);
          that.loading = false;
          if (data.code == 10000) {
            that.AllRights = data.bizContent;
          } else {
            this.$notification["error"]({
              message: "提示",
              description: "网络错误"
            });
          }
        })
        .catch(e => {
          console.error(e);
          that.loading = false;
        });
    },

    //table选择事件
    onSelectChange(selectedRowKeys) {
      console.log("selectedRowKeys changed: ", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    searchBarChange(value) {
      this.searchPhrase = value.data;
      if(this.tabsDefault == 1) {
        this.examResultData(this.currentExam.id);
      }else {
        this.stuResultData(this.currentExam.id);
      }
    },
    handleChange() {},

    //是否对子管理员可见
    switchChange(value) {
      var that = this;
      this.$get("/examadmin/admin/subadmin_islook", {
        isLook: value ? "1" : "0"
      })
        .then(r => {
          console.log(r);
        })
        .catch(e => {
          console.error(e);
        });
    },
    tabsCallback(activeKey) {
      this.tabsDefault = activeKey;
      if(activeKey == '1') {
        this.showChoseExam = true;
      }else {
        this.showChoseStu = true;
      }
    },
    //高级搜索确定
    advanceClick(event) {
      this.location = event;
      this.showSearchDialog = !this.showSearchDialog;
    },
    //关闭考试选择
    choseExamClick() {
      this.showChoseExam = !this.showChoseExam;
    },
    //选择考生
    choseStuClick() {
      this.showChoseStu = !this.showChoseStu;
    },
    //关闭弹窗
    closeDialog() {
      this.showChoseExam = false;
      this.showCommitExam = false;
      this.showChoseStu = false;
    },
    //选择学生后
    chosedStu(stu) {

      this.data1 = []
      this.currentExam = stu;
      let mainDom = this.$refs.mianId;
      this.tableHeight = mainDom.offsetHeight - 340 + "px";
      this.showChoseStu = false
      var examDic = {};

      examDic.userName = stu.userName;
      examDic.surname = stu.surname;
      examDic.departmentName = stu.departmentName;
      examDic.id = stu.id;
      this.data1.push(examDic);
      this.stuResultData(stu.id);
    },
    //考试选择后
    chosedExam(exam) {

      this.data1 = []
      this.currentExam = exam;
      let mainDom = this.$refs.mianId;
      this.tableHeight = mainDom.offsetHeight - 340 + "px";

      this.showChoseExam = false;
      var examDic = {};
      examDic.examName = exam.examName;
      examDic.examStyleName = exam.examStyleName;
      examDic.examTime = exam.modifiedTime + exam.examEndTime;
      examDic.id = exam.id;

      this.data1.push(examDic);
      this.examResultData(exam.id);
    },
    //选择考试后请求结果
    examResultData(examId) {
      this.loading = true;
      this.data2 = [];
      var that = this;
      this.$post("/examadmin/admin/result/mgr_grid", {
        current: that.pagination.current,
        rowCount: that.pagination.pageSize,
        searchPhrase: that.searchPhrase,
        examInfoId: examId,
        userName: "",
        depIds: "", //所属部分
        isGrade: "", //判分状态
        scoreLeft: "", //分数左区间
        scoreRight: "", //分数右区间
        isPass: "", //是否及格
        startTime: "", //开始时间
        endTime: "", //结束时间
        examVerifyStatus: "", //认证状态
        isCommit: -1, //是否交卷
        forceCommit: -1 //是否强制交卷
      })
        .then(r => {
          let data = r.data;
          console.log(data);
          that.loading = false;
          if (data.code == 10000) {
            let mainDom = that.$refs.mianId;
            that.tableHeight = mainDom.offsetHeight - 340 + "px";

            for (var i = 0; i < data.bizContent.rows.length; i++) {
              var dic = data.bizContent.rows[i];
              dic.examVerifyStatus = that.author[dic.examVerifyStatus];
              dic.isMakeup = that.judje[dic.isMakeup];
              dic.isForce = that.judje[dic.isForce];
              that.data2.push(dic);
            }
          } else {
            this.$notification["success"]({
              message: "提示",
              description: "网络错误"
            });
          }
        })
        .catch(e => {
          console.error(e);
          that.loading = false;
        });
    },
    //选择考生后请求结果
    stuResultData(userId) {
      this.loading = true;
      this.data2 = [];
      var that = this;
      this.$post("/examadmin/admin/result/user_result_grid", {
        current: that.pagination.current,
        rowCount: that.pagination.pageSize,
        searchPhrase: that.searchPhrase,
        userId: userId
      })
        .then(r => {
          let data = r.data;
          console.log(data);
          that.loading = false;
          if (data.code == 10000) {
            let mainDom = that.$refs.mianId;
            that.tableHeight = mainDom.offsetHeight - 340 + "px";

            for (var i = 0; i < data.bizContent.rows.length; i++) {
              var dic = data.bizContent.rows[i];
              dic.examVerifyStatus = that.author[dic.examVerifyStatus];
              dic.isMakeup = that.judje[dic.isMakeup];
              dic.isForce = that.judje[dic.isForce];
              that.data2.push(dic);
            }
          } else {
            this.$notification["success"]({
              message: "提示",
              description: "网络错误"
            });
          }
        })
        .catch(e => {
          console.error(e);
          that.loading = false;
        });
    }
  }
};
</script>
<style lang="less" scoped>
.exam_mgr_new {
  width: 100%;
  overflow: scroll;
  position: relative;
  .tableClass2 {
    margin-top: 20px;
    padding: 0;
  }
  .mgr_new_head {
    .moreSearch {
      float: right;
      line-height: 30px;
      margin-left: 10px;
    }
    .searchBarClass {
      float: right;
    }
  }
  .switchClass {
    font-size: 12px;
    text-align: right;
    position: absolute;
    top: 45px;
    right: 10px;
  }
}
</style>
