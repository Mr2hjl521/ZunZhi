<template>
  <div>
    <div class="icon-on-div">
      <p>
        <span>产品管理</span>
        <span class="icon-ondiv-span">类目：</span>
        <el-select v-model="phonetype" placeholder="请选择" @change="getnew()">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button type="primary" @click="sendadd()" style="margin-left:100px">添 加 产 品</el-button>
      </p>
    </div>
    <div class="icon-wo-div">
      <span>产品信息</span>
      <span>价格</span>
      <span>发布时间</span>
      <span>上/下架产品</span>
      <span>操作</span>
    </div>
    <div class="icon-three-div">
      <el-checkbox v-model="checked" class="three-button" @change="check()">全选</el-checkbox>
      <el-button class="icon-three-splicbutton"  @click="del()" >删除产品</el-button>
    </div>
    <div class="four-div" v-for="(item,index) in tableData" :key="index" :class="[index==0?'dis':'']" >
      <el-checkbox class="three-button" v-model="item.checked" style="float:left"></el-checkbox>
      <img class="icon-four-image" :src="item.mainImage">
      <span class="icon-four-span">
        <p>{{item.filmName}}</p>
        <p>{{item.filmDesc}}</p>
      </span>
      <span style="padding-left:2%;width:50px;display:inline-block;">{{item.filmPrice}}</span>
      <span style="padding-left:15%;width:150px;display:inline-block;">{{item.createTime}}</span>
      <el-switch
        @change="update(item.phoneFilmId,item.status)"
        v-model="item.value"
        class="icon-switch"
        active-color="#13ce66"
        inactive-color="#ff4949"
      ></el-switch>
      <span
        style="padding-left:291px; color:blue;cursor:pointer;"
        @click="navto(item.phoneFilmId)"
      >修改</span>
    </div>
  </div>
</template>
<script>
export default {
  created() {
    this.getData();
  },
  updated() {
    this.checkNew();
  },
  data() {
    return {
      phonetype: "类目", //下拉框默认值
      options: [
        {
          value: "4",
          label: "手机膜"
        }
      ],
      checked: false,
      value: false,
      tableData: []
    };
  },
  methods: {
    // changeChecked(a){
    //   this.tableData[a].checked=false
    //   //console.log(this.tableData[a].checked)
    // },
    //下架
    update(id,status){
      var res=this
        this.$axios({
        url:
          "http://39.99.137.77:8081/projects/phoneFilm/update",
        method: "put",
        data: {
          id:id,
          status:status
        }
      })
        .then(function(response) {
          //console.log(response.data)
          res.getData()
        })
        .catch(function(error) {
          res.$message.error("上架失败: " + error);
          //console.log(error);
        });
    },
    //删除
    del(){
      var list=[]
      for(var i=0;i<this.tableData.length;i++){
          //console.log(this.tableData[i].checked)
          if(this.tableData[i].checked==true){
            list.push(this.tableData[i].phoneFilmId)
          }
      }
      for(var i = 0; i < list.length-1; i++){
        for(var j = i+1; j < list.length; j++){
            if(list[i]==list[j]){
     
              list.splice(j,1);
               j--;
    
           }
       }
   }
   var res=this
   this.$axios({
        url:
          "http://39.99.137.77:8081/projects/phoneFilm",
        method: "post",
        data: {
          idList:list
        }
      })
        .then(function(response) {
          //console.log(response.data)
          res.getData()
        })
        .catch(function(error) {
          res.$message.error("上架失败: " + error);
          //console.log(error);
        });
      // //console.log(idList)
    },
    //获取所有数据
    getData() {
       this.tableData=[{
              brandId: 1,
              brandName: "测试",
              createTime: "2019-11-27 16:02:31",
              filmDesc: "测试",
              filmName: "测试 ",
              filmPrice: 10,
              mainImage:"http://39.99.137.77:8080/projects/resource/image/19/11/pictures/apple/5a4347f4N888fa8f5.jpg",
              phoneFilmId: 10,
              seriesId: 1,
              seriesName: "苹果 iPhone 11 Pro max",
              status: 0,
              checked:false
            }]
      var res = this;
      this.$axios({
        url:
          "http://39.99.137.77:8081/projects/phoneFilm/findPhoneFilmByCategoriesId?categoriesId=4",
        method: "get",
        data: {}
      })
        .then(function(response) {
          if (response.status <= 200) {
            //console.log(response.data);
            res.totalRecords = response.data.tatel; //总条数
            for(let i=0;i<response.data.data.length;i++){
               res.tableData.push(
                response.data.data[i]
              );
            }
            for(let i=0;i<res.tableData.length;i++){
              // res.tableData[i]['checked']=true
              if(res.tableData[i].status==0){
                res.tableData[i]['value']=true
              }else{
                res.tableData[i]['value']=false
              }
            }
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          //console.log(error);
        });
    },
    //跳转到增加页面
    sendadd() {
      this.$router.push({ path: "uploadProduct" });
    },
    //下拉框选择事件
    getnew() {
      //console.log(this.value);
    },
    //跳转到修改界面
    navto(id) {
      this.$router.push({
        path: "editProduct",
        query: {
          id: id
        }
      });
    },
    //控制勾选于全选关系函数
    check() {
      if (this.checked == true) {
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].checked = true;
        }
      } else {
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].checked = false;
        }
      }
    },
    //控制勾选于全选关系函数
    checkNew() {
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].checked == false) {
          this.checked = false;
          return;
        }
      }
      this.checked = true;
    }
  }
};
</script>
<style  scoped>
.dis{
  display: none;
}
.icon-on-div {
  font-weight: bolder;
}
.icon-on-div > p {
  margin: 10px 0px 30px 20px;
}
.icon-ondiv-span {
  margin-left: 25px;
}
.icon-wo-div {
  width: 100%;
  height: 15px;
  font-size: 14px;
  font-weight: bolder;
}
.icon-wo-div > span {
  float: left;
  width: 20%;
  text-align: center;
}
.icon-three-div {
  position: relative;
  widows: 100px;
  height: 50px;
  background: #dcdfe6;
  top: 20px;
  bottom: 20px;
  line-height: 50px;
}
.three-button {
  padding-left: 20px;
  padding-right: 40px;
}
.icon-three-splicbutton {
  height: 30px;
}
.four-div {
  width: 100%;
  height: 150px;

  border-bottom: 1px solid black;
  margin-top: 20px;
  line-height: 150px;
}
.icon-four-image {
  width: 100px;
  height: 120px;

  float: left;
  margin-top: 15px;
}
.icon-four-span {
  float: left;
  width: 15%;
  height: 60px;
  font-size: 14px;
  margin-top: 30px;
  margin-left: 30px;
  line-height: 25px;
}
.icon-switch {
  padding-left: 15%;
}
</style>
