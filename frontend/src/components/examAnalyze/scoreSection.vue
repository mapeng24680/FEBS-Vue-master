<template>
  <div class="mainClass">
    <a-breadcrumb>
      <a-breadcrumb-item style="color:#000">对比部门</a-breadcrumb-item>
      <a-breadcrumb-item style="color:#f00" v-for="item in selectedExams" :key="item.id">{{item.examName}}</a-breadcrumb-item>
      <a-breadcrumb-item><a-button @click="choseExam">选择考试</a-button></a-breadcrumb-item>
    </a-breadcrumb>
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
    <a-divider></a-divider>
    <a-icon
      v-if="barType > 0"
      type="bar-chart"
      @click="barChartClick"
      :style="barType==1 ? 'color:#f00' : 'color:#4A4A4A'"
    />
    <a-icon
      v-if="barType > 0"
      type="line-chart"
      @click="lineChartClick"
      :style="barType==2 ? 'color:#f00' : 'color:#4A4A4A'"
    />
    <a-spin :spinning="loading">
      <chart-bar v-show="barType==1 " :chartData="chartData" :xAxis="xAxis"></chart-bar>
      <chart-line v-show="barType==2 " :chartData="chartData" :xAxis="xAxis"></chart-line>
    </a-spin>
    <chose-exam isRadio='2' @closeDialog="closeDialog" @choseMultipleExam="choseMultipleExam" v-if="showChoseExam"></chose-exam>

  </div>
</template>

<script>
import ChartBar from "@/components/examAnalyze/chartBar.vue";
import ChartLine from "@/components/examAnalyze/chartLine.vue";

import choseExam from "@/components/mgrNew/choseExam.vue";

export default {
  //分数段统计
  name: "scoreSection",
  props: {
    examInfo: {
      type: Object
    }
  },
  components: {
    ChartBar,
    ChartLine,
    choseExam
  },
  watch: {
    examInfo: function(value) {
      this.selectedExams=[];
      this.selectedExams.push(value);
      this.loadChartData();
    }
  },
  data() {
    return {
      loading: false,
      showBar: false,
      showChoseExam:false,
      //需要对比的所有考试
      selectedExams:[],
      barType: 0,
      startTime1: "",
      startTime2: "",
      commitTime1: "",
      commitTime2: "",
      xAxis: [],
      chartData: []
    };
  },
  mounted() {
    console.log('scoreSection--mounted')
    if(this.selectedExams.length == 0) {
      this.selectedExams.push(this.examInfo);
    }
    this.loadChartData();
  },
  methods: {

    //进入考场时间
    InterRoomChange(date, dateString) {
      this.startTime1 = dateString[0];
      this.startTime2 = dateString[1];
      this.stuInfoMethod();
      this.stuChartMethod();
    },
    //交卷时间
    commitExamChange(date, dateString) {
      this.commitTime1 = dateString[0];
      this.commitTime2 = dateString[1];
      this.stuInfoMethod();
      this.stuChartMethod();
    },
    barChartClick() {
      this.barType = 1;
    },
    lineChartClick() {
      this.barType = 2;
    },
    closeDialog() {
      this.showChoseExam = false;
    },
    choseExam() {
      this.showChoseExam = true;
    },
    //选中考试
    choseMultipleExam(exams) {
      this.showChoseExam = false;
      this.selectedExams = exams;
      this.loadChartData();
    },
    loadChartData() {
      this.loading = true;
      var that = this;
      var examIDs = [];
      this.selectedExams.forEach( item => {
        examIDs.push(item.id);
      })
      this.$post("/analysis/ae/score_section_count", {
        examInfoIds: examIDs,
        scoreSections:'',
        startTime1: that.startTime1,
        startTime2: that.startTime2,
        commitTime1: that.commitTime1,
        commitTime2: that.commitTime2,
      })
        .then(r => {
          let data = r.data;
          console.log(data);
          that.loading = false;
          if (data.code == 10000) {
            var dic = data.bizContent;
            this.xAxis = dic['x'];
            debugger;
            var array = [];
            let that = this;
            dic["data"].forEach(item => {
              array.push({ name: item["name"], data: item['data'] });
            });
            debugger;
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

.itemClass{
  font-size: 13px;
}
</style>