<template>
  <div class="mainClass" :style="pageLocation()">
    <a-row>
      <a-col :span="6">
        <div class="meumClass">所属部门</div>
      </a-col>
      <a-col :span="18">
        <a-button style="width: 95%"></a-button>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="6">
        <div class="meumClass">判分状态</div>
      </a-col>
      <a-col :span="18">
        <a-select class="controlClass" defaultValue="是否判分" style="width: 95%" @change="handleChange">
          <a-select-option value="未判分">未判分</a-select-option>
          <a-select-option value="已判分">已判分</a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="6">
        <div class="meumClass">考试时间</div>
      </a-col>
      <a-col :span="18">
         <a-range-picker @change="onChange" style="width: 95%"/>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="6">
        <div  class="meumClass">是否及格</div>
      </a-col>
      <a-col :span="18">
        <a-select class="controlClass" defaultValue="请选择" style="width: 95%" @change="handleChange">
          <a-select-option value="是">是</a-select-option>
          <a-select-option value="否">否</a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="6">
        <div class="meumClass">分数区间</div>
      </a-col>
      <a-col :span="8">
         <a-input placeholder="Basic usage" />
      </a-col>
      <a-col :span='2'>
          <div style="text-align: center;lineHeight:30px">到</div>
      </a-col>
      <a-col :span="7">
         <a-input placeholder="Basic usage" />
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="6">
        <div class="meumClass">认证状态</div>
      </a-col>
      <a-col :span="18">
        <a-select class="controlClass" defaultValue="请选择" style="width: 95%" @change="handleChange">
          <a-select-option value="已通过">已通过</a-select-option>
          <a-select-option value="认证失败">认证失败</a-select-option>
          <a-select-option value="无认证信息">无认证信息</a-select-option>
          <a-select-option value="通过，与用户姓名不一致">通过，与用户姓名不一致</a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="6">
        <div class="meumClass">收否交卷</div>
      </a-col>
      <a-col :span="18">
         <a-select class="controlClass" defaultValue="请选择" style="width: 95%" @change="handleChange">
          <a-select-option value="是">是</a-select-option>
          <a-select-option value="否">否</a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="6">
        <div class="meumClass">强制交卷</div>
      </a-col>
      <a-col :span="18">
         <a-select class="controlClass" defaultValue="请选择" style="width: 95%" @change="handleChange">
          <a-select-option value="是">是</a-select-option>
          <a-select-option value="否">否</a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <a-button type="primary" >搜索</a-button>
  </div>
</template>

<script>
export default {
  props:['location'],
  name: "advanceSearch",
  data: function() {
    return {
      value: "",
    };
  },
  methods: {
    onChange(value) {
      console.log(value);
      this.value = value;
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