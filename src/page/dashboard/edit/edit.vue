<template>
  <div class="list">
    <v-nav></v-nav>
    <div class="list-content">
        <header>
            <span>{{dashboardshowname}}</span>
            <el-button type="warning" size="small" @click="save">保存</el-button>
            <el-button type="primary" size="small" @click="showVisualize">新加视图</el-button>
        </header>
        <div class="visualizeList" v-if="isAddVisual">
          <el-table ref="visualizeTable" :data="visualizeList" tooltip-effect="dark"style="width: 95%;margin: 20px auto 20px auto;"  @selection-change="SelectVisual">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="visualizename" label="名称"  show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="type" label="类型" width="150">
            </el-table-column>
          </el-table>
          <div class="pagination-box">
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
            <el-button type="danger" style="margin-right: -23%;" @click="reset">取消</el-button>
          </el-row>
        </div>
        <div>
          <grid-layout
            :layout="layout"
            :col-num="12"
            :row-height="30"
            :is-draggable="true"
            :is-resizable="true"
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
                <el-dropdown>
                  <span class="el-dropdown-link">
                    <i class="icon iconfont db--set"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="a" @click="edit">编辑</el-dropdown-item>
                    <el-dropdown-item command="b" @click="del">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
            </grid-item>
          </grid-layout>
        </div>
        
    </div>
  </div>
</template>

<script>
import Nav from '../../../components/common/nav/nav.vue'
var testLayout = [
      {"x":0,"y":0,"w":6,"h":4,"i":"0","echartId":"echartId0"},
      {"x":6,"y":0,"w":6,"h":4,"i":"1","echartId":"echartId1"},
      {"x":0,"y":0,"w":6,"h":4,"i":"2","echartId":"echartId2"},
      {"x":6,"y":0,"w":6,"h":4,"i":"3","echartId":"echartId3"},
];
export default {
  name: 'edit',
  data () {
    return {
      visualizeList: [],
      bid: '',
      isAddVisual: false,
      selVisuaList:  [],
      echartIndex: 0,
      page: {
        currentPage: 0,
        pageSize: 10,
        totalCount: 0,
      },
      list: [],
      layout: [],
      dashboardshowname: ''
    }
  },
  methods: {
    save(){
      var url = '/api/show/dashboardVisualize'
      this.$axios.post(url,{
        "bid": this.bid,
        "locationList": this.layout
      }).then((res) => {
        if(res.data.code == 1){
          this.$router.replace('/dashboardList');
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
    SelectVisual(val){
      this.selVisuaList = val;
    },
    reset(){
      this.isAddVisual = false;
      this.$refs.visualizeTable.clearSelection();
    },
    showVisualize(){
      this.isAddVisual = true;
    },
    addVisual(){
      this.isAddVisual = false;
      var _this = this;
      var list = this.selVisuaList;
      for(let i=0; i< list.length; i++){
        var vid = list[i].vid;
        this.layout.push({
          "x":0,
          "y":0,
          "w":6,
          "h":4,
          "i": vid,
          "vid": vid,
          "type": list[i].type,
          "echartId": "echart"+vid
        });
        setTimeout(function(){
          let echartId = "echart"+vid;
          let h = $("#"+echartId).parent(".vue-grid-item").height();
          $("#"+echartId).height(h);
          switch(list[i].type){
            case  'line':
              _this.initLine(echartId);
              break;
            case  'pie':
              _this.initPie(echartId);
              break;
            default:
              _this.initBar(echartId);
              break;
          }
        }, 500);
        
      }
    },
    edit(){

    },
    del(){

    },
    initLine(echartId){
      var myChart = this.$echarts.init(document.getElementById(echartId));
      myChart.clear();
      var option = {
        backgroundColor: '#fff',
        title: {
          text: '',
        },
        legend: {
          show: false,
          orient: 'horizontal', //图例水平或者垂直
          left: 'auto',
          top: 'auto',
          bottom: 'auto',
          right: 'auto',
              data: ['邮件营销']
          },
          xAxis: {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
              type: 'value'
          },
          series: [{
              data: [820, 932, 901, 934, 1290, 1330, 1320],
              name: '邮件营销',
              type: 'line',
              smooth: true
          }]
      };
      myChart.setOption(option);
      myChart.resize();
    },
    initBar(echartId){
      var myChart = this.$echarts.init(document.getElementById(echartId));
      myChart.clear();
      var option = {
          backgroundColor: '#fff',
          color: ['#3398DB'],
          tooltip : {
              trigger: 'axis',
              axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                  type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          xAxis : [
              {
                  type : 'category',
                  data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                  axisTick: {
                      alignWithLabel: true
                  }
              }
          ],
          yAxis : [
              {
                  type : 'value'
              }
          ],
          series : [
              {
                  name:'直接访问',
                  type:'bar',
                  barWidth: '60%',
                  data:[10, 52, 200, 334, 390, 330, 220]
              }
          ]
      };
      myChart.setOption(option);
      myChart.resize();
    },
    initPie(echartId){
        var myChart = this.$echarts.init(document.getElementById(echartId));
        myChart.clear();
        var option = {
          backgroundColor: '#fff',
          tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
              orient: 'vertical',
              x: 'left',
              data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
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
                  data:[
                      {value:335, name:'直接访问'},
                      {value:310, name:'邮件营销'},
                      {value:234, name:'联盟广告'},
                      {value:135, name:'视频广告'},
                      {value:1548, name:'搜索引擎'}
                  ]
              }
          ]
      };
      myChart.setOption(option);
      myChart.resize();
    },
    resizedEvent: function(i, newH, newW, newHPx, newWPx){
      var data = this.layout.filter(function(item){
           return item.i == i; 
      });
      var selData = data[0];
      console.log(selData);
      $("#"+selData.echartId).height(newHPx);
      $("#"+selData.echartId).width(newWPx);
      switch(selData.type){
        case  'line':
          this.initLine(selData.echartId);
          break;
        case  'pie':
          this.initPie(selData.echartId);
          break;
        default:
          this.initBar(selData.echartId);
          break;
      }
    },
    getVisualList(){
      var _this = this;
      var url = '/api/show/visualizeList';
      this.$axios.post(url,{
        'page': _this.page.currentPage,
        'size': _this.page.pageSize
      }).then((res) => {
          if(res.data.totalPages == 0){
            $('.empty-content').show();
            _this.page.totalCount = res.data.totalPages;
          }else{
            $('.table-box').show();
            _this.page.totalCount = res.data.totalPages;
            _this.visualizeList = JSON.parse(JSON.stringify(res.data.visualizeList));
          }
      }).catch((err) => {
          this.$message({
              type: 'error',
              message: '网络错误，请重试',
              showClose: true
          })
      })
    },
    getParam(){
      this.bid = this.$route.query.bid;
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
              var h = $("#"+id).parent('.vue-grid-item').height();
              console.log('--------'+id);
              console.log('--------'+h);
              $("#"+id).height(h)
              switch(item.type){
                case  'line':
                  _this.initLine(id);
                  break;
                case  'pie':
                  _this.initPie(id);
                  break;
                default:
                  _this.initBar(id);
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
      _this.getVisualList();
  },
  components: {
    'v-nav': Nav
  }
}
</script>

<style lang="scss" scoped>
@import './edit';
</style>
