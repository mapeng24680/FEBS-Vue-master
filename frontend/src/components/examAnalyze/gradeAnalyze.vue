<template>
  <div class="mainClass">
    <div class="itemClass">
      <span>对比部门</span>
      <a-select defaultValue="allDepartment" style="width: 150px" @change="handleChange">
        <a-icon slot="suffixIcon" type="down-circle" />
        <a-select-option value="aAlassDepartment">一级部门</a-select-option>
        <a-select-option value="allDepartment">全部部门</a-select-option>
        <a-select-option value="Yiminghe">选择部门</a-select-option>
      </a-select>
    </div>
    <a-row>
      <a-col :span="12">
        <div class="itemClass">
          <span>进入考试时间</span>
          <a-range-picker style="width:400px" showTime @change="InterRoomChange" />
        </div>
      </a-col>
      <a-col :span="12">
        <div class="itemClass">
          <span>交卷时间</span>
          <a-range-picker style="width:400px" showTime @change="commitExamChange" />
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
    <a-divider></a-divider>
    <a-icon v-if='barType > 0' type="bar-chart" @click="barChartClick" :style="barType==1 ? 'color:#f00' : 'color:#4A4A4A'"/>
    <a-icon v-if='barType > 0' type="line-chart" @click="lineChartClick" :style="barType==2 ? 'color:#f00' : 'color:#4A4A4A'"/>
    <chart-bar v-show="barType==1 " :chartData="chartData" :xAxis="xAxis"></chart-bar>
    <chart-line v-show="barType==2 " :chartData="chartData" :xAxis="xAxis"></chart-line>
  </div>
</template>

<script>
import ChartBar from "@/components/examAnalyze/chartBar.vue";
import ChartLine from "@/components/examAnalyze/chartLine.vue";

const columns = [
  {
    title: "部门",
    dataIndex: "department"
  },
  {
    title: "应考人数",
    dataIndex: "examineeNums"
  },
  {
    title: "实考人数",
    dataIndex: "examineeRealNums"
  },
  {
    title: "参考率",
    dataIndex: "examineePercent"
  },
  {
    title: "及格率",
    dataIndex: "passPercent"
  },
  {
    title: "最高分",
    dataIndex: "maxScore"
  },
  {
    title: "最低分",
    dataIndex: "minScore"
  },
  {
    title: "平均分",
    dataIndex: "avgScore"
  },
  {
    title: "平均时长",
    dataIndex: "avGAnswerTime"
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
  components: {
    ChartBar,
    ChartLine
  },
  watch: {
    examInfo: function(value) {
      this.stuInfoMethod();
      this.stuChartMethod();
    }
  },
  data() {
    return {
      loading: false,
      showBar: false,
      columns,
      barType:0,
      gridData,
      xAxis: ["最大值", "最小值", "平均分", "应考人数", "实考人数"],
      chartData: [],
      department: "allDepartment",
      searchPhrase: "",
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
  mounted() {},
  methods: {
    //考生信息
    stuInfoMethod() {
      this.loading = true;
      var that = this;
      this.$post("/analysis/ae/analysis_form_bydep", {
        current: that.pagination.current,
        rowCount: that.pagination.pageSize,
        searchPhrase: that.searchPhrase,
        depType: that.department,
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
    //考生统计图数据
    stuChartMethod() {
      this.loading = true;
      var that = this;
      this.$post("/analysis/ae/analysis_chart_bydep", {
        depType: that.department,
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
            var dic = data.bizContent;
            var array = [];
            let that = this;
            dic["rows"].forEach(item => {
              var bottom = [];
              bottom.push(item["maxScore"]);
              bottom.push(item["minScore"]);
              bottom.push(item["avgScore"]);
              bottom.push(parseInt(item["examineeNums"]));
              bottom.push(item["examineeRealNums"]);
              array.push({ name: item["department"], data: bottom });
              var bottom1 = [];
              bottom1.push(item["maxScore"] * 2);
              bottom1.push(item["minScore"] * 2);
              bottom1.push(item["avgScore"] * 2);
              bottom1.push(parseInt(item["examineeNums"]) * 2);
              bottom1.push(item["examineeRealNums"] * 2);
              array.push({ name: item["department"], data: bottom1 });
              var bottom2 = [];
              bottom2.push(item["maxScore"] * 3);
              bottom2.push(item["minScore"] * 3);
              bottom2.push(item["avgScore"] * 3);
              bottom2.push(parseInt(item["examineeNums"]) * 3);
              bottom2.push(item["examineeRealNums"] * 3);
              array.push({ name: item["department"], data: bottom2 });
            });
            that.barType = 1;
            that.showBar = true;
            that.chartData = array;
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
    //对比部门
    handleChange(val) {
      
    },
    //进入考场时间
    InterRoomChange(date, dateString) {},
    //交卷时间
    commitExamChange(date, dateString) {
    },
    barChartClick(){
      this.barType = 1;
    },
    lineChartClick(){
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
</style>