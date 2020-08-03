<template>
  <div class="carManager">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>
          数据分析
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div id="phone" :style="{width: '95%', height: '600px'}"></div>

      <div class="center">
        <!-- 收购转化率 -->
        <div class="buyBox">
          <div id="percentConversion"></div>
          <span class="num">首购转化率 ≈ {{ newFirstBuyNuber }} %</span>
          <div class="block">
            <el-date-picker
              v-model="value2"
              type="month"
              placeholder="选择月"
              value-format="yyyy-MM"
              @change="myTime"
            >"></el-date-picker>
          </div>
        </div>
        <div id="liveness" :style="{width: '50%', height: '600px'}"></div>
      </div>
      <div id="login" :style="{width: '95%', height: '600px'}"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      registeredUsers: "", //注册用户数
      buyUsers: "", //首购过的用户
      newFirstBuyNuber: 0,
      firstBuyNuber: 0,
      nowTime: "", //当前年月
      value2: "",
      aaa: ["衬衫", "鞋子", "雪纺衫", "裤子", "高跟鞋", "袜子"]
    };
  },
  created() {
    this.getTime(); //获取当前年月 并请求此年月的数据
    this.getRepeatPurchaseData(); //获取复购次数
  },
  mounted() {
    this.phone();
    this.livenessLine();
    this.login();
  },
  methods: {
    // 获取当前时间的年--月
    getTime() {
      var now = new Date();
      var year = now.getFullYear(); //年
      var month = now.getMonth() + 1; //月
      this.nowTime = year + "-" + month;
      console.log(this.nowTime);
      this.getFirstBuyData();
    },
    //获取首购转化率数据
    getFirstBuyData() {
      var res = this;
      this.$axios({
        url:
          "http://39.99.137.77:8081/projects/clientUser/selectCountss?time=" +
          this.nowTime,
          method: "get"
      })
        .then(function(response) {
          console.log(response.data);
          res.registeredUsers = response.data.count;
          res.buyUsers = response.data.count1;
          var num1 = response.data.count; //注册人数
          var num2 = response.data.count1; //首购过的人数
          var num3 = num2 / num1;
          res.firstBuyNuber = num3 * 100;
          console.log(res.firstBuyNuber);
          var a = res.firstBuyNuber;
          var b = a.toFixed(2);
          res.newFirstBuyNuber = b;
          res.drawLine();
        })
        .catch(function(err) {});
    },
    // 改变时间月份选择器
    myTime(value) {
      console.log(value);
      this.nowTime = value;
      this.getFirstBuyData(); //重新获取首购转化率数据
    },


    //获取复购次数
    getRepeatPurchaseData() {
       var res = this;
      this.$axios({
        url: 'http://192.168.3.148:8082/statisticalAnalysis/recapturePerCapita',
        method: "get"
      })
        .then(function(response) {
          console.log(response.data);
          
        })
        .catch(function(err) {});
    },
    

    //转化率图表--------------------------------------------------------------------------------------------------------------------------------------------------------
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(
        document.getElementById("percentConversion")
      );
      // 绘制图表
      myChart.setOption({
        title: {
          //   left: "center",
          text: "首购转化率"
        },
        tooltip: {
          formatter: "{a} <br/>{b} : {c}人"
        },
        // toolbox: {
        //   feature: {
        //     dataView: { readOnly: false },
        //     restore: {},
        //     saveAsImage: {}
        //   }
        // },
        legend: {
          data: ["注册", "首购过用户"]
        },
        calculable: true,
        color: ["#c280ff", "#facd91"],
        series: [
          {
            name: "数据统计",
            type: "funnel",
            left: "10%",
            top: 60,
            bottom: 60,
            width: "80%",
            min: 0,
            max: 100,
            minSize: "0%",
            maxSize: "100%",
            sort: "descending",
            gap: 2,
            label: {
              show: true,
              position: "inside"
            },
            labelLine: {
              length: 50,
              lineStyle: {
                width: 1,
                type: "solid"
              }
            },
            itemStyle: {
              borderColor: "#000",
              borderWidth: 1
            },
            emphasis: {
              label: {
                fontSize: 18
              }
            },
            data: [
              { value: this.registeredUsers, name: "注册" },
              { value: this.buyUsers, name: "首购过用户" }
            ]
          }
        ]
      });
    },

    //用户登录分析
    login() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("login"));
      // 绘制图表
      myChart.setOption({
        title: {
          text: "日登陆用户统计",
          subtext: ""
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {
          data: ["登录信息统计"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: [0, 0.01],
            type: "category",
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              onZero: false,
              lineStyle: {}
            },
            axisPointer: {
              label: {
                formatter: function(params) {
                  return (
                    "登陆人数  " +
                    params.value +
                    (params.seriesData.length
                      ? "：" + params.seriesData[0].data
                      : "")
                  );
                }
              }
            },
            data: [
              "2016-1",
              "2016-2",
              "2016-3",
              "2016-4",
              "2016-5",
              "2016-6",
              "2016-7",
              "2016-8",
              "2016-9",
              "2016-10",
              "2016-11",
              "2016-12"
            ]
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 100,
            handleIcon:
              "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
            handleSize: "80%",
            handleStyle: {
              color: "#fff",
              shadowBlur: 3,
              shadowColor: "rgba(0, 0, 0, 0.6)",
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }
        ],
        series: [
          {
            name: "日登陆人数",
            type: "line",
            smooth: true,
            data: [
              3.9,
              5.9,
              11.1,
              18.7,
              48.3,
              69.2,
              231.6,
              46.6,
              55.4,
              18.4,
              10.3,
              0.7
            ]
          }
        ]
      });
    },
    //复购次数图表------------------------------------------------------------------------------------------------------------------------------------------------------------
    phone() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("phone"));
      // 绘制图表
      myChart.setOption({
        title: {
          text: "人均复购次数",
          subtext: ""
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        color: ["#96BFFF", "#FB7293"],
        legend: {
          data: ["手机贴膜", "待取件"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: [
            "12-1",
            "12-3",
            "12-5",
            "12-6",
            "12-7",
            "12-1",
            "12-3",
            "12-5",
            "12-6",
            "12-7",
            "12-1",
            "12-3",
            "12-5",
            "12-6",
            "12-7"
          ],
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: "value",
          boundaryGap: false
        },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 100,
            handleIcon:
              "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
            handleSize: "80%",
            handleStyle: {
              color: "#fff",
              shadowBlur: 3,
              shadowColor: "rgba(0, 0, 0, 0.6)",
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }
        ],
        series: [
          {
            name: "手机贴膜",
            type: "bar",
            data: [10, 20, 345, 23, 23, 34, 45, 56, 56, 67, 78, 23, 45, 56, 67]
          },
          {
            name: "待取件",
            type: "bar",
            data: [10, 20, 345, 23, 23, 34, 45, 56, 56, 67, 78, 23, 45, 56, 67]
          }
        ]
      });
    },
    //活跃度图表------------------------------------------------------------------------------------------------------------------------------------------------------
    livenessLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("liveness"));
      // 绘制图表
      myChart.setOption({
        title: {
          text: "日活跃人数",
          subtext: ""
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        color: ["#E1251B", "#A8A8A8"],
        legend: {
          data: ["活跃", "不活跃"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        dataZoom: [
          //拉动X轴
          {
            type: "inside",
            start: 0,
            end: 50
          },
          {
            start: 0,
            end: 10,
            handleIcon:
              "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
            handleSize: "80%",
            handleStyle: {
              color: "#fff",
              shadowBlur: 3,
              shadowColor: "rgba(0, 0, 0, 0.6)",
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }
        ],
        xAxis: {
          type: "category",
          boundaryGap: [0, 0.01],
          data: [
            "12-1",
            "12-3",
            "12-5",
            "12-6",
            "12-7",
            "12-1",
            "12-3",
            "12-5",
            "12-6",
            "12-7",
            "12-1",
            "12-3",
            "12-5",
            "12-6",
            "12-7"
          ]
        },
        yAxis: {
          type: "value",
          boundaryGap: false
        },
        series: [
          {
            name: "活跃",
            type: "bar",
            data: [10, 20, 345, 23, 23, 34, 45, 56, 56, 67, 78, 23, 45, 56, 67]
          },
          {
            name: "不活跃",
            type: "bar",
            data: [10, 20, 345, 23, 23, 34, 45, 56, 56, 67, 78, 23, 45, 56, 67]
          }
        ]
      });
    }
  }
};
</script>

<style scoped>
.buyBox {
  position: relative;
  width: 50%;
  /* background-color: pink; */
}
.block {
  position: absolute;
  right: 5%;
  bottom: 6%;
  z-index: 8;
}
.num {
  width: 220px;
  position: absolute;
  right: 5%;
  bottom: 12%;
  z-index: 8;
  text-align: left;
  margin-bottom: 5px;
}
#percentConversion {
  /* width: 50%; */
  height: 600px;
  /* background: red; */
}
#liveness {
  background: #ffffff;
}
#phone {
  background: #ffffff;
  /* margin-left: 2.5%; */
  margin-bottom: 50px;
}
#login {
  background: #ffffff;
  margin-left: 2.5%;
  margin-bottom: 1%;
  margin-top: 30px;
}
.center {
  height: 600px;
  width: 100%;
  justify-content: space-around;
  display: flex;
}
.huizong {
  height: 30px;
  width: 400px;
  position: relative;
}
.huizong span {
  height: 30px;
  width: 400px;
  position: absolute;
  bottom: -60px;
  z-index: 999;
}
.tianjia {
  margin-left: 10px;
}
.sousuo {
  margin-right: 10px;
}
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 180px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.outup {
  font-size: 12px;
  color: #fff;
  background-color: #409eff;
  display: inline-block;
  border-radius: 3px;
  padding: 8px 15px;
  margin-left: 10px;
  margin-top: 3px;
}
.upload-demo {
  height: 30px;
  width: 100px;
  display: inline-block;
  margin-left: 10px;
}
.inup {
  margin-top: 10px;
}
</style>

<style>
.el-upload--text {
  width: 60px;
  height: 30px;
  display: inline-block;
  border: 0;
  overflow: visible;
}
.el-table--border {
  border: 1px solid black;
}
.el-table--border,
.el-table--border th,
.el-table td,
.el-table th {
  border-right: 1px solid black;
  border-bottom-color: black;
  border-left-color: black;
  /* background-color: pink; */
  text-align: center;
}
.table {
  border-bottom-color: black !important;
  border-left-color: black !important;
}
</style>
