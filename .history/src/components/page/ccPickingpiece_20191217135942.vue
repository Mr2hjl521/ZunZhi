<template>
  <div class="carManager">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>
          快递点服务人员
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        姓名：<el-input v-model="selectName" placeholder="请输入姓名" class="handle-input mr10"></el-input>
        手机号：<el-input v-model="selectPhone" placeholder="请输入手机号" class="handle-input mr10"></el-input>
         <!-- 学校是下拉框 -->
        学校：<el-select 
            v-model="selectSchoolId"
            placeholder="请选择学校"
            class="handle-select mr10 handle-selectBig"
          >
            <el-option
              v-for="item in schoolNames"
              :key="item.id"
              :label="item.campusName"
              :value="item.id"
            ></el-option>
          </el-select>
        <el-button type="primary" icon="el-icon-search" @click="search" class="sousuo">搜索</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable">
        <el-table-column prop="suName" label="姓名" width="100" class-name="table"></el-table-column>
        <el-table-column prop="suPhone" label="手机号" width="120" class-name="table"></el-table-column>
        <el-table-column prop="address" label="地址" width="200" class-name="table"></el-table-column>
        <el-table-column prop="suSchool" label="学校" width="120" class-name="table"></el-table-column>
        <el-table-column prop="serviceArea" label="快递点" width="120" class-name="table"></el-table-column>
        <el-table-column prop="suAssets" label="余额" width="90" class-name="table"></el-table-column>
        <el-table-column prop="money" label="金额(0.02/条)" width="130" class-name="table"></el-table-column>
        <el-table-column prop="suSmsCount" label="发送短信总条数" width="120" class-name="table"></el-table-column>
        <el-table-column prop="remark" label="备注" width="120" class-name="table"></el-table-column>
        <el-table-column label="操作" width="120" align="center" class-name="table">
          <template slot-scope="scope">
            <!-- suFloorNumber+'号楼'+mm[i].suDoorNumber+'宿舍' -->
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            >修改</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
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

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="40%">
      <el-form ref="editForm" :model="editForm" label-width="100px">
        <el-form-item label="姓名" prop="suName">
          <el-input v-model="editForm.suName" class="inputBox"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="suPhone">
          <el-input v-model="editForm.suPhone" class="inputBox"></el-input>
        </el-form-item>
        <el-form-item label="学校" prop="suSchool">
          <!-- 学校是下拉框 -->
          <el-select
            v-model="editForm.suCampusId"
            :placeholder="editForm.suSchool"
            class="handle-select"
          >
            <el-option
              v-for="item in schoolNames"
              :key="item.id"
              :label="item.campusName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="serviceArea">
          <el-input v-model="editForm.serviceArea" class="inputBox"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="editForm.remark" class="inputBox" type="textarea"></el-input>
        </el-form-item>
      </el-form>  
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
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
      value: "",
      tableData: [],
      cur_page: 1,
      pagesize: 20,
      totalRecords: 0,
      totalPages: 0,
      schoolNames: [], // 学校名字下拉框
      multipleSelection: [],
      select_cate: "",
      selectName: "", //检索服务人员姓名
      selectPhone: "", //检索服务人员手机号
      selectSchoolId: '', //检索学校
      del_list: [],
      is_search: false,
      editVisible: false,
      addVisible: false,
      delVisible: false,
      // 修改弹框里面的字段
      editForm: {
        suId: "",
        suName: "",
        suPhone: "",
        serviceType: "",
        serviceArea: "",
        remark: "",
        suSchool: "",
        suCampusId: "",
        suSchool: ""
      },

      idx: -1,
      id: -1
    };
  },
  created() {
    this.getData();
    this.getSchoolSelect(); //查询学校下拉框内容
  },
  computed: {
    data() {
      // （废弃）原来是操作表格前面的 单选框用的
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
    // 获取所有快递点服务人员数据
    getData() {
      var res = this;
      res.tableData.length = 0;
      this.$axios({
        url: 'http://39.99.137.77:8081/projects/serviceUser/findAllServiceUserPointForPC?pageNum='+res.cur_page+'&pageSize='+ res.pagesize,
        method: "get",
        data: {  }
      })
        .then(function(response) {
          if (response.status <= 200) {
            //console.log(response.data);
            var mm = response.data.list;
            for (var i = 0; i < mm.length; i++) {
              res.tableData.push({
                suName: mm[i].suName,
                suPhone: mm[i].suPhone,
                serviceType: mm[i].serviceType,
                countNum: mm[i].countNum,
                serviceTypeName: mm[i].serviceTypeName,
                address:
                  mm[i].suSchool +
                  mm[i].suFloorNumber +
                  "号楼" +
                  mm[i].suDoorNumber +
                  "宿舍",
                suFloorNumber: mm[i].suFloorNumber,
                suDoorNumber: mm[i].suDoorNumber,
                suSchool: mm[i].suSchool,
                suSchool: mm[i].suSchool,
                suId: mm[i].suId,
                suCampusId: mm[i].suCampusId,
                serviceArea: mm[i].serviceArea,
                suAssets: mm[i].suAssets,
                suSmsCount: mm[i].suSmsCount,
                money: (mm[i].suSmsCount)*0.02,
                remark:  mm[i].remark
              });
            }
            res.totalRecords = response.data.total; //总条数
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          //console.log(error);
        });
    },
    //页面初始化时获取下拉框里面的数据 【学校】
    getSchoolSelect() {
      var res = this;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/campus/findAllCampus",
        method: "get",
        data: {}
      })
        .then(function(response) {
          if (response.status <= 200) {
            //console.log(response.data);
            var mm = response.data.list;
            for (var i = 0; i < mm.length; i++) {
              res.schoolNames.push({
                campusName: mm[i].campusName,
                id: mm[i].id
              });
            }
            // res.addForm.agentNames = response.data;
            //console.log(response.data.list);
            //console.log(res.schoolNames);
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          //console.log(error);
        });
    },
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
    // 关键字检索
    search() {
      this.is_search = true;
      var res = this;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/serviceUser/searchServiceUserForFilm",
        method: "post",
        data: {
          nickName: res.selectName,
          phone: res.selectPhone,
          campusId: res.selectSchoolId,
          serviceType: 2
        }
      })
        .then(function(response) {
          if (response.status <= 200) {
            //console.log(response.data);
            res.tableData.length = 0;
            // res.tableData = response.data;
            res.totalRecords = response.data.length; //总条数
            var mm = response.data;
            if (mm.length == 0) {
              res.tableData = [];
            }
            for (var i = 0; i < mm.length; i++) {
              res.tableData.push({
                suName: mm[i].suName,
                suPhone: mm[i].suPhone,
                serviceType: mm[i].serviceType,
                countNum: mm[i].countNum,
                serviceTypeName: mm[i].serviceTypeName,
                address:
                  mm[i].suSchool +
                  mm[i].suFloorNumber +
                  "号楼" +
                  mm[i].suDoorNumber +
                  "宿舍",
                suFloorNumber: mm[i].suFloorNumber,
                suDoorNumber: mm[i].suDoorNumber,
                suSchool: mm[i].suSchool,
                suSchool: mm[i].suSchool,
                suId: mm[i].suId,
                suCampusId: mm[i].suCampusId,
                serviceArea: mm[i].serviceArea,
                suAssets: mm[i].suAssets,
                suSmsCount: mm[i].suSmsCount,
                money: (mm[i].suSmsCount)*0.02,
                remark:  mm[i].remark
              });
            }
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
        });
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    handleEdit(index, row) {
      this.idx = index;
      this.id = row.suId;
      this.editForm = {
        suId: row.suId,
        suName: row.suName,
        suPhone: row.suPhone,
        serviceType: row.serviceType,
        remark: row. remark,
        serviceArea: row.serviceArea,
        suCampusId: row.suCampusId,
        suSchool: row.suSchool
      };
      this.editVisible = true;
    },
    // 删除
    handleDelete(index, row) {
      this.idx = index;
      //console.log(row.suId);
      this.id = row.suId;
      this.delVisible = true;
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
    // 保存编辑
    saveEdit() {
      var res = this;
      var setData = this.editForm;
      this.$refs.editForm.validate(valid => {
        if (!valid) {
          res.$message.success("格式不正确");
        } else {
          //console.log("===================", setData);
          this.$axios({
            url: "http://39.99.137.77:8081/projects/serviceUser/updateServiceUserForPC",
            method: "put",
            data: setData
          })
            .then(function(response) {
              if (response.status <= 200) {
                res.editVisible = false;
                res.$message.success("修改成功");
                res.$message.success(`修改第 ${res.idx + 1} 行成功`);
                //console.log("修改成功");
                //console.log(setData);
                res.getData();
              }
            })
            .catch(function(error) {
              res.$message.success("修改失败！");
              //console.log(error);
            });
        }
        // 验证通过后的处理...
      });
    },
    // 确定删除
    deleteRow() {
      var res = this;
      //console.log(this.id);
      var id = Number(res.id);
      //console.log(id);
      this.$axios({
        url: "http://39.99.137.77:8081/projects/serviceUser?id=" + id,
        method: "delete",
        data: {}
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
    }
  }
};
</script>

<style scoped>
.inputBox {
    width: 250px;
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

.handle-selectBig {
    width: 220px;
}
.handle-input {
  width: 200px;
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
