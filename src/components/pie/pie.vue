<template>
  <div>
     <header>
     	<span>{{visualParam.visualizename}}</span>
		<el-button type="warning" size="small" @click="reset" v-if="!bid">取消</el-button>
		<el-button type="info" size="small" v-if="bid" @click="returnDb">返回Dashboard</el-button>
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
						        <el-form-item label="描述">
						          <el-input v-model="visualParam.visualizedescription"></el-input>
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
						        <el-form-item label="菜单编组">
						          <el-select v-model="visualParam.businesscategory" filterable allow-create default-first-option
						            placeholder="请选择或输入菜单编组">
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
							 	<el-form-item label="标题位置" v-show="visualParam.echarttitle">
							 		<el-select v-model="visualParam.echartTitPos" placeholder="请选择标题位置">
								    	<el-option
									      v-for="item in legendPos"
									      :key="item.value"
									      :label="item.txt"
									      :value="item.value">
									    </el-option>
							    	</el-select>
							 	</el-form-item>
							 	<el-form-item label="标题颜色" v-show="visualParam.echarttitle" >
							 		<!-- <el-input v-model="visualParam.echartTitColor"></el-input> -->
							 		<el-input v-model="echartTitColor"  @focus="colorSet1 = !colorSet1;"></el-input>
							   		<photoshop-picker v-model="echartTitColor" v-show="colorSet1" @input="updateTitColor"/>
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
							    <el-form-item label="表盘颜色">
							    	<!-- <el-input v-model="visualParam.background"></el-input> -->
							    	<el-input v-model="background" @focus="colorSet = !colorSet;"></el-input>
						            <photoshop-picker v-model="background" v-show="colorSet" @input="updateBgColor"/>
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
import { Chrome } from 'vue-color'
export default {
  	name: 'bar',
  	props: ['vid','businessCats','bid'],
 	data(){
   		return {
   			colorSet: false,
   			colorSet1: false,
   			//设置颜色
   			echartTitColor: '#194d33',
   			background: '#194d33',

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
    	returnDb(){
    	    this.$router.push({
	        	path: '/dashboardEdit', 
	        	query: { 
	        	  bid: this.bid,
	        	  businesscategorys: this.businessCats
	        	}
	        })
    	},
    	updateTitColor(value){
    		// this.visualParam.echartTitColor = value.hex;
    		this.echartTitColor = value.hex;
    	},
    	updateBgColor(value){
    		// this.visualParam.background = value.hex;
    		this.background = value.hex;
    	},
    	tabSwitch(index){
			this.tabIndex = index;
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
    	initEchart(echartId){
    		console.log($('echart-box').width());
	        var myChart = this.$echarts.init(document.getElementById('echart-box'));
			var param = this.visualParam;
			var echartData = this.echartData;
			this.dealPos = this.dealLegendPos(this.visualParam.legendPos,'legendPos');
			this.dealTitPos = this.dealLegendPos(this.visualParam.echartTitPos,'titPos');
			myChart.clear();
	        var option = {
	          	backgroundColor: this.background,
				title: {
					text: param.echarttitle,
					left: this.dealTitPos.left,
					top: this.dealTitPos.top,
					bottom: this.dealTitPos.bottom,
					right: this.dealTitPos.right,
					textStyle: {
						color: this.echartTitColor
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
					left: this.dealPos.left,
					top: this.dealPos.top,
					bottom: this.dealPos.bottom,
					right: this.dealPos.right,
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
	    },
		requestData(){
			var url = '/api/show/visualize';
			this.$axios.post(url,{
	            integerId: this.vid,
	        }).then((res) => {
	        	var data = res.data;
	        	this.background = res.data.background || '#FFFFFF';
	        	this.echartTitColor = res.data.echartTitColor || '#000000';
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
			this.visualParam.background = this.background;
			this.visualParam.echartTitColor = this.echartTitColor;

			this.$axios.put(url,this.visualParam
	        ).then((res) => {
	        	if(res.data.code == 1){
	        		this.$message({
		                type: 'success',
		                message: '保存成功！',
		                showClose: true
		            })
		            if(!this.bid){
		            	this.$router.push({
					        path: '/visualizeList'
					    })
		            }
		            
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
    components: {
   		'photoshop-picker': Chrome
 	},
    mounted(){
    	var _this = this;
    	this.requestData();
    	setTimeout(function(){
			_this.initEchart();
    	},1000);
    	window.onresize = function() {
    		setTimeout(function(){
				_this.initEchart();
	    	},500);
	    }
    }
}
</script>

<style lang="scss" scoped>
  @import '../line/line';
</style>

