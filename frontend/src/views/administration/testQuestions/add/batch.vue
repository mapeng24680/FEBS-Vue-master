<template>
  <div class="batch">
    <div class="flex-container flex-align-c">
      <div class="flex-container flex-align-c flex-jus-sb">
        <div class="flex-container flex-align-c margin-b-15">
          <p>试题分类：</p>
          <a-button type="primary" ghost>请选择</a-button>
          <classification></classification>
        </div>
        <div class="flex-container flex-align-c margin-b-15 margin-l-10">
          <p>试题难度：</p>
          <a-select v-model="EditorObj.difficult" style="width: 80px" @change="onChange">
            <a-select-option v-for="item in arrList1" :key="item.key" :value="item.key">{{item.label}}</a-select-option>
          </a-select>
        </div>
      </div>
      <a-button class="margin-l-10 margin-b-15" type="primary" icon="file-word">下载word模板</a-button>
    </div>
    <div class="flex-container flex-align-c">
      <div class="left">
        <div class="leftHeader flex-container flex-jus-sb">
          <div>输入区：</div>
          <a-button type="primary" @click="showDrawer">
            试题范例
          </a-button>
          <a-button type="primary" @click="showDrawer">
            输入范例
          </a-button>
          <a-drawer
            title="Basic Drawer"
            :placement="placement"
            :closable="false"
            @close="onClose"
            :visible="visible"
          >
            <div id="qtExample" class="active" style="height: 162px;">
              <div class="modal-body input-body">
                <div class="input-example">
                  <div class="input-example-content">
                    <div class="input-example-question" v-for="(item,index) in contentText">
                      <p v-html="contentText.title"></p>
                      <p class="input-com-detail">
                        <span v-for="(childItm,childIndex) in item.content">{{childItm.value}}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a-drawer>
        </div>
        <div class="leftContent"></div>
      </div>
    </div>
  </div>
</template>
<!--批量录入-->
<script>
    import classification from '~/classification/Classification'
    import contentText from './package'
    export default {
        name: "batch",
        inject: ['arrList1', 'EditorObj'],
        data() {
            return {
                contentText,
                visible: false,
                placement: 'bottom',
            }
        },
        mounted() {
            debugger
        },
        components: {
            classification
        },
        methods: {
            onChange() {

            },
            showDrawer() {
                this.visible = true;
            },
            onClose() {
                this.visible = false;
            },
        }
    }
</script>

<style scoped lang="stylus">

</style>
