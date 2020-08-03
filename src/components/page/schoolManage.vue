<template>
  <div class="carManager">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>
          学校管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" @click="addVisible = true">添加学校</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable">
        <el-table-column prop="campusName" label="学校" width="500" class-name="table"></el-table-column>
        <el-table-column prop="status" label="开关" width="500" class-name="table">
             <template slot-scope="scope">
                 <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" 
    @change="changeSchool(scope.row.id)"></el-switch>
             </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" class-name="table">
          <template slot-scope="scope">
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
    <!-- 添加弹出框 -->
    <el-dialog title="添加" :visible.sync="addVisible" width="30%">
      <el-form ref="addForm" :model="addForm" label-width="100px">
        <el-form-item label="学校名" prop="campusName">
         <el-input v-model="addForm.campusName" class="inputBox"></el-input>
        </el-form-item>
        <el-form-item label="开通" prop="pickupAddress">
         <el-switch v-model="addForm.status" active-color="#13ce66" inactive-color="#ff4949" 
         active-value=1
         inactive-value=0></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAdd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加弹出框 结束-->
    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
      <el-form ref="editForm" :model="editForm" label-width="100px">
        <el-form-item label="学校名" prop="campusName">
           <el-input v-model="editForm.campusName" class="inputBox"></el-input>
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
      del_list: [],
      is_search: false,
      editVisible: false,
      addVisible: false,
      delVisible: false,
      // 添加弹框里面的字段
      addForm: {
        id: "",
        campusName: "",
        campusId: "",
        status: '1'
      },
      // 修改弹框里面的字段
      editForm: {
        id: "",
        campusName: "",
      },

      idx: -1,
      id: -1
    };
  },
  created() {
    this.getData();
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
    //   更改学校状态
    changeSchool(id) {
        var res = this;
        //console.log(id)
        var id=id;
        this.$axios({
            url: "http://39.99.137.77:8081/projects/campus/updateSchoolStatus?id="+id,
            method: "put",
            data: {}
          })
            .then(function(response) {
              if (response.status <= 200) {
                res.$message.success("修改成功");
                //console.log("修改成功");
                res.getData();
              }
            })
            .catch(function(error) {
              res.$message.success("修改失败！");
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

    // 获取 所有数据
    getData() {
      var res = this;
      // res.tableData.length=0;
      res.tableData.length = [];
      this.$axios({
        url:
          "http://39.99.137.77:8081/projects/campus/findAllCampus?pageNum=" +
          res.cur_page +
          "&pageSize=" +
          res.pagesize,
        method: "get",
        data: {}
      })
        .then(function(response) {
          if (response.status <= 200) {
            //console.log(response.data);
            var mm = response.data.list;
            for (var i = 0; i < mm.length; i++) {
                if(mm[i].status==0) {
                    res.tableData.push({
                        id: mm[i].id,
                        status: false,
                        campusName: mm[i].campusName
                    });
                }
                 if(mm[i].status==1) {
                    res.tableData.push({
                        id: mm[i].id,
                        status: true,
                        campusName: mm[i].campusName
                     });
                }
            }
            //console.log(res.tableData)
            res.totalRecords = response.data.total; //总条数
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          //console.log(error);
        });
    },
    // 添加
    saveAdd() {
      var res = this;
      var setData = this.addForm;
      //console.log("------",setData)
      this.$refs.addForm.validate(valid => {
        if (!valid) {
          res.$message.success("格式不正确");
        } else {
          this.$axios({
            url: "http://39.99.137.77:8081/projects/campus",
            method: "post",
            data: setData
          })
            .then(function(response) {
              if (response.status <= 200) {
                //console.log(response.data);
                if (response.data == 5) {
                  // ****
                  res.$message.error("已存在");
                } else {
                  res.addVisible = false;
                  res.$message.success("添加成功");
                  res.getData();
                }
              }
            })
            .catch(function(error) {
              res.$message.error("添加失败！");
              //console.log(error);
            });
        }
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
        campusName: row.campusName,
      };
      this.editVisible = true;
    },
    // 删除
    handleDelete(index, row) {
      this.idx = index;
      //console.log(row.id);
      this.id = row.id;
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

    // 保存修改
    saveEdit() {
      var res = this;
      var setData = this.editForm;
      var id = setData.id;
      var campusName = setData.campusName;
      this.$refs.editForm.validate(valid => {
        if (!valid) {
          res.$message.success("格式不正确");
        } else {
          //console.log("===================", setData);
          this.$axios({
            url: 'http://39.99.137.77:8081/projects/campus/updateSchoolName?campusName='+campusName+'&id='+id,
            method: "put",
            data: { }
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
        url: "http://39.99.137.77:8081/projects/campus?id=" + id,
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
