<template>
  <!-- <div class="mainClass" :style="pageLocation()"> -->
  <a-modal
      class="dialogClass"
      title="高级搜索"
      v-model="visible"
      @ok="handleOk"
      okText='搜索'
      @cancel="cancleClick"
      width="400px"
      centered='centered'
    >
    <a-row>
      <a-col :span="6">
        <div class="meumClass">所属部门</div>
      </a-col>
      <a-col :span="18">
        <a-button size='mini' style="width: 95%"></a-button>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="6">
        <div class="meumClass">判分状态</div>
      </a-col>
      <a-col :span="18">
        <a-select class="controlClass" defaultValue="是否判分" style="width: 95%" @change="gradeChange">
          <a-select-option value="">是否判分</a-select-option>
          <a-select-option value="0">未判分</a-select-option>
          <a-select-option value="1">已判分</a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="6">
        <div class="meumClass">考试时间</div>
      </a-col>
      <a-col :span="18">
         <a-range-picker @change="datePickerChange" style="width: 95%"/>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="6">
        <div  class="meumClass">是否及格</div>
      </a-col>
      <a-col :span="18">
        <a-select class="controlClass" defaultValue="请选择" style="width: 95%" @change="passChange">
          <a-select-option value="">请选择</a-select-option>
          <a-select-option value="1">是</a-select-option>
          <a-select-option value="-1">否</a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="6">
        <div class="meumClass">分数区间</div>
      </a-col>
      <a-col :span="8">
         <a-input placeholder="左区间" v-model="filters.scoreLeft"/>
      </a-col>
      <a-col :span='2'>
          <div style="text-align: center;lineHeight:30px">到</div>
      </a-col>
      <a-col :span="7">
         <a-input placeholder="右区间" v-model="filters.scoreRight"/>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="6">
        <div class="meumClass">认证状态</div>
      </a-col>
      <a-col :span="18">
        <a-select class="controlClass" defaultValue="请选择" style="width: 95%" @change="authorChange">
          <a-select-option value="1">已通过</a-select-option>
          <a-select-option value="2">认证失败</a-select-option>
          <a-select-option value="3">无认证信息</a-select-option>
          <a-select-option value="4">通过，与用户姓名不一致</a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="6">
        <div class="meumClass">是否交卷</div>
      </a-col>
      <a-col :span="18">
         <a-select class="controlClass" defaultValue="请选择" style="width: 95%" @change="commitChange">
           <a-select-option value="-1">请选择</a-select-option>
          <a-select-option value="1">是</a-select-option>
          <a-select-option value="0">否</a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="6">
        <div class="meumClass">强制交卷</div>
      </a-col>
      <a-col :span="18">
         <a-select class="controlClass" defaultValue="请选择" style="width: 95%" @change="forceChange">
           <a-select-option value="-1">请选择</a-select-option>
          <a-select-option value="1">是</a-select-option>
          <a-select-option value="0">否</a-select-option>
        </a-select>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
export default {
  props:['location'],
  name: "advanceSearch",
  data: function() {
    return {
      visible:true,
      filters:{
        depIds: '',//所属部分
        isGrade: '',//判分状态
        scoreLeft: '',//分数左区间
        scoreRight: '',//分数右区间
        isPass: '',//是否及格
        startTime: '',//开始时间
        endTime: '',//结束时间
        examVerifyStatus: '',//认证状态
        isCommit: -1,//是否交卷
        forceCommit: -1,//是否强制交卷
      }
    };
  },
  methods: {
    //考试时间
    datePickerChange(date,dateString) {
      this.filters.startTime = dateString[0];
      this.filters.endTime = dateString[1];
    },
    //判分状态
    gradeChange(value) {
      this.filters.isGrade = value;
    },
    //是否及格
    passChange(value) {
      this.filters.isPass = value;
    },
    //认证状态
    authorChange(value) {
      this.filters.examVerifyStatus = value;
    },
    //是否交卷
    commitChange(value) {
      this.filters.isCommit = value;
    },
    //强制交卷
    forceChange(value) {
      this.filters.forceCommit = value;
    },
    pageLocation() {
      var style = {};
      style.top = this.location.clientY+30 + 'px';
      style.right = '40px';
      return style
    }
  }
};
</script>

<style lang="less" scoped>

    .ant-row {
      margin: 10px;
    }

.mainClass {
    box-shadow: darkgrey 10px 10px 20px 5px ;//边框阴影
    border-radius: 4px;
    width: 350px;
    padding-top: 10px;
    position: fixed;
    background-color: #fff;

    .meumClass {
        width: 60px;
        line-height: 30px;
        margin: 0 auto;
        font-size: 13px;
    }
    .ant-row {
        margin-top: 10px;
        margin-bottom: 5px;
    }
}
</style>