<template>
  <div>
    <div class="head">
      <div class="head_title">
        <h2>待处理订单</h2>
      </div>
      <div class="head_body">
        <div class="card">
          <div class="card_title" style="background:#9783e3;">
            <h2>待审核</h2>
            <h3 style="margin-top:46px">
              人员审核
              <span class="icon-el-span">{{ userNumber }}</span>
            </h3>
            <h3>
              库存审核
              <span class="icon-el-span">{{ filmNumber }}</span>
            </h3>
          </div>
          <div class="card-body" style="background:#a992fe;"></div>
        </div>
        <div class="card">
          <div class="card_title" style="background:#e45c71;">
            <h2>待放款申请</h2>
            <h3 style="margin-top:46px">
              贴膜
              <span class="icon-el-span">{{ filmApplicationNumber }}</span>
            </h3>
            <h3>
              代取件
              <span class="icon-el-span">{{ takeApplicationNumber }}</span>
            </h3>
          </div>
          <div class="card-body" style="background:#ff677e;"></div>
        </div>
        <div class="card">
          <div class="card_title" style="background:#e4ba70;">
            <h2>当天贴膜订单数</h2>
            <h3 style="margin-top:46px" class="mybox">
              <img class="icon-img-er" src="../.././assets/img/02.png" alt />
              <span class="icon-spaner">{{ smsNumber }}</span>
            </h3>
          </div>
          <div class="card-body" style="background:#ffd07d;"></div>
        </div>
        <div class="card">
          <div class="card_title" style="background:#00c6b9;">
            <h2>短信发送总条数</h2>
            <h3 style="margin-top:46px" class="mybox">
              <img class="icon-img-er" src="../.././assets/img/03.png" alt />
              <span class="icon-spaner">{{ takeApplicationNumber }}</span>
            </h3>
          </div>
          <div class="card-body" style="background:#00decf;"></div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="bottom_left">
        <div class="bto_title">
          <div>待派单</div>
          <div class="number">{{numberesd}}</div>
          <div>
            <el-select v-model="id" placeholder="请选择">
              <el-option
                v-for="(item,index) in options"
                :key="index"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="bottom_bto">
          <div class="icon-div-ned">
            <ul class="icon-ndd-ul">
              <li class="icon-lili">
                <strong style="margin-left:70px">学校</strong>
                <strong class="icon-red icon-ned">订单数</strong>
              </li>
              <li
                v-for="(item,index) in options"
                class="icon-elel"
                :key="index"
                @click="addli(index)"
              >
                <span style="margin-left:50px">{{item.value}}</span>
                <span class="icon-red">{{item.orderNumber}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="bottom_right">
        <div id="myChart"></div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      value1: "",
      number: 209, //等待派单的数量
      options: [],
      value: "",
      userNumber: "", //人员审核
      filmNumber: "", //库存申请审核
      filmApplicationNumber: "", //贴膜
      takeApplicationNumber: "", //代取件
      filmOrderNumber: "", //贴膜订单数
      smsNumber: "",
      numberesd: 0, //总单数
      id: "",
      npd: "",
      dist: [], //传给给服务人员派单的值
      myTime: [],
      myData: []
    };
  },
  created() {
    this._Shoelist();
    this.getData(); //获取折线图数据
  },
  mounted() {
    // this.drawLine();
  },
  methods: {
    //获取折线图数据
    getData() {
      var res = this;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/pcIndex/find",
        method: "get"
      })
        .then(function(response) {
          // console.log(response.data.data.userCountBos);
          var mm = response.data.data.userCountBos;
          for (var i = 0; i < mm.length; i++) {
            var time = mm[i].date.substr(5, 5);
            // console.log(time);
            res.myTime.push(time);
            res.myData.push(mm[i].count);
          }
          res.drawLine();
        })
        .catch(function(err) {
        });
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        title: {
          left: "left",
          text: "用户增长率"
        },
        tooltip: {
          //跟随鼠标显示数值
          trigger: "axis"
        },
        //保存图片
        toolbox: {
          feature: {
            saveAsImage: {
              name: "用户增长率", //图片名
              pixelRatio: 2
            }
          }
        },
        color: "#2db7f5",
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.myTime
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"]
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
              "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
            handleSize: "80%",
            handleStyle: {
              color: "#fff",
              shadowBlur: 3,
              shadowColor: "rgba(0, 0, 0, 0.6)",
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }
        ],
        series: [
          {
            // data: [820, 932, 901, 934, 1290, 1330, 1320],
            data: this.myData,
            type: "line"
          }
        ]
      });
    },
    addli(index) {
      //点击跳转路由
      this.$router.push({
        path: "/distributeLeaflets",
        query: {
          id: this.options[index].id
        }
      });
    },
    //获取后台接口数据
    _Shoelist() {
      var res = this;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/pcIndex/find",
        method: "get"
      })
        .then(function(response) {
          // console.log(response.data.data)
          var npf = response.data.data;
          //console.log(npf)
          res.userNumber = npf.userNumber;
          res.filmNumber = npf.filmNumber;
          res.filmApplicationNumber =
            npf.filmApplicationNumber;
          res.takeApplicationNumber = npf.takeApplicationNumber;
          res.filmOrderNumber = npf.filmOrderNumber;
          res.smsNumber = npf.smsNumber;
          for (var i = 0; i < npf.pcIndexCampusBos.length; i++) {
            res.numberesd += npf.pcIndexCampusBos[i].orderNumber;
            res.options.push({
              value: npf.pcIndexCampusBos[i].campusName,
              id: npf.pcIndexCampusBos[i].campusId,
              orderNumber: npf.pcIndexCampusBos[i].orderNumber
            });
          }
          //console.log(res.numberesd)
        })
        .catch(function(err) {
          //console.log(err);
        });
    }
  }
};
</script>
<style  scoped>
.mybox {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.icon-spaner {
  float: right;
  font-size: 50px;
  margin-right: 90px;
  margin-top: 16px;
}
.icon-img-er {
  width: 80px;
  height: 80px;
  margin-left: 22px;
}
.head {
  height: 300px;
  width: 95%;
  margin: 2.5%;
  background: #ffffff;
  box-shadow: 10px 10px 5px #888888;
}
.head_title {
  height: 50px;
  border-bottom: #888888 solid 1px;
  padding-left: 10px;
  margin: 0 10px;
}
.head_title h2 {
  line-height: 50px;
  
}
.head_body {
  height: 250px;
  width: 100%;
  display: flex;
  justify-content: space-around;
}
.card {
  height: 220px;
  width: 23%;
  margin-top: 10px;
  overflow: hidden;
  border-radius: 10px;
}
.card_title {
  height: 50px;
  width: 100%;
  background: red;
}
.card_title h2 {
  color: #ffffff;
  height: 100%;
  line-height: 50px;
  padding-left: 10px;
}
.card_title h3 {
  color: #ffffff;
  margin: 18px 0px 0 5px;
  word-spacing: 20px;
}
.card-body {
  height: 170px;
  width: 100%;
  background: green;
}
.bottom {
  height: 700px;
  width: 95%;
  margin: 2.5%;
  box-shadow: 10px 10px 5px #888888;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.bottom_left {
  height: 700px;
  width: 45%;
  margin: left;
}
.bottom_right {
  width: 50%;
  margin-right: 30px;
  position: relative;
  /* background: pink; */
}
.block {
  position: absolute;
  right: 20px;
  top: 60px;
  z-index: 999;
}

#myChart {
  width: 600px;
  height: 400px;
  background-color: #fff;
  margin-top: 50px;
  padding: 10px;
  border-radius: 3px;
}

.bto_title {
  height: 40px;
  width: 100%;
  background: #fff;
  display: flex;
  justify-content: space-around;
  line-height: 40px;
  margin-left: 5px;
  border-radius: 5px;
}
.number {
  color: #ffffff;
}
.icon-div-ned {
  width: 100%;
  height: 658px;
  background: #fff;
  /* background: yellow; */
  margin-left: 5px;
  /* box-shadow: 5px -5px 5px #888888; */
  box-shadow: 0 15px 30px #888888;
  margin-top: 10px;
  /* padding: 10px; */
}
.icon-ndd-ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.icon-red {
  float: right;
  margin-right: 200px;
}
.icon-lili > strong {
  color: blue;
}
.icon-ned {
  float: right;
  margin-right: 180px;
}
ul > li {
  width: 98%;
  height: 40px;
  line-height: 40px;
}
.icon-elel {
  border-bottom: 1px solid #888888;
  margin: 0 5px;
}
.icon-lili {
  border-bottom: 1px solid #888888;
  margin: 0 5px;
}
.icon-el-span {
  float: right;
  margin-right: 50px;
}
</style>

