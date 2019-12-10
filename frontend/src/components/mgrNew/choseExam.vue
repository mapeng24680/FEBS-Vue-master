<template>
  <div class="mainClass">
    <a-modal
      class="dialogClass"
      title="选择考试"
      v-model="visible"
      @ok="handleOk"
      @cancel="cancleClick"
      width="70%"
      centered='centered'
    >
      <a-row type="flex" justify="center" :gutter="20">
        <a-col :span="6">
          <div class="itemClass">
            <div class="titleClass">考试名称：</div>
            <a-input style="width:150px" v-model="examName"/>
          </div>
        </a-col>
        <a-col :span="5">
          <div class="itemClass">
            <div class="titleClass">考试分类：</div>
            <a-button style="width:100px">
              选择分类
              <a-icon type="border-inner" />
            </a-button>
          </div>
        </a-col>
        <a-col :span="8">
          <div class="itemClass">
            <div class="titleClass">考试时间：</div>
            <a-range-picker @change="examTimeChange" style="width:250px" />
          </div>
        </a-col>
      </a-row>
      <div class="buttonClass">
        <a-button style="width:100px" @click="repeatClick">重置</a-button>
        <a-button type="primary" style="width:100px" @click="searchClick">搜索</a-button>
      </div>

      <a-divider orientation="right"></a-divider>
      <a-spin :spinning="loading">
        <a-table
          :rowSelection="{type:'radio',columnTitle:'选择',onChange:onSelectChange,selectedRowKeys}"
          :columns="columns"
          :dataSource="gridData"
          :scroll="{y: 300 }"
        />
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {
    title: "考试名称",
    dataIndex: "examName"
  },
  {
    title: "考试类型",
    dataIndex: "examStyleName"
  },
  {
    title: "总分",
    dataIndex: "paperTotalScore"
  },
  {
    title: "开始时间",
    dataIndex: "modifiedTime"
  },
  {
    title: "结束时间",
    dataIndex: "examEndTime"
  },
  {
    title: "创建人",
    dataIndex: "createUserName"
  },
  {
    title: "创建时间",
    dataIndex: "createTime"
  }
];

const gridData = [];


export default {
  name: "ChoseExam",
  data() {
    return {
      centered:true,
      loading:false,
      visible: true,
      columns,
      selectedRowKeys:[],
      gridData,
      examName:'',
      examStartTime:'',
      examEndTime:''
    };
  },
  mounted() {
    this.loadExamData();
  },
  methods: {
    examTimeChange(date,dateString) {
        this.examStartTime = dateString[0]
        this.examEndTime = dateString[1]
    },
    searchClick() {
      this.loadExamData()
    },
    repeatClick() {
      this.examName = ''
      this.examStartTime = ''
      this.examEndTime = ''
    },
    loadExamData() {
      this.loading = true;
      var that = this
      this.$post("/examadmin/admin/exam/mgr_grid", {
        current: 1,
        rowCount: 100,
        searchPhrase: '',
        examName: that.examName,
        examStyle: '',
        examStatus: '',
        examStartTime: that.examStartTime,
        examEndTime: that.examEndTime,
      })
        .then(r => {
          let data = r.data;
          console.log(data);
          that.loading = false;
          if(data.code == 10000) {
            that.gridData = data.bizContent.rows
          }else {
            this.$notification['success']({
            message: '提示',
            description:
              '网络错误'
          });
          }
        })
        .catch(e => {
          console.error(e);
          that.loading = false;
        });
    },
    onSelectChange(selectedRowKeys) {
      console.log("selectedRowKeys changed: ", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    handleOk() {
      if(this.selectedRowKeys.length > 0){
        var index = this.selectedRowKeys[0]
        this.$emit('chosedExam',this.gridData[index]);
      }
    },
    cancleClick() {
      this.$emit("closeDialog");
    },
  }
};
</script>

<style lang="less" scoped>

.ant-row {
  margin: 0;
  padding: 0;
}

.itemClass {
  display: flex;
}
.titleClass {
  line-height: 30px;
  margin: 0 auto;
  font-size: 13px;
  text-align: right;
  width: 70px;
}

.buttonClass {
  margin-top: 20px;
  text-align: center;
}
</style>