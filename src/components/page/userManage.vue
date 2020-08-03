<template>
  <div class="carManager">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>用户管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="name" placeholder="姓名" class="handle-input mr10"></el-input>
        <el-input v-model="phoneNumber" placeholder="手机号" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search" class="sousuo">搜索</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="nickName" align="center" label="姓名" class-name="table"></el-table-column>
        <el-table-column prop="phone" align="center" label="手机号" class-name="table"></el-table-column>
        <el-table-column prop="address" label="地址" align="center" class-name="table"></el-table-column>
        <el-table-column prop="assets" align="center" label="金额" class-name="table"></el-table-column>
        <el-table-column label="操作" align="center" class-name="table">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
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
    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
      <el-form ref="editForm" :model="editForm" label-width="100px" :rules="FormRules">
        <el-form-item label="姓名" prop="nickName">
          <el-input v-model="editForm.nickName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="学校" prop="address">
          <el-select v-model="editForm.campusId" >
            <el-option
              v-for="item in school"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="楼号" prop="floorNumber">
          <el-input v-model="editForm.floorNumber"></el-input>
        </el-form-item>
        <el-form-item label="门牌号" prop="doorNumber">
          <el-input v-model="editForm.doorNumber"></el-input>
        </el-form-item>
        <!-- <el-form-item label="金额" prop="assets">
          <el-input v-model="editForm.assets"></el-input>
        </el-form-item> -->
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
import Validator from "async-validator";
export default {
  data() {
    return {
      school: [
        {
          value: "2",
          label: "未完成"
        },
        {
          value: "1",
          label: "已完成"
        }
      ], //学校
      name: "", //搜索栏名字
      phoneNumber: "", //搜索栏手机号
      tableData: [],
      cur_page: 1,
      pagesize: 20,
      totalRecords: 0,
      totalPages: 0,
      is_search: false,
      editVisible: false,
      delVisible: false,
      editForm: {
        id: "",
        nickName: "",
        phone: "",
        cuaId: "",
        campusName: "",
        floorNumber: "",
        doorNumber: "",
        campusId: ""
      },
      FormRules: {
        // lincensePlateId: [
        //   { message: "车牌号不能为空", required: true, trigger: "blur" },
        //   { min: 3, max: 12, message: "请输入正确车牌号", trigger: "blur" }
        // ],
      },
      idx: -1,
      id: -1
    };
  },
  created() {
    this.getData();
    this.getSchool()
  },
  computed: {},
  methods: {
    //每页显示个数改变
    handleSizeChange(val) {
      this.pagesize = val;
      //console.log(this.pagesize)
      this.getData();
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      //console.log(this.cur_page)
      this.getData();
    },
    //获取学校数据
    getSchool() {
      this.school=[]
      var res = this;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/campus/findAllCampus",
        method: "get",
        data: {}
      })
        .then(function(response) {
          if (response.status <= 200) {
            for(let i=0;i<response.data.list.length;i++){
                if(response.data.list[i].status==1){
                  res.school.push({
                    value:response.data.list[i].id,
                    label:response.data.list[i].campusName
                  })
                }
            }
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          //console.log(error);
        });
    },
    // 获取后端数据
    getData() {
      var res = this;
      this.$axios({
        url: " http://39.99.137.77:8081/projects/clientUser/selectAll?pageNum="+this.cur_page+"&pageSize="+this.pagesize,
        method: "get",
        data: { pageNum: res.cur_page, pageSize: res.pagesize }
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.tableData = response.data.list;
                 for(let i=0;i<res.tableData.length;i++){
                res.tableData[i]['address']=res.tableData[i].campusName+res.tableData[i].floorNumber+'号楼'+res.tableData[i].doorNumber+'房间'
          }
            res.totalRecords= response.data.total; //总条数
            //console.log(response.data);
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          //console.log(error);
        });
    },
    search() {
      this.is_search = true;
      var res = this;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/clientUser/searchClientUser",
        method: "post",
        data: {
         nickName:res.name,
         phone:res.phoneNumber
        }
      })
        .then(function(response) {
          if (response.status <= 200) {
            //console.log(response)
            res.tableData = response.data;
            res.totalRecords = response.data.length; //总条数
              for(let i=0;i<res.tableData.length;i++){
                res.tableData[i]['address']=res.tableData[i].campusName+res.tableData[i].floorNumber+'号楼'+res.tableData[i].doorNumber+'房间'
          }
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
    handleEdit(index, row) {
      this.idx = index;
      this.id = row.id;
      this.editForm = {
        id: row.id,
        nickName: row.nickName,
        phone: row.phone,
        cuaId: row.cuaId,
        campusName: row.campusName,
        floorNumber: row.floorNumber,
        doorNumber: row.doorNumber,
        campusId:row.campusId
      };
      this.editVisible = true;
      //console.log(this.editForm)
    },
    handleDelete(index, row) {
      this.idx = index;
      this.id = row.id;
      this.delVisible = true;
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
          this.$axios({
            url: "http://39.99.137.77:8081/projects/clientUser/updateUserInfo",
            method: "post",
            data: setData
          })
            .then(function(response) {
              if (response.status <= 200) {
                res.editVisible = false;
                res.$message.success("修改成功");
                res.$message.success(`修改第 ${res.idx + 1} 行成功`);
                res.getData()
                if (res.tableData[res.idx].id === res.id) {
                  res.$set(res.tableData, res.idx, res.editForm);
                } else {
                  for (let i = 0; i < res.tableData.length; i++) {
                    if (res.tableData[i].id === res.id) {
                      res.$set(res.tableData, i, res.editForm);
                      return;
                    }
                  }
                }
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
      this.$axios({
        url: "http://39.99.137.77:8081/projects/clientUser?id="+res.id,
        method: "delete",
        data: { }
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.$message.success("删除成功");
            res.getData
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

