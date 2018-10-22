<template>
  <div>
     <header>
     	<span>{{visualizename}}</span>
		<el-button type="warning" size="small">取消</el-button>
		<el-button type="primary" size="small">保存</el-button>
     </header>
		<div id="content">
			<div class="left">
				<h4>table表名</h4>
				<ul class="tab-list">
					<li @click="tabSwitch(0)" :class=" tabIndex == 0 ? 'selected' : '' ">数据选择</li>
					<li @click="tabSwitch(1)" :class=" tabIndex == 1 ? 'selected' : '' ">表盘设置</li>
					<span class="run" @click="run"></span>
				</ul>
				<div class="tab-content">
					<div class="tab-content-one" v-show="tabIndex == 0">
						<div class="metrics">
							<el-form ref="option-set" :model="lineParam" label-width="80px">
							 	<el-form-item label="业务场景">
							    	<el-select v-model="lineParam.dataTalbe" placeholder="请选择图例位置">
								    	<el-option
									      v-for="item in tables"
									      :key="item.visualizename"
									      :label="item.visualizename"
									      :value="item.visualizename">
									    </el-option>
							    	</el-select>
							    </el-form-item>
							</el-form>
						</div>
					</div>
					<div class="tab-content-two" v-show="tabIndex == 1">
						<div class="panl-setting">
							<el-form ref="option-set" :model="lineParam" label-width="80px">
							  	<el-form-item label="标题">
							   		 <el-input v-model="lineParam.title.text"></el-input>
							 	</el-form-item>
							 	<el-form-item label="图例位置">
							    	<el-select v-model="lineParam.legend.left" placeholder="请选择图例位置">
								    	<el-option
									      v-for="item in legendPos"
									      :key="item.value"
									      :label="item.txt"
									      :value="item.value">
									    </el-option>
							    	</el-select>
							    </el-form-item>
							    <el-form-item label="图例布局">
							    	<el-select v-model="lineParam.legend.orient" placeholder="请选择图例布局">
								    	<el-option
									      v-for="item in legendOpt"
									      :key="item.value"
									      :label="item.txt"
									      :value="item.value">
									    </el-option>
							    	</el-select>
							    </el-form-item>
							    <el-form-item label="是否提示">
							    	<el-switch v-model="lineParam.tooltip.show"></el-switch>
							    </el-form-item>
							</el-form>
						</div>
					</div>
				</div>
			</div>
			<div class="right">
				<div id="echart-box"></div>
			</div>
		</div>
  </div>
</template>

<script>
export default {
  	name: 'pie',
  	props: ['vid'],
 	data(){
   		return {
   			visualizename: '',
   			tables: [
   				{
   					visualizename: '业务名称1'
   				},
   				{
   					visualizename: '业务名称2'
   				}
   			],
   			legendOpt:[
   				{
   					txt: '水平',
   					value: 'horizontal'
   				},{
					txt: '垂直',
   					value: 'vertical'
   				}
   			],
   			legendPos: [
				{
   					txt: '水平',
   					value: 'horizontal'
   				},{
					txt: '垂直',
   					value: 'vertical'
   				}
   			],

   			tabIndex: '0',
      		lineParam: {
      			dataTalbe: '',
      			//标题设置
				title: {
					text: '',
					textStyle: {
						color: '#000',
						fontSize: 18
					}
				},
				//图例设置
				legend: {
					show: true,
					orient: 'horizontal', //图例水平或者垂直
					left: 'auto',
					top: 'auto',
					bottom: 'auto',
					right: 'auto'
				},
				//提示框设置
	   			tooltip: {
	   				show: true	
	   			}
      		},
    	}
    },
    methods: {
    	tabSwitch(index){
			this.tabIndex = index;
		},
		 initEchart(echartId){
	        var myChart = this.$echarts.init(document.getElementById('echart-box'));
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
	    },
		requestData(){
			var url = '/api/show/visualize';
			this.$axios.post(url,{
	            integerId: this.vid,
	        }).then((res) => {
	        	var data = res.data;
	            this.lineParam.title.text = data.visualizeshowname;
	            this.visualizename = data.visualizename;
	        }).catch((err) => {
	            this.$message({
	                type: 'error',
	                message: '网络错误，请重试',
	                showClose: true
	            })
	        })
		},
		run(){
			this.initEchart();
		}
    },
    mounted(){
    	this.requestData();
		this.initEchart();
    }
}
</script>

<style lang="scss" scoped>
  @import './pie';
</style>

