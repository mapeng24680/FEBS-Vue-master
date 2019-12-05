<template>
  <div class="exam_mgr_new">
    <div class="flex-container flex-align-c margin-b-10">
      <a-Button type="primary" class="margin-r-5" icon="plus-square">创建考试</a-Button>
      <a-Button type="primary" class="margin-r-5" icon="export">导出信息</a-Button>
      <a-Button type="primary" class="margin-r-5" icon="elet">删除</a-Button>
      <a-Button type="primary" class="margin-r-5" icon="vertical-align-top">置顶考试</a-Button>
      <a-Button @click="showModal" type="primary" class="margin-r-5" icon="appstore">管理考试分类</a-Button>
      <a-input-search
        placeholder="请输入考试名称"
        style="width: 200px;margin-right: 5px;"
        @search="onSearch"
      />
      <div class="margin-r-5">
        启用状态
        <a-select defaultValue="lucy" style="width: 80px" @change="handleChange">
          <a-select-option value="jack">Jack</a-select-option>
          <a-select-option value="lucy">Lucy</a-select-option>
        </a-select>
      </div>
      <div class="margin-r-5">
        考试分类
        <a-select defaultValue="lucy" style="width: 80px" @change="handleChange">
          <a-select-option value="jack">Jack</a-select-option>
          <a-select-option value="lucy">Lucy</a-select-option>
        </a-select>
      </div>
      <div class="margin-r-5">
        考试时间
        <a-range-picker @change="onChange" />
      </div>
    </div>
    <a-table 
      :rowSelection="rowSelection"
      :columns="columns"
      :dataSource="data"
      :scroll="{ x: 1500, y: 300 }"
    >
      <!-- <div slot="filterDropdown" style="padding: 8px">
        <a-checkbox-group :options="plainOptions" v-model="value" @change="onChange" />
      </div> -->
      <template slot="edit">
        <a-icon title="编辑" type="edit" />
        <a-icon title="考试链接" type="link" />
        <a-icon title="成绩查询批改" type="form" />
        <a-icon title="统计分析" type="bar-chart" />
        <a-icon title="考生答题状态查询" type="search" />
      </template>
    </a-table>

    <!-- 管理考试分类 -->
  <a-modal
      title="管理考试分类"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="visible=false"
    >
      <p></p>
    </a-modal>
    <popEdit />
  </div>
</template>
<script>
import popEdit from './popEdit'
const columns = [
  {
    title: "考试名称",
    width: 100,
    dataIndex: "name",
    key: "name",
  },
  { title: "分类", width: 100, dataIndex: "fl", key: "age" },
  { title: "总分", dataIndex: "count", key: "1", width: 150 },
  { title: "开始时间", dataIndex: "startTime", key: "2", width: 150 },
  { title: "结束时间", dataIndex: "endTime", key: "3", width: 150 },
  { title: "创建人", dataIndex: "cjr", key: "4", width: 150 },
  { title: "创建时间", dataIndex: "cjsj", key: "5", width: 150 },
  { title: "关联任务", dataIndex: "glrw", key: "6", width: 150 },
  { 
    title: "操作",
    dataIndex: "edit",
    key: "7",
    align: "center",
    scopedSlots: {
      // filterDropdown: "filterDropdown",
      filterIcon: "filterIcon",
      customRender: "edit"
    }
  }
];
export default {
  data() {
    return {
      columns,
      value: [],
      data:[],
        visible: false,
        confirmLoading: false,
      // plainOptions: ["Apple", "Pear", "Orange", "a", "b", "x", "s"]
    };
  },
  created(){
    this.getData()
  },
  components:{
popEdit
  },
  methods: {
       showModal() {
        this.visible = true;
      },
      handleOk(){

      },
    getData(){
      this.$get('/api/sort',{}).then(json=>{

      })
    },
    onSearch() {},
    handleChange() {},
    onChange() {},
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this;
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            "selectedRows: ",
            selectedRows
          );
        }
      };
    }
  }
};
</script>
<style lang="stylus" >
.exam_mgr_new {
  .ant-checkbox-group {
    .ant-checkbox-group-item {
      display: block;
    }
  }
}
</style>