<template>
    <div class="exam_mgr_new">
        <a-Button type="primary" icon="plus-square">s s s创建考试</a-Button>
        <a-Button type="primary" icon="export">导出信息</a-Button>
        <a-Button type="primary" icon="elet">删除</a-Button>
        <a-Button type="primary" icon="vertical-align-top">置顶考试</a-Button>
        <a-Button type="primary" icon="appstore">管理考试分类</a-Button>
        <a-input-search placeholder="input search text" style="width: 200px" @search="onSearch" />
        <div>
             启用状态<a-select defaultValue="lucy" style="width: 120px" @change="handleChange">
      <a-select-option value="jack">Jack</a-select-option>
      <a-select-option value="lucy">Lucy</a-select-option>
    </a-select>
        </div>
    <div>
           考试分类
    <a-select defaultValue="lucy" style="width: 120px" @change="handleChange">
      <a-select-option value="jack">Jack</a-select-option>
      <a-select-option value="lucy">Lucy</a-select-option>
    </a-select>
    </div>
    <div>
        考试时间
        <a-range-picker @change="onChange" />
    </div>
     <a-table :columns="columns" :dataSource="data" :scroll="{ x: 1500, y: 300 }">
    <a slot="action" slot-scope="text" href="javascript:;">action</a>
  </a-table>
  
    </div>
</template>
<script>
const columns = [
    { title: 'Full Name', width: 100, dataIndex: 'name', key: 'name', fixed: 'left' },
    { title: 'Age', width: 100, dataIndex: 'age', key: 'age', fixed: 'left' },
    { title: 'Column 1', dataIndex: 'address', key: '1', width: 150 },
    { title: 'Column 2', dataIndex: 'address', key: '2', width: 150 },
    { title: 'Column 3', dataIndex: 'address', key: '3', width: 150 },
    { title: 'Column 4', dataIndex: 'address', key: '4', width: 150 },
    { title: 'Column 5', dataIndex: 'address', key: '5', width: 150 },
    { title: 'Column 6', dataIndex: 'address', key: '6', width: 150 },
    { title: 'Column 7', dataIndex: 'address', key: '7', width: 150 },
    { title: 'Column 8', dataIndex: 'address', key: '8' },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      scopedSlots: { customRender: 'action' },
    },
  ];
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      key: i,
      name: `Edrward ${i}`,
      age: 32,
      address: `London Park no. ${i}`,
    });
  }
export default {
    data(){
        return {
        data,
        columns,
        }
    },
    methods:{
        onSearch(){},
        handleChange(){},
        onChange(){},
    },
}
</script>
<style lang="less" scoped>
.exam_mgr_new{

}
</style>