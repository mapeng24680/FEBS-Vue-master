 let obj=[
  {
    'title': '单选题',
    "content": [
      {'value': '1.驾驶人有下列哪种违法行为一次记6分'},
      {'value': 'A、使用其他车辆行驶证'},
      {'value': 'B、饮酒后驾驶机动车'},
      {'value': 'C、车速超过规定时速50%以上'},
      {'value': 'D、违法占用应急车道行驶'},
      {'value': 'D、违法占用应急车道行驶'},
      {'value': '答案:D'},
      {'value': '解析:请仔细阅读交规<span class="txt-red" style="visibility: hidden;">(若无解析本行可不填)</span>'},
      {'value': '难度:简单'},
    ],
  },
   {
     'title': '多选题',
     "content": [
       {'value': '1.驾驶人有下列哪种违法行为一次记6分？'},
       {'value': 'A、使用其他车辆行驶证'},
       {'value': 'B、饮酒后驾驶机动车'},
       {'value': 'C、车速超过规定时速50%以上'},
       {'value': 'D、违法占用应急车道行驶'},
       {'value': 'D、违法占用应急车道行驶'},
       {'value': '答案:ABCD'},
       {'value': '解析:请仔细阅读交规<span class="txt-red" style="visibility: hidden;">(若无解析本行可不填)</span>'},
       {'value': '难度:简单'},
     ],
   }, {
     'title': '判断题',
     "content": [
       {'value': '1.国际象棋起源于英国吗？'},
       {'value': '答案:红楼梦&&石头记|水浒传|三国演义|西游记 '},
       {'value': '解析:无<span class="txt-red" style="visibility: hidden;">(若无解析本行可不填)</span>'},
       {'value': '难度:简单'},
     ],
   }, {
     'title': '问答题',
     "content": [
       {'value': '1.请论述全球化对国家政治产生了哪些深刻的影响？'},
       {'value': '答案:全球化使国家主权受到一定的制约；全球化对政府的治理提出了更高的要求。'},
       {'value': '解析:请仔细阅读交规<span class="txt-red" style="visibility: hidden;">(若无解析本行可不填)</span>'},
       {'value': '难度:简单'},
     ],
   },
]
 let obj1= {
     'title': '输入规范',
     "content": [
       {'value': '1、所有题型标号支持1.或1、或（1）三种格式。'},
       {'value': '2、所有题型必须含有 “ <span style="color: #F76377">答案：</span>”字段，且不能为空。'},
       {'value': '3、所有题型 “ <span style="color: #F76377">解析：</span>” 字段非必需，没有可不填。'},
       {'value': '3、所有题型 “ <span style="color: #F76377">解析：</span>” 字段非必需，没有可不填。'},
       {'value': '4、所有题型必须含有 “ <span style="color: #F76377">难度：</span>”字段，且不能为空。'},
       {'value': '5、所有题型 “ <span style="color: #F76377">试题标签：</span>” 字段非必需，没有可不填。示例：地域/北京、年份/2019/三月'},
       {'value': '6、所有题型题目中包含图片，则将图片插入到指定位置即可。'},
       {'value': ' 7、<span style="color: #1A8CFE">选择题</span>最少支持2个选项A,B，最多支持8个选项A,B,C,D,E,F,G,H且按照顺序使用。'},
       {'value': ' 8、<span style="color: #1A8CFE">选择题</span>A-H这些选项号与内容之间要用、或 . 分开。'},
       {'value': '9、<span style="color: #1A8CFE">选择题</span>答案中请勿加分隔符或者空格。'},
       {'value': '10、<span style="color: #F76377">判断题</span>答案支持 “错误”，“正确” 或者 “错”，“对”。'},
       {'value': '11、<span style="color:#A06AD2">填空题</span>仅支持题目中出现括号。'},
       {'value': '12、<span style="color:#A06AD2">填空题</span>目里的多个填空答案要用 | 分割，单个答案不用添加。'},
       {'value': '13、<span style="color:#A06AD2">填空题</span>的填空答案支持输入同义词，用&&连接多个同义词答案。'},
       {'value': '14、<span style="color:#C9A310">问答题</span>可以包含 “普通关键词：” 和 “ 核心关键词：”，没有可不填。'},
       {'value': '15、<span style="color:#C9A310">问答题</span>多个关键词用、去分隔，并列关键词（或的关系）用 | 去分隔。'},
     ],
   }
export    {obj,obj1}
