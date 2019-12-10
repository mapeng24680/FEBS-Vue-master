<template>
  <div class="batch">
    <div class="flex-container flex-align-c flex-jus-sb">
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
      <div>
        <a-button class="margin-l-10 margin-b-15" type="primary" icon="file-word">下载word模板</a-button>
        <a-button class="margin-l-10 margin-b-15" type="primary" icon="file-word" @click="importFun()">录入</a-button>
      </div>
    </div>
    <div class="flex-container flex-align-c antd-height-55">
      <div class="left">
        <div class="commonHeader flex-container flex-jus-sb flex-align-c">
          <div class="title">输入区：</div>
          <div class="flex-container">
            <a-button type="primary" @click="showDrawer">
              试题范例
            </a-button>
            <a-button class="margin-l-10" type="primary" @click="showDrawer1">
              输入范例
            </a-button>
          </div>
        </div>
        <div ref="leftContent" class="Content leftContent "></div>
      </div>
      <div class="right">
        <div class="commonHeader flex-container flex-jus-sb flex-align-c">
          <div class="title">检查区：{{titleText}}</div>
        </div>
        <div ref="preview" id="preview" class="Content padd-l-10 box padd-t-10"></div>
      </div>
    </div>
    <a-drawer
      title="试题范例"
      :height="356"
      wrapClassName="batchDrawer"
      :wrapStyle="wrapStyle"
      :bodyStyle="wrapStyle"
      :placement="placement"
      :closable="false"
      @close="onClose"
      :visible="visible"
    >
      <div id="qtExample" class="active">
        <div class="modal-body input-body">
          <div class="input-example">
            <div class="input-example-content">
              <div class="input-example-question" :key="index" v-for="(item,index) in obj">
                <p :style="dragStyle(index)">{{item.title}}</p>
                <p class="input-com-detail" :key="childIndex" v-for="(childItm,childIndex) in item.content"
                   v-html="childItm.value"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-drawer>
    <a-drawer
      title="试题范例"
      :height="356"
      wrapClassName="batchDrawer"
      :wrapStyle="wrapStyle"
      :bodyStyle="wrapStyle"
      :placement="placement"
      :closable="false"
      @close="onClose1"
      :visible="visible1"
    >
      <div class="active">
        <div class="modal-body input-body">
          <div class="input-example">
            <div class="input-example-content">
              <div class="input-example-question">
                <p :style="dragStyle(0)">{{obj1.title}}</p>
                <p class="input-com-detail" :key="childIndex" v-for="(childItm,childIndex) in obj1.content"
                   v-html="childItm.value"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-drawer>
  </div>
</template>
<!--批量录入-->
<script>
    import classification from '~/classification/Classification'
    import {obj, obj1} from './text.js'
    import {Markdown} from './markdown'
    import E from "wangEditor";
    import $ from 'jquery';
    import {mapState, mapMutations} from 'vuex'
    const  nameReg = /^\n?\s*(([0-9]+\s*[.|、])|(((\()|（)[0-9]+((\))|）)))\s*(.*?)\s*(?:\n|$)/g;
    const  singleReg = /^\n?\s*(答案[:：])\s*(.*?)\s*(?:\n|$)/g;
    const  fillReg = /([\(|\（]\s*[\)|\）])/g;
    let    qt_type="1";
    export default {
        name: "batch",
        inject: ['arrList1'],
        data() {
            return {
                obj, obj1,
                visible: false,
                visible1: false,
                titleText: '',
                placement: 'bottom',
                wrapStyle: {
                    overflow: 'auto',
                    height: 'calc(100% - 24px)'
                },
                colorDrawer: ['#1A8CFE', '#1DC88C', '#F76377', '#A06AD2', '#C9A310'],
            }
        },

        computed: {
            dragStyle() {
                return function (index) {
                    return `color:${this.colorDrawer[index]}`
                }
            },
            EditorObj:{
                get(){
                    return this.$store.state.account.editWang
                },
                set(v){},
            }
        },
        mounted() {
            this.setMarkdown()
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
            showDrawer1() {
                this.visible1 = true;
            },
            onClose1() {
                this.visible1 = false;
            },
            getClassify(value,detail,num) {
                detail.push({name:value, type:num});
            },
            markAnswer(type,ii){
                var that=this;
                var list = ['A','B','C','D','E','F','G','H'];
                $(".question").eq(ii).each(function (index, element) {
                    var $that = $(this);
                    var titleNum = $(this).find('.type-box .title').text();
                    var answerText =  $(this).find(".qt_answer").text().replace(/^\s*答案\s*[:：]/,"");
                    //word版多选题带,号处理
                    if(answerText.match(/^([a-h][,|，]){0,7}([a-h])$/ig)){
                        answerText = answerText.replace(/,|，/g,'')
                    }
                    var answer =answerText.toUpperCase();
                    //处理下只有图片的情况
                    var checkTitle = $(this).find('.qt_title').text().replace($(this).find('.type-box').text(),'')

                    if($.trim(checkTitle) === ''){

                        if($(this).find('.qt_title img').length < 1){

                            $(this).find('.qt_title').addClass('qt_error').html('题目（至少两个字)')

                        }
                    }
                    //检测是否按顺序排序
                    var select = $(this).find('.key .title').text();
                    var type = $(this).data('type');
                    select = select.split('.').join("");

                    //处理题目中的题号带括号，替换下中文括号
                    titleNum = titleNum.replace(/（/, '(');
                    titleNum = titleNum.replace(/）/, ')');
                    $(this).find('.type-box .title').text(titleNum);

                    //错误标记check_error
                    if($(this).find('.error,.qt_error').length > 0){
                        $(this).addClass("check_error")
                    }

                    if(type=="1"||type=="2") {

                        for (var k = 0, selectLen = select.length; k < selectLen; k++) {

                            //根据选项与ACSII的比较，判断是否为正常的排序及重复选项的存在
                            if (!(select[k] === String.fromCharCode(65 + k))) {
                                $(this).addClass("check_error");
                                $(this).find('.key').addClass('qt_error')
                            }
                        }
                        for (var i = 0,listLen =list.length ; i < listLen; i++) {
                            //标记选项框
                            if (answer.search(list[i]) !== -1) {

                                $(this).find(".key_" + list[i] + " .checkOrRadio").prop("checked", true);
                            } else {
                                $(this).find(".key_" + list[i] + " .checkOrRadio").attr("disabled", true);

                            }
                        }
                        //根据选项最后一位的ASCII码 与选项对比小于即为不存选项（大写比较）
                        //单选题判断答案是否存在
                        // 过滤空字符串
                        var answerhandle = answer.split('').filter(function (msg) {

                            return msg && msg.trim()

                        });
                        //单选题判断答案是否存在
                        if(answerhandle.length ===1){
                            if(select.slice(-1).charCodeAt() < answerhandle[0].toLocaleUpperCase().charCodeAt()){
                                $that.addClass("check_error");
                                $that.find(".qt_answer").removeAttr('hidden').addClass('qt_error').text('答案不存在！')
                            }
                        }

                        // 多选题判断答案是否存在
                        if(answerhandle.length > 1){

                            for(var j =0,answerLen=answerhandle.length;j<answerLen;j++){
                                if(answerhandle[j].charCodeAt()>select.slice(-1).charCodeAt()){
                                    $that.addClass("check_error");
                                    $that.find(".qt_answer").removeAttr('hidden').addClass('qt_error').text('答案不存在！')
                                }

                            }
                        }
                        //题目有错误时把单多选按钮隐藏
                        if($(this).find(".qt_error").length!=0){
                            $(this).find('.change-type').hide()
                        }else{
                            $(this).find('.change-type').show()
                        }

                    }
                    if(type == '4'){
                        //  填空题括号与答案对应，先进行空元素匹配，在进行重复答案匹配
                        var fillReg = /([\(|\（]\s*[\)|\）])/g;
                        var newAnswer = [];
                        if($(this).find('.qt_title').text().match(fillReg)){
                            var fillNum =  $(this).find('.qt_title').text().match(fillReg).length;
                        }
                        var answerNum = answerText.split('|');

                        // 先判断长度是否相等
                        if(fillNum !== answerNum.length){
                            $(this).addClass("check_error");
                            //长度不相等即为错
                            $(this).find(".qt_answer").addClass('qt_error')
                        }else{
                            //去除空元素
                            answerNum.forEach(function (value) {
                                if($.trim(value)){
                                    newAnswer.push(value)
                                }
                            });
                            if(fillNum !== newAnswer.length){
                                $(this).addClass("check_error");
                                //长度不相等即为错
                                $(this).find(".qt_answer").addClass('qt_error')
                            }
                        }
                    }
                    if(type == '5') {
                        //问答题答案为空时标记为错误
                        if (answerText.length === 0) {
                            $(this).addClass("check_error");
                            $(this).find(".qt_answer").addClass('qt_error')
                        }
                    }
                });
                //单选多选相互转化
                $('.change-type input').click(function(){
                    if($(this).is(':checked')){
                        $(this).parent().siblings().removeClass('type-name-1').addClass('type-name-2');
                        that.changeType($(this),'多选题','checkbox',2);
                    }else{
                        $(this).parent().siblings().removeClass('type-name-2').addClass('type-name-1');
                        that.changeType($(this),'单选题','radio',1);
                    }
                })
            },
            changeType(tar,title,dataType,inputType){
                tar.parent().siblings('.type-name').text(title);
                tar.parents('.qt_title').siblings('.key').find('input').attr('type',dataType);
                tar.parents('.question').attr('data-type',inputType)
            },
            changeSize(ii){
                $(".question .qt_title .title").eq(ii).each(function(index, element) {
                    var $numWords = $(this).text().length;
                    if($numWords==4){
                        $(this).css({"font-size":"20px"});
                    }else if ($numWords==5) {
                        $(this).css({"font-size":"16px"});
                    }else if ($numWords>5) {
                        $(this).css({"font-size":"14px"});
                    }
                });
            },
            setMarkdown() {
                let editor = new E(this.$refs['leftContent']);
                // 编辑器的事件，每次改变会获取其html内容
                var that = editor, self = this;
                editor.customConfig.onchange = (html) => {
                    $('#preview').html('');
                        let newArr = [];
                        let indexArr = [];
                        let questionArr = [];
                        let detail = [];
                        let contentText = html.replace(/<p>/g, "\n\n").replace(/<\/p>/g, "\n\n").replace(/<br>/g, "\n\n").replace(/auto;">/g, 'auto;">\n\n').split('\n');
                        //去除空格
                        contentText.forEach(function (value) {
                            if (value) {

                                value = value.replace(/&nbsp;/g, ' ');
                                value = '&nbsp;&nbsp;&nbsp;' + value;
                                value = value.replace(/&nbsp;/g, "\n");

                                newArr.push(value)
                            }
                        });
                        //寻找相应的下标
                        newArr.forEach(function (value, index) {

                            if (value.match(nameReg)) {
                                indexArr.push(index)
                            }

                        });
                        //截取完整小题
                        indexArr.forEach(function (value, index) {

                            questionArr.push(newArr.slice(indexArr[index], indexArr[index + 1]))

                        });
                        self.titleText = `(共${questionArr.length}题)`
                        //判断题型，赋值qt_type
                        questionArr.forEach(function (value) {
                            var allValue = value.join(' ');
                            //匹配没有答案的情况(  答案：/【答案】)
                            if (!allValue.match(/\n+\s*【\s*答案\s*】\s*/g) && !allValue.match(/\n+\s*(答案[:：])\s*/g)) {
                                //匹配到选项存在则默认为单选题先判断是否带有a.类似标志
                                if (allValue.match(/\n+\s*[a-h]\s*[.|、]/ig)) {

                                    self.getClassify(value, detail, 1)

                                } else if (fillReg.test(allValue)) {
                                    //在判断是否带有（）
                                    self.getClassify(value, detail, 4)
                                } else {
                                    //否则默认为问答题
                                    self.getClassify(value, detail, 5)
                                }

                            } else {

                                var answerReg = /^\s*\n?【\s*答案\s*】\s*/;
                                var answerJude = /\n\n\n\s*【\s*答案\s*】|\n\n\n\s*答案[:：]/g;
                                //针对存在多个答案的情况
                                if (allValue.match(answerJude).length > 1) {
                                    value.forEach(function (ele, i) {

                                        if (ele.match(answerJude)) {

                                            value = value.slice(0, i + 1)

                                        }

                                    })
                                }
                                value.forEach(function (val) {
                                    // 处理下中文括号
                                    if (answerReg.test(val)) {
                                        val = val.replace(answerReg, '答案：');
                                    }
                                    //只有答案两个字的情况
                                    if (/^\s*\n?答案\s*\n?$/.test(val)) {
                                        val = val.replace(/^\s*\n?(答案)\s*/, '答案：');
                                    }

                                    if (val.match(singleReg)) {

                                        var m = val.match(singleReg);//匹配答案项
                                        var isAnswer = m[0].replace(/^\n?\s*(答案[:|：])\s*/, "");//寻找答案后的字符串
                                        //有答案字段，没有正确的答案
                                        if (!isAnswer) {
                                            var newString = value.join(' ');
                                            if (newString.match(/\n?\s*[a-h][.|、]\s*/ig)) {
                                                //有选项情况下，默认为单选题
                                                self.getClassify(value, detail, 1)
                                            } else {
                                                //填空题筛选
                                                if ((newString.split('答案')[0]).match(fillReg)) {

                                                    self.getClassify(value, detail, 4);
                                                    return false
                                                }
                                                //无选项情况下，默认为问答题（主要包括判断题与问答题的区分）
                                                self.getClassify(value, detail, 5)
                                            }
                                        } else {
                                            //word版多选题带,号处理
                                            if (isAnswer.match(/^([a-h][,|，]){0,7}([a-h])$/ig)) {
                                                isAnswer = isAnswer.replace(/,|，/g, '')
                                            }
                                            var isSelect = isAnswer.match(/^\s*[a-h]{1,8}\s*(?:\n|$)/i);//单选/多选
                                            var isJude = isAnswer.match(/^\s*(正确|错误|对|错)\s*(?:\n|$)/i);//判断
                                            var isSelects = [] //该数组用于接收处理玩空字符串之后的isSelect
                                            // 针对大小写选项重复
                                            if (isSelect) {
                                                //  数组去重
                                                isSelect = (isSelect[0].split('')).filter(function (ele, i, array) {
                                                    return array.indexOf(ele) === i;
                                                });
                                                //二次处理isSelect,去除空字符串
                                                isSelect.forEach(function (value1) {
                                                    if (value1.trim()) {
                                                        isSelects.push(value1)

                                                    }
                                                });
                                                //排序
                                                isSelects.sort();

                                                //1，2项比较是否为同一个选项(a,A)
                                                if (isSelects.length === 2 && isSelects[0].toLocaleLowerCase() === isSelects[1]) {
                                                    isSelects = isSelects.splice(0, 1)
                                                }
                                            }
                                            //单选题
                                            if (isSelects && isSelects.length === 1) {

                                                self.getClassify(value, detail, 1)
                                            }
                                            //多选题
                                            if (isSelects && isSelects.length > 1) {

                                                self.getClassify(value, detail, 2)

                                            }
                                            //判断题
                                            if (isJude) {

                                                self.getClassify(value, detail, 3)

                                            }
                                            if (!isSelect && !isJude) {
                                                // 填空题
                                                if ((((value.join(" ").split('答案:'))[0].match(fillReg)) && (value.join(" ").split('答案:')).length > 1)
                                                    ||
                                                    (((value.join(" ").split('答案：'))[0].match(fillReg))) && (value.join(" ").split('答案：')).length > 1) {
                                                    self.getClassify(value, detail, 4)
                                                } else {
                                                    //问答题
                                                    self.getClassify(value, detail, 5)
                                                }
                                            }
                                        }
                                    }
                                })
                            }
                        });
                        var html = '';
                        //没有数据时隐藏检查处错误提示
                        if (detail.length === 0) {
                            // $("#errorCount").text('');
                            // $("#errorText").hide();
                            // $("#nextError").hide()
                        }
                        var ii = -1;//计数
                        detail.forEach(function (value) {
                            ii++;
                            qt_type = value.type;
                            html = Markdown.toHTML((value.name).join(''),undefined,undefined,qt_type);
                            $('#preview').append(html);
                            self.$nextTick(function () {
                                // 标记答案
                                self.markAnswer(qt_type, ii);
                                self.changeSize(ii);
                                //  错误点及时检测
                                var errorNum = $('.check_error') && $('.check_error').length;
                                if (errorNum > 0) {

                                    $("#errorCount").text(errorNum);
                                    $("#errorText").show();
                                    if (errorNum === 1) {
                                        $("#nextError").text('查看').show();
                                    } else {
                                        $("#nextError").text('下一处').show();
                                    }
                                } else {
                                    $("#errorCount").text('');
                                    $("#errorText").hide();
                                    $("#nextError").hide()
                                }
                            })
                        });

                        //禁止右侧多选点击，禁止默认事件
                        $(".key input").click(function () {
                            return false
                        })
                        $(".body-content .cont-r .tab-content .batch-type .simulationOption div.now_diff").click(); //纠正难度错误
                }
                editor.customConfig.menus = [];
                editor.create();
            },
            serializeFn(){
                var classification = $("input[name=classification]").val();
                // var difficult=$("select[name=difficult]").val();
                var data=[];

                $("#preview").find(".question").each(function (index,element) {
                    var type = $(this).attr('data-type');
                    var reQuestion = $(this).find(".qt_title").html().replace(/^[\s\S]*<span class="type-box"[\s\S]*>[\s\S]+<\/span>([\s\S]*)$/,"$1");
                    var question=this.escapeHTML(reQuestion);
                    var answer1=$(this).find(".key_A").length==0 ? "" : (this.escapeHTML($(this).find(".key_A").html())==""?" ":this.escapeHTML($(this).find(".key_A").html()));
                    var answer2=$(this).find(".key_B").length==0 ? "" : (this.escapeHTML($(this).find(".key_B").html())==""?" ":this.escapeHTML($(this).find(".key_B").html()))
                    var answer3=$(this).find(".key_C").length==0 ? "" : (this.escapeHTML($(this).find(".key_C").html())==""?" ":this.escapeHTML($(this).find(".key_C").html()))
                    var answer4=$(this).find(".key_D").length==0 ? "" : (this.escapeHTML($(this).find(".key_D").html())==""?" ":this.escapeHTML($(this).find(".key_D").html()))
                    var answer5=$(this).find(".key_E").length==0 ? "" : (this.escapeHTML($(this).find(".key_E").html())==""?" ":this.escapeHTML($(this).find(".key_E").html()))
                    var answer6=$(this).find(".key_F").length==0 ? "" : (this.escapeHTML($(this).find(".key_F").html())==""?" ":this.escapeHTML($(this).find(".key_F").html()))
                    var answer7=$(this).find(".key_G").length==0 ? "" : (this.escapeHTML($(this).find(".key_G").html())==""?" ":this.escapeHTML($(this).find(".key_G").html()))
                    var answer8=$(this).find(".key_H").length==0 ? "" : (this.escapeHTML($(this).find(".key_H").html())==""?" ":this.escapeHTML($(this).find(".key_H").html()))
                    if(type=="1"||type=="2"){
                        var key=this.escapeHTML($(this).find(".qt_answer").html()).replace(/&nbsp;/g,"").toUpperCase().replace(/<BR CLASS="MARKDOWN_RETURN">/g, "");
                    }else if (type=="3") {
                        var key=this.escapeHTML($(this).find(".qt_answer").html()).replace(/(^\s+)|(\s+$)/g,"").replace(/(正确|对)/,1).replace(/(错误|错)/,0);
                    }else{
                        var key=this.escapeHTML($(this).find(".qt_answer").html());
                    }
                    var comKeyWord = $(this).find(".qt_comKeyWord").length==0 ? "" : this.escapeHTML($(this).find(".qt_comKeyWord").html());
                    var coreKeyWord = $(this).find(".qt_coreKeyWord").length==0 ? "" : this.escapeHTML($(this).find(".qt_coreKeyWord").html());
                    var analysis=$(this).find(".qt_analysis").length==0 ? "" : this.escapeHTML($(this).find(".qt_analysis").html());
                    var difficult=$(this).find(".qt_difficult").length==0 ? "" : this.escapeHTML($(this).find(".qt_difficult").html());
                    if ($(this).find(".qt_difficult").length!=0){
                        difficult=difficult.slice(0,2);
                    }
                    var label=$(this).find(".qt_label").length==0 ? "" : this.escapeHTML($(this).find(".qt_label").html());
                    data[index]={
                        "classification":classification,
                        "type":type,
                        "difficult":difficult,
                        "question":question,
                        "answer1":answer1,
                        "answer2":answer2,
                        "answer3":answer3,
                        "answer4":answer4,
                        "answer5":answer5,
                        "answer6":answer6,
                        "answer7":answer7,
                        "answer8":answer8,
                        'normal_words':comKeyWord,
                        "key_words":coreKeyWord,
                        "key":key,
                        "analysis":analysis,
                        "label":label,
                        "disorder":1
                    };
                    // 若不存在该项则不存入
                    for (i in data[index]) {
                        if(data[index][i]==""||!data[index][i]){
                            delete data[index][i];
                        }
                    }
                });
                return data;
            },
            escapeHTML(text){
                return text.replace(/^[\s\S]*<span class="title"[\s\S]*>[\s\S]+<\/span>([\s\S]*)$/,"$1")
                    .replace(/<br class="markdown_return">/g, "$markdown_return")
                    .replace(/\&nbsp;/g, " ")
                    .replace(/\$markdown_return/g, '<br class="markdown_return">')
            },
            importFun(){
                var previewHtml = $('#preview').html();
                var previewText = $('#preview').text();

                if($.trim(previewHtml) === '' || $.trim(previewText) === ''){
                    alert('导入内容不能为空！');
                    return false
                }

                if($('.check_error').length > 0){
                    alert('存在错误，请检查试题！');
                    return false;
                }
                var text = $("#text-input .fr-view").html();
                $("#errorText , #errorTextNew").hide();
                if($("input[name=classification]").val()==''){
                    alert("请选择试题分类！");
                    return false;
                }else{
                    var data=this.serializeFn();
                    var dataForm=JSON.stringify(data);
                    $("#import").hide();
                    $("#import_questions").show();
                    this.$post('/baseinfo/admin/upload_testqm_txt/',dataForm).then(json=>{
                        $("#import_questions").hide();
                        $("#import").show();
                        var message="成功导入 "+json.data.data.bizContent.successCount+" 道试题，失败 "+json.data.data.bizContent.failCount+" 道题";
                        $("#import_result").text(message);
                        if (USER_ROLE == 'sub_admin' && KSXRIGHTS.allowPaperAdd != 1){
                            $('#conResult').hide();
                        }
                        $('#txtImport').modal();
                        // gio
                        ksxProbe.gioTrack('enterQuestionSuccess', 1, {
                            'questionEnterMethod_var': '批量录入',
                            'questionEnterCount_var': json.data.data.bizContent.successCount
                        });

                        $('#txtImport').on('hidden.bs.modal', function (e) {
                            $( '#txtImport' ).off().on( 'hidden', 'hidden.bs.modal');
                            location.reload();
                        })
                    })

                }
            },
        }
    }
</script>

<style lang="stylus">
  @import "question_import.css"
  .batch {
    height: 100%;

    .antd-height-55 {
      height: calc(100% - 55px);
    }

    .left, .right {
      width 50%;
      height 100%;
      margin-right: 10px;
      background: #FFFFFF;
      overflow hidden
      border-top: 1px solid #DEDEDE;
      border-bottom: 1px solid #DEDEDE;

      .commonHeader {
        padding: 0 20px 0 10px;
        background: #F3F3F5;
        border-left: 1px solid #DEDEDE;
        border-right: 1px solid #DEDEDE;

        .title {
          font-size: 18px;
          color: #3A3E51;
          line-height: 40px;
        }
      }

      .Content {
        height calc(100% - 40px);
        outline none;
        overflow: auto;
      }

      .leftContent {
        .w-e-text-container{
          height 100% !important
        }
      }
    }

    .right {
      border: 1px solid #DEDEDE;

      .commonHeader {
        border-left: none;
        border-right: none;
      }
    }
  }

  .batchDrawer {
    .ant-drawer-wrapper-body {
      height 100%

      .txt-red {
        color red;
      }
    }
  }
</style>
