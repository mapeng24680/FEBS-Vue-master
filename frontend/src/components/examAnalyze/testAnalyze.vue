<template>
  <div class="mainClass">
    <a-modal
      class="dialogClass"
      title="试题分析"
      v-model="visible"
      @ok="handleOk"
      @cancel="cancleClick"
      width="70%"
      centered='centered'
    >
    <!-- type="flex" justify="center" -->
      <a-row :gutter="20">
        <a-col :span="6">
          <div class="itemClass">
            <div class="titleClass">题型：</div>
            <Select :defaultValue="typeValue" style="width:120px" @change="handleChangeType">
              <Option v-for="(item,key) in testType" :key="key" value="item">{{item}}</Option>
            </Select>
          </div>
        </a-col>
        <a-col :span="6">
          <div class="itemClass">
            <div class="titleClass">难度：</div>
            <Select :defaultValue="levelValue" style="width:120px" @change="handleChangeLevel">
              <Option v-for="(item,key) in easyLevel" :key="key" value="item">{{item}}</Option>
            </Select>
          </div>
        </a-col>
      </a-row>
      <a-divider orientation="right"></a-divider>
      <a-spin :spinning="loading">
        <!-- <a-table
          v-if="isRadio==1"
          :rowSelection="{type:'radio',columnTitle:'选择',onChange:onSelectChange,selectedRowKeys}"
          :columns="columns"
          :dataSource="gridData"
          :scroll="{y: 300 }"
        />
        <a-table
          v-if="isRadio==2"
          :rowSelection="{onChange:onSelectChange,selectedRowKeys}"
          :columns="columns"
          :dataSource="gridData"
          :scroll="{y: 300 }"
        /> -->
      </a-spin>
    </a-modal>
  </div>
</template>
<script >
export default {
  name: "TestAnalyze",
    data() {
      return {
        visible: true,
        testType: ["全部题型", "单选题", "多选题", "判断题", "填空题","问答题"],
        typeValue:'',
        levelValue:'',
        easyLevel: ["全部难度", "简单", "普通", "困难"],
        loading:false,
      };
    },
  methods: {
     handleOk() {

     },
     cancleClick() {

     },
     handleChangeType(value) {
          this.EditorObj.type = value;
          this.setEdit(this.EditorObj)
      },
      handleChangeLevel(value) {
          this.EditorObj.type = value;
          this.setEdit(this.EditorObj)
      },
  }
};
</script>

<style lang="less" scoped>

.itemClass {
  display: flex;
}

.titleClass {
  line-height: 30px;
  margin: 0 auto;
  font-size: 13px;
  text-align: right;
  width: 50px;
}

</style>