<template>
  <div class="carManager">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>
          库存申请审核
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        姓名：
        <el-input v-model="selectName" placeholder="请输入姓名" class="handle-input mr10"></el-input>手机号：
        <el-input v-model="selectPhone" placeholder="请输入手机号" class="handle-input mr10"></el-input>学校：
        <!-- 学校是下拉框 -->
        <el-select v-model="selectSchoolId" placeholder="请选择学校" class="handle-select mr10">
          <el-option
            v-for="item in school"
            :key="item.id"
            :label="item.campusName"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="search" class="sousuo">搜索</el-button>
      </div>

      <el-table :data="tableData" border class="table" ref="multipleTable">
        <el-table-column prop="suName" label="姓名" width="200" class-name="table"></el-table-column>
        <el-table-column prop="suPhone" label="手机号" width="200" class-name="table"></el-table-column>
        <el-table-column prop="address" label="收货地址" width="200" class-name="table"></el-table-column>
        <el-table-column prop="countNum" label="型号数" width="200" class-name="table"></el-table-column>
        <el-table-column prop="createTime" label="申请日期" width="200" class-name="table"></el-table-column>
        <el-table-column label="操作" width="200" align="center" class-name="table">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            >查看</el-button>
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
    <!-- 查看申请列表弹出框  -->
    <el-dialog title="申请列表" :visible.sync="editVisible" width="62%">
      <div v-for="(datapply,index) in myData" :key="index" class="line">
        <span class="type2">品牌：{{datapply.brandName}}</span>
        <span style="width:10px">|</span>
        <span class="mr10">系列：{{datapply.seriesName}}</span>
        <span style="width:10px">|</span>
        <span class="type">型号：{{datapply.modelName}}</span>
        <span style="width:10px">|</span>
        <span class="ml10">颜色/数量:</span>
        <span class="mr10">{{datapply.colorName}} {{datapply.number}}</span>
        <el-button
          type="primary"
          icon="el-icon-check"
          class="sousuo"
          @click="pass(index,datapply.afId)"
        >通过</el-button>
        <el-button type="danger" class="sousuo" @click="nopass(index,datapply.afId)">不通过</el-button>
      </div>
    </el-dialog>
    <!-- 不通过弹出框 -->
    <el-dialog title="请填写审核不通过理由" align="center" :visible.sync="npepass" width="35%">
      <el-input height="150px" placeholder="请输入内容" type="textarea" size="medium" v-model="remark"></el-input>
      <el-button type="primary" class="ok" @click="ok">确定提交</el-button>
    </el-dialog>
    <!-- 弹出框结束 -->

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
      myIndex: "", //填写不通过理由带过来的上一层的index
      myAfid: "", //填写不通过理由带过来的上一层的afid
      remark: "", //填写不通过理由
      school: [], //存所有可以查询的学校
      value: "",
      tableData: [],
      cur_page: 1,
      pagesize: 20,
      totalRecords: 0,
      totalPages: 0,
      schoolNames: [], // 学校名字下拉框
      multipleSelection: [],
      selectSchoolId: "", //检索学校id
      selectName: "", //检索服务人员姓名
      selectPhone: "", //检索服务人员手机号
      del_list: [],
      is_search: false,
      editVisible: false,
      addVisible: false,
      delVisible: false,
      myData: [], //申请列表数据

      editVisible: false, //控制查看申请列表弹窗的开关
      npepass: false, //控制填写不通过理由的弹窗的开关
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
    getData() {
      var res = this;
      res.tableData.length = 0;
      this.$axios({
        url: 'http://39.99.137.77:8081/projects/applicationFilm/findAll?pageNum='+res.cur_page+'&pageSize='+ res.pagesize,
        method: "get",
        data: { }
      })
        .then(function(response) {
          if (response.status <= 200) {
            //console.log(response.data);
            var mm = response.data.list;
            for (var i = 0; i < mm.length; i++) {
              res.tableData.push({
                address:
                  mm[i].suCampusName +
                  mm[i].suFloorNumber +
                  "号楼" +
                  mm[i].suDoorNumber +
                  "宿舍",
                suCampusId: mm[i].suCampusId,
                suName: mm[i].suName,
                suPhone: mm[i].suPhone,
                countNum: mm[i].countNum,
                createTime: mm[i].createTime,
                serviceUserId: mm[i].serviceUserId
              });
            }
            res.totalRecords = response.data.total; //总条数
            //console.log(res.tableData);
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
              res.school.push({
                campusName: mm[i].campusName,
                id: mm[i].id
              });
            }
            // res.addForm.agentNames = response.data;
            //console.log(res.school);
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          //console.log(error);
        });
    },
    // 通过
    pass(index, afId) {
      //console.log("=====", afId);
      //console.log("=====", index);
      var id = afId;
      var res = this;
      res
        .$axios({
          url:
            "http://39.99.137.77:8081/projects/applicationFilm/PCAgreeToShip?id=" + id,
          method: "get",
          data: {}
        })
        .then(function(response) {
          if (response.status <= 200) {
            //console.log(response.data);
            res.$message.success("审核完成");
            res.myData.splice(index, 1);
            if (res.myData < 1) {
              res.editVisible = false;
              res.getData();
            }
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          //console.log(error);
        });
    },
    // 不通过
    nopass(index, afId) {
      //console.log("=====", afId);
      this.myIndex = index; //填写不通过理由带过来的上一层的index
      this.myAfid = afId; //填写不通过理由带过来的上一层的afid
      //打开填写不通过的弹窗
      this.npepass = true;
    },
    // 确认提交不通过的事件
    ok() {
      var res = this;
      // //console.log(res.myIndex);
      // //console.log(res.myAfid);
      // //console.log(res.remark);
      if(res.remark!=="") {
        res
        .$axios({
          url: "http://39.99.137.77:8081/projects/applicationFilm/updateStatusNo",
          method: "put",
          data: {
            id: res.myAfid,
            remark: res.remark
          }
        })
        .then(function(response) {
          if (response.status <= 200) {
            //console.log(response.data);
            //console.log("ok");
            res.$message.success("审核完成");
            res.npepass = false;
            res.remark =""; //清空remark
            res.myData.splice(res.myIndex, 1);
            if (res.myData < 1) {
              res.editVisible = false;
              res.getData();
            }
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          //console.log(error);
        });
      }else {
        res.$message.error("未填写不通过理由");
      }
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
      //console.log(res.selectSchoolId);
      //console.log(res.selectName);
      //console.log(res.selectPhone);
      res.$axios({
        url:"http://39.99.137.77:8081/projects/applicationFilm/searchApplicationFilmForPC",
        method: "post",
        data: {
          "campusId": res.selectSchoolId,
          "nickName": res.selectName,
          "phone": res.selectPhone
        }
      })
        .then(function(response) {
          if (response.status <= 200) {
            //console.log("=====",response.data);
            res.tableData.length = 0;
            var mm = response.data;
            for (var i = 0; i < mm.length; i++) {
              res.tableData.push({
                address:
                  mm[i].suCampusName +
                  mm[i].suFloorNumber +
                  "号楼" +
                  mm[i].suDoorNumber +
                  "宿舍",
                suCampusId: mm[i].suCampusId,
                suName: mm[i].suName,
                suPhone: mm[i].suPhone,
                countNum: mm[i].countNum,
                createTime: mm[i].createTime,
                serviceUserId: mm[i].serviceUserId
              });
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
    handleEdit(index, row) {
      this.idx = index;
      this.id = row.serviceUserId;
      //   //console.log(this.id);
      var res = this;
      res
        .$axios({
          url:
            "http://39.99.137.77:8081/projects/applicationFilm/findApplicationFilmByServiceUserId?serviceUserId=" +
            res.id,
          method: "get",
          data: {}
        })
        .then(function(response) {
          if (response.status <= 200) {
            //console.log(response.data.phoneVariousSeriesNameBos);
            res.myData = response.data.phoneVariousSeriesNameBos;
            res.editVisible = true;
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          //console.log(error);
        });

      //console.log("ok");
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
.headers {
  margin: 20px 0px 30px 0px;
}
.headers > input {
  margin-right: 15px;
}
.icon-buttoned {
  padding: 5px 10px;
  position: relative;
  left: 20px;
  top: -2px;
}
.icon-sk-span {
  color: blue;
  cursor: pointer;
}
.icon-sk-spaan {
  color: red;
  cursor: pointer;
}
.nefcr {
  word-spacing: 5px;
  margin-left: 8px;
}
.line {
  height: 40px;
  width: 100%;
  /* background-color: red; */
  font-size: 16px;
}
.type {
  width: 180px !important;
  margin: 0 8px;
}
.type2 {
  width: 100px;
  text-align: left;
  margin: 8px;
  /* background-color: red; */
}
.mr10 {
  margin-right: 8px;
  margin-left: 8px;
}
.ml10 {
  margin-left: 8px;
}
.ok {
  margin: 0 auto;
  margin-top: 20px;
}
</style>
