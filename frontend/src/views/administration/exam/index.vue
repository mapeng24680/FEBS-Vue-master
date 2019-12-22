<template>
  <div class="exam">
    <a-button @click="choseExamClick" size='small' class="choseExamBtn">选择考试</a-button>
    <exam-msg v-if="showExamMsg" :examInfo="examInfo" @checkTextAnalyze='checkTextAnalyze'></exam-msg>
    <a-spin :spinning="loading">
      <div v-if="showExamMsg" class="bottomClass">
        <a-tabs :defaultActiveKey="tabsDefault" @change="tabsCallback">
          <a-tab-pane tab="成绩分析" key="1"></a-tab-pane>
          <a-tab-pane tab="分数段统计" key="2"></a-tab-pane>
          <a-tab-pane tab="考生信息" key="3"></a-tab-pane>
        </a-tabs>
        <grade-analyze v-if="tabsDefault==1" :examInfo="selectedExam"></grade-analyze>
        <score-section v-if="tabsDefault==2" :examInfo="selectedExam"></score-section>
        <stu-msg v-if="tabsDefault==3" :examInfo="selectedExam"></stu-msg>
      </div>
    </a-spin>
    <chose-exam :isRadio='isRadio' @closeDialog="closeDialog" @chosedExam="chosedExam" v-if="showChoseExam"></chose-exam>
    <test-analyze v-if="showView"></test-analyze>
  </div>
</template>

<script>
//考试信息
import examMsg from "@/components/examAnalyze/examMsg.vue";
//成绩分析
import gradeAnalyze from "@/components/examAnalyze/gradeAnalyze.vue";
//分数段统计
import scoreSection from "@/components/examAnalyze/scoreSection.vue";
//考生信息
import stuMsg from "@/components/examAnalyze/stuMsg.vue";
//考题分析
import testAnalyze from "@/components/examAnalyze/testAnalyze.vue";
//选择考试
import choseExam from "@/components/mgrNew/choseExam.vue";

export default {
  //考试分析
  name: "ExamAnalyze",
  components: {
    examMsg,
    gradeAnalyze,
    choseExam,
    scoreSection,
    stuMsg,
    testAnalyze
  },
  data() {
    return {
      isRadio:1,
      showView:false,
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
      this.selectedExam['activeKey'] = activeKey;
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
    },
    //查看考题分析
    checkTextAnalyze(val){
      this.showView = val;
    }
  }
};
</script>

<style lang="less" scoped>
.exam {
  width: 100%;
  height: 620px;
  overflow-y: scroll;
}

.bottomClass {
  width: 100%;
}

.choseExamBtn {
  position: fixed;
  right: 50px;
  top: 90px;
}
</style>
