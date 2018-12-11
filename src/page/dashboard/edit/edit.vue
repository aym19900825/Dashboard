<template>
  <div class="list">
    <v-nav showItem="dashboard" v-show="!isPreview"></v-nav>
    <div class="list-content">
        <header v-if="!isPreview">
            <span>{{dashboardshowname}}</span>
            <el-button type="info" size="small" @click="returnDb" style="margin-left: 10px;">返回仪表板列表</el-button>
            <el-button type="warning" size="small" @click="exportPage">分享</el-button>
            <el-button type="warning" size="small" @click="preview">预览</el-button>
            <el-button type="warning" size="small" @click="editInfo">修改信息</el-button>
            <el-button type="warning" size="small" @click="save">保存</el-button>
            <el-button type="primary" size="small" @click="showVisualize">配置视图</el-button>
        </header>
        <el-button size="small" @click="returnEdit" v-if="isPreview&&!isShare" :class = "isPreview? 'returnBtn' : ''"  icon="el-icon-back"></el-button>
        <div class="visualizeList" v-show="isAddVisual && !isPreview" >
          <el-row :gutter="20" style="padding-top: 20px;">
            <el-col :span="16" style="margin-left: 8%;"> 
              <el-input placeholder="请输入名称" v-model="searchData.visualizename" @keyup.enter.native="searchVisual"></el-input>
            </el-col>
            <el-col :span="4">
              <el-input placeholder="请输入类型" v-model="searchData.type" @keyup.enter.native="searchVisual"></el-input>
            </el-col>
          </el-row>
          <el-table ref="visualizeTable" :data="visualizeList" tooltip-effect="dark" style="width: 95%;margin: 20px auto 20px auto;" @selection-change="selectVisual">
            <el-table-column type="selection" width="55" disabled></el-table-column>
            <el-table-column prop="visualizename" label="名称"  show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="type" label="类型" width="150">
            </el-table-column>
          </el-table>
          <div style="text-align: right;">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page.currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="page.pageSize"
              layout="total, sizes, prev, pager, next"
              :total="page.totalCount">
            </el-pagination>
          </div>
          <el-row>
            <el-button type="primary" @click="addVisual">完成</el-button>
            <el-button type="danger" @click="reset">取消</el-button>
          </el-row>
        </div>
        <div class="content-layout">
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
        <div class="empty-layout">
          <p style="text-align: center;margin-top: 15%;font-size: 26px;">您还没有配置任何视图!</p>
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
        <el-form-item label="刷新时间">
          <el-select v-model="newDashboard.refresh" filterable allow-create default-first-option
          placeholder="请选择刷新时间(s)">
            <el-option
              v-for="item in refreshOpt"
              :label="item+'min'"
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
          <el-input v-model="shareForm.link" style="width: 95%;"></el-input>
          <i class="icon iconfont db--fuzhi" v-clipboard:copy="shareForm.link"
            v-clipboard:success="copySuccess" v-clipboard:error="copyError"></i>
        </el-form-item>
        <el-form-item label="嵌入iframe链接地址">
          <el-input v-model="shareForm.iframeLink" style="width: 95%;"></el-input>
          <i class="icon iconfont db--fuzhi" v-clipboard:copy="shareForm.iframeLink"
           v-clipboard:success="copySuccess" v-clipboard:error="copyError"></i>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Nav from '../../../components/common/nav/nav.vue'
import Config from '../../../config.js'
export default {
  name: 'edit',
  data () {
    return {
      config: Config,
      basic_url: Config.dev_url,
      searchData: {
        'type': '',
        'visualizename': '',
        'businesscategory': ''
      },

      refreshOpt: [0,3,5,8,10],
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
        type: '',
        refresh: ''
      },
      businesscategorys: [],
      dashboardForm: false,

      colors: ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
      colstacks:[]
    }
  },
  methods: {
    returnDb(){
      this.$router.push({
        path: '/dashboardList', 
      });
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getVisualList();
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.getVisualList();
    },
    editDashboard(){
      var url = this.basic_url + '/show/dashboard/?bid=' + this.bid ;
      this.$axios.put(url,this.newDashboard).then((res) => {
        if(res.data.code == 1){
          this.$message({
              type: 'success',
              message: '保存成功',
              showClose: true
          });
          this.dashboardForm = false;
          this.refresh = this.newDashboard.refresh;
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
      var url = this.basic_url + '/show/dashboardVisualize'
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
      var _this = this;
      this.isAddVisual = false;
      this.page = {
        currentPage: 1,
        pageSize: 10,
        totalCount: 0,
      };
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
        $('.content-layout').show();
        $('.empty-layout').hide();
        
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
      var selIndex;
      if(visualize.did){
        this.deleteList.push(visualize.did);
      }
      for(var i = 0; i < this.layout.length; i++){
          if(this.layout[i].vid == visualize.vid){
            index = i;
          }
      }
      for(var j = 0; j < this.selVisuaList.length; j++){
          if(this.selVisuaList[j].vid == visualize.vid){
            selIndex = j;
          }
      }
      this.layout.splice(index,1);
      this.selVisuaList.splice(selIndex,1);
      this.rerenderEchart('edit');
      console.log(this.selVisuaList);
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
        var url1 = this.basic_url + '/show/visualizeData';
        this.$axios.post(url1,{
            integerId: vid,
        }).then((res) => {
          echartData = res.data;
          var myChart = this.$echarts.init(document.getElementById(echartId));
          var dealPos = this.dealLegendPos(echartData.legendPos,'legendPos');
          var dealTitPos = this.dealLegendPos(echartData.echartTitPos,'titPos');
          myChart.clear();
          var seriesData = [];
          var legendData = [];
          var legendSelO = !!echartData.legendSelData && echartData.legendSelData!='' ? echartData.legendSelData.split(',') : [];

          var legendSel = {};
          for(var i=0; i<echartData.showValue[0].length; i++){
            var colObj = echartData.columnList[i];
            var radius = !!colObj.colRadius ? colObj.colRadius.split(',') : ['0%','50%'];
            var len = echartData.columnList.length;
            var center = [];
            if(len==1){
              center = ['50%', '50%'];
            }else{
              if(i==1){
                center = ['25%', '50%'];
              }else{
                center = ['75%', '50%'];
              }
            }
            var seriesObj = {};
            seriesObj = {
              name: colObj.colName,
                type:'pie',
                radius : radius,
                center : center,
                roseType : colObj.colRoseType == false ? false : 'area',
                label: {
                  show: colObj.colLabel,
                  position: colObj.colLabelPos
                },
                lableLine: {
                    show: colObj.colLabelline,
                },
                data: echartData.showValue[0][i]
            };
            seriesData.push(seriesObj);
          }

          var showVal = echartData.showValue[0][0];
          for(var j = 0; j < showVal.length; j++ ){
            if(legendData.indexOf(showVal[j].name) === -1){
             legendData.push(showVal[j].name);
            }
            if(legendSelO.length > 0){
              if(legendSelO.indexOf(showVal[j].name) === -1){
                legendSel[showVal[j].name] = false;
              }else{
                legendSel[showVal[j].name] = true;
              }
            }else{
              legendSel[showVal[j].name] = true;
            }
          }

          var option = {
            backgroundColor: echartData.background,
            title: {
              text: echartData.echarttitle,
              left: dealTitPos.left,
              top: dealTitPos.top,
              bottom: dealTitPos.bottom,
              right: dealTitPos.right,
              textStyle: {
                color: echartData.echartTitColor
              }
            },
            tooltip: {
              show: echartData.tooltipShow,
              trigger: 'item',
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
              show: echartData.legendShow,
              type: !!echartData.legendType ? echartData.legendType : 'plain',
              orient: echartData.legendOrient, //图例水平或者垂直
              left: dealPos.left,
              top: dealPos.top,
              bottom: dealPos.bottom,
              right: dealPos.right,
              data: legendData,
              selected: legendSel
            },
            series: seriesData
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
          var seriesData = [];
          var legendData = [];
          var legendSelO = !!param.legendSelData && param.legendSelData!='' ? param.legendSelData.split(',') : [];

          var legendSel = {};
          for(var i=0; i<echartData.showValue[0].length; i++){
            var colObj = param.columnList[i];
            var radius = !!colObj.colRadius ? colObj.colRadius.split(',') : ['0%','50%'];
            var len = param.columnList.length;
            var center = [];
            if(len==1){
              center = ['50%', '50%'];
            }else{
              if(i==1){
                center = ['25%', '50%'];
              }else{
                center = ['75%', '50%'];
              }
            }
            var seriesObj = {};
            seriesObj = {
              name: colObj.colName,
                type:'pie',
                radius : radius,
                center : center,
                roseType : colObj.colRoseType == false ? false : 'area',
                label: {
                  show: colObj.colLabel,
                  position: colObj.colLabelPos
                },
                lableLine: {
                    show: colObj.colLabelline,
                },
                data: echartData.showValue[0][i]
            };
            seriesData.push(seriesObj);
          }

          var showVal = echartData.showValue[0][0];
          for(var j = 0; j < showVal.length; j++ ){
            if(legendData.indexOf(showVal[j].name) === -1){
             legendData.push(showVal[j].name);
            }
            if(legendSelO.length > 0){
              if(legendSelO.indexOf(showVal[j].name) === -1){
                legendSel[showVal[j].name] = false;
              }else{
                legendSel[showVal[j].name] = true;
              }
            }else{
              legendSel[showVal[j].name] = true;
            }
          }

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
              type: !!param.legendType ? param.legendType : 'plain',
              orient: param.legendOrient, //图例水平或者垂直
              left: dealPos.left,
              top: dealPos.top,
              bottom: dealPos.bottom,
              right: dealPos.right,
              data: legendData,
              selected: legendSel
            },
            series: seriesData
          };
          myChart.setOption(option);
          myChart.resize();
        }
    },
    initLine(echartId,vid,type,param,echartData){
        echartData = echartData || {};
        //如果对象是空对象
        if(JSON.stringify(echartData) == "{}"){
          var url1 = this.basic_url + '/show/visualizeData';
          this.$axios.post(url1,{
              integerId: vid,
          }).then((res) => {
            echartData = JSON.parse(JSON.stringify(res.data));
            var myChart = this.$echarts.init(document.getElementById(echartId));
            var dealPos = this.dealLegendPos(param.legendPos,'legendPos');
            var dealTitPos = this.dealLegendPos(param.echartTitPos,'titPos');
            this.dealLegendPos();
            var seriesData = [];
            var colSets = echartData.columnList;
            var lengdData = [];
            var colors = [];

            myChart.clear();
            var orientYList = echartData.orientYList;
            orientYList.unshift({
              yAxisLabel:  param.yAxisLabel,
              yAxisLine: param.yAxisLine,
              yInverse: param.yInverse,
              ySplitLine: param.ySplitLine,
              yaxisLabelPos: param.yaxisLabelPos,
              ylineColor: param.ylineColor,
              yname: param.yname,
              ytype: param.ytype
            });

            
            if(echartData.xToy){
              var xSet = {};
              var ySet = {};
              xSet = {
                name: echartData.yname,
                type: 'value',
                splitLine: {show: echartData.ySplitLine},
                  inverse: echartData.yInverse,
                  axisLine: {
                    show: echartData.yAxisLine
                },
                axisLabel: {
                    formatter: '{value}'+(!!echartData.yAxisLabel&&echartData.yAxisLabel!='null'?echartData.yAxisLabel:'')
                  }
              };
              ySet = {
                name: echartData.xname,
                type: 'category',
                data: echartData.showKey,
                axisTick: {
                      alignWithLabel: echartData.alignWithLabel
                  },
                  splitLine: {show: echartData.xSplitLine},
                  inverse: echartData.xInverse,
                  axisLine: {
                    show: echartData.xAxisLine
                },
                axisLabel: {
                      formatter: '{value}'+(!!echartData.xAxisLabel&&echartData.xAxisLabel!='null'?echartData.xAxisLabel:'')
                  }
                };
              }else{
                var xSet = {};
                var ySet = [];
                xSet = {
                  name: echartData.xname,
                  type: 'category',
                  data: echartData.showKey,
                  axisTick: {
                      alignWithLabel: echartData.alignWithLabel
                  },
                  splitLine: {show: echartData.xSplitLine},
                  inverse: echartData.xInverse,
                  axisLine: {
                    show: echartData.xAxisLine
                  },
                  axisLabel: {
                    formatter: '{value}'+(!!echartData.xAxisLabel&&echartData.xAxisLabel != 'null' ? echartData.xAxisLabel : '')
                  },
                };
                for(var k=0; k<orientYList.length; k++ ){
                  var thisY = orientYList[k];
                  var ySetObj = {
                    name: thisY.yname,
                    type: 'value',
                    splitLine: {show: thisY.ySplitLine},
                      inverse: thisY.yInverse,
                      axisLine: {
                        show: thisY.yAxisLine
                    },
                    axisLabel: {
                          formatter: '{value}'+(!!thisY.yAxisLabel&&thisY.yAxisLabel!='null'?thisY.yAxisLabel:'')
                      },
                    offset: 40*(k-1<0?0:k-1),
                  };
                  ySet.push(ySetObj);
                }
              }

              for(var i=0; i<echartData.showValue.length; i++){
                var obj = {
                  data: echartData.showValue[i],
                  name: colSets[i].colName,
                  label: {
                    show: colSets[i].colLabel == 'false' ? false : true,
                    position: colSets[i].colLabelPos
                  },
                  barWidth: colSets[i].colWidth,
                  markPoint: {
                    data: []
                  },
                  smooth: colSets[i].colSmooth,
                  step: colSets[i].colstep
                };
                
              if(!!colSets[i].colType){
                obj.type = colSets[i].colType;
              }else{
                obj.type = type;
              }
              lengdData.push(colSets[i].colName);
              if(colSets[i].colYIndex&&colSets[i].colYIndex>orientYList.length-1){
                colSets[i].colYIndex = 0;
              }
              obj.yAxisIndex =  colSets[i].colYIndex;
              if(!!colSets[i].colColor){
                colors.push(colSets[i].colColor);
              }else{
                colors.push(this.colors[i]);
              }
              if(!!colSets[i].colMax || !!colSets[i].colMax){
                if(!!colSets[i].colMax){
                  obj.markPoint.data.push({type : 'max', name: '最大值'});
                }
                if(!!colSets[i].colMin){
                  obj.markPoint.data.push({type : 'min', name: '最小值'});
                }
              }

              if(!!colSets[i].colAreaStyle){
                obj.areaStyle = {
                  color: colSets[i].colAreaColor
                }
              }
              if(!!colSets[i].sampling){
                obj.sampling = colSets[i].sampling;
              }
              if(!!colSets[i].colStack){
                if(this.colstacks.length == 0){
                  this.colstacks.push({
                    name: colSets[i].colStack,
                    val: colSets[i].colStack
                  });
                  obj.stack = colSets[i].colStack;
                }else{
                  for(var j=0; j<this.colstacks.length; j++){
                    if(colSets[i].colStack == this.colstacks[j].val){
                      this.colstacks.push({
                        name: this.colstacks[j].name,
                        val: colSets[i].colStack
                      });
                      obj.stack = this.colstacks[j].name;
                      break;
                    }else{
                      this.colstacks.push({
                        name: colSets[i].colStack,
                        val: colSets[i].colStack
                      });
                      obj.stack = colSets[i].colStack;
                      break;
                    }
                  }
                }
              }
              seriesData.push(obj);
            }
            var option = {
                backgroundColor: param.background,
                color: colors,
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
                  data: lengdData
                },
                tooltip: {
                  show: param.tooltipShow,
                },
                xAxis: xSet,
                yAxis: ySet,
                dataZoom: [
                  {
                      show: echartData.dataZoom,
                  },
                  {
                      type: 'inside',
                  },
                  {
                    show: echartData.dataZoom,
                    yAxisIndex: 0,
                    filterMode: 'empty',
                    width: 30,
                    height: '80%',
                    showDataShadow: false,
                    left: '93%'
                  }
                ],
                series: seriesData
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
          this.dealLegendPos();
          var seriesData = [];
          var colSets = param.columnList;
          var lengdData = [];
          var colors = [];

          var orientYList = param.orientYList;
          orientYList.unshift({
            yAxisLabel:  param.yAxisLabel,
            yAxisLine: param.yAxisLine,
            yInverse: param.yInverse,
            ySplitLine: param.ySplitLine,
            yaxisLabelPos: param.yaxisLabelPos,
            ylineColor: param.ylineColor,
            yname: param.yname,
            ytype: param.ytype
          });

          myChart.clear();

          if(param.xToy){
            var xSet = {};
            var ySet = {};
            xSet = {
              name: param.yname,
              type: 'value',
              splitLine: {show: param.ySplitLine},
                inverse: param.yInverse,
                axisLine: {
                  show: param.yAxisLine
              },
              axisLabel: {
                formatter: '{value}'+(!!param.yAxisLabel&&param.yAxisLabel!='null'?param.yAxisLabel:'')
              }
            };
            ySet = {
              name: param.xname,
              type: 'category',
              data: param.showKey,
              axisTick: {
                    alignWithLabel: param.alignWithLabel
                },
                splitLine: {show: param.xSplitLine},
                inverse: param.xInverse,
                axisLine: {
                  show: param.xAxisLine
              },
              axisLabel: {
                    formatter: '{value}'+(!!param.xAxisLabel&&param.xAxisLabel!='null'?param.xAxisLabel:'')
                }
          };
        }else{
          var xSet = {};
          var ySet = [];
          xSet = {
            name: param.xname,
            type: 'category',
            data: param.showKey,
            axisTick: {
                  alignWithLabel: param.alignWithLabel
              },
              splitLine: {show: param.xSplitLine},
              inverse: param.xInverse,
              axisLine: {
                show: param.xAxisLine
            },
            axisLabel: {
              formatter: '{value}'+(!!param.xAxisLabel&&param.xAxisLabel!='null'?param.xAxisLabel:'')
            }
          };
          for(var k=0; k<orientYList.length; k++ ){
            var thisY = orientYList[k];
            var ySetObj = {
                name: thisY.yname,
                type: 'value',
                splitLine: {show: thisY.ySplitLine},
                  inverse: thisY.yInverse,
                  axisLine: {
                    show: thisY.yAxisLine
                },
                axisLabel: {
                      formatter: '{value}'+(!!thisY.yAxisLabel&&thisY.yAxisLabel!='null'?thisY.yAxisLabel:'')
                  },
                  offset: 40*(k-1<0?0:k-1),
            };
            ySet.push(ySetObj);
          }
        }

        for(var i=0; i<echartData.showValue.length; i++){
          var obj = {
            data: echartData.showValue[i],
            type: !!colSets[i].colType ? colSets[i].colType : 'bar',
            name: colSets[i].colName,
            label: {
              show: colSets[i].colLabel == 'false' ? false : true,
              position: colSets[i].colLabelPos
            },
            barWidth: colSets[i].colWidth,
            markPoint: {
              data: []
            },
            smooth: colSets[i].colSmooth,
            step: colSets[i].colstep    
          };

          if(colSets[i].colYIndex&&colSets[i].colYIndex>orientYList.length-1){
            colSets[i].colYIndex = 0;
          }
          obj.yAxisIndex =  colSets[i].colYIndex;

          if(!!colSets[i].colType){
            obj.type = colSets[i].colType;
          }else{
            obj.type = type;
          }
          lengdData.push(colSets[i].colName);
          if(!!colSets[i].colColor){
            colors.push(colSets[i].colColor);
          }else{
            colors.push(this.colors[i]);
          }

          if(!!colSets[i].colAreaStyle){
            obj.areaStyle = {
              color: colSets[i].colAreaColor
            }
          }
          if(!!colSets[i].sampling){
            obj.sampling = colSets[i].sampling;
          }
          if(!!colSets[i].colMax || !!colSets[i].colMax){
            if(!!colSets[i].colMax){
              obj.markPoint.data.push({type : 'max', name: '最大值'});
            }
            if(!!colSets[i].colMin){
              obj.markPoint.data.push({type : 'min', name: '最小值'});
            }
          }
          if(!!colSets[i].colStack){
            if(this.colstacks.length == 0){
              this.colstacks.push({
                name: colSets[i].colStack,
                val: colSets[i].colStack
              });
              obj.stack = colSets[i].colStack;
            }else{
              for(var j=0; j<this.colstacks.length; j++){
                if(colSets[i].colStack == this.colstacks[j].val){
                  this.colstacks.push({
                    name: this.colstacks[j].name,
                    val: colSets[i].colStack
                  });
                  obj.stack = this.colstacks[j].name;
                  break;
                }else{
                  this.colstacks.push({
                    name: colSets[i].colStack,
                    val: colSets[i].colStack
                  });
                  obj.stack = colSets[i].colStack;
                  break;
                }
              }
            }
          }
          seriesData.push(obj);
        }
        var option = {
          backgroundColor: param.background,
          color: colors,
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
            data: lengdData
          },
          tooltip: {
            show: param.tooltipShow,
          },
          xAxis: xSet,
          yAxis: ySet,
          dataZoom: [
            {
                show: param.dataZoom,
            },
            {
                type: 'inside',
            },
            {
              show: param.dataZoom,
              yAxisIndex: 0,
              filterMode: 'empty',
              width: 30,
              height: '80%',
              showDataShadow: false,
              left: '93%'
            }
          ],
          series: seriesData
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
    searchVisual(){
      this.page.currentPage = 1;
      this.getVisualList();
    },
    getVisualList(){
      $(".el-pagination").hide();
      var _this = this;
      var page =  _this.page.currentPage - 1;
      var url = this.basic_url + '/show/visualizeList2?page=' +  page +'&size=' + _this.page.pageSize;
      this.$axios.post(url,_this.searchData).then((res) => {
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
      this.refresh = this.$route.query.refresh || 0;
    },
    editInfo(){
      var url = this.basic_url + '/show/dashboard/'+ this.bid;
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
      // url = url.replace(domain,this.config.export_url);
      url = url + '&isPreview=true&isShare=true&refresh=' + this.refresh;
      this.shareForm.link = url;
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
      var url = this.basic_url + '/show/dashboardData';
      this.$axios.post(url,{
        'integerId': _this.bid,
      }).then((res) => {
          this.dashboardshowname = res.data.dashboardshowname;
          this.refresh = res.data.refresh;
          var data = res.data.showDtoList;
          data.forEach(function(item){
              item.echartId = 'echart' + item.vid;
              item.i = item.vid;
          });
          this.layout = data;
          if(this.layout.length > 0){
            $('.content-layout').show();
            $('.empty-layout').hide();
          }else{
            $('.content-layout').hide();
            $('.empty-layout').show();
          }
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
    },
    copySuccess(){
      this.$message({
          message: '复制成功',
          type: 'success'
      });
    },
    copyError(){
      this.$message({
          message: '复制失败',
          type: 'error'
      });
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
      window.onresize = function() {
        $(".list-content").height($(window).height());
        if(_this.isShare){
            _this.rerenderEchart('preview');
        }else{
            _this.rerenderEchart('edit');
        }
      }
      //页面分享后定时刷新
      var refresh = this.refresh;
      if(refresh > 0 && this.isShare){
        setInterval(function(){ 
          window.location.reload();
        }, refresh*60*1000);
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
