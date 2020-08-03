<template>
  <div class="carManager">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 首次派发
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <!-- <div class="handle-box">
        <el-button type="primary" @click="addVisible = true" class="tianjia">添加</el-button>
      </div> -->
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
      >
        <el-table-column type="index" width="55" align="center" label="序号" class-name="table"></el-table-column>
        <el-table-column prop="suName" label="姓名" width="100" align="center" class-name="table"></el-table-column>
        <el-table-column prop="suAge" label="年龄" width="100" align="center" class-name="table"></el-table-column>
        <el-table-column prop="suPhone" label="联系方式" width="100" align="center" class-name="table"></el-table-column>
        <el-table-column prop="suSchool" label="学校" width="100" align="center" class-name="table"></el-table-column>
         <el-table-column prop="suFloorNumber" label="楼号" width="100" align="center" class-name="table"></el-table-column>
        <el-table-column prop="suDoorNumber" label="门牌号" width="100" align="center" class-name="table"></el-table-column>
        <el-table-column prop="suPersonalDesc" label="签名" width="200" align="center" class-name="table"></el-table-column>
        <el-table-column label="操作" width="180" align="center" class-name="table">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            >分配</el-button>
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
          :page-sizes="[50,100]"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>-->
    </div>
    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="40%">
      <el-form  label-width="100px" >
        <el-form-item label="" prop="number" v-for="(item,index) in newTbale" :key="index">
          <div>{{item.brandName}} {{item.seriesName}} {{item.phoneModelName}} {{item.phoneColorName}} {{item.number}}张</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
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
      tableData: [],
      newTbale:[],
      serviceUserId: "",
      cur_page: 1,
      pagesize: 50,
      totalRecords: 0,
      totalPages: 0,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      is_search: false,
      editVisible: false,
      delVisible: false,
      idx: -1,
      id: -1
    };
  },
  created() {
    this.getData();
    this.getMessage()
  },
  computed: {},
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
    // 获取未分配人员的模拟数据
    getData() {
      var res = this;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/serviceUser/findNotFilmServiceUser",
        method: "get",
        data: {}
      })
        .then(function(response) {
          if (response.status <= 200) {
            console.log(response.data);
            res.tableData = response.data;
            // res.totalRecords = response.data.memberTotalRecords; //总条数
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
    },
    //获取分配数据
     getMessage() {
      var res = this;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/initialFilm/findAll",
        method: "get",
        data: {}
      })
        .then(function(response) {
          if (response.status <= 200) {
            console.log(response.data);
            res.newTbale = response.data;
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
    handleEdit(index, row) {
      this.idx = index;
      this.serviceUserId = row.suId;
      this.editVisible = true;
    },
    // 确认分配
    saveEdit() {
      var res = this;
      var setData = this.editForm;
          this.$axios({
            url: "http://39.99.137.77:8081/projects/serviceFilmStock/addInitialFilm?serviceUserId="+res.serviceUserId,
            method: "get",
            data: {
                serviceUserId:res.serviceUserId
            }
          })
            .then(function(response) {
              if (response.status <= 200) {
                  res.$message.success("分配成功！");
                  res.editVisible=false
                  res.getData()
              }
            })
            .catch(function(error) {
              res.$message.error("分配失败！");
              console.log(error);
            });
    },
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

