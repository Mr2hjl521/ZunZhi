<template>
  <div class="carManager">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 配比列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" @click="addVisible = true" class="tianjia">添加</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="index" width="55" align="center" label="序号" class-name="table"></el-table-column>
        <el-table-column prop="brandName" label="品牌" width="100" align="center" class-name="table"></el-table-column>
        <el-table-column prop="seriesName" label="系列" width="150" align="center" class-name="table"></el-table-column>
        <el-table-column
          prop="phoneModelName"
          label="型号"
          width="150"
          align="center"
          class-name="table"
        ></el-table-column>
        <el-table-column
          prop="phoneColorName"
          label="颜色"
          width="100"
          align="center"
          class-name="table"
        ></el-table-column>
        <el-table-column prop="number" label="数量" width="100" align="center" class-name="table"></el-table-column>
        <el-table-column label="操作" width="180" align="center" class-name="table">
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
    <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
      <el-form ref="editForm" :model="editForm" label-width="100px" :rules="FormRules">
        <el-form-item label="数量" prop="number">
          <el-input v-model="editForm.number" style="width:75%"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加弹出框 -->
    <el-dialog title="添加" :visible.sync="addVisible" width="30%">
      <el-form ref="addForm" :model="addForm" :rules="FormRules" label-width="100px">
        <el-form-item label="品牌" prop="brandId">
          <el-select v-model="addForm.brandId" placeholder="品牌" @change="getSeries">
            <el-option
              v-for="item in brand"
              :key="item.brandId"
              :label="item.brand"
              :value="item.brandId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系列" prop="seriesId">
          <el-select v-model="addForm.seriesId" placeholder="系列" @change="getmodule">
            <el-option
              v-for="item in series"
              :key="item.seriesId"
              :label="item.series"
              :value="item.seriesId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="型号" prop="moduleId">
          <el-select v-model="addForm.moduleId" placeholder="型号">
            <el-option
              v-for="item in module"
              :key="item.moduleId"
              :label="item.module"
              :value="item.moduleId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="颜色" prop="colorId">
          <el-select v-model="addForm.colorId" placeholder="颜色">
            <el-option
              v-for="item in color"
              :key="item.colorId"
              :label="item.color"
              :value="item.colorId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="number">
          <el-input v-model="addForm.number" style="width:75%"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAdd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加弹出框 结束-->
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
      brand: [],
      series: [],
      module: [],
      color: [
        {
          colorId: 1,
          color: "黑色"
        },
        {
          colorId: 2,
          color: "白色"
        }
      ],
      tableData: [],
      value: "",
      valueAse: "",
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
      addVisible: false,
      delVisible: false,
      editForm: {
        id: "",
        colorId: "",
        brandId: "",
        moduleId: "",
        number: "",
        seriesId: ""
      },
      addForm: {
        id: "",
        colorId: "",
        brandId: "",
        moduleId: "",
        number: "",
        seriesId: ""
      },
      FormRules: {
        brandId: [{ message: "不能为空", required: true, trigger: "blur" }],
        moduleId: [{ message: "不能为空", required: true, trigger: "blur" }],
        colorId: [{ message: "不能为空", required: true, trigger: "blur" }],
        number: [{ message: "不能为空", required: true, trigger: "blur" }],
        seriesId: [{ message: "不能为空", required: true, trigger: "blur" }]
      },
      idx: -1,
      id: -1
    };
  },
  created() {
    this.getBrand();
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
    getBrand() {
      var res = this;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/brand/findAll",
        method: "get",
        data: {}
      })
        .then(function(response) {
          if (response.status <= 200) {
            console.log(response.data);
            for (var i = 0; i < response.data.length; i++) {
              res.brand.push({
                brandId: response.data[i].id,
                brand: response.data[i].brandName
              });
            }
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
    },
    getSeries() {
      this.series = [];
      //   console.log(this.addForm.brandId);
      var res = this;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/series?brandId=" + res.addForm.brandId,
        method: "get",
        data: { brandId: res.addForm.brandId }
      })
        .then(function(response) {
          if (response.status <= 200) {
            console.log(response.data);
            for (var i = 0; i < response.data.length; i++) {
              res.series.push({
                seriesId: response.data[i].id,
                series: response.data[i].seriesName
              });
            }
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
    },
    getmodule() {
      this.module = [];
      var res = this;
      this.$axios({
        url:
          "http://39.99.137.77:8081/projects/phoneModel/findModelBySeriesId?seriesId=" +
          res.addForm.seriesId,
        method: "get",
        data: { seriesId: res.addForm.seriesId }
      })
        .then(function(response) {
          if (response.status <= 200) {
            console.log(response.data);
            for (var i = 0; i < response.data.length; i++) {
              res.module.push({
                moduleId: response.data[i].id,
                module: response.data[i].modelName
              });
            }
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
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
    // 获取 easy-mock 的模拟数据
    getData() {
      var res = this;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/initialFilm/findAll",
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
        brandId: row.brandId,
        id: row.id,
        number: row.number,
        phoneColorId: row.phoneColorId,
        phoneModelId: row.phoneModelId,
        seriesId: row.seriesId
      };
      console.log(this.editForm)
      this.editVisible = true;
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
            url: "http://39.99.137.77:8081/projects/initialFilm",
            method: "put",
            data: setData
          })
            .then(function(response) {
              if (response.status <= 200) {
                res.editVisible = false;
                res.$message.success("修改成功");
                res.getData()
                res.$message.success(`修改第 ${res.idx + 1} 行成功`);
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
              console.log(error);
            });
        }
        // 验证通过后的处理...
      });
    },
    // 添加
    saveAdd() {
      var res = this;
      console.log(this.addForm);
      this.$refs.addForm.validate(valid => {
        if (!valid) {
          res.$message.success("格式不正确");
        } else {
          this.$axios({
            url: "http://39.99.137.77:8081/projects/initialFilm",
            method: "post",
            data: {
              brandId: res.addForm.brandId,
              number: res.addForm.number,
              phoneColorId: res.addForm.colorId,
              phoneModelId: res.addForm.moduleId,
              seriesId: res.addForm.seriesId
            }
          })
            .then(function(response) {
              if (response.status <= 200) {
                res.$message.success("添加成功！");
                res.getData();
                res.addVisible = false;
              }
            })
            .catch(function(error) {
              res.getData();
              res.addVisible = false;
            });
        }
      });
    },
    // 确定删除
    deleteRow() {
      var res = this;
      console.log(this.id);
      this.$axios({
        url: "http://39.99.137.77:8081/projects/initialFilm?id=" + res.id,
        method: "delete",
        data: { id: res.id }
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.$message.success("删除成功");
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
          res.$message.success("删除失败！");
          console.log(error);
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

