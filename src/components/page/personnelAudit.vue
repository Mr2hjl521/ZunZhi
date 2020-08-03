<template>
  <div>
   <div class="carManager">
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="el-icon-lx-cascades"></i>
               人员审核
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="headers">
      <span>姓名：</span>
      <el-input v-model="tableDataName" type="text" style="width:100px" />
      <span style="margin-left:20px">服务类型：</span>
      <el-select v-model="value3" placeholder="请选择">
        <el-option
          :disabled="true"
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
  </el-select>
  <!-- class="icon-buttoned"  -->
      <el-button type="primary" icon="el-icon-search" size="small" @click="check()" class="sousuo">检索</el-button>
    </div>
    <div class="container">
    <el-table :data="tableData" border class="table" ref="multipleTable">
      <el-table-column prop="suAvatarUrl" align="center" label="照片" class-name="table" >
        <!-- 图片的显示 -->
        <template slot-scope="scope">            
          <img :src="scope.row.suAvatarUrl"  min-width="70" height="70" />
        </template>         
      </el-table-column> 
      <el-table-column prop="suName" label="姓名" align="center" class-name="table"></el-table-column>
      <el-table-column prop="suAge" label="年龄" align="center" class-name="table"></el-table-column>
      <el-table-column prop="jpLoginname" label="性别" align="center" class-name="table"></el-table-column>
      <el-table-column prop="usermu" label="服务类型" align="center" class-name="table"></el-table-column>
      <el-table-column prop="suSchool" label="地址" align="center" class-name="table"></el-table-column>
      <el-table-column prop="suPersonalDesc" label="个签" align="center" class-name="table"></el-table-column>
      <el-table-column prop="jpAgentName" label="审核" align="center" class-name="table">
        <template slot-scope="scope" class="icon-slot-bt">
          <P>
            <el-button
              class="icon-buttone"
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            >通过</el-button>
          </P>
          <p style="margin-top:10px">
            <el-button
              type="danger"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
            >不通过</el-button>
          </p>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <!-- 点击通过出来的弹框 -->
    <el-dialog align="center" :visible.sync="npepass" width="30%">
      <h3 style="margin-bottom:10px;margin-top:-30px">{{titlede}}</h3>
      <el-input height="100px" v-model="input2" placeholder="请输入内容"></el-input>
      <el-button type="primary"  class="icon-button" @click="add()">确定提交</el-button>
    </el-dialog>
    <!-- 点通过出来的弹框结束 -->
    <!-- 点不通过出来的弹框结束 -->
    <el-dialog align="center" title="请填写审核不通过理由" :visible.sync="hide" width="30%">
      <el-input placeholder="请输入内容" v-model="input1" class="icon-nd-input"></el-input>
       <el-button type="primary"  class="icon-button" @click="addent()">确定提交</el-button>
    </el-dialog>
    <!-- 点不通过出来的弹框结束 -->
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
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      npepass: false, //通过的弹出框
      hide: false, //不通过的弹出框
      tableDataName: "",
      titlede: "", //弹出框的title内容
      input1: "", //不通过的理由
      suerID: "", //获取人员id
      cur_page: 1,
      pagesize: "",
      totalRecords: 0,
      input2: "",
      pagesize: 20,
      table:"",
      value:"",
      value3:"",
      input2:"",
      suerIDer:"",//获取服务人员id
      options:[
        {
           value: '0',
           label: '贴膜'
        },
        {
           value: '1',
           label: '代取'
        },
        {
           value: '2',
           label: '网点'
        }
      ]
    };
  },
  created() {
    this._Shoelist();
  },
  methods: {
    //每页显示个数改变
    handleSizeChange(val) {
      this.pagesize = val;
     this._Shoelist();
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this._Shoelist();
    },

    //点击通过里面的确认按钮
    add(){
      var res=this
      this.$axios({
        url:
          "http://39.99.137.77:8081/projects/serviceUser/updateServiceUserAuditTypeYes?serviceArea="+this.input2+"&serviceUserId="+this.suerIDer,
       
           method: "put",
      })
        .then(function(response) {
            //console.log(response)
            res.npepass=false;
            res._Shoelist()
        })
        .catch(function(err) {
           //console.log(err)
        })
    },
    //点击不通过里面的确认提交按钮
    addent(){
      var res=this;
         this.$axios({
        url:
          "http://39.99.137.77:8081/projects/serviceUser/updateServiceUserAuditTypeNo?cuRemark="+this.input1+"&suId="+this.suerIDer,

           method: "put",
      })
        .then(function(response) {
            //console.log(response)
            res.hide=false;
            res._Shoelist()
        })
        .catch(function(err) {
            //console.log(err)
        });
    },
    check(){
      var res=this
      this.$axios({
        url:
          "http://39.99.137.77:8081/projects/serviceUser/searchServiceUserForAudit",
         
           method: "post",
            data: {
              nickName: this.tableDataName,
              serviceType: this.value3,
        }
      })
        .then(function(response) {
            //console.log(response)
            res.tableData.length=[]
            res.tableData=response.data
            for (let i = 0; i < res.tableData.length; i++) {
            if (res.tableData[i].serviceType == 0) {
              res.tableData[i]["usermu"] = "贴膜";
            } else if (res.tableData[i].serviceType == 1) {
              res.tableData[i]["usermu"] = "代取";
            } else {
              res.tableData[i]["usermu"] = "网点";
            }
          }
          for (let i = 0; i < res.tableData.length; i++) {
            if (res.tableData[i].suSex == 1) {
              res.tableData[i]["jpLoginname"] = "男";
            } else {
              res.tableData[i]["jpLoginname"] = "女";
            }
          }
          res.totalRecords= response.data.total;
        })
        .catch(function(err) {
           //console.log(err)
        })
    },
    handleEdit(index, row) {
      this.suerIDer=row.suId
      if (row.serviceType == 0) {
         alert("已经通过")
         this.add();
      } else if (row.serviceType == 1) {
        this.npepass = true;
        this.titlede = "请填写服务区域";
      } else if (row.serviceType == 2) {
        this.npepass = true;
        this.titlede = "请添加备注";
      }
    },
    handleDelete(index, row) {
      this.suerIDer=row.suId
      this.hide = true
      } ,
    _Shoelist() {
      var res = this;
      this.$axios({
        url:
          "http://39.99.137.77:8081/projects/serviceUser/findServiceUserAuditTypeZero?pageNum"+this.cur_page+"&pageSize="+this.pagesize,
           method: "get"
      })
        .then(function(response) {
          //console.log(response.data.list);
          //console.log(response.data);

          res.tableData = response.data.list;
          res.totalRecords= response.data.total;
          for (let i = 0; i < res.tableData.length; i++) {
            if (res.tableData[i].serviceType == 0) {
              res.tableData[i]["usermu"] = "贴膜";
            } else if (res.tableData[i].serviceType == 1) {
              res.tableData[i]["usermu"] = "代取";
            } else {
              res.tableData[i]["usermu"] = "网点";
            }
          }
          for (let i = 0; i < res.tableData.length; i++) {
            if (res.tableData[i].suSex == 1) {
              res.tableData[i]["jpLoginname"] = "男";
            } else {
              res.tableData[i]["jpLoginname"] = "女";
            }
          }
          //console.log(res.tableData, "545645646");
        })
        .catch(function(err) {
          //console.log(err);
        });
    },
   
  }
};
</script>
<style scoped>
.sousuo {
  margin: 0 10px;
}
.headers {
  margin: 20px 0px 30px 0px;
}
.headers > input {
  margin-right: 50px;
}
.icon-buttoned {
  /* padding: 5px 10px; */
  /* position: relative;
  left: 30px;
  top: -2px; */
  margin-left: 20px;
}
.icon-buttone {
  padding: 9px 22px;
}
.icon-button {
  position: relative;
  margin-bottom: 20px;
  top: 20px;
}
.icon-nd-input {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.image{
  width: 100px;
  height: 100px;
}
</style>