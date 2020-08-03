<template>
  <div class="carManager">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 库存管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-search" @click="gomatching" class="tianjia">配比列表</el-button>
        <el-button type="primary" icon="el-icon-search" @click="gofenpei" class="tianjia">首次派发</el-button>
        <span style="font-size:30px;font-weight:700;color:red;margin-left:24%;">手机膜总数：{{allNumber}}</span>
      </div>
      <div class="container">
        <el-select v-model="schoolId" placeholder="学校" @change="getName()" class="mleft">
          <el-option
            v-for="item in school"
            :key="item.schoolId"
            :label="item.school"
            :value="item.schoolId"
          ></el-option>
        </el-select>
        <el-select v-model="nameId" placeholder="姓名" @change="getBrand()" class="mleft">
          <el-option
            v-for="item in name"
            :key="item.nameId"
            :label="item.name"
            :value="item.nameId"
          ></el-option>
        </el-select>
        <el-select v-model="brandId" placeholder="品牌" @change="getModel()" class="mleft">
          <el-option
            v-for="item in brand"
            :key="item.brandId"
            :label="item.brand"
            :value="item.brandId"
          ></el-option>
        </el-select>
        <el-select v-model="modelId" placeholder="型号" class="mleft">
          <el-option
            v-for="item in model"
            :key="item.modelId"
            :label="item.model"
            :value="item.modelId"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="getNewTable"
          class="tianjia mleft"
        >确定查询</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable">
        <el-table-column type="index" width="55" align="center" label="序号" class-name="table"></el-table-column>
        <el-table-column prop="campusName" label="学校" align="center" class-name="table"></el-table-column>
        <el-table-column prop="suName" label="姓名" align="center" class-name="table"></el-table-column>
        <el-table-column prop="brandName" label="品牌" align="center" class-name="table"></el-table-column>
        <el-table-column prop="modelName" label="型号" align="center" class-name="table"></el-table-column>
        <el-table-column prop="filmNumber" label="数量" align="center" class-name="table"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
// import { fetchData } from '../../api/index';
import Validator from "async-validator";
export default {
  name: "carManager",
  data() {
    return {
      school: [], //学校列表
      name: [], //姓名列表
      brand: [], //品牌列表
      model: [], //型号列表
      schoolId: "", //学校选中id
      nameId: "", //姓名id
      brandId: "", //品牌Id
      modelId: "", //型号Id
      allNumber: "",
      tableData: [],
      idx: -1,
      id: -1
    };
  },
  created() {
    this.getData();
    this.getSchool();
    this.getNewTable()
  },
  computed: {},
  methods: {
    gomatching() {
      this.$router.push({
        path: "matching",
        query: {}
      });
    },
    gofenpei() {
      this.$router.push({
        path: "giveManage",
        query: {}
      });
    },
    //查询所有列表数据
    getNewTable() {
      var res = this;
      this.$axios({
        url:
          "http://39.99.137.77:8081/projects/serviceFilmStock/findServiceFilmStockByDto",
        method: "post",
        data: { brandId: res.brandId,
          campusId: res.schoolId,
          phoneModelId: res.modelId,
          serviceUserId: res.nameId}
      })
        .then(function(response) {
          if (response.status <= 200) {
            console.log(response.data.data);
            res.tableData=response.data.data
            for(var i=0;i<res.tableData.length;i++){
                if(res.tableData[i].brandName==null){
                    res.tableData[i].brandName='全部'
                }
                  if(res.tableData[i].modelName==null){
                    res.tableData[i].modelName='全部'
                }
                  if(res.tableData[i].suName==null){
                    res.tableData[i].suName='全部'
                }
            }
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
    },
    // 获取全部的手机膜数量
    getData() {
      var res = this;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/filmNumber/findAll",
        method: "get",
        data: {}
      })
        .then(function(response) {
          if (response.status <= 200) {
            console.log(response.data);
            res.allNumber = response.data;
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
    },
    //获取学校
    getSchool() {
        this.school=[]
      var res = this;
      this.$axios({
        url:
          "http://39.99.137.77:8081/projects/campus/findAllCampus?pageNum=1&pageSize=10000",
        method: "get",
        data: {}
      })
        .then(function(response) {
          if (response.status <= 200) {
            for (var i = 0; i < response.data.list.length; i++) {
              res.school.push({
                schoolId: response.data.list[i].id,
                school: response.data.list[i].campusName
              });
            }
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          //console.log(error);
        });
    },
    //根据学校查询姓名
    getName() {
        this.name=[]
      var res = this;
      this.$axios({
        url:
          "http://39.99.137.77:8081/projects/serviceUser/findServiceUserByCampus?campusId=" +
          res.schoolId,
        method: "get",
        data: { campusId: res.schoolId }
      })
        .then(function(response) {
          if (response.status <= 200) {
            console.log(response.data);
            for (var i = 0; i < response.data.length; i++) {
              res.name.push({
                nameId: response.data[i].id,
                name: response.data[i].name
              });
            }
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          //console.log(error);
        });
    },
    //查询品牌
    getBrand() {
        this.brand=[]
      if (this.name == []) {
        return;
      }
      if (this.school == []) {
        return;
      }
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
    //查询型号
    getModel() {
        this.model=[]
      if (this.name == []) {
        return;
      }
      if (this.school == []) {
        return;
      }
      this.model=[]
      var res = this;
      this.$axios({
        url:
          "http://39.99.137.77:8081/projects/phoneModel/findByPhoneModelByBrandId?brandId=" +
          res.brandId,
        method: "get",
        data: {}
      })
        .then(function(response) {
          if (response.status <= 200) {
            console.log(response.data);
            for (var i = 0; i < response.data.length; i++) {
              res.model.push({
                modelId: response.data[i].modelId,
                model: response.data[i].modelName
              });
            }
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
    }
  }
};
</script>

<style scoped>
.mleft {
  margin-left: 20px;
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

