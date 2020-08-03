<template>
  <div class="carManager">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>上传产品
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <div class="block"></div>
        <p class="Ptitle">商品类目:</p>品牌：
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
        </el-select>系列：
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
        </el-select>型号：
        <el-select v-model="ModelId" placeholder="请选择型号" class="handle-select">
          <el-option
            v-for="item in ModelNames"
            :key="item.id"
            :label="item.modelName"
            :value="item.id"
          ></el-option>
        </el-select>规格：
        <el-select
          multiple
          v-model="colorIds"
          placeholder="请选择颜色"
          class="handle-select"
          @change="handleChangeColor"
        >
          <el-option
            v-for="item in colorNames"
            :key="item.id"
            :label="item.colorName"
            :value="item.id"
          ></el-option>
        </el-select>价格：
        <el-input v-model="myPrice" placeholder="请输入价格" class="handle-input" type="number"></el-input>
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
      <!-- 添加颜色弹出框 -->
      <el-dialog title="添加" :visible.sync="addColor" width="30%">
        <el-form label-width="100px">
          <el-form-item label="颜色" prop="addColorName">
            <el-input v-model="addColorName" class="handle-select"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeAddColor">取 消</el-button>
          <el-button type="primary" @click="saveAdd">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加弹出框 结束-->
      <div class="imgBox">
        <div class="left">
          <div class="imageMain">
            <div class="tbox">主图（ 最多上传一张 ）</div>
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
              <img width="100%" />
            </el-dialog>
          </div>
          <div class="imageUnmain">
            <div class="tbox">副图（ 最多长传五张 ）</div>
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
              <img width="100%" />
            </el-dialog>
          </div>
          <div class="imageMessage">
            <div class="tbox">详情图（ 最多长传五张， 图片尺寸：750*1500 ）</div>
            <div>
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
                <img width="100%" />
              </el-dialog>
            </div>
          </div>
          <!-- 上传+预览按钮 -->
          <div class="btnBox">
            <el-button type="primary" @click="onLook" class="myBtn">预览</el-button>
            <el-button type="primary" @click="onSubmit" class="myBtn">上传</el-button>
          </div>
        </div>

        <div class="right">
          <div class="docs-header" v-show="look==true">
            <img :src="closeImg" class="close" @click="close" />
            <div style="max-width:1024px;margin:0 auto;">
              <div class="phone">
                <div class="box-content" id="box">
                  <!-- 轮播图开始 -->
                  <div class="banner">
                    <el-carousel indicator-position="none">
                      <el-carousel-item v-for="item in MarrbArr" :key="item.id">
                        <img :src="item.src" class="bannerImage" />
                      </el-carousel-item>
                    </el-carousel>
                  </div>
                  <!-- 轮播图结束 -->
                  <div class="goos_title">
                    <div class="price">&yen;{{ myPrice }}</div>
                    <div class="type">{{ title }}</div>
                  </div>
                  <div class="color">
                    <div>
                      <span class="hui">服务：</span> 正品保证 极速退款 7天退换
                    </div>
                    <div>
                      <span class="hui">颜色：</span>
                      <span v-for="item in colorName" :key="item.id" class="colorSpan">{{item}}</span>
                    </div>
                  </div>
                  <div class="xianhgqing">
                    <div class="x_title">—— 商品详情 ——</div>
                    <div class="x_pic" v-for="item in MarrbArrc" :key="item.id">
                      <img :src="item.src" class="x_picitem" />
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
  inject: ["reload"],
  data() {
    return {
      addColor: false,
      addColorName: "", //弹出框里面新增的颜色
      brandId: "", //品牌
      brandName: "", //品牌名称【展示用】
      seriesId: "", //系列
      seriesName: "", //系列名称【展示用】
      ModelId: "", //型号
      ModelName: "", //型号名称【展示用】
      colorId: "", //颜色
      colorIds: [], //多选颜色
      colorName: [], //颜色名称【展示用】
      brandNames: [], //品牌下拉框
      seriesNames: [], //系列下拉框
      ModelNames: [], //型号下拉框
      colorNames: [], //颜色下拉框
      closeImg: require("../../assets/img/close.png"),
      look: false, //控制手机模拟器的开关
      MarrbArr: [], //展示用副图
      MarrbArrc: [], //展示用详情图
      mainImage: "", //主图
      unimportantImage: [], //附图
      messageImage: [], //详情图
      //主图部分
      dialogImageUrl: "",
      dialogVisible: false,
      //附图部分
      UnimportantimageUrl: "",
      UnimportantVisible: false,
      //详情图
      MessageimageUrl: "",
      MessageVisible: false,
      myPrice: "",
      title: "",
      desc: "",
      //规格
      specificationId: ""
    };
  },
  created() {
    this.getBrandSelect(); //查询品牌下拉框内容
    this.getColorSelect(); //查询颜色下拉框内容
  },
  computed: {},
  methods: {
    // 自定义加颜色
    handleChangeColor(value) {
      // //console.log(value);
      if (this.colorIds.includes(99)) {
        this.addColor = true;
      } else {
        // //console.log("blue");
      }
      // //console.log(this.colorIds);
    },
    closeAddColor() {
      this.addColor = false; //关闭弹窗
      // let arr = this.colorIds;
      let index = this.colorIds.indexOf(99);
      if (index) {
        // //console.log(index); //返回索引
        // 删除自自定义
        this.colorIds.splice(index, 1);
      }
      // //console.log(this.colorIds);
    },
    // 自定义添加颜色
    saveAdd() {
      var res = this;
      // //console.log(this.addColorName);
      if (this.addColorName == "") {
        res.$message.error("颜色不能为空");
      } else {
        this.$axios({
          url: "http://39.99.137.77:8081/projects/phoneColor",
          method: "post",
          data: { colorName: this.addColorName }
        })
          .then(function(response) {
            if (response.status <= 200) {
              // //console.log(response.data);
              if (response.data == 5) {
                res.$message.error("已存在");
              } else {
                res.addColor = false;
                res.$message.success("添加成功");
                res.addColorName = "";
                res.colorIds = [];
                res.getColorSelect();
              }
            }
          })
          .catch(function(error) {
            res.$message.error("添加失败！");
            // //console.log(error);
          });
      }
    },
    // 选品牌
    handleChange(value) {
      //console.log(value);
      var res = this;
      var brandId = value;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/series?brandId=" + brandId,
        method: "get",
        data: {}
      })
        .then(function(response) {
          if (response.status <= 200) {
            // //console.log(response.data);
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
            // //console.log(response.data);
            res.ModelNames = response.data;
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          // //console.log(error);
        });
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
            // //console.log(response.data);
            res.brandNames = response.data;
            // //console.log(res.brandNames);
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          // //console.log(error);
        });
    },
    //页面初始化时获取下拉框里面的数据 【颜色】 根据品牌查
    getColorSelect() {
      var res = this;
      this.$axios({
        url: "http://39.99.137.77:8081/projects/phoneColor/findAll",
        method: "get",
        data: {}
      })
        .then(function(response) {
          if (response.status <= 200) {
            // //console.log(response.data);
            res.colorNames = response.data;
            res.colorNames.push({
              colorName: "自定义",
              id: 99
            });
            // //console.log("lllllll", res.colorNames);
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          // //console.log(error);
        });
    },
    // 预览
    onLook() {
      var res = this;
      // 为了避免用户在预览情况下再次点击预览导致数据有误，在点击预览的时候要先判断现在是不是在预览状态

      if (res.look == false) {
        if (
          res.mainImage == "" ||
          res.unimportantImage.length == 0 ||
          res.messageImage.length == 0 ||
          res.desc == "" ||
          res.myPrice == "" ||
          res.title == "" ||
          res.brandId == "" ||
          res.seriesId == "" ||
          res.ModelId == "" ||
          res.colorIds.length == 0
        ) {
          res.$message.error("信息未填写完整,不能预览");
        } else {
          // 都填全了
          // 品牌
          var ll = res.brandNames;
          var brandId = res.brandId;
          for (var i = 0; i < ll.length; i++) {
            if (ll[i].id == brandId) {
              res.brandName = ll[i].brandName;
            }
          }
          // 系列
          var hh = res.seriesNames;
          var seriesId = res.seriesId;
          for (var u = 0; u < hh.length; u++) {
            if (hh[u].id == seriesId) {
              res.seriesName = hh[u].seriesName;
            }
          }
          // 型号
          var ww = res.ModelNames;
          var ModelId = res.ModelId;
          for (var w = 0; w < ww.length; w++) {
            if (ww[w].id == ModelId) {
              res.ModelName = ww[w].modelName;
            }
          }
          // 颜色
          res.colorName = []; //清空一下
          var yy = res.colorNames;
          var colorIds = res.colorIds;
          for (var y = 0; y < yy.length; y++) {
            for (var p = 0; p < colorIds.length; p++) {
              if (yy[y].id == colorIds[p]) {
                res.colorName.push(yy[y].colorName);
              }
            }
          }
          // //console.log(res.brandName);
          // //console.log(res.seriesName);
          // //console.log(res.ModelName);
          // //console.log(res.colorName);

          // //console.log(this.unimportantImage); //副图
          var kk = this.unimportantImage;
          for (var i = 0; i < kk.length; i++) {
            var Marrb =
              "http://39.99.137.77:8080/projects/resource/image/a/" + kk[i];
            res.MarrbArr.push({
              id: i,
              src: Marrb
            });
          }
          // //console.log("展示用副图", res.MarrbArr);

          // //console.log(this.messageImage); //详情图
          var nn = this.messageImage;
          for (var c = 0; c < nn.length; c++) {
            var Marrc =
              "http://39.99.137.77:8080/projects/resource/image/a/" + nn[c];
            res.MarrbArrc.push({
              id: c,
              src: Marrc
            });
          }
          // //console.log("展示用详情图", res.MarrbArrc);
          this.look = true;
        }
      }
    },
    // 关闭预览
    close() {
      this.look = false;
      this.MarrbArr = [];
      this.MarrbArrc = [];
    },
    //添加事件
    onSubmit() {
      var res = this;
      if (
        res.mainImage == "" ||
        res.unimportantImage.length == 0 ||
        res.messageImage.length == 0 ||
        res.desc == "" ||
        res.title == "" ||
        res.brandId == "" ||
        res.seriesId == "" ||
        res.ModelId == "" ||
        res.myPrice == "" ||
        res.colorIds.length == 0
      ) {
        // //console.log("有没填写全的");
        res.$message.error("信息未填写完整,不能上传");
      } else {
        // 都填全了
        // //console.log("ok");
        // //console.log(res.brandId);
        // //console.log(res.seriesId);
        // //console.log(res.colorIds);
        var cArr = res.colorIds;
        var colorName = [];
        for (var h = 0; h < cArr.length; h++) {
          colorName.push({
            ppcId: cArr[h]
          });
        }
        // //console.log("==================colorName", colorName);
        // //console.log(res.title);
        // //console.log(res.desc);
        // //console.log(res.myPrice);
        var money = Number(res.myPrice);
        // //console.log(money);
        // //console.log(res.mainImage); //主图

        // //console.log(res.unimportantImage);
        //副图
        var vArr = res.unimportantImage;
        var viceImage = [];
        for (var t = 0; t < vArr.length; t++) {
          viceImage.push({
            viceImage: vArr[t]
          });
        }
        // //console.log("==================viceImage", viceImage);
        // //console.log(res.messageImage);
        //详情图
        var dArr = res.messageImage;
        var descImage = [];
        for (var y = 0; y < dArr.length; y++) {
          descImage.push({
            descImage: dArr[y]
          });
        }
        // //console.log("==================descImage", descImage);
        var setDate = {
          brandId: res.brandId,
          colorName: colorName,
          descImage: descImage,
          filmDesc: res.desc,
          filmName: res.title,
          filmPrice: money,
          mainImage: res.mainImage,
          seriesId: res.seriesId,
          viceImage: viceImage
        };
        // //console.log("setDate看这里", setDate);
        this.$axios({
          url: "http://39.99.137.77:8081/projects/phoneFilm/add",
          method: "post",
          data: setDate
        })
          .then(function(response) {
            if (response.status <= 200) {
              //console.log(response.data);
              if (response.data == 5) {
                res.$message.error("已存在");
              } else {
                res.addColor = false;
                res.$message.success("上传成功");
                // location.reload();  体验不好
                res.reload();
              }
            }
          })
          .catch(function(error) {
            res.$message.error("添加失败！");
            // //console.log(error);
          });
      }
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
      this.mainImage = response.data[0];
      // //console.log("主图", this.mainImage);
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
      // //console.log("附图", this.unimportantImage);
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
    MessageSuccess(response, file, fileList) {
      //console.log(response, file, fileList);
      //console.log(response.data[0]);
      this.messageImage.push(response.data[0]);
      // //console.log("详情图", this.messageImage);
    }
  }
};
</script>

<style scoped>
.tbox {
  margin: 5px 0;
}
.myBtn {
  width: 80px;
  height: 35px;
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
  margin-top: 0;
  overflow: scroll;
}
.Ptitle {
  margin-bottom: 20px;
  font-size: 20px;
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
  /* height: 200px; */
  /* height: 100%; */
  background: #fff;
}
.x_title {
  text-align: center;
  padding: 5px;
}
.x_pic {
  width: 100%;
}
.x_picitem {
  display: block;
  width: 100%;
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}
.bannerImage {
  width: 100%;
  height: 100%;
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
  height: 1px;
  background-color: #181c32;
  /* background-color: pink; */
}

#box::-webkit-scrollbar-thumb {
  background-color: #666;
}

.handle-select {
  width: 175px;
  margin-right: 10px;
}

.handle-input {
  width: 170px;
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
.left {
  width: 700px;
  overflow: hidden;
}
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
  right: 25px;
  z-index: 999;
}
/* 主图 */
.imageMain {
  font-size: 14px;
  height: 160px;
  width: 150px;
  overflow: hidden;
  margin-bottom: 30px;
}
/* 副图 */
.imageUnmain {
  font-size: 14px;
  height: 160px;
  width: 700px;
  overflow: hidden;
  margin-bottom: 30px;
}
/* 详情图 */
.imageMessage {
  font-size: 14px;
  height: 160px;
  width: 700px;
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
  height: 188px;
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


