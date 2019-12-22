<template>
  <div id="previewPaper" class="flex-container">
    <div class="flex-two model-left modal-body modal-body-style background-eff3f7 relative">
      <div class="title">
        <div class="title_border"></div>
        <div class="title_content">答题卡</div>
      </div>
      <div class="card-content-list">
        <div class="card-content">
          <div class="card-content-title">判断题(共1题，合计10.0分)</div>
          <div class="box-list">
            <div class="box normal-box s1">
              <a href="#5de9035c4b6dbb42984a3bca" class="iconBox questions_5de9035c4b6dbb42984a3bca"
                 questionsid="5de9035c4b6dbb42984a3bca">1</a>
            </div>
          </div>
          <div class="split"></div>
        </div>
      </div>
      <div class="modal-footer">
        <span class="box icon-box s1"></span>
        <span class="icon-label">未答</span>
        <span class="box icon-box s2"></span>
        <span class="icon-label">正确</span>
        <span class="box icon-box s4"></span>
        <span class="icon-label">错误</span>
      </div>
    </div>
    <div class="flex-six background-eff3f7 modal-body-style margin-l-30">
      <div class="body-wrapper relative">
        <div class="body paper">
          <div class="questions">
            <div class="questions-title">1 单选题(共5题，合计50.0分)</div>
            <div class="heightOver">
              <div class="questions-content" v-for="item in 5" :key="item">
                <div class="question-content">
                  <div class="exam-question">
                    <span class="question-index ellipsis">1.</span>
                    在参加各种社交宴请宾客中,要注意从座椅的（）侧入座,动作应轻而缓,轻松自然。(10.0分)
                  </div>
                  <a-radio-group class="answers" disabled v-model="value">
                    <a-radio :style="radioStyle" :value="1">前侧</a-radio>
                    <a-radio :style="radioStyle" :value="2">左侧</a-radio>
                  </a-radio-group>
                  <div class="analysis">
                    <div class="analysis-row">
                      <div class="analysis-title">考生答案：</div>
                      <div class="analysis-content question-com-answer "></div>
                    </div>
                    <div class="analysis-row">
                      <div class="analysis-title">正确答案：</div>
                      <div class="analysis-content question-ans-right">B</div>
                    </div>
                    <div class="analysis-row">
                      <div class="analysis-title">解释说明：</div>
                      <div class="analysis-content question-analysis textalign-justify display-block"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-one background-eff3f7 modal-body-style margin-l-30">
      <div class="nav nav-status nav-operation">
        <ul class="menu-items">
          <li class="menu-item menu-item-time">
            <div class="item-label">剩余时间</div>
            <div class="item-data" id="timeDown">00:59:59</div>
          </li>
          <li class="menu-item menu-item-process">
            <div class="item-label">当前进度</div>
            <div class="item-data">
              <span id="commitCount">0</span>/<span id="totalCount">0</span>
            </div>
            <div class="item-process">
              <div class="item-process-bar" id="commitProcess"></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "previewPaper",
        inject: ['getReaciveNameFromParent'],
        data() {
            return {
                value: 1,
                radioStyle: {
                    display: 'block',
                    height: '30px',
                    lineHeight: '30px',
                },
            }
        },
        computed: {
            reactiveNameFromParent() {
                return this.getReaciveNameFromParent()
            }
        },
        methods: {},
        mounted() {
        },
        created() {
        },
    }
</script>

<style scoped lang="stylus">
  #previewPaper {
    height 100%

    .background-eff3f7 {
      background-color #eff3f7
    }

    .modal-body-style {
      background: #ffffff;
      border-radius: 4px;
      background-clip: padding-box;
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.10);
    }

    .model-left {
      border: 1px solid #dedede;
    }

    .modal-body {
      .title {
        position: relative;
        text-align: left;
        margin-left: 20px;
        margin-top 20px
        .title_border {
          display: inline-block;
          width: 4px;
          height: 18px;
          background: #1A8CFE;
          position: absolute;
          top: 0;
          bottom: 0;
          margin: auto;
        }

        .title_content {
          margin-left: 14px;
          font-weight: 600;
          color: #3A3E51;
        }
      }

      .card-content-list {
        height: calc(100% - 38px);
        overflow: auto;

        .card-content {
          padding: 0 20px 0 20px;
          position: relative;

          .card-content-title {
            font-size: 12px;
            color: #3A3E51;
            font-weight: 600;
            padding-bottom: 12px;
            padding-top: 20px;
            line-height: 17px;
            padding: 10px 0;
          }

          .box-list {
            padding-bottom: 0;
            position: relative;
            left: -5px;
            font-size: 0;
            margin-right: -15px;

            .box {
              height: auto;
              line-height: unset;
              position: relative;
              margin-bottom: 15px;
              width: 35px;
              margin-top: unset;
              margin-right: unset;
              font-size: 14px;
              display: inline-block;
              text-align center

              .iconBox {
                border: 1px solid #DCDFE6;
                color: #DCDFE6;
                background: #fff;
                width: 27px;
                height: 27px;
                line-height: 25px;
                border-radius: 50%;
                display: inline-block;
              }
            }
          }
          .split{
            width: 100%;
            border-bottom: 1px solid #E6E6E6;
          }
        }
      }
    }

    .modal-footer {
      position: absolute;
      bottom: 0;
      background-color #eff3f7
      padding: 10px 20px 10px 0px;
      border: unset;
      right: 0;
      width: 100%;
      box-shadow: 0 -2px 10px 0 rgba(58, 62, 81, 0.10);
      text-align: right;

      .icon-label {
        font-size: 12px;
        color: #6D717C;
      }

      .icon-box {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        display: inline-block;
        vertical-align: middle;
        margin-right: 2px;
        margin-left: 15px
      }

      .s1 {
        background: #FFFFFF;
        border: 1px solid #B4B6BD;
      }

      .s2 {
        background: #1A8CFE;
      }

      .s4 {
        background: #FF0000;
      }
    }

    .body-wrapper {
      padding-right: unset;
      height: 100%;

      .paper {
        color: #3A3E51;
        width: 100%;
        background: #FFFFFF;
        border: 1px solid #DEDEDE;
        border-radius: 4px;
        height: 100%;

        .questions:last-child {
          border-bottom: none;
          height: 100%;

          .questions-title {
            font-size: 18px;
            line-height: 25px;
            padding: 18px 20px;
            background: #FAFAFA;
            border-bottom: 1px solid #DEDEDE;
            word-wrap: break-word;
          }

          .heightOver {
            height: calc(100% - 62px);
            overflow auto

            .questions-content {
              padding-left: 30px;
              padding-right: 75px;

              .question-content {
                padding: 30px 0;
                position: relative;

                .exam-question {
                  font-size: 16px;
                  line-height: 22px;
                  margin-bottom: 10px;
                  padding-left: 20px;
                  position: relative;
                  word-wrap: break-word;

                  .ellipsis {
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                  }

                  p {
                    margin-bottom: 0;
                  }
                }

                .answers {
                  overflow: auto;

                  .record {
                    margin-top: 20px;
                  }
                }

                .analysis {
                  overflow: auto;
                  background: rgba(222, 222, 222, 0.2);
                  border-radius: 4px;
                  padding: 15px 20px;
                  line-height: 24px;
                  margin-top: 10px;
                  position: relative;

                  .analysis-row {
                    min-height: 24px;
                    padding-left: 70px;
                    padding-right: 60px;
                    position: relative;

                    .analysis-title {
                      position: absolute;
                      width: 70px;
                      left: 0;
                      top: 0;

                      .analysis-content {
                        word-wrap: break-word;
                      }
                    }
                  }
                }
              }
            }
          }

        }
      }
    }

    .nav {
      color: #3A3E51;
      line-height: 20px;
      width: 100%;
      padding: 0 10px;
      background: #FFFFFF;
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.10);
      border-radius: 4px;
      margin-bottom: 10px;
      text-align: center;
      height 100%
      border: 1px solid #dedede;

      .menu-item {
        padding: 14px 0;
        height: 69px;

        .item-label {
          margin-bottom: 3px;
        }

        .item-data {
          font-size: 18px;
          line-height: 22px;
          color: #FF0000;
          font-weight: 400;
        }
      }

      .menu-item + .menu-item {
        border-top: 1px solid #dedede;
      }
    }
  }
</style>
