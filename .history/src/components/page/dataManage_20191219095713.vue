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
      ActivityLevelTime: [], //活跃度时间
      notActivityCounts: [], //不活跃
      activityCounts: [], //活跃
      type1Arr: [], //type =0 贴膜数据数组
      type2Arr: [], //type =1 代取数据数组
      type1Time: [], //type =0 贴膜时间
      type2Time: [], //type =1 代取时间
      repeatPurchaseTime: [], //复购次数时间轴
      registeredUsers: "", //注册用户数
      buyUsers: "", //首购过的用户
      newFirstBuyNuber: 0,
      firstBuyNuber: 0,
      nowTime: "", //当前年月
      value2: "",
    };
  },
  created() {
    this.getTime(); //获取当前年月 并请求此年月的数据
    this.getRepeatPurchaseData(); //获取复购次数
    this.getActivityLevelData(); //获取用户活跃度
    // this.getLogonStatisticsData(); //获取日登录用户统计
    this.login();
  },
  mounted() {
    // this.login();
  },
  methods: {
    // 获取当前时间的年--月
    getTime() {
      var now = new Date();
      var year = now.getFullYear(); //年
      var month = now.getMonth() + 1; //月
      this.nowTime = year + "-" + month;
      // console.log(this.nowTime);
      this.getFirstBuyData();
    },
    // 改变时间月份选择器
    myTime(value) {
      // console.log(value);
      this.nowTime = value;
      this.getFirstBuyData(); //重新获取首购转化率数据
    },
    //*A---获取首购转化率数据 
    getFirstBuyData() {
      var res = this;
      this.$axios({
        url:
          "http://39.99.137.77:8081/projects/clientUser/selectCountss?time=" +
          this.nowTime,
        method: "get"
      })
        .then(function(response) {
          // console.log(response.data);
          if(response.data=="") {
            res.newFirstBuyNuber = 0;
            res.drawLine();
          }else {
            res.registeredUsers = response.data.count;
            res.buyUsers = response.data.count1;
            var num1 = response.data.count; //注册人数
            var num2 = response.data.count1; //首购过的人数
            var num3 = num2 / num1;
            res.firstBuyNuber = num3 * 100;
            // console.log(res.firstBuyNuber);
            var a = res.firstBuyNuber;
            var b = a.toFixed(2);
            res.newFirstBuyNuber = b;
            res.drawLine();
          }
          
        })
        .catch(function(err) {});
    },
    //A---首购转化率图表--------------------------------------------------------------------------------------------------------------------------------------------------------
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
    //*B---获取复购次数 
    getRepeatPurchaseData() {
      var res = this;
      this.$axios({
        url: "http://192.168.3.148:8082/statisticalAnalysis/recapturePerCapita",
        method: "get"
      })
        .then(function(response) {
          console.log(response.data);
          res.repeatPurchaseTime = response.data.dataSet;
          var yy = response.data.list;
          for (var t = 0; t < yy.length; t++) {
            // type ==0
            if (yy[t].type == 0) {
              res.type1Arr.push(yy[t].avg);
              res.type1Time.push(yy[t].dateTime);
            }
            // type ==1
            if (yy[t].type == 1) {
              res.type2Arr.push(yy[t].avg);
              res.type2Time.push(yy[t].dateTime);
            }
          }
          if (res.type1Arr.length < res.repeatPurchaseTime.length) {
            console.log("type1Arr有残缺");
            var ww = res.repeatPurchaseTime;
            for (var r = 0; r < ww.length; r++) {
              //每一个 ww[r] 都是时间
              // 判断type2Arr里面有没有 ww[r]
              if (res.type1Time.includes(ww[r])) {
                console.log("i", r);
                console.log(ww[r]);
              } else {
                console.log("else", r);
                // 缺少第r个
                res.type1Arr.splice(r, 0, 0);
                console.log("0=======", res.type1Arr);
              }
            }
          }
          if (res.type2Arr.length < res.repeatPurchaseTime.length) {
            console.log("type2Arr有残缺");
            var ww = res.repeatPurchaseTime;
            for (var r = 0; r < ww.length; r++) {
              //每一个 ww[r] 都是时间
              // 判断type2Arr里面有没有 ww[r]
              if (res.type2Time.includes(ww[r])) {
                console.log("i", r);
                console.log(ww[r]);
              } else {
                console.log("else", r);
                // 缺少第r个
                res.type2Arr.splice(r, 0, 0);
                console.log("1=======", res.type2Arr);
              }
            }
          }
          console.log("0=======", res.type1Arr);
          console.log("0time=======", res.type1Time);
          console.log("1=======", res.type2Arr);
          console.log("1time=======", res.type2Time);
          console.log("=======", res.repeatPurchaseTime); //时间轴
          //  res.$nextTick(() => {
          res.phone();
          console.log(res.type2Arr);
          // })
        })
        .catch(function(err) {});
    },
    //B---复购次数图表------------------------------------------------------------------------------------------------------------------------------------------------------------
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
          data: this.repeatPurchaseTime,
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
            data: this.type1Arr
          },
          {
            name: "待取件",
            type: "bar",
            data: this.type2Arr
          }
        ]
      });
    },
    //*C---获取用户活跃度 
    getActivityLevelData() {
      var res = this;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/statisticalAnalysis/findByActivity",
        method: "get"
      })
        .then(function(response) {
          console.log(response.data.data);
          var ss = response.data.data;
          for( var w=0;w<ss.length;w++ ) {
            res.ActivityLevelTime.push(ss[w].time) //时间轴
            res.notActivityCounts.push(ss[w].notActivityCount) //不活跃用户
            res.activityCounts.push(ss[w].activityCount) //活跃用户
          }
          console.log( res.ActivityLevelTime)
          console.log( res.notActivityCounts)
          console.log( res.activityCounts)
          res.livenessLine();
        })
        .catch(function(err) {});
    },
    //C---活跃度图表------------------------------------------------------------------------------------------------------------------------------------------------------
    livenessLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("liveness"));
      // 绘制图表
      myChart.setOption({
         title: {
          //   left: "center",
          text: "用户活跃度"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["活跃", "不活跃"]
        },
        color: ["#F59A23", "#00BFBF"],
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "value"
        },
        yAxis: {
          type: "category",
          data: this.ActivityLevelTime
        },
        series: [
          {
            name: "活跃",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            data:  this.activityCounts   
      
          },
          {
            name: "不活跃",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            data: this.notActivityCounts
          }
        ]
      });
    },
    //*D---获取日登录用户统计
    getLogonStatisticsData() {
      this.login();
    },
    //D---日登录用户统计图表
    login() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("login"));
      // 绘制图表
      myChart.setOption({
        title: {
          text: "日登录用户统计",
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
                    "登录人数  " +
                    params.value +
                    (params.seriesData.length
                      ? "：" + params.seriesData[0].data
                      : "")
                  );
                }
              }
            },
            data: this.ActivityLevelTime
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
            name: "日登录人数",
            type: "line",
            smooth: true,
            data: this.activityCounts
          }
        ]
      });
    },


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
