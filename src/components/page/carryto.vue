<template>
  <div>
    <div class="carManager">
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="el-icon-lx-cascades"></i>
            入账信息
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="container">
      <div class="headers">
        <span>姓名：</span>
        <el-input  v-model="inputadd" style="width:150px;height:50px" placeholder="请输入内容"></el-input>
        <span>类目：</span>
        <el-select v-model="value1" placeholder="请选择">
          <el-option
            :disabled="true"
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <span>账单状态：</span>
        <el-select v-model="value2" placeholder="请选择">
          <el-option
            v-for="itemned in bill"
            :key="itemned.value"
            :label="itemned.label"
            :value="itemned.value"
            :disabled="true"
          ></el-option>
        </el-select>
        <span>交易日期：</span>
        <div class="block">
          <el-date-picker class="el-data" :disabled="true" v-model="value3" type="date" placeholder="选择日期"></el-date-picker>
        </div>
      </div>
      <div style="margin-top:-20px" class="btnBox">
        <el-button size="small" class="myBtn">导出</el-button>
        <el-button type="primary"  @click="search" style="left:1056px" size="small" class="myBtn">搜索</el-button>
      </div>

      <div class="icon-on-div">
        <el-table
          :data="tableData"
          border
          class="table"
          ref="multipleTable"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="name" label="姓名" width="200" align="center" class-name="table"></el-table-column>
          <el-table-column prop="usermu" label="类目" width="300" align="center" class-name="table"></el-table-column>
          <el-table-column prop="money" label="交易金额" width="280" align="center" class-name="table"></el-table-column>
          <el-table-column
            prop="createTime"
            label="交易日期"
            width="310"
            align="center"
            class-name="table"
          ></el-table-column>
          <el-table-column prop="province" label="状态" width="255" align="center" class-name="table">
            <template> 
              <span>已入账</span> 
            </template>
          </el-table-column>
          <el-table-column prop="city" label="备注" width="220" align="center" class-name="table"></el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="cur_page"
          :page-size="pagesize"
          :total="totalRecords"
          :page-sizes="[5, 10, 20, 40]"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      //表格数组
      tableData: [
      ],
      //类目数组
      nsped: "", //类目的serviceType
      options: [
        {
          value: "0",
          label: "贴膜进账"
        },
        {
          value: "1",
          label: "快递进账"
        },
        {
          value: "2",
          label: "充值进账"
        }
      ],
      //账单状态
      bill: [
        {
          value: "0",
          label: "待入账"
        },
        {
          value: "1",
          label: "已入账"
        },
        {
          value: "2",
          label: "支付出错"
        }
      ],
      inputadd: "", //绑定姓名input框的内容
      pagesize: 20,
      input1: "2019-02-11", //交易日期
      value1: "", //类目
      value2: "", //账单状态
      cur_page: 1,
      totalRecords: 0,
      value3: "",
      disabledDate(time) {
        return time.getTime() > Date.now();
      }
    };
  },
  created() {
    this._Shoelist(); //获取后台接口数据
  },
  methods: {
    //获取后台接口数据
    _Shoelist() {
      var res = this;
      this.tableData=[];
      this.$axios({
        url:
          "http://39.99.137.77:8081/projects/paylog/findAllPayLogForPC?pageNum="+this.cur_page+"&pageSize="+this.pagesize,
           method: "get",
          //  data:{
          //       pageNum:this.cur_page,
          //       pageSize:this.pagesize
          //  }
      })
        .then(function(response) {
          // console.log(response.data.list)
          res.tableData = response.data.list;
          for (let i = 0; i < res.tableData.length; i++) {
            if (res.tableData[i].serviceType == 0) {
              res.tableData[i]["usermu"] = "贴膜进账";
            } else if (res.tableData[i].serviceType == 1) {
              res.tableData[i]["usermu"] = "快递进账";
            } else {
              res.tableData[i]["usermu"] = "充值进账";
            }
          }
          for (let i = 0; i < res.tableData.length; i++) {
            if (res.tableData[i].status == 0) {
              res.tableData[i]["province"] = "待入账";
            } else if (res.tableData[i].status == 0) {
              res.tableData[i]["province"] = "已入账";
            } else {
              res.tableData[i]["province"] = "支付出错";
            }
          }
          //console.log(response.data)
          res.totalRecords= response.data.total;
        })
        .catch(function(err) {
          //console.log(err);
        });
    },
    a(){
      //console.log(this.tableData)
    },
    // 搜索
    search() {
      var res = this;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/paylog/searchAllPayLogForPC",
        method: "post",
        data: {
          nickName: this.inputadd,
          serviceType: this.value1
        }
      })
        .then(function(response) {
          //console.log(response,"45454152415")
          res.tableData.length = 0;
          //console.log(response.data, "5878748645646");
          res.totalRecords= response.data.total;
          res.tableData = response.data;
          for (let i = 0; i < res.tableData.length; i++) {
            if (res.tableData[i].serviceType == 1) {
              res.tableData[i]["usermu"] = "待取快递";
            } else if (res.tableData[i].serviceType == 0) {
              res.tableData[i]["usermu"] = "手机贴膜";
            } else {
              res.tableData[i]["usermu"] = "服务人员充值";
            }
          }
          for (let i = 0; i < res.tableData.length; i++) {
            if (res.tableData[i].status == 1) {
              res.tableData[i]["province"] = "未入账";
            } else if (res.tableData[i].status == 0) {
              res.tableData[i]["province"] = "已入账";
            } else {
              res.tableData[i]["province"] = "支付出错";
            }
          }
         
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          //console.log(error);
        });
    },
    //每页显示个数改变
    handleSizeChange(val) {
      this.pagesize = val;
      //console.log(this.pagesize);
      this._Shoelist();
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this._Shoelist();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>
<style  scoped>
.myBtn {
  margin-top: 15px;
}
.btnBox {
  width:  100%;
  box-sizing: border-box;
  padding: 0 10px;
  padding-right: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  /* background: pink; */
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
  width: 100%;
  font-size: 14px;
}
.el-data {
  position: relative;
  left: 937px;
  top: -50px;
}
</style>