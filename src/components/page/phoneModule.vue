<template>
  <div class="carManager">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>
          手机型号管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" @click="addBrand = true">添加品牌</el-button>
        <el-button type="primary" @click="addSeries = true">添加系列</el-button>
        <el-button type="primary" @click="addModule = true">添加型号</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable">
        <el-table-column prop="brandName" label="品牌" width="135" class-name="table"></el-table-column>
        <el-table-column prop="seriesName" label="系列" width="135" class-name="table"></el-table-column>
        <el-table-column prop="modelName" label="型号" width="135" class-name="table"></el-table-column>
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
    <!-- 添加品牌弹出框 -->
    <el-dialog title="添加" :visible.sync="addBrand" width="30%">
      <el-form ref="addForm" :model="addForm" label-width="100px">
        <el-form-item label="品牌" prop="brand">
          <el-input v-model="newbrand"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="brand" style="width:300px;overflow:hidden;height:150px;">
          <el-upload
            action="http://39.99.137.77:8081/projects/image/productImage/upload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%">
          </el-dialog>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addBrand = false">取 消</el-button>
        <el-button type="primary" @click="saveBrand">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加系列弹出框 结束-->
    <!-- 添加弹出框 -->
    <el-dialog title="添加" :visible.sync="addSeries" width="30%">
      <el-form ref="addFormTwo" :model="addFormTwo" label-width="100px">
        <el-form-item label="品牌" prop="brand">
          <el-select
            v-model="brandId"
            placeholder="请选择品牌"
            class="handle-select"
            @change="handleChange"
          >
            <el-option
              v-for="item in brandNames"
              :key="item.id"
              :label="item.brandName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="型号" prop="newseries">
          <el-input v-model="newseries"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addSeries = false">取 消</el-button>
        <el-button type="primary" @click="saveSeries">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加型号弹出框 结束-->
    <!-- 添加弹出框 -->
    <el-dialog title="添加" :visible.sync="addModule" width="30%">
      <el-form ref="addFormTwo" :model="addFormTwo" label-width="100px">
        <el-form-item label="品牌" prop="brand">
          <el-select
            v-model="brandId"
            placeholder="请选择品牌"
            class="handle-select"
            @change="handleChange"
          >
            <el-option
              v-for="item in brandNames"
              :key="item.id"
              :label="item.brandName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系列" prop="brand">
          <el-select
            v-model="seriesId"
            placeholder="请选择系列"
            class="handle-select"
            @change="handleChange2"
          >
            <el-option
              v-for="item in seriesNames"
              :key="item.id"
              :label="item.seriesName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="型号" prop="newmodel">
          <el-input v-model="newmodel"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addModule = false">取 消</el-button>
        <el-button type="primary" @click="saveModule">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加弹出框 结束-->
    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
      <el-form ref="editForm" :model="editForm" label-width="100px">
        <el-form-item label="品牌" prop="brandName" >
          <el-input v-model="editForm.brandName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="系列" prop="seriesName">
          <!-- <el-input v-model="editForm.seriesName"></el-input> -->
          <el-select
            v-model="editForm.seriesName"
            placeholder="请选择系列"
            class="handle-select"
            @change="handchangeid"
          >
            <el-option
              v-for="item in seriesNames"
              :key="item.id"
              :label="item.seriesName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="型号" prop="modelName">
          <el-input v-model="editForm.modelName"></el-input>
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
      dialogVisible: false,
      mainImage: "",
      newbrand: "",
      newmodel: "",
      newseries: "",
      brandNames: [], //品牌下拉框
      seriesNames: [], //系列下拉框
      brand: "", //添加品牌字段
      brandId: "", //品牌
      brandName: "", //品牌名称【展示用】
      seriesId: "", //系列
      seriesName: "", //系列名称【展示用】
      ModelId: "", //型号
      ModelName: "", //型号名称【展示用】
      tableData: [
        {
          brand: "哈哈",
          series: "呵呵",
          module: "啦啦"
        }
      ],
      cur_page: 1,
      pagesize: 20,
      totalRecords: 0,
      totalPages: 0,
      schoolNames: [], // 学校名字下拉框
      multipleSelection: [],
      del_list: [],
      is_search: false,
      editVisible: false,
      addBrand: false,
      addSeries: false,
      addModule: false,
      delVisible: false,
      // 添加弹框里面的字段
      addForm: {},
      addFormTwo: {},
      addFormThree: {},
      // 修改弹框里面的字段
      editForm: {
        brandName: "",
        seriesName: "",
        modelName: ""
      },

      idx: -1,
      id: -1
    };
  },
  created() {
    this.getData();
    this.getBrandSelect();
  },
  updated() {
    if (this.addBrand == false) {
      this.mainImage = "";
    }
  },
  computed: {},
  methods: {
    //主图部分添加
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 主图删除更换成功后返回的后端图片地址
    handleSuccess(response, file, fileList) {
      console.log(response.data[0]);
      this.mainImage = response.data[0];
    },
    //   更改学校状态
    changeSchool() {
      var res = this;
      this.$axios({
        url: "",
        method: "put",
        data: {}
      })
        .then(function(response) {
          if (response.status <= 200) {
          }
        })
        .catch(function(error) {
          res.$message.success("修改失败！");
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
    //页面初始化时获取下拉框里面的数据 【品牌】
    getBrandSelect() {
      var res = this;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/brand/findAll",
        method: "get",
        data: {}
      })
        .then(function(response) {
          if (response.status <= 200) {
            console.log(response.data);
            res.brandNames = response.data;
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
        });
    },
    // 选品牌
    handleChange(value) {
      var res = this;
      var brandId = value;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/series?brandId=" + brandId,
        method: "get",
        data: {}
      })
        .then(function(response) {
          if (response.status <= 200) {
            console.log(response.data);
            res.seriesNames = response.data;
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          // //console.log(error);
        });
    },
    // 选系列
    handleChange2(value) {
      // //console.log(value);
      var res = this;
      var seriesId = value;
      this.$axios({
        url:
          "http://39.99.137.77:8081/projects/phoneModel/findModelBySeriesId?seriesId=" +
          seriesId,
        method: "get",
        data: {}
      })
        .then(function(response) {
          if (response.status <= 200) {
            //console.log(response.data);
            res.ModelNames = response.data;
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
        });
    },
    // 获取 所有数据
    getData() {
      console.log(this.cur_page, this.pagesize);
      var res = this;
      this.$axios({
        url:
          "http://39.99.137.77:8081/projects/phoneModel/selectAll?pageNum=" +
          res.cur_page +
          "&pageSize=" +
          res.pagesize,
        method: "get",
        data: { pageNum: res.cur_page, pageSize: res.pagesize }
      })
        .then(function(response) {
          if (response.status <= 200) {
            console.log(response);
            res.tableData = response.data.list;
            res.totalRecords = response.data.total;
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
        });
    },
    // 添加品牌
    saveBrand() {
      var res = this;
      var setData = this.addForm;
      this.$refs.addForm.validate(valid => {
        this.$axios({
          url: "http://39.99.137.77:8081/projects/brand",
          method: "post",
          data: {
            brandImageLogo: res.mainImage,
            brandName: res.newbrand
          }
        })
          .then(function(response) {
            if (response.status <= 200) {
              console.log(response);
            }
            res.$message.success("添加成功！");
            res.addBrand = false;
          })
          .catch(function(error) {
            res.$message.error("添加失败！");
            res.addBrand = false;
          });
      });
    },
    // 添加系列
    saveSeries() {
      var res = this;
      var setData = this.addForm;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/series",
        method: "post",
        data: {
          brandId: res.brandId,
          seriesName: res.newseries
        }
      })
        .then(function(response) {
          if (response.status <= 200) {
            console.log(response);
            res.$message.success("添加成功！");
            res.addSeries = false;
             res.getData()
          }
        })
        .catch(function(error) {
          res.$message.error("添加失败！");
          res.addSeries = false;
        });
    },
    // 添加型号
    saveModule() {
      var res = this;
      var setData = this.addForm;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/phoneModel",
        method: "post",
        data: {
          modelName: res.newmodel,
          seriesId: res.seriesId
        }
      })
        .then(function(response) {
          if (response.status <= 200) {
            console.log(response);
            res.addModule = false;
            res.getData()
          }
        })
        .catch(function(error) {
          res.$message.error("添加失败！");
          res.addModule = false;
        });
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    handchangeid(value){
        console.log(value)
        this.editForm.seriesId=value
        for(var i=0;i<this.seriesNames.length;i++){
            if(value==this.seriesNames[i].id){
              this.editForm.seriesName=this.seriesNames[i].seriesName
            }
        }
        console.log(this.editForm)
    },
    handleEdit(index, row) {
      this.editVisible = true;
       var res = this;
      var brandId = row.brandId;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/series?brandId=" + brandId,
        method: "get",
        data: {}
      })
        .then(function(response) {
          if (response.status <= 200) {
            console.log(response.data);
            res.seriesNames = response.data;
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          // //console.log(error);
        });
         this.editForm = {
        brandId: row.brandId,
        brandName: row.brandName,
        modelName: row.modelName,
        seriesName: row.seriesName,
        modelId: row.modelId,
        seriesId: row.seriesId
      };
    },
    // 删除
    handleDelete(index, row) {
      this.idx = index;
      this.id = row.modelId;
      this.delVisible = true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 保存修改
    saveEdit() {
      var res = this;
      var setData = this.editForm;  
      console.log(setData)
          this.$axios({
            url: "http://39.99.137.77:8081/projects/phoneModel/updatePhone",
            method: "post",
            data: setData
          })
            .then(function(response) {
              if (response.status <= 200) {
                res.editVisible = false;
                res.$message.success("修改成功");
                res.getData();
              }
            })
            .catch(function(error) {
              res.$message.success("修改失败！");
              //console.log(error);
            });
    },
    // 确定删除
    deleteRow() {
      var res = this;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/phoneModel/deleteByPhoneId?id=" + res.id,
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
          res.$message.success("删除失败！");
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
