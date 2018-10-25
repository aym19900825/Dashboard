<template>
  <div>
     <header>
     	<span>{{visualParam.visualizename}}</span>
		<el-button type="warning" size="small" @click="reset">取消</el-button>
		<el-button type="primary" size="small" @click="save">保存</el-button>
     </header>
		<div id="content">
			<div class="left">
				<h4>table表名</h4>
				<ul class="tab-list">
					<li @click="tabSwitch(0)" :class=" tabIndex == 0 ? 'selected' : '' ">视图设置</li>
					<li @click="tabSwitch(1)" :class=" tabIndex == 1 ? 'selected' : '' ">表盘设置</li>
					<span class="run" @click="run"></span>
				</ul>
				<div class="tab-content">
					<div class="tab-content-one" v-show="tabIndex == 0">
						<div class="metrics">
							<el-form ref="option-set" :model="visualParam" label-width="100px">
								<el-form-item label="名称">
						          <el-input v-model="visualParam.visualizename"></el-input>
						        </el-form-item>
						        <el-form-item label="类型">
						          <el-select disabled v-model="visualParam.type" placeholder="请选择活动区域" width="100%">
						            <el-option label="折线图" value="line"></el-option>
						            <el-option label="饼图" value="pie"></el-option>
						            <el-option label="柱状图" value="bar"></el-option>
						          </el-select>
						        </el-form-item>
						        <el-form-item label="y轴数据类型">
						          <el-select disabled v-model="visualParam.ytype" placeholder="y轴数据类型">
						            <el-option label="double" value="double"></el-option>
						            <el-option label="float" value="float"></el-option>
						            <el-option label="int" value="int"></el-option>
						          </el-select>
						        </el-form-item>
						        <el-form-item label="业务场景">
						          <el-select v-model="visualParam.businesscategory" filterable allow-create default-first-option
						            placeholder="请选择或输入业务场景">
						            <el-option
						              v-for="item in businessCats"
						              :label="item"
						              :value="item"
						              :key="item">
						            </el-option>
						          </el-select>
						        </el-form-item>
							</el-form>
						</div>
					</div>
					<div class="tab-content-two" v-show="tabIndex == 1">
						<div class="panl-setting">
							<el-form ref="option-set" :model="visualParam" label-width="80px">
							  	<el-form-item label="标题">
							   		 <el-input v-model="visualParam.echarttitle"></el-input>
							 	</el-form-item>
							 	<el-form-item label="显示图例">
							    	<el-switch v-model="visualParam.legendShow"></el-switch>
							    </el-form-item>
							 	<el-form-item label="图例位置" v-if="visualParam.legendShow">
							    	<el-select v-model="visualParam.legendPos" placeholder="请选择图例位置">
								    	<el-option
									      v-for="item in legendPos"
									      :key="item.value"
									      :label="item.txt"
									      :value="item.value">
									    </el-option>
							    	</el-select>
							    </el-form-item>
							    <el-form-item label="图例布局" v-if="visualParam.legendShow">
							    	<el-select v-model="visualParam.legendOrient" placeholder="请选择图例布局">
								    	<el-option
									      v-for="item in legendOpt"
									      :key="item.value"
									      :label="item.txt"
									      :value="item.value">
									    </el-option>
							    	</el-select>
							    </el-form-item>
							    <el-form-item label="显示提示">
							    	<el-switch v-model="visualParam.tooltipShow"></el-switch>
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
  	name: 'line',
  	props: ['vid','businessCats'],
 	data(){
   		return {
   			visualizename: '',
   			tabIndex: '0',
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
   					txt: '上中',
   					value: 'topCenter'
   				},{
					txt: '上右',
   					value: 'topRight'
   				},{
					txt: '上左',
   					value: 'topLeft'
   				},{
   					txt: '下中',
   					value: 'bottomCenter'
   				},{
					txt: '下左',
   					value: 'bottomLeft'
   				},{
					txt: '下右',
   					value: 'bottomRight'
   				}

   			],

      		visualParam: {},
      		echartData: {},
      		dealPos: {
      			top: 'auto',
      			left: 'auto',
      			right: 'auto',
      			bottom: 'auto',
      		},
    	}
    },
    methods: {
    	tabSwitch(index){
			this.tabIndex = index;
		},
		dealLegendPos(){
			switch(this.visualParam.legendPos){
				case 'topCenter':
					this.dealPos = {
						top: 'auto',
				        left: 'auto',
				        bottom: 'auto',
				        right: 'auto'
					};
					break;
				case 'topRight':
					this.dealPos = {
						top: 'auto',
				        left: 'auto',
				        bottom: 'auto',
				        right: '0'
					};
					break;
				case 'topLeft':
					this.dealPos = {
						top: 'auto',
				        left: '0',
				        bottom: 'auto',
				        right: 'auto'
					};
					break;
				case 'bottomCenter':
					this.dealPos = {
						top: 'auto',
				        left: 'auto',
				        bottom: '0',
				        right: 'auto'
					};
					break;
				case 'bottomLeft':
					this.dealPos = {
						top: 'auto',
				        left: '0',
				        bottom: '0',
				        right: 'auto'
					};
					break;
				default:
					this.dealPos = {
						top: 'auto',
				        left: 'auto',
				        bottom: '0',
				        right: '0'
					};
					break;
			}
		},
    	initEchart(){
			var myChart = this.$echarts.init(document.getElementById('echart-box'));
			var param = this.visualParam;
			var echartData = this.echartData;
			this.dealLegendPos();
			myChart.clear();
			var option = {
				title: {
					text: param.echarttitle,
				},
				legend: {
					show: param.legendShow,
					orient: param.legendOrient, //图例水平或者垂直
					left: this.dealPos.left,
					top: this.dealPos.top,
					bottom: this.dealPos.bottom,
					right: this.dealPos.right,
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
			        type: 'line',
			        smooth: true
			    }]
			};
			myChart.setOption(option);
		},
		requestData(){
			var url = '/api/show/visualize';
			this.$axios.post(url,{
	            integerId: this.vid,
	        }).then((res) => {
	        	var data = res.data;
	        	this.visualParam = JSON.parse(JSON.stringify(data));
	        }).catch((err) => {
	            this.$message({
	                type: 'error',
	                message: '网络错误，请重试',
	                showClose: true
	            })
	        });
	        var url1 = '/api/show/visualizeData';
	        this.$axios.post(url1,{
	            integerId: this.vid,
	        }).then((res) => {
	        	var data = res.data;
	        	this.echartData = JSON.parse(JSON.stringify(data));
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
		},
		save(){
			var url = '/api/show/visualize?vid='+this.vid;
			this.$axios.put(url,this.visualParam
	        ).then((res) => {
	        	if(res.data.code == 1){
	        		this.$message({
		                type: 'success',
		                message: '保存成功！',
		                showClose: true
		            })
		            this.$router.push({
				        path: '/visualizeList'
				    })
	        	}else{
	        		this.$message({
		                type: 'error',
		                message: '网络错误，请重试',
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
		reset(){
			this.$router.push({
		        path: '/visualizeList'
		    })
		}
    },
    mounted(){
    	var _this = this;
    	this.requestData();
    	setTimeout(function(){
			_this.initEchart();
    	},1000);
		console.log(this.businessCats);
    }
}
</script>

<style lang="scss" scoped>
  @import './line';
</style>

