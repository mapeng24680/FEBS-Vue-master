<template>
  <div class="exam">
    <a-button @click="choseExamClick" class="choseExamBtn">选择考试</a-button>
    <exam-msg v-if="showExamMsg" :examInfo="examInfo"></exam-msg>
    <a-spin :spinning="loading">
      <div class="bottomClass">
        <a-tabs :defaultActiveKey="tabsDefault" @change="tabsCallback">
          <a-tab-pane tab="成绩分析" key="1"></a-tab-pane>
          <a-tab-pane tab="分数段统计" key="2"></a-tab-pane>
          <a-tab-pane tab="考生信息" key="3"></a-tab-pane>
        </a-tabs>
        <grade-analyze :examInfo="selectedExam"></grade-analyze>
      </div>
    </a-spin>
    <chose-exam @closeDialog="closeDialog" @chosedExam="chosedExam" v-if="showChoseExam"></chose-exam>
  </div>
</template>
<script>
//考试信息
import examMsg from "@/components/examAnalyze/examMsg.vue";
//成绩分析
import gradeAnalyze from "@/components/examAnalyze/gradeAnalyze.vue";
//选择考试
import choseExam from "@/components/mgrNew/choseExam.vue";
export default {
  //考试分析
  name: "ExamAnalyze",
  components: {
    examMsg,
    gradeAnalyze,
    choseExam
  },
  data() {
    return {
      tabsDefault: "1",
      showChoseExam: false,
      loading: false,
      showExamMsg: false,
      selectedExam: {},
      examInfo: {}
    };
  },
  methods: {
    //考试信息
    examInfoMethod(examInfoId) {
      var that = this;
      this.$post("/analysis/ae/exam_info", {
        examInfoId: examInfoId
      })
        .then(r => {
          let data = r.data;
          console.log(data);
          that.loading = false;
          if (data.code == 10000) {
            that.showExamMsg = true;
            that.examInfo = data.bizContent;
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
    tabsCallback(activeKey) {
      this.tabsDefault = activeKey;
    },
    //选择考试
    choseExamClick() {
      this.showChoseExam = true;
    },
    closeDialog() {
      this.showChoseExam = false;
    },
    //选中考试
    chosedExam(exam) {
      this.showChoseExam = false;
      this.examInfoMethod(exam.id);
      this.selectedExam = exam;
    }
  }
};
</script>

<style lang="less" scoped>
.exam {
  width: 100%;
  height: 640px;
  overflow-y: auto;
}

.bottomClass {
  width: 100%;
}

.choseExamBtn {
  position: fixed;
  right: 50px;
  top: 100px;
}
</style>
