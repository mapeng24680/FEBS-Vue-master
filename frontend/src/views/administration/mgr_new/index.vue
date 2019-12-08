<template>
  <div class="exam_mgr_new" ref="mianId" @click="tapWindowClose">
    <div class="mgr_new_head">
      <a-Button
        @click="choseExamClick"
        v-if="tabsDefault=='1'"
        type="primary"
        icon="plus-square"
      >选择考试</a-Button>
      <a-Button v-if="tabsDefault=='2'" type="primary" icon="plus-square">选择考生</a-Button>
      <a-Button type="primary" icon="export">导出</a-Button>
      <a-Button v-if="tabsDefault=='2'" type="primary" icon="delete">删除</a-Button>
      <a-Button v-if="tabsDefault=='1'" type="primary" icon="vertical-align-top">批量交卷</a-Button>
      <a-Button v-if="tabsDefault=='1'" type="primary" icon="vertical-align-bottom">批量补考</a-Button>
      <a-select
        v-if="tabsDefault=='1'"
        icon="appstore"
        defaultValue="更多"
        style="width: 120px"
        @change="handleChange"
      >
        <a-select-option value="修改部门">修改部门</a-select-option>
        <a-select-option value="恢复考试">恢复考试</a-select-option>
        <a-select-option value="导出附件链接">导出附件链接</a-select-option>
        <a-select-option value="删除">删除</a-select-option>
      </a-select>
      <a-button v-if="tabsDefault=='1'" class="moreSearch" @click="advanceClick">
        高级搜索
        <a-icon type="down" />
      </a-button>
      <a-input-search
        v-if="tabsDefault=='1'"
        class="searchBarClass"
        placeholder="请输入姓名、账号信息"
        style="width: 200px"
        @search="onSearch"
      />
    </div>
    <div>
      <a-tabs :defaultActiveKey="tabsDefault" @change="tabsCallback">
        <a-tab-pane tab="按开始查询批改" key="1"></a-tab-pane>
        <a-tab-pane tab="按考生查询批改" key="2" forceRender></a-tab-pane>
      </a-tabs>
      <div class="switchClass">
        按考试查询批改按考生查询批改考生信息对子管理员可见&nbsp;
        <a-tooltip placement="top" title="Prompt Text">
          <a-icon type="question-circle" />
        </a-tooltip>
        <a-switch defaultChecked @change="onChange" />
      </div>
      <a-table :columns="columns1" :dataSource="data1" :scroll="{y: 100 }" size="small"></a-table>
      <a-table
        :columns="columns2"
        :dataSource="data2"
        size="small"
        :rowSelection="rowSelection"
        :scroll="{y: tableHeight}"
      />
      <advance-search class="moreSearch" v-if="showSearchDialog" :location="location"></advance-search>
      <chose-exam @closeDialog="closeDialog" v-if="showChoseExam"></chose-exam>
    </div>
  </div>
</template>

<script>
import advanceSearch from "@/components/mgrNew/advancedSearch.vue";
import choseExam from "@/components/mgrNew/choseExam.vue";

const columns1 = [
  { title: "考试名称", key: "1", dataIndex: "name" },
  { title: "考试类型", key: "2", dataIndex: "type" },
  { title: "考试时间", key: "3", dataIndex: "time" }
];
const columns2 = [
  { title: "账号", key: "1", dataIndex: "account" },
  { title: "用户名", key: "2", dataIndex: "admin" },
  { title: "身份认证状态", key: "3", dataIndex: "author" },
  { title: "所属部门", key: "4", dataIndex: "part" },
  { title: "分数", key: "5", dataIndex: "score" },
  { title: "及格", key: "6", dataIndex: "pass" },
  { title: "是否为补考", key: "7", dataIndex: "isPatch" },
  { title: "强制交卷", key: "8", dataIndex: "force" },
  { title: "交卷时间", key: "9", dataIndex: "time" },
  { title: "操作", key: "10", dataIndex: "control" }
];
const data1 = [];
const data2 = [];
for (let i = 0; i < 10; i++) {
  data1.push({
    key: i,
    name: "考试名称",
    type: "考试类型",
    time: "考试时间"
  });
  data2.push({
    key: i,
    account: "考试名称",
    admin: "用户名",
    author: "身份认证状态",
    part: "所属部门",
    score: "分数",
    pass: "及格",
    isPatch: "是否为补考",
    force: "强制交卷",
    time: "交卷时间",
    control: "操作"
  });
}
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  }
};
export default {
  data() {
    return {
      data1,
      columns1,
      data2,
      columns2,
      rowSelection,
      showSearchDialog: false,
      showChoseExam: false,
      location: {},
      tabsDefault: "1",
      tableHeight: 0
    };
  },
  mounted() {
    let mainDom = this.$refs.mianId;
    this.tableHeight = mainDom.offsetHeight - 500 + "px";
  },
  components: {
    advanceSearch,
    choseExam
  },
  methods: {
    tapWindowClose(event) {
      // var btn = document.querySelector(".moreSearch");
      // if (!btn.contains(event.target)) {
      //   this.showSearchDialog = false;
      // }
      // debugger;
    },
    onSearch() {},
    handleChange() {},
    onChange() {},
    tabsCallback(activeKey) {
      this.tabsDefault = activeKey;
    },
    advanceClick(event) {
      this.location = event;
      this.showSearchDialog = !this.showSearchDialog;
    },
    choseExamClick() {
      this.showChoseExam = !this.showChoseExam;
    },
    closeDialog() {
      this.showChoseExam = false;
    }
  }
};
</script>
<style lang="less" scoped>
.exam_mgr_new {
  width: 100%;
  overflow: scroll;
  position: relative;
  .mgr_new_head {
    .moreSearch {
      float: right;
      line-height: 30px;
      margin-left: 10px;
    }
    .searchBarClass {
      float: right;
    }
  }
  .switchClass {
    font-size: 12px;
    text-align: right;
    position: absolute;
    top: 45px;
    right: 10px;
  }
}
</style>