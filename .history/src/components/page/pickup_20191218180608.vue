<template>
  <div class="carManager">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>代取件订单
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="name" placeholder="姓名" class="handle-input mr10"></el-input>
        <el-input v-model="phoneNumber" placeholder="手机号" class="handle-input mr10"></el-input>
        <el-input v-model="orderNumber" placeholder="订单号" class="handle-input mr10"></el-input>
        <el-select v-model="value" placeholder="订单状态" @change="getnew()">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="search" class="sousuo">搜索</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="takeDeliveryOrderId" label="订单号" align="center" class-name="table"></el-table-column>
        <el-table-column prop="cName" label="姓名" align="center" class-name="table"></el-table-column>
        <el-table-column prop="phone" label="手机号" align="center" class-name="table"></el-table-column>
        <el-table-column prop="address" label="地址" align="center" class-name="table"></el-table-column>
        <el-table-column prop="countParcel" label="包裹数量" align="center" class-name="table"></el-table-column>
        <el-table-column prop="tPrice" label="交易金额" align="center" class-name="table"></el-table-column>
         <el-table-column prop="pPrice" label="实际交易金额" align="center" class-name="table"></el-table-column>
        <el-table-column prop="countCoupons" label="优惠券" align="center" class-name="table"></el-table-column>
        <el-table-column prop="createTime" label="下单时间" align="center" class-name="table"></el-table-column>
        <el-table-column prop="type" label="订单状态" align="center" class-name="table"></el-table-column>
        <el-table-column prop="sName" label="服务人员" align="center" class-name="table"></el-table-column>
        <el-table-column label="操作"  align="center" class-name="table">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
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
    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Validator from "async-validator";
export default {
  data() {
    return {
      options: [
        {
          value: "0",
          label: "待取件"
        },
         {
          value: "1",
          label: "以取代送"
        },
         {
          value: "2",
          label: "已完成"
        },
         {
          value: "4",
          label: "异常"
        },
         {
          value: "5",
          label: "已结算"
        },
        {
          value: "3",
          label: "未完成"
        }
      ],
      name:'',//搜索栏名字
      phoneNumber:'',//搜索栏手机号
      orderNumber:'',//搜索栏订单号
      value: "",//搜索栏下拉框
      tableData: [],
      cur_page: 1,
      pagesize: 20,
      totalRecords: 0,
      totalPages: 0,
      is_search: false,
      editVisible: false,
      delVisible: false,
      idx: -1,
      id: -1
    };
  },
  created() {
      this.getData()
  },
  computed: {
  },
  methods: {
    //每页显示个数改变
    handleSizeChange(val) {
      this.pagesize = val;
      this.getData();
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    // 获取全部数据
    getData() {
      var res = this;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/takeServiceOrder/selectAll?pageNum="+this.cur_page+"&pageSize="+this.pagesize,
        method: "get",
        data: { pageNum: res.cur_page, pageSize: res.pagesize }
      })
        .then(function(response) {
          if (response.status <= 200) {
            // console.log(response.data)
            res.tableData = response.data.list;
            res.totalRecords = response.data.total; //总条数
             for(let i=0;i<res.tableData.length;i++){
                res.tableData[i]['address']=res.tableData[i].campusName+res.tableData[i].floorNumber+'号楼'+res.tableData[i].doorNumber+'房间'
            if(res.tableData[i].status==0){
              res.tableData[i]['type']='待取件'
            }else if(res.tableData[i].status==1){
              res.tableData[i]['type']='以取待送'
            }else if(res.tableData[i].status==2){
              res.tableData[i]['type']='已完成'
            }else if(res.tableData[i].status==3){
              res.tableData[i]['type']='未完成'
            }else if(res.tableData[i].status==4){
              res.tableData[i]['type']='异常'
            }else if(res.tableData[i].status==5){
              res.tableData[i]['type']='已结算'
            }
          }
            //console.log(res.tableData);
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          //console.log(error);
        });
    },
    //检索功能下拉框
    getnew(){
        //console.log(this.value)
    },
    search() {
      //console.log(this.name)
      this.is_search = true;
      var res = this;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/takeServiceOrder/selectSousuo",
        method: "post",
        data: {
          cName: res.name,
          phone: res.phoneNumber,
          outTradeNo: res.orderNumber,
          status:res.value
        }
      })
        .then(function(response) {
          if (response.status <= 200) {
            //console.log(response)
            res.tableData = response.data;
             for(let i=0;i<res.tableData.length;i++){
                res.tableData[i]['address']=res.tableData[i].campusName+res.tableData[i].floorNumber+'号楼'+res.tableData[i].doorNumber+'房间'
            if(res.tableData[i].status==0){
              res.tableData[i]['type']='待取件'
            }else if(res.tableData[i].status==1){
              res.tableData[i]['type']='以取待送'
            }else if(res.tableData[i].status==2){
              res.tableData[i]['type']='已完成'
            }else if(res.tableData[i].status==3){
              res.tableData[i]['type']='未完成'
            }else if(res.tableData[i].status==4){
              res.tableData[i]['type']='异常'
            }else if(res.tableData[i].status==5){
              res.tableData[i]['type']='已结算'
            }
          }
            res.totalRecords = response.data.length; //总条数
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          //console.log(error);
        });
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    handleDelete(index, row) {
      this.idx = index;
      this.id = row.takeServiceOrderId;
      this.delVisible = true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 确定删除
    deleteRow() {
      var res = this;
      //console.log(this.id)
      this.$axios({
        url: "http://39.99.137.77:8081/projects/takeServiceOrder?id="+res.id,
        method: "delete",
        data: {}
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.$message.success("删除成功");
            res.getData()
            res.delVisible = false;
            if (res.tableData[res.idx].id === res.id) {
              res.tableData.splice(res.idx, 1);
            } else {
              for (let i = 0; i < res.tableData.length; i++) {
                if (res.tableData[i].id === res.id) {
                  res.tableData.splice(i, 1);
                  return;
                }
              }
            }
          }
        })
        .catch(function(error) {
          res.$message.success("查询失败！");
          //console.log(error);
        });
    }
  }
};
</script>

<style scoped>
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
  width: 120px;
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
}
.table {
  border-bottom-color: black !important;
  border-left-color: black !important;
}
</style>

