<template>
  <div class="out" v-if="a">
    <div class="title" style="font-size:18px;">系统设置</div>
    <div class="form">
      <div class="left">
        <div class="imageOne">
          <p>
            轮 播 图 设 置
            <span class="annotation">（最多五张）</span>
          </p>
          <div class="imageOne_up">
            <div class="img" v-for="(item,index) in imgOnelist" :key="index">
              <img :src="item.url" alt style="height:100%;width:100%">
              <div class="del" @click="delImageone(item.id)">×</div>
            </div>
            <div class="newimg">
              <el-upload
                action="http://39.99.137.77:8081/projects/image/productImage/upload"
                list-type="picture-card"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt>
              </el-dialog>
            </div>
          </div>
          <el-button type="primary" id="btn" @click="addImageOne()">确认上传</el-button>
        </div>
        <div class="imageTwo">
          <p>
            商 品 推 荐 设 置
            <span class="annotation">（分类页面）</span>
          </p>
          <div class="image_Two">
            <div class="img" v-for="(item,index) in mainImglist" :key="index">
              <img :src="item.imageUrl" alt style="height:100%;width:100%">
              <div class="del" @click="delMainimg()">×</div>
            </div>
            <el-upload
              action="http://39.99.137.77:8081/projects/image/productImage/upload"
              list-type="picture-card"
              :on-remove="mainRemove"
              :on-success="mainSuccess"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt>
            </el-dialog>
          </div>
          <el-button type="primary" id="btn" @click="addMain()">确认上传</el-button>
        </div>
        <div class="imageOne">
          <p>
            服 务 保 障
            <span class="annotation">（最多五张）</span>
          </p>
          <div class="imageOne_up">
            <div class="img" v-for="(item,index) in imgThreelist" :key="index">
              <img :src="item.imageUrl" alt style="height:100%;width:100%">
              <div class="del" @click="delThreeimg(item.id)">×</div>
            </div>
            <div class="newimg">
              <el-upload
                action="http://39.99.137.77:8081/projects/image/productImage/upload"
                list-type="picture-card"
                :on-remove="annotationRemove"
                :on-success="annotationSuccess"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt>
              </el-dialog>
            </div>
          </div>
          <el-button type="primary" id="btn" @click="addImageThree()" >确认上传</el-button>
        </div>
      </div>
      <div class="right">
        <div class="announcement">
          <div>特 别 声 明</div>
          <div>
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="announcementMessage"
              maxlength="1000"
              :autosize="{ minRows: 2, maxRows: 4}"
              show-word-limit
            ></el-input>
          </div>
        </div>
        <div class="help">
          <div>使 用 帮 助</div>
          <div>
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="helpMessage"
              maxlength="1000"
              :autosize="{ minRows: 2, maxRows: 4}"
              show-word-limit
            ></el-input>
          </div>
        </div>
        <div class="updata">
          <el-button type="primary" id="btn" @click="updataMessage()">确认上传</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      a: true, //控制页面的刷新
      mesid: "", //声明和使用帮助信息修改
      width: "", //轮播图宽度
      newwidth: "", //服务保障图宽度
      announcementMessage: "", //文本域
      helpMessage: "", //文本域
      dialogImageUrl: "",
      dialogVisible: false,
      mainImglist: [], //分类单图
      imgOnelist: [], //轮播图后端获取list
      newimgOnelist: [], //图片服务器返回list
      imgurl: "", //贴膜图片
      imgThreelist: [], //服务保障获取list
      newimgThreelist: [] //图片服务器返回list
    };
  },
  created() {
    this.getMessage();
  },
  methods: {
    //轮播图删除的钩子函数
    handleRemove(file, fileList) {
      // console.log(file.response.data);
      for (var i = 0; i < this.newimgOnelist.length; i++) {
        if (this.newimgOnelist[i] == file.response.data) {
          this.newimgOnelist.splice(i, 1);
        }
      }
      // console.log(this.newimgOnelist);
    },
    // 轮播更换成功后返回的后端图片地址
    handleSuccess(response, file, fileList) {
      // console.log(response, file, fileList);
      this.newimgOnelist.push(response.data[0]);
      // console.log(this.newimgOnelist);
    },
    //添加轮播图
    addImageOne() {
      this.a = false;
      var res = this;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/carouselImage",
        method: "post",
        data: {
          url: res.newimgOnelist
        }
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.$message.success("成功");
            res.getMessage();
            res.a = true;
          }
        })
        .catch(function(error) {
          //   res.$message.success("失败！");
          // console.log(error);
        });
    },
    //服务保障删除的钩子函数
    annotationRemove(file, fileList) {
      // console.log(file.response.data);
      for (var i = 0; i < this.newimgThreelist.length; i++) {
        if (this.newimgThreelist[i] == file.response.data) {
          this.newimgThreelist.splice(i, 1);
        }
      }
      // console.log(this.newimgThreelist);
    },
    // 服务保障更换成功后返回的后端图片地址
    annotationSuccess(response, file, fileList) {
      // console.log(response, file, fileList);
      this.newimgThreelist.push(response.data[0]);
      // console.log(this.newimgThreelist);
    },
    //添加服务保障
    addImageThree() {
      this.a = false;
      var res = this;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/process",
        method: "post",
        data: {
          url: res.newimgThreelist
        }
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.$message.success("成功");
            res.getMessage();
            res.a = true;
          }
        })
        .catch(function(error) {
          //   res.$message.success("失败！");
          // console.log(error);
        });
    },
    //分类页面删除的钩子函数
    mainRemove(file, fileList) {
      // console.log(file.response.data);
      if (this.imgurl == file.response.data) {
        this.imgurl = "";
      }
      // console.log(this.newimgThreelist);
    },
    // 分类页面更换成功后返回的后端图片地址
    mainSuccess(response, file, fileList) {
      // console.log(response, file, fileList);
      this.imgurl = response.data[0];
      // console.log(this.imgurl);
    },
    //分类页面添加
    addMain() {
      this.a = false;
      var res = this;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/CategoriesImage",
        method: "post",
        data: {
          'categoriesId': 4,
          'imageUrl': res.imgurl
        }
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.$message.success("成功");
            res.getMessage();
            res.a = true;
          }
        })
        .catch(function(error) {
          //   res.$message.success("失败！");
          // console.log(error);
        });
    },
    //删除轮播图
    delImageone(id) {
      var res = this;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/carouselImage?id=" + id,
        method: "delete",
        data: {}
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.$message.success("成功");
            res.getMessage();
          }
        })
        .catch(function(error) {
          //   res.$message.success("失败！");
          // console.log(error);
        });
    },
    //删除服务保障图
    delThreeimg(id) {
      var res = this;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/process?id=" + id,
        method: "delete",
        data: {}
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.$message.success("成功");
            res.getMessage();
          }
        })
        .catch(function(error) {
          //   res.$message.success("失败！");
          // console.log(error);
        });
    },
    //删除主图
    delMainimg() {
      var res = this;
      this.$axios({
        url:
          "http://39.99.137.77:8081/projects/CategoriesImage?categoriesId=" +
          res.mainImglist[0].id,
        method: "delete",
        data: {}
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.$message.success("成功");
            res.getMessage();
          }
        })
        .catch(function(error) {
          //   res.$message.success("失败！");
          // console.log(error);
        });
    },
    //修改声明和使用信息
    updataMessage() {
      var res = this;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/aboutMall",
        method: "put",
        data: {
          help: res.helpMessage,
          id: res.mesid,
          statement: res.announcementMessage
        }
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.$message.success("成功");
            res.getMessage();
          }
        })
        .catch(function(error) {
          //   res.$message.success("失败！");
          // console.log(error);
        });
    },
    //获取所有数据
    getMessage() {
      var res = this;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/systemSetting",
        method: "get",
        data: {}
      })
        .then(function(response) {
          if (response.status <= 200) {
            // console.log(response.data);
            res.helpMessage = response.data.aboutMall[0].help;
            res.announcementMessage = response.data.aboutMall[0].statement;
            res.mainImglist = response.data.categoriesImage;
            res.imgOnelist = response.data.carouselImage;
            res.width = (5 - res.imgOnelist.length) * 160;
            res.imgThreelist = response.data.process;
            res.newwidth = (5 - res.imgThreelist.length) * 160;
            res.mesid = response.data.aboutMall[0].id;
          }
        })
        .catch(function(error) {
          res.$message.success("失败！");
          // console.log(error);
        });
    }
  }
};
</script>
<style scoped>
.updata {
  width: 80%;
  margin-left: 10%;
  margin-top: 30px;
}
.help {
  height: 160px;
  width: 80%;
  margin-left: 10%;
  margin-top: 30px;
}
.announcement {
  height: 160px;
  width: 80%;
  margin-left: 10%;
  margin-top: 30px;
}
.out {
  width: 100%;
  height: 1000px;
  background: #ffffff;
}
.form {
  height: 1000px;
  width: 100%;
  display: flex;
  justify-content: space-around;
}
.left {
  height: 1000px;
  width: 50%;
}
.right {
  border-left: solid 1px black;
  height: 1000px;
  width: 50%;
}
.imageOne {
  margin-top: 40px;
  height: 245px;
  width: 780px;
  margin-left: 2%;
  background: #c0c0c0;
}
.imageOne_up {
  overflow: hidden;
  height: 160px;
  width: 100%;
}
.imageTwo {
  margin-top: 20px;
  height: 245px;
  width: 180px;
  margin-left: 2%;
}
.image_Two {
  overflow: hidden;
  height: 160px;
  width: 100%;
}
#btn {
  float: right;
  margin-top: 10px;
  height: 30px;
  width: 100px;
  text-align: center;
  font-size: 16px;
  margin-right: 30px;
}
.annotation {
  color: gray;
  font-size: 12px;
}
.img {
  position: relative;
  height: 144px;
  width: 140px;
  margin: 8px 4px;
  float: left;
}
.del {
  z-index: 10;
  height: 20px;
  width: 20px;
  position: absolute;
  right: -10px;
  top: -10px;
  font-size: 32px;
  text-align: center;
  line-height: 20px;
  border-radius: 50px;
  cursor: pointer;
}
.newimg {
  padding: 7px 0;
  height: 140px;
}
</style>

