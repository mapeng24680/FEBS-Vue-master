<template>
  <div class="Excel flex-container flex-align-c flex-jus-c">
    <div class="text-center" v-show="!success">
      <a-icon :style="dragStyle" type="cloud-upload" />
      <h1 class="title">Excel批量导入试</h1>
      <p >Excel导入试题功能支持“单选题、多选题、判断题、填空题、问答题”五类题型的导入</p>
      <p>第一步：下载Excel试题模版</p>
      <p>第二步：使用模版整理试题，点击“上传Excel”完成试题导入</p>
      <div class="flex-container flex-jus-c margin-top20"  >
        <a-upload
          name="file"
          accept=".xls"
          :showUploadList="false"
          @change="handleUpload"
        >
          <a-button :loading="uploading" type="primary">上传excel</a-button>
        </a-upload>
        <a-button type="primary" class="margin-l-10" ghost>下载模版</a-button>
      </div>
    </div>
    <div v-show="success" class="text-center">
      <div>
        <h1 class="title">Excel导入结果</h1>
        <div class="success-tip ">
          <div class="success">
            <a-icon type="check-circle" />
            <div class="title success-title" > 上传成功:</div>
            <ul>
              <li class="table4" >填空题:&nbsp;2&nbsp;道;</li>
              <li class="table4" >填空题:&nbsp;2&nbsp;道;</li>
            </ul>
          </div>
        </div>
      </div>
      <a-button type="primary" class="margin-l-10" ghost>继续导入</a-button>
      <a-button type="primary" class="margin-l-10" >去创建试题</a-button>
      <a-button type="primary" class="margin-l-10" >查看试题</a-button>
    </div>
  </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "Excel",
        data(){
            return {
                uploading: false,
                success: false,
                fileList:[],
                dragStyle:{
                    fontSize:'50px'
                },
                succ:{
                    'table1':'单选题',
                    'table2':'多选题',
                    'table3':'判断题',
                    'table4':'填空题',
                    'table5':'问答题',
                },
            }
        },
        mounted(){
        },
        methods:{
            handleUpload(event) {
                if(event.file.size > 1024*1024){
                    this.$message.error('文件不能大于2mb')
                    return
                }
                this.uploadFun(event.file);
            },
            uploadFun(files){
                const formData = new FormData();
                formData.append('filename', files.name);
                axios.post('/baseinfo/admin/online_import_html',formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(json=>{
                    this.success=true;
                })
            },
        }
    }
</script>

<style scoped lang="stylus">
.Excel{
  height 100%
  .title{
    font-size: 24px;
    color: #3A3E51;
    display: block;
    margin-bottom: 20px;
  }
  p{
    text-align: left;
    font-size: 14px;
    color: #6D717C;
    margin-bottom: 0;
  }

  #uploadForm{
    .btn-primary {
      color: #fff;
      background-color: #1A8CFE;
      border-color: #1A8CFE;
      display block
      text-decoration: none;
      line-height: 32px;
      vertical-align: middle;
      position: relative;
      height: 32px;
      padding 0 15px
      #excelUpload{
        opacity 0
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
  .success-tip{
    width: 380px;
    margin: 0 auto;
    background: rgba(103,194,58,0.05);
    border: 1px solid rgba(103,194,58,0.20);
    border-radius: 2px;
    margin-bottom 50px
    font-size: 14px;
    color: #3A3E51;
    padding: 10px;
    text-align: left;
    .success-title{
      display: inline-block;
      margin-bottom: 10px;
      font-size 14px
    }
    ul{
      list-style-type: none;
      padding-left: 24px;
      li{
        display: inline-block;
        width: 90px;
        color #3A3E51;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
