<template>
  <div class="mainClass" :loading="loading">
    <a-modal
      class="dialogClass"
      title="选择考试"
      v-model="visible"
      @ok="handleOk"
      @cancel="cancleClick"
      width="70%"
      centered="true"
    >
      <a-row type="flex" justify="center" :gutter="20">
        <a-col :span="6">
          <div class="itemClass">
            <div class="titleClass">考试名称：</div>
            <a-input style="width:150px" />
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
            <a-range-picker @change="onChange" style="width:250px" />
          </div>
        </a-col>
      </a-row>
      <div class="buttonClass">
        <a-button style="width:100px">重置</a-button>
        <a-button type="primary" style="width:100px">搜索</a-button>
      </div>

      <a-divider orientation="right"></a-divider>
      <a-table
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :columns="columns"
        :dataSource="data"
        :scroll="{y: 300 }"
      />
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {
    title: "考试名称",
    dataIndex: "name"
  },
  {
    title: "考试分类",
    dataIndex: "age"
  },
  {
    title: "总分",
    dataIndex: "scroe"
  },
  {
    title: "开始时间",
    dataIndex: "startTime"
  },
  {
    title: "结束时间",
    dataIndex: "endTime"
  },
  {
    title: "创建人",
    dataIndex: "creatPerson"
  },
  {
    title: "创建时间",
    dataIndex: "creatTime"
  }
];

const data = [];
for (let i = 0; i < 50; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`
  });
}

export default {
  name: "ChoseExam",
  data() {
    return {
      loading:false,
      visible: true,
      data,
      columns,
      selectedRowKeys: [],
      gridData:[],
    };
  },
  mounted() {
    this.loadExamData();
  },
  computed() {

  },
  methods: {
    loadExamData() {
      this.loading = true;
      var that = this
      this.$post("/examadmin/admin/exam/mgr_grid", {
        current: 1,
        rowCount: 100,
        searchPhrase: '',
        examName: '',
        examStyle: '',
        examStatus: '',
        examStartTime: '',
        examEndTime: '',
      })
        .then(r => {
          let data = r.data.data;
          console.log(data);
          that.loading = false;
          if(data.code == 10000) {
            that.gridData = data.bizContent.row
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
    handleOk() {},
    cancleClick() {
      this.$emit("closeDialog");
    }
  }
};
</script>

<style lang="less" scoped>
// /deep/ .ant-modal-title {
//   text-align: center;
//   background-color: red
// }
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