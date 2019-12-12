<template>
  <div class="mainClass">
    <a-modal
      class="dialogClass"
      title="选择考试"
      v-model="visible"
      @ok="handleOk"
      @cancel="cancleClick"
      width="70%"
      centered="centered"
    >
      <a-row type="flex" justify="center" :gutter="20">
        <a-col :span="8">
          <div class="itemClass">
            <div class="titleClass">账 号：</div>
            <a-input style="width:200px" v-model="filterData.userName" />
          </div>
        </a-col>
        <a-col :span="8">
          <div class="itemClass">
            <div class="titleClass">姓 名：</div>
            <a-input style="width:200px" v-model="filterData.surname" />
          </div>
        </a-col>
        <a-col :span="8">
          <div class="itemClass">
            <div class="titleClass">性 别：</div>
            <a-select
              class="controlClass"
              defaultValue="请选择"
              style="width: 200px"
              @change="passChange"
            >
              <a-select-option value="男">男</a-select-option>
              <a-select-option value="女">女</a-select-option>
            </a-select>
          </div>
        </a-col>
      </a-row>
      <a-row type="flex" justify="center" :gutter="20">
        <a-col :span="8">
          <div class="itemClass">
            <div class="titleClass">状 态：</div>
            <a-select
              class="controlClass"
              defaultValue="请选择"
              style="width: 200px"
              @change="passChange"
            >
              <a-select-option value="正常">正常</a-select-option>
              <a-select-option value="禁用">禁用</a-select-option>
            </a-select>
          </div>
        </a-col>
        <a-col :span="8">
          <div class="itemClass">
            <div class="titleClass">部 门：</div>
            <a-button style="width:200px" icon='retweet'>选择部门</a-button>
          </div>
        </a-col>
        <a-col :span="8">
          <div class="itemClass">
            <div class="titleClass">职 位：</div>
            <a-input style="width:200px" v-model="filterData.post" />
          </div>
        </a-col>
      </a-row>
      <a-row type="flex" justify="center" :gutter="20">
        <a-col :span="8">
          <div class="itemClass">
            <div class="titleClass">手 机：</div>
            <a-input style="width:200px" v-model="filterData.phone" />
          </div>
        </a-col>
        <a-col :span="8">
          <div class="itemClass">
            <div class="titleClass">证件号：</div>
            <a-input style="width:200px" v-model="filterData.idCard" />
          </div>
        </a-col>
        <a-col :span="8">
          <div class="itemClass">
            <div class="titleClass">邮 箱：</div>
            <a-input style="width:200px" v-model="filterData.email" />
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
          :columns="columns"
          :dataSource="gridData"
          size="small"
          :rowSelection="{type:'radio',columnTitle:'选择',onChange:onSelectChange,selectedRowKeys}"
          :scroll="{y: 300}"
          :pagination="pagination"
          @change="tableChange"
        ></a-table>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {
    title: "账号",
    dataIndex: "userName"
  },
  {
    title: "姓名",
    dataIndex: "surname"
  },
  {
    title: "所属部门",
    dataIndex: "departmentName"
  },
  {
    title: "电子邮件",
    dataIndex: "email"
  },
  {
    title: "性别",
    dataIndex: "sex"
  }
];

const gridData = [];
const filterData = {
    userName: "",
    surname: "",
    sex: "请选择",
    status: "请选择",
    post: "",
    departmentName: "",
    phone: "",
    idCard: "",
    email: ""
    };

export default {
  name: "ChoseStu",
  data() {
    return {
      centered: true,
      loading: false,
      visible: true,
      columns,
      selectedRowKeys: [],
      gridData,
      filterData,
      pagination: {
        current: 1, //当前页数 v-model
        defaultCurrent: 1, //默认的当前页数
        defaultPageSize: 10, //每页显示几条数据
        showSizeChanger: true,
        total: gridData.length, //总数
        pageSizeOptions: ["10", "20", "30", "40", "50"],
        // showTotal: total => `共 ${gridData.length} 条数据`
      }
    };
  },
  mounted() {
    this.loadExamData();
  },
  methods: {
    /**
     *  分页、排序、筛选变化时触发
     */
    tableChange(pagination, filters, sorter) {
      this.pagination = pagination;
    },

    searchClick() {
      this.loadExamData();
    },
    repeatClick() {

    },
    loadExamData() {
      this.loading = true;
      var that = this;
      this.$post("/baseinfo/admin/user_mgr_grid", {
        current: that.pagination.current,
        rowCount: that.pagination.pageSize,
        searchPhrase: "",
        userName: "",
        surname: "",
        departmentId: "",
        phone: "",
        sex: "",
        status: "",
        position: "",
        notice: "",
        email: ""
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
    onSelectChange(selectedRowKeys) {
      console.log("selectedRowKeys changed: ", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    handleOk() {
      if (this.selectedRowKeys.length > 0) {
        var index = this.selectedRowKeys[0];
        this.$emit("chosedStu", this.gridData[index]);
      }
    },
    cancleClick() {
      this.$emit("closeDialog");
    }
  }
};
</script>

<style lang="less" scoped>
.ant-row-flex {
  margin-top: 10px;
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