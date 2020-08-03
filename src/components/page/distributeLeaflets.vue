<template>
  <div>
    <div class="carManager">
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="el-icon-lx-cascades">派单</i>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="icon-box">
        <div class="icon-div-ned">
          <div class="icon-devv-on">
            <ul class="icon-divv-ul">
              <li class="xixi">
                <el-checkbox v-model="checkeds" class="three-button" @change="add()"></el-checkbox>
              </li>
              <li v-for="(item,index) in tableData.floorOrderBos" :key="index">
                <el-checkbox v-model="checked[index]" class="three-button" @change="check(index)"></el-checkbox>
              </li>
            </ul>
          </div>
          <el-table
            :data="tableData.floorOrderBos"
            class="table"
            ref="multipleTable"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              prop="floorNumber"
             
              align="center"
              label="楼号"
              class-name="table"
            ></el-table-column>
            <el-table-column
              prop="orderNumber"
              align="center"
              label="订单数"
             
              class-name="table"
            ></el-table-column>
          </el-table>
        </div>
        <div class="icon-devv-on">
          <ul class="icon-divv-ul">
            <li></li>
            <li
              v-for="(item,index) in tableData.serviceAreaBos"
              :key="index"
            >
              <!-- <input type="radio" @click="adders(index)" /> -->
              <el-radio v-model="radio" @change="adders(index)" :label="index"></el-radio>
            </li>
          </ul>
        </div>
        <div class="icon-div-ned">
          <el-table
            :data="tableData.serviceAreaBos"
            class="table"
            ref="multipleTable"
            @selection-change="handleSelectionChange"
            >
            
              <el-table-column
                prop="serviceUserName"
                width="100"
                align="center"
                label="服务人员"
                class-name="table"
              >  
                <template slot-scope="msg">
                 <div class="line" v-show="flag==0"> {{msg.row.serviceUserName}}</div>
                 <div v-show="flag==9">{{msg.row.serviceUserName}}</div>
                </template>
            </el-table-column>
               
               
               
            <el-table-column
              prop="serviceArea"
              align="center"
              label="所负责楼号"
              class-name="table"
            >
             <template slot-scope="msg">
                 <div class="line" v-show="flag==0"> {{msg.row.serviceArea}}</div>
                  <div v-show="flag==9">{{msg.row.serviceArea}}</div>
                </template>

            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-button type="danger" style="float:right;margin:30px 40px 0px 0px" @click="Arrange()">点击派送</el-button>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      flag: 9,
      tableData: [],
      ned: [], //获取选中的楼号
      checked: [], //循环遍历出来的所有checkbox的值
      lable: "",
      radio: "",
      ndder: "", //获取单选框的下标
      checkeds: "",
      nsedr:0
    };
  },
  created() {
    this.addli();
  },
  updated() {
      
  },
  methods: {
    handleSelectionChange() {},
    //点击全选按钮
    add() {
      if (this.checkeds == true) {
        for (let i = 0; i < this.tableData.floorOrderBos.length; i++) {
          this.checked[i] = true;
        }
      } else {
        for (let i = 0; i < this.tableData.floorOrderBos.length; i++) {
          this.checked[i] = false;
        }
      }
    },
    //单选按钮点击
    adders(index) {
      this.ndder = this.tableData.serviceAreaBos[index].serviceUserId;
      //console.log("点击单选框弹出的东西",this.ndder)
    },
    //复选框点击
    check(index) {
      if (this.checked[index] == true) {
        this.tableData.floorOrderBos[index].checked = true;
      } else {
        this.tableData.floorOrderBos[index].checked = false;
      }
      this.nsedr=0;
      for (let i = 0; i < this.tableData.floorOrderBos.length; i++) {
        if (this.checked[i] == false) {
          this.checkeds = false;
        }else if(this.checked[i] == true){
            this.nsedr++
        }
      }
    //   alert(this.nsedr)
      if(this.nsedr==this.tableData.floorOrderBos.length){
         this.checkeds = true;
      }
      
    },
    //页面刷新执行的效果
    addli() {
      var res = this;
      this.$axios({
        url:
          "http://39.99.137.77:8081/projects/pcIndex/findOrderServiceUserByCampusId?campusId="+this.$route.query.id,
         
        method: "get"
      })
        .then(function(response) {
          res.tableData = response.data.data;
          for (var i = 0; i < res.tableData.floorOrderBos.length; i++) {
            res.tableData.floorOrderBos[i]["checked"] = false;
          }
          for (var i = 0; i < res.tableData.serviceAreaBos.length; i++) {
            res.tableData.serviceAreaBos[i]["checked"] = false;
          }
          //console.log(res.tableData, "564346465");
        })
        .catch(function(err) {
          //console.log(err);
        });
    },
    //点击检索的按钮
    Arrange() {
      //遍历循环楼号
      this.ned = [];
      for (var i = 0; i < this.tableData.floorOrderBos.length; i++) {
        if (this.tableData.floorOrderBos[i].checked == true) {
          this.ned.push(this.tableData.floorOrderBos[i].floorNumber);
        }
      }
      //console.log(this.$route.query.id, "要传给后端的id"), 
      //console.log(this.ned, "传给后端的楼号");
      //console.log(this.ndder, "传给后端的人员的id");
      if (!this.ndder == "" && !this.ned.length == 0) {
        var res = this;
        this.$axios({
          url: "http://39.99.137.77:8081/projects/pcIndex/addTakeServiceOrder",
          method: "post",
          data: {
            campusId: this.$route.query.id,
            floorNumbers: this.ned,
            serviceUserId: this.ndder
          }
        })
          .then(function(response) {
            //console.log(response);
            res.addli();
            res.checkeds = false;
            res.radio=false;
            if(res.tableData.floorOrderBos.length==0) {
                res.flag=0;
            }
          })
          .catch(function() {
            //console.log(err);
          });
      } else {
        alert("请选择楼号和服务人员");
      }
    }
  }
};
</script>
<style  scoped>
.line {
    height: 43px !important;
    background-color: pink;
}
.table {
    width: 45%;
}
.headers {
  width: 100%;
  height: 30px;
  margin: 0px 0px 30px 0px;
}

.headers > span {
  margin-left: 15px;
  margin-right: 10px;
}
.icon-buttoned {
  padding: 5px 10px;
  position: relative;
  left: 13px;
  top: 5px;
}
.icon-on-input {
  width: 250px;
  height: 20px;
  position: relative;
  top: -2px;
  left: 10px;
}
.icon-on-div {
  margin: 20px 0px 0px 10px;
}
.table {
  width: 45%;
  font-size: 14px;
}
.el-data {
  position: relative;
  left: 937px;
  top: -50px;
}
.icon-div-ned {
  width: 50%;
  height: 100%;
  background: white;
  display: flex;
  justify-content: space-between;
  border-right: 1px solid rgb(204, 196, 196);
}
.icon-box {
  display: flex;
  justify-content: space-between;
}
.icon-devv-on {
  width: 40px;
  height: auto;
  background: white;
  float: left;
  text-align: center;
  padding-left:10px;
}
.icon-divv-ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.icon-divv-ul > li {
  width: 30px;
  height: 23px;
  padding: 9px 0px 8px 0px;
  background: white;
  text-align: center;
}
.xixi {
    width: 10px;
    background-color: pink;
}
</style>