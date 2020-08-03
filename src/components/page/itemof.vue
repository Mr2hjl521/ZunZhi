<template>
  <div>
    <div class="carManager">
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="el-icon-lx-cascades"></i>
               佣金出账
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="container">
      <div class="headers">
          <p>姓 名:</p>
          <el-input v-model="inputadd" style="width:150px;height:50px" placeholder="请输入内容"></el-input>
          <p>类 目：</p>
          <el-select v-model="value1" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="true"
            ></el-option>
          </el-select>
          <p>账单状态：</p>
          <el-select v-model="value2" placeholder="请选择">
            <el-option
            
              class="icon-weight"
              v-for="itemned in bill"
              :key="itemned.value"
              :label="itemned.label"
              :value="itemned.value"
              :disabled="true"
            ></el-option>
          </el-select>
          <p>交易日期：</p>
              <el-date-picker
                  v-model="value3"
                  :disabled="true"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
              </el-date-picker>
              <p class="ppk">申请日期：</p>
              <el-date-picker
                  class="el-dataa"
                  v-model="value4"
                  :disabled="true"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
              </el-date-picker>
      </div>
      <div style="margin-top:-20px" class="btnBox">
        <el-button size="small" class="myBtn">导出</el-button>
        <el-button type="primary"  @click="add()" size="small" class="myBtn">检索</el-button>
      </div>
      <div class="icon-on-div">
        <el-table
          :data="tableData"
          border
          class="table"
          ref="multipleTable"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="applicationName" label="姓名" width="90" align="center" class-name="table"></el-table-column>
          <el-table-column prop="applicationPhone" label="手机号"  width="150" align="center" class-name="table"  ></el-table-column>
          <el-table-column prop="applicationNumber" label="银行卡账号" width="220" align="center" class-name="table" ></el-table-column>
          <el-table-column prop="usermu" label="身份" width="230" align="center" class-name="table"></el-table-column>
          <el-table-column prop="price" label="佣金" width="170" align="center" class-name="table"></el-table-column>
          <el-table-column prop="createTime" label="申请日期" width="200" align="center" class-name="table"></el-table-column>
          <el-table-column prop="updateTime" label="交易日期"  width="200" align="center" class-name="table"></el-table-column>
          <el-table-column prop="province" label="状态" width="200" align="center" class-name="table" ></el-table-column>
          <el-table-column label="操作" width="100" align="center" class-name="table">
            <template slot-scope="scope">
              <el-button type="text" class="red" @click="handleDelete(scope.$index, scope.row)">发放</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
         <el-pagination
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
        // {
        //   username: "小明",
        //   phoneNumber: "50",
        //   idcard: "123456789",
        //   card: "手机贴膜服务人员",
        //   province: "100",
        //   city: "2018-10-11",
        //   phonedata: "2018-10-11",
        //   condition: "已入账"
        // },
      ],
      //类目数组
      options: [
        {
          value: "0",
          label: "手机贴膜"
        },
        {
          value: "1",
          label: "代取快递"
        },
        {
          value: "2",
          label: "快递点服务人员"
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
      value1: "",
      value2: "",
      cur_page: 1,
      totalRecords: 0,
      value3: "",
      value4:"",
      nedf:"",
      disabledDate(time) {
        return time.getTime() > Date.now();
      }
    };
  },
  created() {
    this._Shoelist(); //获取后台接口数据
  },
  methods: {
    //发放按钮
     handleDelete(index, row) {
          this.nedf=row.id
          var res = this;
          res.$axios({
          url: "http://39.99.137.77:8081/projects/accountApplication/updateAccountAppStatus?accountApplicationId="+this.nedf,
          method: "put"
      }).then(function(response){
          //console.log(response)
          res._Shoelist()
      }).catch(function(){
          //console.log("失败")
      })
      },
    _Shoelist() {
      var res=this
      this.tableData=[];
      this.$axios({
        url:
            "http://39.99.137.77:8081/projects/accountApplication/findAllAccountApplicationForPC?pageNum="+this.cur_page+"&pageSize="+this.pagesize,
             method: "get",
            //  data:{
            //     pageNum:this.cur_page,
            //     pageSize:this.pagesize
            // }
      })
        .then(function(response) {
          //console.log(response,"4564654564")
          res.tableData=response.data.list;
          for (let i = 0; i < res.tableData.length; i++) {
            if (res.tableData[i].serviceType == 0) {
              res.tableData[i]["usermu"] = "手机贴膜";
            } else if (res.tableData[i].serviceType == 1) {
              res.tableData[i]["usermu"] = "代取快递";
            } else {
              res.tableData[i]["usermu"] = "快递点服务人员";
            }
          }
           for (let i = 0; i < res.tableData.length; i++) {
            if (res.tableData[i].status == 0) {
              res.tableData[i]["province"] = "待入账";
            } else if (res.tableData[i].status == 1) {
              res.tableData[i]["province"] = "已入账";
            } else {
              res.tableData[i]["province"] = "支付出错";
            }
          }
           res.totalRecords= response.data.total;
        })
        .catch(function(err) {
           //console.log(err);
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
      this._Shoelist()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //检索
    add(){
         var res = this;
          res.$axios({
          url: "http://39.99.137.77:8081/projects/accountApplication/searchAccountAppForPC",
          method: "post",
          data: {
            nickName: res.inputadd,
            serviceType: res.value1,
            status: res.value2
        }
      }).then(function(response){
        //console.log(response)
         res.tableData=[];
         res.tableData=response.data
         for (let i = 0; i < res.tableData.length; i++) {
            if (res.tableData[i].serviceType == 1) {
              res.tableData[i]["usermu"] = "待取快递";
            } else if (res.tableData[i].serviceType == 0) {
              res.tableData[i]["usermu"] = "手机贴膜";
            } else {
              res.tableData[i]["usermu"] = "快递点服务人员";
            }
          }
           for (let i = 0; i < res.tableData.length; i++) {
            if (res.tableData[i].status == 0) {
              res.tableData[i]["province"] = "待入账";
            } else if (res.tableData[i].status == 1) {
              res.tableData[i]["province"] = "已入账";
            } else {
              res.tableData[i]["province"] = "支付出错";
            }
          }
      }).catch(function(){
         //console.log("shibai")
      })
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
  display: flex;
  /* justify-content: space-around; */
  /* justify-content: space-between; */
  flex-wrap:nowrap;
  width: 100%;
  height: 50px;
  margin: 0px 0px 10px 0px;
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
  width: 200px;
}
.el-range-editor--small.el-input__inner {
    height: 32px;
    width: 20%;
}
#icon-wenght{
   width: 50%;
}
.icon-nedfgh{
  width: 100%;
  height: 20px;
  display: flex;
  justify-content:space-between;

}
.headers>p{
 width:7%;
 height: 20px; 
 word-spacing:20px;
 margin-left: 15px;
}
</style>