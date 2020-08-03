<template>
  <div class="carManager" v-if="a">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>编辑产品
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <p class="Ptitle">商品类目:</p>品牌：
        <el-select v-model="brand" :placeholder="brandName" class="handle-select" disabled="true">
          <el-option
            v-for="item in brand"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>型号：
        <el-select v-model="model" :placeholder="modelName" class="handle-select" disabled="true">
          <el-option
            v-for="item in model"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>颜色：
        <el-select
          v-model="specification"
          :placeholder="specificationName"
          class="handle-select"
          disabled="true"
        >
          <el-option
            v-for="item in specification"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>价格：
        <el-input v-model="myPrice" placeholder="请输入价格" class="handle-input"></el-input>
      </div>

      <div class="handle-box">
        标题:
        <el-input v-model="title" placeholder="最多不超过十个字" class="handle-input big"></el-input>
      </div>
      <div class="handle-box">
        <span class="dec">描述:</span>
        <el-input
          type="textarea"
          v-model="desc"
          class="handle-textarea"
          placeholder="最多不超过三十个字"
          :rows="5"
        ></el-input>
      </div>

      <div class="imgBox">
        <div class="left">
          <div class="imageMain">
            <div class="tbox">主图（ 最多上传一张 ）</div>
            <div
              class="imageMain relive"
              @click="updataMainimg()"
              v-show="keyMain"
              style="height:140px;width:140px"
            >
              <div class="absoimg">×</div>
              <img :src="mainImage" style="  width: 100%;height: 100%;">
            </div>
            <div class="imageMain">
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
                <img width="100%" :src="dialogImageUrl" alt>
              </el-dialog>
            </div>
          </div>

          <div style="height: 160px;width: 810px;font-size: 14px;float: left;overflow: hidden; margin-bottom: 30px;">
           <div class="tbox">副图（ 最多长传五张 ）</div>
            <div>
              <div
                class="relive"
                @click="delImageUnimportant(index)"
                style="height:140px;width:140px;float:left;margin-right:5px;"
                v-for="(item,index) in newunimportantImage"
                :key="index"
              >
                <div class="absoimg">×</div>
                <img :src="item.viceImage" alt style=" width: 100%;height: 100%;">
              </div>
              <div class="imageUnmain" v-bind:style="{height:height+'px',width:width+'px'}">
                <el-upload
                  action="http://39.99.137.77:8081/projects/image/productImage/upload"
                  list-type="picture-card"
                  :on-preview="UnimportantPictureCardPreview"
                  :on-remove="UnimportantRemove"
                  :on-success="UnimportantSuccess"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="UnimportantVisible">
                  <img width="100%" :src="UnimportantImageUrl" alt>
                </el-dialog>
              </div>
            </div>
          </div>
          <div style="height: 160px;width: 810px;font-size: 14px;float: left;overflow: hidden;">
           <div class="tbox">详情图（ 最多长传五张， 图片尺寸：750*1500 ）</div>
            <div
              class="relive"
              @click="delImage(index)"
              style="height:140px;width:140px;float:left;margin-right:5px;"
              v-for="(item,index) in newmessageImage"
              :key="index"
            >
              <div class="absoimg">×</div>
              <img :src="item.descImage" alt style=" width: 100%;height: 100%;">
            </div>
            <div class="imageMessage" v-bind:style="{height:height+'px',width:messagewidth+'px'}">
              <el-upload
                action="http://39.99.137.77:8081/projects/image/productImage/upload"
                list-type="picture-card"
                :on-preview="MessagePictureCardPreview"
                :on-remove="MessageRemove"
                :on-success="MessageSuccess"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="MessageVisible">
                <img width="100%" :src="MessageImageUrl" alt>
              </el-dialog>
            </div>
          </div>
          <!-- 上传+预览按钮 -->
          <div style="float:left;height:50px;width:300px;margin-top:50px" class="btnBox">
            <el-button type="primary" @click="onLook" class="myBtn">预览</el-button>
            <el-button type="primary" @click="sendMessage" class="myBtn">上传</el-button>
          </div>
        </div>

        <div class="right">
          <div class="docs-header" v-show="look==true">
            <img :src="closeImg" class="close" @click="close">
            <div style="max-width:1024px;margin:0 auto;">
              <div class="phone">
                <div class="box-content" id="box">
                  <!-- 轮播图开始 -->
                  <div class="banner">
                    <el-carousel indicator-position="none">
                      <el-carousel-item v-for="item in imagesbox" :key="item.id">
                        <img :src="item.idView" class="image" style="height:100%;width:100%">
                      </el-carousel-item>
                    </el-carousel>
                  </div>
                  <!-- 轮播图结束 -->
                  <div class="goos_title">
                    <div class="price">&yen;{{myPrice}}</div>
                    <div class="type">{{title}}</div>
                  </div>
                  <div class="color">
                    <div>
                      <span class="hui">服务：</span> 正品保证 极速退款 7天退换
                    </div>
                    <div>
                      <span class="hui">颜色：</span>
                      <span v-for="item in colorArr" :key="item.id" class="colorSpan">{{item.color}}</span>
                    </div>
                  </div>
                  <div class="xianhgqing">
                    <div class="x_title">—— 商品详情 ——</div>
                    <div class="x_pic" v-for="item in xiangqingArr" :key="item.id">
                      <img :src="item.src" class="x_picitem" style="height:100%;width:100%">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Validator from "async-validator";
export default {
  data() {
    return {
      a:true,//控制页面刷新
      status:'',//状态
      colorList: [], //颜色数组
      width: "", //幅图宽度
      messagewidth: "", //详情图宽度
      height: 140, //图像高度
      keyMain: true, //控制主图回显
      id: "", //获取产品管理界面的id
      colorArr: [
        {
          id: 0,
          color: "黑色"
        }
      ],
      xiangqingArr: [],
      imagesbox: [],
      closeImg: require("../../assets/img/close.png"),
      look: true, //控制手机模拟器的开关
      mainImage: "", //主图
      unimportantImage: [], //附图
      newunimportantImage: [], //重新获取的幅图
      messageImage: [], //详情图
      newmessageImage: [], //重新获取的详情图
      //主图部分
      dialogImageUrl: "",
      dialogVisible: false,
      //附图部分
      UnimportantimageUrl: "",
      UnimportantVisible: false,
      //详情图部分
      MessageimageUrl: "",
      MessageVisible: false,
      myPrice: "",//价格
      title: "",//标题
      desc: "",//描述
      //品牌
      brandName: "",
      brandId: "",
      brand: [
        {
          value: "0",
          label: "小米"
        }
      ],
      //型号
      modelId: "",
      modelName: "",
      model: [
        {
          value: "0",
          label: "2系列"
        }
      ],
      //规格
      specificationId: "",
      specificationName: "",
      specification: [
        {
          value: "0",
          label: "黑色"
        },
        {
          value: "1",
          label: "白色"
        }
      ]
    };
  },
  created() {
    this.getData();
  },
  mounted() {
    // this.phoneSee()
  },
  computed: {},
  methods: {
    //删除单个图片
    delImage(index){
      // alert(this.newmessageImage[index].id)
       var res = this;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/productImage?id="+res.newmessageImage[index].id,
        method: "delete",
        data: {}
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.$message.success("成功");
            res.getData()
          }
        })
        .catch(function(error) {
          res.$message.success("失败！");
          //console.log(error);
        });
    },
     //删除单个图片
    delImageUnimportant(index){
      // alert(this.newmessageImage[index].id)
       var res = this;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/productImage?id="+res.newunimportantImage[index].id,
        method: "delete",
        data: {}
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.$message.success("成功");
            res.getData()
          }
        })
        .catch(function(error) {
          res.$message.success("失败！");
          //console.log(error);
        });
    },
    //提交修改
    sendMessage() {
      this.a=false
      for(var i=0;i<this.unimportantImage.length;i++){
         this.newunimportantImage.push({'halfImage':this.unimportantImage[i]})
      }
      for(var i=0;i<this.messageImage.length;i++){
         this.newmessageImage.push({'halfImage':this.messageImage[i]})
      }
      var res = this;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/phoneFilm/updateEide",
        method: "put",
        data: {
          "brandId":res.brandId,
          'colorName':res.colorList,
          "descImage":res.newmessageImage,
          'viceImage':res.newunimportantImage,
          "filmDesc":res.desc,
          "filmName":res.title,
          "filmPrice":res.myPrice,
          "mainImage":res.mainImage,
          "phoneFilmId":res.id,
          "seriesId":res.modelId,
          'status':res.status
        }
      })
        .then(function(response) {
          res.a=true
          if (response.status <= 200) {
            res.$message.success("成功");
            res.unimportantImage=[]
            res.messageImage=[]
            res.getData()
          }
        })
        .catch(function(error) {
          res.a=true
          res.$message.success("失败！");
          //console.log(error);
        });
    },
    //更新预览
    phoneSee() {
      this.imagesbox = [];
      this.xiangqingArr = [];
      for (var i = 0; i < this.newunimportantImage.length; i++) {
        this.imagesbox.push({
          id: 1,
          idView: this.newunimportantImage[i].viceImage
        });
      }
      for (var i = 0; i < this.newmessageImage.length; i++) {
        this.xiangqingArr.push({
          id: 1,
          src: this.newmessageImage[i].descImage
        });
      }
      //console.log(this.newmessageImage.length, this.imagesbox);
    },
    //更新详情图
    updataMessage(index) {
      //console.log(index);
      this.newmessageImage.splice(index, 1);
    },
    //更新幅图
    updataUnimportant(index) {
      //console.log(index);
      this.newunimportantImage.splice(index, 1);
    },
    //更新主图
    updataMainimg() {
      this.mainImage = "";
      this.keyMain = false;
    },
    //根据id获取数据
    getData() {
      this.id = this.$route.query.id;
      var res = this;
      this.$axios({
        url:
          "http://39.99.137.77:8081/projects/phoneFilm/backDisplayByPhoneFilmId?phoneFilmId=" +
          this.id,
        method: "get",
        data: { id: this.id }
      })
        .then(function(response) {
          if (response.status <= 200) {
            //console.log(response.data.data); //
            res.status=response.data.data.status; //状态
            res.desc = response.data.data.filmDesc; //描述
            res.title = response.data.data.filmName; //标题
            res.brandId = response.data.data.brandId; //品牌id
            res.modelId = response.data.data.seriesId; //系列id
            res.specificationId = response.data.data.colorName[0].ppId; //颜色id
            res.brandName = response.data.data.brandName; //品牌
            res.modelName = response.data.data.seriesName; //系列
            res.colorList = response.data.data.colorName; //颜色数组
            res.specificationName = response.data.data.colorName[0].colorName; //颜色
            res.myPrice = response.data.data.filmPrice; //价格
            res.mainImage = response.data.data.mainImage; //主图
            res.newunimportantImage = response.data.data.viceImage; //幅图获取list
            res.width = (5 - res.newunimportantImage.length) * 160; //幅图动态宽度
            res.newmessageImage = response.data.data.descImage; //详情图获取list
            res.messagewidth = (5 - res.newmessageImage.length) * 160; //详情图动态宽度
            res.phoneSee();
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          //console.log(error);
        });
    },
    // 预览
    onLook() {
      var res = this;
      //console.log("预览");
      //console.log(res.mainImage);
      //console.log(res.unimportantImage);
      //console.log(res.messageImage);
      this.phoneSee();
      this.look = true;
    },
    // 关闭预览
    close() {
      this.look = false;
    },
    //添加事件
    onSubmit() {
      //console.log(this.form);
    },
    //主图部分添加
    handleRemove(file, fileList) {
      //console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 主图删除更换成功后返回的后端图片地址
    handleSuccess(response, file, fileList) {
      //console.log(response, file, fileList);
      //console.log(response.data[0]);
      this.imageMain = response.data[0];
      this.mainImage=response.data[0]
      //console.log("主图", this.imageMain);
    },
    //附图部分添加
    UnimportantRemove(file, fileList) {
      //console.log(file.response.data);
      for (var i = 0; i < this.unimportantImage.length; i++) {
        if (this.unimportantImage[i] == file.response.data) {
          this.unimportantImage.splice(i, 1);
        }
      }
    },
    UnimportantPictureCardPreview(file) {
      this.UnimportantImageUrl = file.url;
      this.UnimportantVisible = true;
    },
    // 附图添加成功返回的后端图片地址
    UnimportantSuccess(response, file, fileList) {
      //console.log(response, file, fileList);
      //console.log(response.data[0]);
      this.unimportantImage.push(response.data[0]);
      //console.log("附图", this.unimportantImage);
    },
    //详情图部分添加
    MessageRemove(file, fileList) {
      //console.log(file.response.data);
      for (var i = 0; i < this.unimportantImage.length; i++) {
        if (this.messageImage[i] == file.response.data) {
          this.messageImage.splice(i, 1);
        }
      }
    },
    MessagePictureCardPreview(file) {
      this.MessageImageUrl = file.url;
      this.MessageVisible = true;
    },
    //详情图添加成功回调
    MessageSuccess(response, file, fileList) {
      //console.log(response, file, fileList);
      this.messageImage.push(response.data[0]);
      // alert(response.data[0])
    }
  }
};
</script>

<style scoped>
.tbox {
  margin: 5px 0;
}
.Ptitle {
  margin-bottom: 20px;
  font-size: 20px;
}
.btnBox {
  width: 810px !important;
  display: block;
  /* background-color: pink; */
}
.myBtn {
  width: 80px;
  height: 35px;
}
.relive {
  position: relative;
}
.absoimg {
  font-size: 30px;
  line-height: 20px;
  text-align: center;
  color: white;
  cursor: pointer;
  height: 20px;
  width: 20px;
  border-radius: 50px;
  background: red;
  position: absolute;
  right: 0px;
  top: 0px;
}
/* 模拟手机样式 */
@media (min-width: 850px) {
  .docs-home .phone {
    /*margin: 0px 0px;*/
    margin: 10px auto !important;
  }

  .phone:before {
    content: "";
    width: 60px;
    height: 10px;
    border-radius: 10px;
    position: absolute;
    left: 50%;
    margin-left: -30px;
    background: #333;
    top: 50px;
  }

  .phone .statusbar {
    position: absolute;
    width: 320px;
    height: 20px;
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAAoCAIAAADhf9zeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6REEyN0EzRUU1QzM3MTFFNEE1ODA5RkNEOEU4MEU4ODYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6REEyN0EzRUY1QzM3MTFFNEE1ODA5RkNEOEU4MEU4ODYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEQTI3QTNFQzVDMzcxMUU0QTU4MDlGQ0Q4RTgwRTg4NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEQTI3QTNFRDVDMzcxMUU0QTU4MDlGQ0Q4RTgwRTg4NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuHAU7gAAA6nSURBVHja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");
    left: 50%;
    margin-left: -160px;
    top: 100px;
    -webkit-background-size: 100% auto;
    background-size: 100% auto;
  }

  .phone:after {
    content: "";
    position: absolute;
    width: 60px;
    height: 60px;
    left: 50%;
    margin-left: -30px;
    bottom: 20px;
    border-radius: 100%;
    box-sizing: border-box;
    border: 5px solid #333;
  }
}
.phone {
  background: #111;
  border-radius: 0px;
  box-shadow: none;
  width: 100%;
  height: 500px;
  padding: 0;
}
.box-content {
  width: 320px;
  height: 100%;
  display: block;
  background-color: #f1f1f1;
  /* color: #fff; */
  margin-top: 20px;
  overflow: scroll;
}
.title {
  height: 100px;
  /* background-color: skyblue; */
  padding: 5px 10px;
  font-size: 10px;
}
.docs-home.mui-ios .phone .statusbar,
.docs-home.mui-android .phone .statusbar,
.docs-home.mui-ios .phone:before,
.docs-home.mui-ios .phone:after {
  display: none;
}
.phone {
  margin: 0 auto;
  position: relative;
  background: #111;
  border-radius: 55px;
  box-shadow: 0px 0px 0px 2px #aaa;
  width: 320px;
  height: 500px;
  padding: 105px 25px;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
}
.phone iframe {
  width: 320px;
  height: 100%;
  display: block;
  width: 100%;
  margin-top: 20px;
}
.handle-box {
  margin-bottom: 15px;
}
/* .message {
    width: 100%;
    margin: 15pxm;
} */
.dec {
  display: inline-block;
  /* width: 90px; */
  height: 100px;
  line-height: 100px;
  padding-bottom: 5px 10px;
  /* background-color: red; */
}
.goos_title {
  height: 45px;
  margin-bottom: 15px;
  font-size: 17px;
  background-color: #fff;
  padding: 5px 10px;
  margin-bottom: 8px;
}
.price {
  color: red;
  margin-bottom: 3px;
  font-size: 20px;
}
.type {
  font-size: 15px;
}

.color {
  height: 50px;
  line-height: 25px;
  padding: 5px 10px;
  background-color: #fff;
  margin-bottom: 8px;
  font-size: 14px;
}
.hui {
  color: grey;
}
.colorSpan {
  margin: 6px;
}
.xianhgqing {
  height: 200px;
  background: #fff;
}
.x_title {
  text-align: center;
  padding: 5px;
}
.x_pic {
  width: 100%;
  /* height: 100px; */
  /* background-color: yellow; */
}
.x_picitem {
  width: 100%;
}
/* 
滚动条的设置
::-webkit-scrollbar 滚动条整体部分，可以设置宽度啥的
::-webkit-scrollbar-button 滚动条两端的按钮
::-webkit-scrollbar-track  外层轨道
::-webkit-scrollbar-track-piece  内层滚动槽
::-webkit-scrollbar-thumb 滚动的滑块
::-webkit-scrollbar-corner 边角
::-webkit-resizer 定义右下角拖动块的样式
*/

#box::-webkit-scrollbar {
  width: 6px;
  background-color: #181c32;
}

#box::-webkit-scrollbar-thumb {
  background-color: #666;
}

.handle-select {
  width: 190px;
  margin-right: 15px;
}

.handle-input {
  width: 190px;
  display: inline-block;
  margin-left: 8px;
}
.big {
  width: 300px;
}
.handle-textarea {
  width: 300px;
  /* height: 200px; */
  margin: 8px;
}
.imgBox {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
/* .left {
  background-color: pink;
} */
.right {
  width: 40%;
  /* background-color: yellow; */
  position: relative;
}
.close {
  width: 60px;
  height: 60px;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 999;
}
/* 主图 */
.imageMain {
  height: 150px;
  width: 150px;
  font-size: 14px;
  overflow: hidden;
  margin-bottom: 30px;
  /* background-color: pink; */
}
/* 副图 */
.imageUnmain {
  height: 160px;
  width: 810px;
  font-size: 14px;
  float: left;
  overflow: hidden;
  margin-bottom: 30px;
}
/* 详情图 */
.imageMessage {
  float: left;
  font-size: 14px;
  height: 180px;
  width: 810px;
  /* background: pink; */
  overflow: hidden;
  margin-bottom: 50px;
}
#form {
  width: 500px;
}
</style>
<style>
/* 轮播图 开始*/
.el-carousel__container {
  position: relative;
  height: 150px;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
/* .el-carousel__indicators{
    background-color: red;
    bottom: -15px !important;
  } */
/* 轮播图 结束*/

.el-upload--picture-card {
  width: 130px;
  height: 130px;
}
.el-upload-list__item-actions {
  width: 130px !important;
  height: 130px !important;
  background-color: pink;
}
/* .el-upload-list__item */
.is-success {
  width: 130px !important;
  height: 130px !important;
}
</style>


