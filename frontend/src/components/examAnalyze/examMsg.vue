<template>
  <div class="mainClass">
    <h2>{{examInfo.examName}}</h2>
    <a-divider orientation="left"></a-divider>
    <table>
      <tr>
        <td>
          考试分类：
          <span>{{examInfo.examClass}}</span>
        </td>
        <td>应考人数：
            <span>{{examInfo.examTimeRestrict}}人(实考{{examInfo.examineeNums}}人,参考率{{examInfo.examineePercent}})</span>
        </td>
      </tr>
      <tr>
        <td>总分：
            <span>{{examInfo.examTotalScore}}分</span>
        </td>
        <td>平均分：
            <span>{{examInfo.avgScore}}分</span>
        </td>
      </tr>
      <tr>
        <td>及格分：
            <span>{{examInfo.passMark}}分(及格率{{examInfo.passPercent}})</span>
        </td>
        <td>最高分：
            <span>{{examInfo.maxScore}}分</span>
        </td>
      </tr>
      <tr>
        <td>答题时长：
            <span>{{examInfo.examTime}}分钟(平均答题时长{{examInfo.avGAnswerTime}})</span>
        </td>
        <td>最低分：
            <span>{{examInfo.minScore}}分</span>
        </td>
      </tr>
      <tr>
        <td>考试时间：
            <span>{{examInfo.examStartTime}}~{{examInfo.examEndTime}}</span>
        </td>
        <td>考试类型：
            <span>{{examInfo.examType}}</span>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props:['examInfo'],
  //考试信息
  name: "ExamMsg",
  methods: {
   
  }
};
</script>

<style scoped>
.mainClass {
  width: 100%;
  position: relative;
}
.ant-divider {
  margin: 10px;
  padding: 0;
}
h2 {
  line-height: 40px;
  height: 40px;
  padding-left: 20px;
}
span {
    color: black;
    font-size: 15px;
}
table {
  color: 15px;
  margin-left: 20px;
  width: 100%;
  color: darkgray;
}
table > tr {
  width: 50%;
  line-height: 30px;
  height: 30px;
}
</style>