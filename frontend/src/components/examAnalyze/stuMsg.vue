<template>
  <div class="mainClass">
    <a-row :gutter="10">
      <a-col :span='6'>
        <div class="itemClass">
          <span>筛选考生</span>
          <a-select defaultValue="全部考生" style="width: 150px" @change="filterStuClick">
            <a-icon slot="suffixIcon" type="down-circle" />
            <a-select-option value="0">全部考生</a-select-option>
            <a-select-option value="1">及格</a-select-option>
            <a-select-option value="2">不及格</a-select-option>
            <a-select-option value="3">已考</a-select-option>
            <a-select-option value="4">漏考</a-select-option>
          </a-select>
        </div>
      </a-col>
      <a-col :span='6'>
        <div class="itemClass">
          <span>对比部门</span>
          <a-select defaultValue="allDepartment" style="width: 150px" @change="departmentChange">
            <a-icon slot="suffixIcon" type="down-circle" />
            <a-select-option value="aAlassDepartment">一级部门</a-select-option>
            <a-select-option value="allDepartment">全部部门</a-select-option>
            <a-select-option value="Yiminghe">选择部门</a-select-option>
          </a-select>
        </div>
      </a-col>
    </a-row>
    <a-row :gutter="10">
      <a-col :span="12">
        <div class="itemClass">
          <span>进入考试时间</span>
          <a-range-picker style="width:380px" showTime @change="InterRoomChange" />
        </div>
      </a-col>
      <a-col :span="12">
        <div class="itemClass">
          <span>交卷时间</span>
          <a-range-picker style="width:380px" showTime @change="commitExamChange" />
        </div>
      </a-col>
    </a-row>
    <a-spin :spinning="loading">
      <a-table
        :columns="columns"
        :dataSource="gridData"
        size="small"
        :pagination="pagination"
        @change="tableChange"
      ></a-table>
    </a-spin>
  </div>
</template>

<script>
const columns = [
  {
    title: "姓名",
    dataIndex: "userName"
  },
  {
    title: "部门",
    dataIndex: "depName"
  },
  {
    title: "答题时长",
    dataIndex: "ansTime"
  },
  {
    title: "交卷时间",
    dataIndex: "commitTime"
  },
  {
    title: "成绩",
    dataIndex: "score"
  },
  {
    title: "结果",
    dataIndex: "result"
  }
];

const gridData = [];

export default {
  //成绩分析
  name: "GradeAnalyze",
  props: {
    examInfo: {
      type: Object
    }
  },
  watch: {
    examInfo: function(value) {
      this.stuInfoMethod();
    }
  },
  data() {
    return {
      loading: false,
      columns,
      gridData,
      startTime1: "",
      startTime2: "",
      commitTime1: "",
      commitTime2: "",
      stuType: 0,
      department: "allDepartment",
      pagination: {
        current: 1, //当前页数 v-model
        pageSize: 10,
        defaultCurrent: 1, //默认的当前页数
        defaultPageSize: 10, //每页显示几条数据
        showSizeChanger: true,
        total: gridData.length, //总数
        pageSizeOptions: ["10", "20", "30", "40", "50"],
        showTotal: total => `共 ${gridData.length} 条数据`
      }
    };
  },
  mounted() {
    this.stuInfoMethod();
  },
  methods: {
    //考生信息
    stuInfoMethod() {
      this.loading = true;
      var that = this;
      this.$post("/analysis/ae/exam_user_analysis", {
        current: that.pagination.current,
        rowCount: that.pagination.pageSize,
        searchPhrase: "",
        depType: that.department,
        resultType: that.stuType,
        examInfoId: that.examInfo.id,
        startTime1: "",
        startTime2: "",
        commitTime1: "",
        commitTime2: ""
      })
        .then(r => {
          let data = r.data;
          console.log(data);
          that.loading = false;
          if (data.code == 10000) {
            that.gridData = data.bizContent.rows;
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
    /**
     *  分页、排序、筛选变化时触发
     */
    tableChange(pagination, filters, sorter) {
      this.pagination = pagination;
    },
    filterStuClick(val) {
      this.stuType = val;
      this.stuInfoMethod();
    },
    //对比部门
    departmentChange(val) {
      this.department = val;
      this.stuInfoMethod();
    },
    //进入考场时间
    InterRoomChange(date, dateString) {
      this.startTime1 = dateString[0];
      this.startTime2 = dateString[1];
      this.stuInfoMethod();
    },
    //交卷时间
    commitExamChange(date, dateString) {
      this.commitTime1 = dateString[0];
      this.commitTime2 = dateString[1];
      this.stuInfoMethod();
    },
    barChartClick() {
      this.barType = 1;
    },
    lineChartClick() {
      this.barType = 2;
    }
  }
};
</script>

<style scoped>
.mainClass {
  height: auto;
}
.ant-row {
  margin-top: 15px;
  margin-bottom: 15px;
}
.itemClass {
  font-size: 13px;
}
</style>