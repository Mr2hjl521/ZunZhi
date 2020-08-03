<template>
  <div class="carManager">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>
          手机贴膜订单
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        姓名:<el-input v-model="selectName" placeholder="请输入姓名" class="handle-input mr10"></el-input>
        手机号:<el-input v-model="selectPhone" placeholder="请输入手机号" class="handle-input mr10"></el-input>
        订单号:<el-input v-model="selectOrderNumber" placeholder="请输入订单号" class="handle-input mr10"></el-input>
        订单状态:<el-select v-model="selectStatus" placeholder="订单状态" class="handle-select mr10">
            <el-option key="0" label="待服务" value="0"></el-option>
            <el-option key="1" label="待评价" value="1"></el-option>
            <!-- <el-option key="2" label="已结算" value="2"></el-option> -->
            <!-- <el-option key="3" label="已删除订单" value="3"></el-option> -->
            <el-option key="4" label="已完成" value="4"></el-option>
            
          </el-select>
        
        <el-button type="primary" icon="el-icon-search" @click="search" class="sousuo">搜索</el-button>
        <el-button type="danger" icon="el-icon-search"  @click="go" class="sousuo">异常订单</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable">
        <el-table-column prop="tpoOrderNumber" label="订单号" width="180" class-name="table"></el-table-column>
        <el-table-column prop="cuaName" label="姓名" width="120" class-name="table"></el-table-column>
        <el-table-column prop="cuPhone" label="手机号" width="120" class-name="table"></el-table-column>
        <el-table-column prop="address" label="地址" width="200" class-name="table"></el-table-column>
        <el-table-column prop="pName" label="商品" width="200" class-name="table"></el-table-column>
        <el-table-column prop="ppcPrice" label="交易金额" width="80" class-name="table"></el-table-column>
        <el-table-column prop="actualPrice" label="实际交易金额" width="110" class-name="table"></el-table-column>
        <el-table-column prop="couponsNumber" label="优惠券" width="80" class-name="table"></el-table-column>
        <el-table-column prop="tpoCreateTime" label="下单时间" width="200" class-name="table"></el-table-column>
        <el-table-column prop="tpoStatusName" label="订单状态" width="110" class-name="table">       </el-table-column>
        <el-table-column prop="suName" label="服务人员1" width="120" class-name="table"></el-table-column>
        <el-table-column label="操作" width="80" align="center" class-name="table">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="errorTypeName" label="服务状态" width="120" class-name="table">
           <template slot-scope="msg">
            <div v-if="msg.row.errorTypeName=='异常'"> 
             <div class="abnormal"> {{msg.row.errorTypeName}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="againServiceUserName"  label="服务人员2" width="120" class-name="table">
           <template slot-scope="msg">
            <div v-if="msg.row.errorTypeName=='异常'&&msg.row.againServiceUserName!=='null'"> 
             <div> {{msg.row.againServiceUserName}}</div>
            </div>
            <div v-if="msg.row.errorTypeName=='异常'&&msg.row.againServiceUserName===null">
             <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit2(msg.$index, msg.row)"
            >选择服务人员</el-button>
            </div>
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
    <!--  选择服务人员弹窗 -->
    <el-dialog title="选择服务人员" :visible.sync="editVisible2" width="50%">
      <el-form ref="editForm" :model="editForm" label-width="100px" class="selectServiceBox">
       <div class="sBox" v-for="item in list" :key="item.id">
         <img :src="item.avatarUrl" alt="" class="pic">
         <!-- hhhh -->
         <div class="serviceInfo">
           <div class="info1">
             <span class="serviceName">{{ item.serviceName }}</span>
             <span class="sex">{{ sex[item.serviceUserSex] }}</span>
           </div>
           <div class="info2">{{ item.campusName }}</div>
           <div>{{ item.serviceUserDesc }}</div>
         </div>
         <div class="radi">
            <input type="radio" :id="item.id" :value="item.serviceUserId" v-model="selectServiceId" class="radiBtn"> 
         </div>  
       </div>
       
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit2">确 定</el-button>
      </span>
    </el-dialog>


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
// import { fetchData } from '../../api/index';
import Validator from "async-validator";
export default {
  name: "carManager",
  data() {
    return {
      // 0 女 1 男
      sex: ["女","男"],
      selectServiceId: '', //最终选择的二次配送的服务人员的id
      list: [
      ],
      radio: '',
      value: "",
      // 展示的表格数据
      tableData: [
       
      ],
      cur_page: 1,
      pagesize: 20,
      totalRecords: 0,
      totalPages: 0,
      agentNames: [], // 代理商名字下拉框
      multipleSelection: [],
	    select_cate: "",
	    selectName: "", //检索服务人员姓名
      selectPhone: "", //检索服务人员手机号
      selectStatus: "", //检索订单状态
      selectOrderNumber: "", //检索订单号
      del_list: [],
      is_search: false,
      editVisible: false,  //控制编辑弹窗
      editVisible2: false, //控制选择服务人员弹窗
      addVisible: false,
      delVisible: false,
      editForm: {
      },

      idx: -1,
      id: -1
    };
  },
  created() {
    this.getData();
    // this.getSelect(); //查询下拉框内容
  },
  computed: {
    data() {
      return this.tableData.filter(d => {
        let is_del = false;
        for (let i = 0; i < this.del_list.length; i++) {
          if (d.name === this.del_list[i].name) {
            is_del = true;
            break;
          }
        }
        if (!is_del) {
          if (
            d.address.indexOf(this.select_cate) > -1 &&
            (d.name.indexOf(this.select_word) > -1 ||
              d.address.indexOf(this.select_word) > -1)
          ) {
            return d;
          }
        }
      });
    }
  },
  methods: {
    dateFormatterexpirationTime(row, column) {
      let datetime = row.expirationTime;
      if (datetime) {
        datetime = new Date(datetime);
        let y = datetime.getFullYear() + "-";
        let mon = datetime.getMonth() + 1 + "-";
        let d = datetime.getDate();
        return y + mon + d;
      }
      return "";
    },
    dateFormatter(row, column) {
      let datetime = row.joinTime;
      if (datetime) {
        datetime = new Date(datetime);
        let y = datetime.getFullYear() + "-";
        let mon = datetime.getMonth() + 1 + "-";
        let d = datetime.getDate();
        return y + mon + d;
      }
      return "";
    },
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

    // 获取 所有数据
    getData() {
      var res = this;
      res.tableData=[];
      this.$axios({
      	url: 'http://39.99.137.77:8081/projects/testPhoneOrder/pcFindAll?pageNum='+res.cur_page+'&pageSize='+ res.pagesize,
      	method: 'get',
      	data: {  }
      })
      	.then(function(response) {
      		if (response.status <= 200) {
            //console.log(response.data)
            res.totalRecords = response.data.total; //总条数
              var mm = response.data.list;
              //console.log(mm) 
              for(var i=0;i<mm.length;i++) {
                if(mm[i].errorType==0) {
                  //异常订单
                  res.tableData.push({
                    soId: mm[i].soId,
                    cuaName: mm[i].cuaName,
                    cuPhone: mm[i].cuPhone,
                    pName: mm[i].pName,
                    ppcPrice: mm[i].ppcPrice,
                    actualPrice: mm[i].actualPrice,
                    tpoOrderNumber: mm[i].tpoOrderNumber,
                    couponsNumber: mm[i].couponsNumber,
                    tpoCreateTime: mm[i].tpoCreateTime,
                    tpoStatus: mm[i].tpoStatus,
                    tpoStatusName: mm[i].tpoStatusName,
                    suName: mm[i].suName,
                    errorType: mm[i].errorType,
                    errorTypeName: "异常",
                    againServiceUserName: mm[i].againServiceUserName,
                    // againServiceUserName: "臭猪",
                    address: mm[i].cuCampusName+mm[i].cuaFloorNumber+'号楼'+mm[i].cuaDoorNumber+'宿舍',
                    tpoStatusName:  mm[i].tpoStatusName,
                    tpoId:  mm[i].tpoId
                    
                    
                  })
                }else {
                  res.tableData.push({
                    tpoId:  mm[i].tpoId,
                    soId: mm[i].soId,
                    cuaName: mm[i].cuaName,
                    cuPhone: mm[i].cuPhone,
                    pName: mm[i].pName,
                    ppcPrice: mm[i].ppcPrice,
                    actualPrice: mm[i].actualPrice,
                    tpoOrderNumber: mm[i].tpoOrderNumber,
                    couponsNumber: mm[i].couponsNumber,
                    tpoCreateTime: mm[i].tpoCreateTime,
                    tpoStatus: mm[i].tpoStatus,
                    tpoStatusName: mm[i].tpoStatusName,
                    suName: mm[i].suName,
                    errorType: mm[i].errorType,
                    errorTypeName: "",
                    againServiceUserName: mm[i].againServiceUserName,
                    address: mm[i].cuCampusName+mm[i].cuaFloorNumber+'号楼'+mm[i].cuaDoorNumber+'宿舍',
                    tpoStatusName:  mm[i].tpoStatusName
                })
                }   
              }
              //console.log(res.tableData)
      // 			// res.getData()
      		}
      	})
      	.catch(function(error) {
      		res.$message.error('查询失败: ' + error);
      		//console.log(error);
      	});
    },
    go() {
      this.$router.push('/abnormal')
    },
	// 关键字检索
    search() {
      this.is_search = true;
      var res = this;
      // //console.log(res.selectPhone)
      // //console.log(res.selectName)
      // //console.log(res.selectStatus)
      // //console.log(res.selectOrderNumber)
      this.$axios({
        url: "http://39.99.137.77:8081/projects/testPhoneOrder/findSearchAll",
        method: "post",
        data: {
          phone: res.selectPhone,
          clientUserName: res.selectName,
          status: res.selectStatus,
          orderNumber: res.selectOrderNumber
        }
      })
        .then(function(response) {
          if (response.status <= 200) {
            //console.log(response.data.list)
            res.tableData=[]
            var mm = response.data.list;
              for(var i=0;i<mm.length;i++) {
                if(mm[i].errorType==0) {
                  //异常订单
                  res.tableData.push({
                    tpoId:  mm[i].tpoId,
                    soId: mm[i].soId,
                    cuaName: mm[i].cuaName,
                    cuPhone: mm[i].cuPhone,
                    pName: mm[i].pName,
                    ppcPrice: mm[i].ppcPrice,
                    actualPrice: mm[i].actualPrice,
                    tpoOrderNumber: mm[i].tpoOrderNumber,
                    couponsNumber: mm[i].couponsNumber,
                    tpoCreateTime: mm[i].tpoCreateTime,
                    tpoStatus: mm[i].tpoStatus,
                    tpoStatusName: mm[i].tpoStatusName,
                    suName: mm[i].suName,
                    errorType: mm[i].errorType,
                    errorTypeName: "异常",
                    againServiceUserName: mm[i].againServiceUserName,
                    // againServiceUserName: "臭猪",
                    address: mm[i].cuCampusName+mm[i].cuaFloorNumber+'号楼'+mm[i].cuaDoorNumber+'宿舍',
                    tpoStatusName:  mm[i].tpoStatusName
                    
                  })
                }else {
                  res.tableData.push({
                    tpoId:  mm[i].tpoId,
                    soId: mm[i].soId,
                    cuaName: mm[i].cuaName,
                    cuPhone: mm[i].cuPhone,
                    pName: mm[i].pName,
                    ppcPrice: mm[i].ppcPrice,
                    actualPrice: mm[i].actualPrice,
                    tpoOrderNumber: mm[i].tpoOrderNumber,
                    couponsNumber: mm[i].couponsNumber,
                    tpoCreateTime: mm[i].tpoCreateTime,
                    tpoStatus: mm[i].tpoStatus,
                    tpoStatusName: mm[i].tpoStatusName,
                    suName: mm[i].suName,
                    errorType: mm[i].errorType,
                    errorTypeName: "",
                    againServiceUserName: mm[i].againServiceUserName,
                    address: mm[i].cuCampusName+mm[i].cuaFloorNumber+'号楼'+mm[i].cuaDoorNumber+'宿舍',
                    tpoStatusName:  mm[i].tpoStatusName
                })
                }   
              }
            // res.tableData = response.data.memberData;
            // res.totalRecords = response.data.memberTotalRecords; //总条数
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
    // 编辑框 
    handleEdit(index, row) {
      // this.idx = index;
      // this.id = row.agentId;
      // this.editForm = {
      //   agentId: row.agentId,
      //   tpoStatus: row.tpoStatus
      // };
      // this.editVisible = true;
    },
    handleDelete(index, row) {
      this.idx = index;
      //console.log(row.tpoId);
      this.id = row.tpoId;
      this.delVisible = true;
    },
    //获取可以二次配送的服务人员的数据
    // 选择服务人员编辑框
    handleEdit2(index, row) {
      this.idx = index;
      this.id = row.soId;
      this.soId = row.soId;
      //console.log(this.id)
      var soId = row.soId;
      var res = this;
      res.$axios({
      	url: 'http://39.99.137.77:8081/projects/testPhoneOrder/findServiceUserBy?soId='+res.id,
      	method: 'get',
      	data: { }
      })
      	.then(function(response) {
      		if (response.status <= 200) {
            //console.log(response.data)
            res.list = response.data;
            res.editVisible2 = true;
      		}
      	})
      	.catch(function(error) {
      		res.$message.error('查询失败: ' + error);
      		//console.log(error);
      	});


      //console.log("ok")
     
    },
    delAll() {
      const length = this.multipleSelection.length;
      let str = "";
      this.del_list = this.del_list.concat(this.multipleSelection);
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].name + " ";
      }
      this.$message.success("删除了" + str);
      this.multipleSelection = [];
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 确定删除
    deleteRow() {
      var res = this;
      //console.log(this.id);
      var id = Number(res.id);
      //console.log(id)
      this.$axios({
        url: "http://39.99.137.77:8081/projects/testPhoneOrder?id="+id,
        method: "delete",
        data: {  }
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.$message.success("删除成功");
            res.delVisible = false;
            res.getData();
          }
        })
        .catch(function(error) {
          res.$message.success("查询失败！");
          //console.log(error);
        });
    },
    // *****保存选择服务人员的弹窗*****
    saveEdit2() {
      var res = this;
      //console.log(res.soId)
      //console.log(res.selectServiceId)
      this.$refs.editForm.validate(valid => {
        if (!valid) {
          res.$message.success("格式不正确");
        } else {
          this.$axios({
            url: "http://39.99.137.77:8081/projects/testPhoneOrder/updateAgainServiceUserById?soId="+res.soId+'&serviceUserId='+res.selectServiceId,
            method: "put",
            data: {}
          })
            .then(function(response) {
              if (response.status <= 200) {
                res.editVisible2 = false;
                res.$message.success("修改成功");
                res.$message.success(`修改第 ${res.idx + 1} 行成功`);
                //console.log("修改成功");
                res.getData();
              }
            })
            .catch(function(error) {
              res.$message.success("修改失败！");
              //console.log(error);
            });
        }
      });
    },

  }
};
</script>

<style msg>
.abnormal {
  color: red;
}
</style>
<style scoped>
/* ****选择服务人员弹窗样式 */
.red {
  color: red;
}
.sBox {
  height: 80px;
  /* background-color: red; */
  display: flex;
  flex-direction: row;
  margin: 15px;
  padding: 10px;
  border-bottom: 1px solid #F6F6F6;
  /* justify-content: space-between; */
  
}
.serviceInfo {
    /* background-color: pink; */
    padding: 0 10px;
    
  }
.serviceName {
  font-size: 16px;
  font-weight: 700;
}
.info1 {
  display: flex;
  flex: row;
  justify-content: space-between;
  margin-bottom: 8px;
}
.info2 {
  margin-bottom: 10px;
}
.radi {
  width: 40px;
  height: 40px;
  flex: 1;
  text-align: right;
  padding-top: 35px; 
  margin-right: 20px;
  /* background-color: pink; */
}
.radiBtn {
  width: 20px;
  height: 20px;
}
.pic {
  width: 80px;
  height: 80px;
  margin-right: 10px;
  border-radius: 5px;
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
  width: 120px;
}

.handle-input {
  width: 170px;
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
  margin: 10px;
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
/* .cell {
  color:#ff0000;
} */
</style>
