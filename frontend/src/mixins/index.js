export default {
  data() {
    return {
      A_Z: {},
      A_ZCode: {},
      arrList: [
        {'key': '0', label: '全选'},
        {'key': '1', label: '单选题'},
        {'key': '2', label: '多选题'},
        {'key': '3', label: '判断题'},
        {'key': '4', label: '填空题'},
        {'key': '5', label: '问答题'},
        // {'key': '6', label: '组合题'},
        // {'key': '7', label: '录音题'},
      ],
      arrList1: [
        {'key': 'simple', label: '简单'},
        {'key': 'middle', label: '普通'},
        {'key': 'hard', label: '困难'},
      ],
    }
  },
  mounted() {
    this.getAZ()
    this.getAZCode()
  },
  methods: {
    getAZ() {
      var t = 1;
      for (var i = 65; i < 91; i++) {
        this.A_Z[t++] = String.fromCharCode(i);
      }
    },
    getAZCode() {
      var t = 0;
      for (var i = 65; i < 91; i++) {
        this.A_ZCode[String.fromCharCode(i)] = t++;
      }
    },
    rowFun(record) {
      return record.id
    },
  }

}
