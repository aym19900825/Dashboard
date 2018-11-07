<template>
  <div class="list">
    <v-nav showItem="dashboard" v-show="!isPreview"></v-nav>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next"
      :total="page.totalCount" style="position: absolute; right: 10px;
      z-index: 10003; display: none;">
    </el-pagination>
    <div class="list-content">
        <header v-if="!isPreview">
            <span>{{dashboardshowname}}</span>
            <el-button type="warning" size="small" @click="exportPage">分享</el-button>
            <el-button type="warning" size="small" @click="preview">预览</el-button>
            <el-button type="warning" size="small" @click="editInfo">修改信息</el-button>
            <el-button type="warning" size="small" @click="save">保存</el-button>
            <el-button type="primary" size="small" @click="showVisualize">配置视图</el-button>
        </header>
        <el-button size="small" @click="returnEdit" v-if="isPreview&&!isShare" :class = "isPreview? 'returnBtn' : ''"  icon="el-icon-back"></el-button>
        <div class="visualizeList" v-show="isAddVisual && !isPreview" >
          <el-table ref="visualizeTable" :data="visualizeList" tooltip-effect="dark" style="width: 95%;margin: 20px auto 20px auto;" @selection-change="selectVisual">
            <el-table-column type="selection" width="55" disabled></el-table-column>
            <el-table-column prop="visualizename" label="名称"  show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="type" label="类型" width="150">
            </el-table-column>
          </el-table>
          <el-row>
            <el-button type="primary" @click="addVisual">完成</el-button>
            <el-button type="danger" style="margin-right: -23%;" @click="reset">取消</el-button>
          </el-row>
        </div>
        <div>
          <grid-layout
            :layout="layout"
            :col-num="12"
            :row-height="30"
            :is-draggable="gridDraggable"
            :is-resizable="griRresizable"
            :vertical-compact="true"
            :margin="[10, 10]"
            :use-css-transforms="true">
            <grid-item v-for="item in layout"
                       :x="item.x"
                       :y="item.y"
                       :w="item.w"
                       :h="item.h"
                       :i="item.vid"
                       @resized="resizedEvent">
                <div :id="item.echartId" class="echart-box"></div>
                <el-dropdown v-show="!isPreview">
                  <span class="el-dropdown-link">
                    <i class="icon iconfont db--set"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="a">
                      <span  @click="editVisual(item.vid,item.type)">编辑</span> 
                    </el-dropdown-item>
                    <el-dropdown-item command="b">
                      <span  @click="del(item)">删除</span> 
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
            </grid-item>
          </grid-layout>
        </div> 
    </div>
    <el-dialog title="dashboard" :visible.sync="dashboardForm" width="560px" :before-close="resetDashboard">
      <el-form :model="newDashboard" label-width="120">
        <el-form-item label="名称">
          <el-input v-model="newDashboard.dashboardname"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="newDashboard.dashboarddescription"></el-input>
        </el-form-item>
        <el-form-item label="菜单编组">
          <el-select v-model="newDashboard.businesscategory" filterable allow-create default-first-option
          placeholder="请选择或输入菜单编组">
            <el-option
              v-for="item in businesscategorys"
              :label="item"
              :value="item"
              :key="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetDashboard">取 消</el-button>
        <el-button type="primary" @click="editDashboard">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="分享地址" :visible.sync="shareShow" width="560px" :before-close="resetShare">
      <el-form :model="shareForm" label-width="120">
        <el-form-item label="链接地址">
          <el-input v-model="shareForm.link"></el-input>
        </el-form-item>
        <el-form-item label="嵌入iframe链接地址">
          <el-input v-model="shareForm.iframeLink"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Nav from '../../../components/common/nav/nav.vue'
export default {
  name: 'edit',
  data () {
    return {
      shareShow: false,
      shareForm: {
        link: '',
        iframeLink: ''
      },
      isShare: false,

      isPreview: false,
      visualizeList: [],
      bid: '',
      isAddVisual: false,
      selVisuaList:  [],
      echartIndex: 0,
      page: {
        currentPage: 1,
        pageSize: 10,
        totalCount: 0,
      },
      list: [],

      layout: [],
      gridDraggable: true,
      griRresizable: true,

      deleteList: [],
      dashboardshowname: '',

      newDashboard: {
        dashboardname: '',
        dashboardshowname: '',
        businesscategory: '',
        dashboarddescription: '',
        bid: '',
        type: ''
      },
      businesscategorys: [],
      dashboardForm: false
    }
  },
  methods: {
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getVisualList();
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.getVisualList();
    },
    editDashboard(){
      var url = '/api/show/dashboard/?bid=' + this.bid ;
      this.$axios.put(url,this.newDashboard).then((res) => {
        if(res.data.code == 1){
          this.$message({
              type: 'error',
              message: '保存成功',
              showClose: true
          });
          this.dashboardForm = false;
        }else{
          this.$message({
              type: 'error',
              message: '保存失败，请重试',
              showClose: true
          })
        }
      }).catch((err) => {
          this.$message({
              type: 'error',
              message: '网络错误，请重试',
              showClose: true
          })
      })
      
    },
    resetDashboard(){
      this.dashboardForm = false;
    },
    save(){
      var param = {};
      if(this.deleteList.length > 0){
        param = {
          'bid': this.bid,
          'locationList': this.layout,
          'deleteList': this.deleteList
        };
      }else{
        param = {
          'bid': this.bid,
          'locationList': this.layout
        };
      }
      var url = '/api/show/dashboardVisualize'
      this.$axios.post(url, param).then((res) => {
        if(res.data.code == 1){
          this.$message({
              type: 'success',
              message: '保存成功！',
              showClose: true
          })
          // this.$router.replace('/dashboardList');
        }else{
          this.$message({
              type: 'error',
              message: '保存失败，请重试',
              showClose: true
          })
        }
      }).catch((err) => {
          this.$message({
              type: 'error',
              message: '网络错误，请重试',
              showClose: true
          })
      })
    },
    choose(){
      this.$router.replace('/detail');
    },
    selectVisual(val){
      this.selVisuaList = val;
    },
    reset(){
      this.isAddVisual = false;
      this.page = {
        currentPage: 1,
        pageSize: 10,
        totalCount: 0,
      };
      this.$refs.visualizeTable.clearSelection();
    },
    showVisualize(){
      this.getVisualList();
      this.isAddVisual = true;
    },
    addVisual(){
      this.isAddVisual = false;
      this.page = {
        currentPage: 1,
        pageSize: 10,
        totalCount: 0,
      };
      var _this = this;
      var list = this.selVisuaList.filter(function(item){
        var flag = true;
        for(var m=0; m<_this.layout.length; m++){
          if(item.vid == _this.layout[m].vid){
            flag = false;
          };
        }
        if(flag){
          return item;
        }
      });
      for(let i=0; i< list.length; i++){
        let vid = list[i].vid;
        let type = list[i].type;
        let param = list[i];
        let obj = JSON.parse(JSON.stringify(list[i]));
        obj.x = 0;
        obj.y = 0;
        obj.w = 6;
        obj.h = 4;
        obj.i = vid;
        obj.vid = vid;
        obj.type = type;
        obj.echartId = "echart"+vid;
        this.layout.push(obj);
        setTimeout(function(){
          let echartId = "echart"+vid;
          let h = $("#"+echartId).parent(".vue-grid-item").height();
          $("#"+echartId).height(h);
          console.log($("#"+echartId).height());
          switch(type){
            case  'pie':
              _this.initPie(echartId,vid,param); 
              break;
            default:
              _this.initLine(echartId,vid,type,param);
              break;
          }
        }, 1000);
        
      }
    },
    editVisual(vid,type){
      var url = '';
      switch(type){
        case  'line':
          url = '/editline';
          break;
        case  'pie':
          url = '/editpie';
          break;
        default:
          url = '/editbar';
          break;
      }
      this.$router.push({
        path: url, 
        query: { 
          vid: vid,
          businesscategorys: this.businesscategorys,
          bid: this.bid
        }
      })
    },
    del(visualize){
      var index;
      if(visualize.did){
        this.deleteList.push(visualize.did);
      }
      for(var i = 0; i < this.layout.length; i++){
          if(this.layout[i].vid == visualize.vid){
            index = i;
          }
      }
      this.layout.splice(index,1);
      this.rerenderEchart('edit');
    },
    dealLegendPos(data,type){
      var res = {};
      switch(data){
        case 'topCenter':
          if(type == 'titPos'){
            res = {
              top: 'auto',
                  left: 'center',
                  bottom: 'auto',
                  right: 'auto'
            };
          }else{
            res = {
              top: 'auto',
                  left: 'auto',
                  bottom: 'auto',
                  right: 'auto'
            };
          }
          
          break;
        case 'topRight':
          res = {
            top: 'auto',
                left: 'auto',
                bottom: 'auto',
                right: '0'
          };
          break;
        case 'topLeft':
          res = {
            top: 'auto',
                left: '0',
                bottom: 'auto',
                right: 'auto'
          };
          break;
        case 'bottomCenter':
          if(type == 'titPos'){
            res = {
              top: 'auto',
                  left: 'auto',
                  bottom: 'auto',
                  right: 'auto'
            };
          }else{
            res = {
              top: 'auto',
                  left: 'center',
                  bottom: '0',
                  right: 'auto'
            };
          }
          break;
        case 'bottomLeft':
          res = {
            top: 'auto',
                left: '0',
                bottom: '0',
                right: 'auto'
          };
          break;
        default:
          res = {
            top: 'auto',
                left: 'auto',
                bottom: '0',
                right: '0'
          };
          break;
      }
      return res;
    },
    initPie(echartId,vid,param,echartData){
      echartData = echartData || {};
      //如果对象是空对象
      if(JSON.stringify(echartData) == "{}"){
        var url1 = '/api/show/visualizeData';
        this.$axios.post(url1,{
            integerId: vid,
        }).then((res) => {
          echartData = res.data;
          var myChart = this.$echarts.init(document.getElementById(echartId));
          myChart.clear();
          var dealPos = this.dealLegendPos(param.legendPos,'legendPos');
          var dealTitPos = this.dealLegendPos(param.echartTitPos,'titPos');
          var option = {
            backgroundColor: param.background,
            title: {
              text: param.echarttitle,
              left: dealTitPos.left,
              top: dealTitPos.top,
              bottom: dealTitPos.bottom,
              right: dealTitPos.right,
              textStyle: {
                color: param.echartTitColor
              }
            },
            tooltip: {
                show: param.tooltipShow,
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
              show: param.legendShow,
              orient: param.legendOrient, //图例水平或者垂直
              left: dealPos.left,
              top: dealPos.top,
              bottom: dealPos.bottom,
              right: dealPos.right,
              data: echartData.showKey
            },
            series: [
              {
                name:'访问来源',
                type:'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: echartData.showValue
              }
            ]
          };
          myChart.setOption(option);
          myChart.resize();
        }).catch((err) => {
            this.$message({
                type: 'error',
                message: '网络错误，请重试',
                showClose: true
            })
        })
      }else{
        var myChart = this.$echarts.init(document.getElementById(echartId));
        myChart.clear();
        var dealPos = this.dealLegendPos(param.legendPos,'legendPos');
        var dealTitPos = this.dealLegendPos(param.echartTitPos,'titPos');
        var option = {
          backgroundColor: param.background,
          title: {
            text: param.echarttitle,
            left: dealTitPos.left,
            top: dealTitPos.top,
            bottom: dealTitPos.bottom,
            right: dealTitPos.right,
            textStyle: {
              color: param.echartTitColor
            }
          },
          tooltip: {
              show: param.tooltipShow,
              trigger: 'item',
              formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
            show: param.legendShow,
            orient: param.legendOrient, //图例水平或者垂直
            left: dealPos.left,
            top: dealPos.top,
            bottom: dealPos.bottom,
            right: dealPos.right,
            data: echartData.showKey
          },
          series: [
            {
              name:'访问来源',
              type:'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                  normal: {
                      show: false,
                      position: 'center'
                  },
                  emphasis: {
                      show: true,
                      textStyle: {
                          fontSize: '30',
                          fontWeight: 'bold'
                      }
                  }
              },
              labelLine: {
                  normal: {
                      show: false
                  }
              },
              data: echartData.showValue
            }
          ]
        };
        myChart.setOption(option);
        myChart.resize();
      }
    },
    initLine(echartId,vid,type,param,echartData){
        echartData = echartData || {};
        //如果对象是空对象
        if(JSON.stringify(echartData) == "{}"){
          var url1 = '/api/show/visualizeData';
          this.$axios.post(url1,{
              integerId: vid,
          }).then((res) => {
            echartData = JSON.parse(JSON.stringify(res.data));
            var myChart = this.$echarts.init(document.getElementById(echartId));
            var dealPos = this.dealLegendPos(param.legendPos,'legendPos');
            var dealTitPos = this.dealLegendPos(param.echartTitPos,'titPos');
            myChart.clear();
            var option = {
              backgroundColor: param.background,
              title: {
                text: param.echarttitle,
                left: dealTitPos.left,
                top: dealTitPos.top,
                bottom: dealTitPos.bottom,
                right: dealTitPos.right,
                textStyle: {
                  color: param.echartTitColor
                }
              },
              legend: {
                show: param.legendShow,
                orient: param.legendOrient, //图例水平或者垂直
                left: dealPos.left,
                top: dealPos.top,
                bottom: dealPos.bottom,
                right: dealPos.right,
                data: echartData.xname
              },
              tooltip: {
                show: param.tooltipShow,
              },
              xAxis: {
                  type: 'category',
                  data: echartData.showKey
              },
              yAxis: {
                  type: 'value'
              },
              series: [{
                  data: echartData.showValue,
                  name: echartData.xname,
                  type: type,
                  smooth: true
              }]
            };
            myChart.setOption(option);
            myChart.resize();
          }).catch((err) => {
              this.$message({
                  type: 'error',
                  message: '网络错误，请重试',
                  showClose: true
              })
          })
        }else{
          var myChart = this.$echarts.init(document.getElementById(echartId));
          var dealPos = this.dealLegendPos(param.legendPos,'legendPos');
          var dealTitPos = this.dealLegendPos(param.echartTitPos,'titPos');
          myChart.clear();
          var option = {
            backgroundColor: param.background,
            title: {
              text: param.echarttitle,
              left: dealTitPos.left,
              top: dealTitPos.top,
              bottom: dealTitPos.bottom,
              right: dealTitPos.right,
              textStyle: {
                color: param.echartTitColor
              }
            },
            legend: {
              show: param.legendShow,
              orient: param.legendOrient, //图例水平或者垂直
              left: dealPos.left,
              top: dealPos.top,
              bottom: dealPos.bottom,
              right: dealPos.right,
              data: echartData.xname
            },
            tooltip: {
              show: param.tooltipShow,
            },
            xAxis: {
                type: 'category',
                data: echartData.showKey
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: echartData.showValue,
                name: echartData.xname,
                type: type,
                smooth: true
            }]
          };
          myChart.setOption(option);
          myChart.resize();
        }
    },
    resizedEvent: function(i, newH, newW, newHPx, newWPx){
      var data = this.layout.filter(function(item){
           return item.i == i; 
      });
      var selData = data[0];
      if(selData.showKey){
        var echartData = {
          showkey: selData.showKey,
          showValue: selData.showValue,
          xname: selData.xname,
          yname: selData.yname
        };
      }
      $("#"+selData.echartId).height(newHPx);
      $("#"+selData.echartId).width(newWPx);
      switch(selData.type){
        case  'pie':
          this.initPie(selData.echartId,selData.vid,selData,echartData);
          break;
        default:
          this.initLine(selData.echartId,selData.vid,selData.type,selData,echartData);
          break;
      }
    },
    getVisualList(){
      $(".el-pagination").hide();
      var _this = this;
      var page =  _this.page.currentPage - 1;
      var url = '/api/show/visualizeList2?page=' +  page +'&size=' + _this.page.pageSize;
      this.$axios.post(url,{}).then((res) => {
          if(res.data.totalPages == 0){
            $('.empty-content').show();
            _this.page.totalCount = res.data.total;
            setTimeout(function(){
              var top = $(".visualizeList").height() - 50;
              $(".el-pagination").css({
                top: top
              });
              $(".el-pagination").show();
            }, 100);
          }else{
            $('.table-box').show();
            _this.page.totalCount = res.data.total;
            var listData = res.data.visualizeList;
            _this.visualizeList = JSON.parse(JSON.stringify(listData));
            _this.toggleSelection([_this.visualizeList[0]]);

            for(var i=0; i<_this.visualizeList.length; i++){
              for(var j=0; j<_this.layout.length; j++){
                if(listData[i].vid == _this.layout[j].vid){
                  _this.selVisuaList.push(_this.visualizeList[i]);
                }
              }
            }
            setTimeout(function(){
              var top = $(".visualizeList").height() - 50;
              $(".el-pagination").css({
                top: top
              });
              $(".el-pagination").show();
            }, 100);
          }
      }).catch((err) => {
          this.$message({
              type: 'error',
              message: '网络错误，请重试',
              showClose: true
          })
      })
    },
    toggleSelection() {
      var rows = this.selVisuaList;
      if(rows) {
        this.$nextTick(function () {
          rows.forEach(row => {
            this.$refs.visualizeTable.toggleRowSelection(row,true);
          });
        });
      }
    },
    getParam(){
      this.bid = this.$route.query.bid;
      this.businesscategorys = this.$route.query.businesscategorys;
      this.isPreview = this.$route.query.isPreview || false;
      this.isShare = this.$route.query.isShare || false;
    },
    editInfo(){
      var url = '/api/show/dashboard/'+ this.bid;
      this.$axios.post(url,{
        
      }).then((res) => {
        this.newDashboard = res.data;
        this.dashboardForm = true;
      }).catch((err) => {
          this.$message({
              type: 'error',
              message: '网络错误，请重试',
              showClose: true
          })
      })

    },
    rerenderEchart(pageState){
      var _this = this;
      var data = this.layout;
      setTimeout(function(){
        data.forEach(function(item){
          var id = item.echartId;
          var vid = item.vid;
          if(item.showKey){
            var echartData = {
              showkey: item.showKey,
              showValue: item.showValue,
              xname: item.xname,
              yname: item.yname
            };
          }
          var h = $("#"+id).parent('.vue-grid-item').height();
          $("#"+id).height(h);
          switch(item.type){
            case  'pie':
              _this.initPie(id,vid,item,echartData);
              break;
            default:
              _this.initLine(id,vid,item.type,item,echartData);
              break;
          }
        });
        if(pageState == 'preview'){
          _this.gridDraggable = false;
          _this.griRresizable = false;
        }else{
          _this.gridDraggable = true;
          _this.griRresizable = true;
        }
      },100);

    },
    preview(){
      this.isPreview = true;
      this.rerenderEchart('preview');
    },
    returnEdit(){
      this.isPreview = false;
      this.rerenderEchart('edit');
    },
    exportPage(){
      var url = window.location.href;
      var domain = window.location.host;
      url = url.replace(domain,'192.168.1.114:8080');
      this.shareForm.link = url+'&isPreview=true&isShare=true';
      this.shareForm.iframeLink = '<iframe src="' + url + '" height="600" width="800"></iframe>';
      this.shareShow = true;
    },
    resetShare(){
      this.shareForm = {
        link: '',
        iframeLink: ''
      };
      this.shareShow = false;
    },
    getDashboardData(){
      var _this = this;
      var url = '/api/show/dashboardData';
      this.$axios.post(url,{
        'integerId': _this.bid,
      }).then((res) => {
          this.dashboardshowname = res.data.dashboardshowname;
          var data = res.data.showDtoList;
          data.forEach(function(item){
              item.echartId = 'echart' + item.vid;
              item.i = item.vid;
          });
          this.layout = data;
          setTimeout(function(){
            data.forEach(function(item){
              var id = item.echartId;
              var vid = item.vid;
              var echartData = {
                showkey: item.showKey,
                showValue: item.showValue,
                xname: item.xname,
                yname: item.yname
              };
              var h = $("#"+id).parent('.vue-grid-item').height();
              $("#"+id).height(h)
              switch(item.type){
                case  'pie':
                  _this.initPie(id,vid,item,echartData);
                  break;
                default:
                  _this.initLine(id,vid,item.type,item,echartData);
                  break;
              }
            });
          },1000);
      }).catch((err) => {
          this.$message({
              type: 'error',
              message: '网络错误，请重试',
              showClose: true
          })
      })
    }
  },
  mounted(){
      var _this = this;
      _this.getParam();
      _this.getDashboardData();
      $(".list-content").height($(window).height());
      if(this.isShare){
        this.rerenderEchart('preview');
      }
  },
  components: {
    'v-nav': Nav
  }
}
</script>

<style lang="scss" scoped>
@import './edit';
</style>
