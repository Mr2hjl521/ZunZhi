<template>
  <div class="carManager">
    <div class="crumbs">
      <el-breadcrumb separator="/">
       <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>
          楼号管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
         请选择学校：<el-select v-model="schoolId" placeholder="类别查询" @change="getData()">
          <el-option v-for="item in type" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="addVisible = true"
          class="tianjia"
        >添加</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable">
        <el-table-column type="index" width="55" align="center" label="序号" class-name="table"></el-table-column>
        <el-table-column prop="floorNumber" label="楼号" width="120" class-name="table"></el-table-column>
        <el-table-column label="操作" width="220" align="center" class-name="table">
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
      <!-- <div class="pagination">
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
      </div>-->
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="添加" :visible.sync="addVisible" width="30%">
      <el-form ref="editForm" :model="addForm" label-width="100px" :rules="FormRules">
        <el-form-item label="楼号" prop="floorNumber">
          <el-input v-model="addForm.floorNumber"></el-input>
        </el-form-item>
        <el-form-item label="学校" prop="campusId">
          <el-select v-model="addForm.campusId" placeholder="学校">
            <el-option v-for="item in type" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAdd">确 定</el-button>
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
  name: "carManager",
  data() {
    return {
      type: [],
      testa: null,
      schoolId: "",
      value: "",
      tableData: [],
      cur_page: 1,
      pagesize: 20,
      totalRecords: 0,
      totalPages: 0,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      is_search: false,
      addVisible: false,
      delVisible: false,
      FormRules: {},
      addForm: {
		  floorNumber:'',
		  campusId:''
	  },
      idx: -1,
      id: -1
    };
  },
  created() {
    this.getSchool();
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
    // 获取 所有数据
    getSchool() {
      var res = this;
      // res.tableData.length=0;
      res.tableData.length = [];
      this.$axios({
        url:
          "http://39.99.137.77:8081/projects/campus/findAllCampus?pageNum=1&pageSize=10000",
        method: "get",
        data: {}
      })
        .then(function(response) {
          if (response.status <= 200) {
            for (var i = 0; i < response.data.list.length; i++) {
              if (response.data.list[i].status == 1) {
                res.type.push({
                  id: response.data.list[i].id,
                  name: response.data.list[i].campusName
                });
              }
            }
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          //console.log(error);
        });
    },
    //每页显示数改变
    handleSizeChange(val) {
      this.pagesize = val;
      this.getData();
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    // 获取 easy-mock 的模拟数据
    getData() {
      console.log(this.schoolId);
      var res = this;
      this.$axios({
        url:
          "http://39.99.137.77:8081/projects/floor/findFloorByCampusId?campusId=" +
          res.schoolId,
        method: "get",
        data: { campusId: res.schoolId }
      })
        .then(function(response) {
          if (response.status <= 200) {
            console.log(response.data);
            res.tableData = response.data;
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
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
      console.log(row.id);
      this.id = row.id;
      this.delVisible = true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 添加
    saveAdd() {
      var res = this;
	  var setData = this.addForm;
	  console.log(setData)
          this.$axios({
            url: "http://39.99.137.77:8081/projects/floor",
            method: "post",
            data: setData
          })
            .then(function(response) {
              if (response.status <= 200) {
                res.$message.success('添加成功');
                res.addVisible = false;
                res.getData();
              }
            })
            .catch(function(error) {
              res.$message.success('添加成功');
                res.addVisible = false;
                res.getData();
            });
    },
    // 确定删除
    deleteRow() {
      var res = this;
      this.$axios({
        url:
          "http://39.99.137.77:8081/projects/floor?id="+res.id,
        method: "delete",
        data: { id: res.id }
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
          console.log(error);
        });
    }
  }
};
</script>

<style scoped>
#qrCode {
  display: inline-block;
}
.newqrcode {
  position: fixed;
  left: 45%;
  top: 300px;
  z-index: 999;
  background: gray;
  height: 340px;
  width: 300px;
}
#qrCode img {
  width: 132px;
  height: 132px;
  background-color: #fff;
  padding: 6px;
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
