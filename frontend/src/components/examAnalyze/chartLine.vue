<template>
  <div class="mainClass">
    <apexchart
      ref="count"
      type="line"
      height="300px"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script>

export default {
  name: "ChartLine",
  props: {
    chartData: {
      type: Array
    },
    xAxis: {
      type: Array
    }
  },
  watch: {
    'chartData': function(value) {
      this.refreshChart();
      debugger
    },
  },
  data() {
    return {
      chartOptions: {
        chart: {
          id: "vuechart-example"
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "20%"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: []
      },
      fill: {
        opacity: 1
      },
      series: []
    };
  },
  methods: {
    refreshChart() {
      //   this.chartOptions = {
      //     colors: [colors[Math.floor(Math.random() * colors.length)]]
      //   };
      debugger
      this.$refs.count.updateSeries(this.chartData, true);
      this.$refs.count.updateOptions(
        {
          xaxis: {
            categories: this.xAxis
            //   ["最大值", "最小值", "平均分", "应考人数", "实考人数"]
          }
          // title: {
          //   text: '近七日系统访问记录',
          //   align: 'left'
          // }
        },true,true);
    }
  }
};
</script>

<style scoped>
.mainClass {
  height: 300px;
  width: 100%;
}
</style>