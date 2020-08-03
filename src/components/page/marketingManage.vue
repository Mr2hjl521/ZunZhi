<template>
  <div class="icon-two-div">
    <div class="carManager">
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="el-icon-lx-cascades"></i>
            优惠券
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <el-main class="icon-on-div">
      <div class="icon-wo-div" @click="clickor">
        <h3 style="margin:10px 0px 10px 0px">贴膜优惠券</h3>
        <div class="imgBox">
          <img :src="couponImg" class="couponImg" />
        </div>
        <div>有效期：{{ validTime1 }}天</div>
      </div>
      <div class="icon-wo-div" @click="clickor2">
        <h3 style="margin:10px 0px 10px 0px">代取快递优惠券</h3>
        <div class="imgBox">
          <img :src="couponImg" class="couponImg" />
        </div>
        <div>有效期：{{ validTime2 }}天</div>
      </div>
      <!-- 编辑贴膜优惠券弹出框 -->
      <el-dialog title align="center" :visible.sync="npepass" width="40%">
        <h2>贴膜优惠券</h2>
        <div class="icon-te-cli">
          <img :src="couponImg" class="couponImg" />
        </div>
        <div>
          有效期:
          <el-input v-model="time1" class="handle-input mr10" type="number" :placeholder="validTime1"></el-input>天
        </div>
        <el-button type="primary" @click="Shoelist" class="icon-button">保存</el-button>
      </el-dialog>
      <!-- 弹出框结束 -->

      <!-- 编辑代取快递优惠券弹出框 -->
      <el-dialog title align="center" :visible.sync="npepass2" width="45%">
        <h2>代取快递优惠券</h2>
        <div class="icon-te-cli">
          <img :src="couponImg" class="couponImg" />
        </div>
        <div>
          有效期:
          <el-input v-model="time2" class="handle-input mr10" :placeholder="validTime2" type="number"></el-input>天
        </div>
        <el-button type="primary" @click="Shoelist2" class="icon-button">保存</el-button>
      </el-dialog>
      <!-- 弹出框结束 -->
    </el-main>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      validTime1: "",//从后端接收的第一个有效期
      validTime2: "",//从后端接收的第一个有效期
      time1: "",
      time2: "",
      couponImg: require("../../assets/img/coupon2.png"),
      tableData: [
        {
          title: "代取件券"
          // scr:require('图片地址')
        },
        {
          title: "手机贴膜券"
          // scr:require('图片地址')
        }
      ],
      npepass: false, //改变贴膜弹出框隐藏消失
      npepass2: false, //改变代取弹出框隐藏消失
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      var res = this;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/coupons/findAll",
        method: "get",
        data: {}
      })
        .then(function(response) {
          if (response.status <= 200) {
            //console.log(response.data);
            //console.log(response.data[0].validTime)
            res.validTime1 = response.data[0].validTime;
            res.validTime2 = response.data[1].validTime;
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          //console.log(error);
        });
    },
    clickor() {
      this.npepass = true;
    },
    clickor2() {
      this.npepass2 = true;
    },
    // 修改贴膜优惠券
    Shoelist() {
      var that= this;
      //console.log(this.time1)
      var time1 =Number(this.time1)
      //console.log(time1)
      this.$axios({
        url: 'http://39.99.137.77:8081/projects/coupons/pcUpdateTime',
        method: "put",
        data: {
            id: 1,
            validTime: time1
        }
      })
        .then(function(res) {
          //console.log(res);
          that.npepass = false;
          that.getData();
        })
        .catch(function(err) {
          //console.log();
        });
    },
     // 修改代取优惠券
    Shoelist2() {
      var that= this;
      //console.log(this.time2)
      var time2 =Number(this.time2)
      //console.log(time2)
      this.$axios({
        url: 'http://39.99.137.77:8081/projects/coupons/pcUpdateTime',
        method: "put",
        data: {
            id: 2,
            validTime: time2
        }
      })
        .then(function(res) {
          //console.log(res);
          that.npepass2 = false;
          that.getData();
        })
        .catch(function(err) {
          //console.log();
        });
    }
  }
};
</script>
<style  scoped>
.handle-input {
  width: 80px;
  display: inline-block;
  margin-left: 10px;
  margin-right: 10px;
}
.imgBox {
  width: 200px;
  height: 120px;
  /* background-color: pink; */
  margin: 0 auto;
}
.couponImg {
  width: 100%;
  height: 100%;
}
.icon-on-div {
  width: 100%;
  /* height: 805px; */
  background: #fff;
}
.icon-on-pen {
  font-size: 18px;
  margin: 8px 0px 10px 20px;
}
.icon-wo-div {
  width: 300px;
  height: 200px;
  background: white;
  float: left;
  text-align: center;
  margin: 20px 20px 10px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.icon-on-buttton {
  position: relative;
  width: 350px;
  height: 50px;
  margin-top: 687px;
  color: white;
  background: #b8741a;
  font-size: 18px;
}
.icon-te-cli {
  width: 180px;
  height: 120px;
  margin-top: 20px;
  margin-bottom: 10px;
}
.icon-div-new {
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.icon-button {
  width: 100px;
  margin-top: 30px;
}
.icon-el-wer {
  width: 200px;
}
.el-input--small .el-input__inner {
  height: 32px;
  line-height: 32px;
}
.icon-div-new > span {
  margin-left: 10px;
}
</style>

<style>
.el-dialog__body {
  padding-top: 10px;
}
.el-input__inner {
    padding-right: 0px;
}
</style>
