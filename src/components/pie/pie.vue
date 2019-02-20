<template>
  <div>
     <header>
     	<span>{{visualParam.visualizename}}</span>
     	<el-button type="info" size="small" @click="returnVisual">返回视图列表</el-button>
		<el-button type="warning" size="small" v-if="!bid" @click="reset">取消</el-button>
		<el-button type="info" size="small" v-if="bid" @click="returnDb">返回Dashboard</el-button>
		<el-button type="primary" size="small" @click="save" style="margin-right: 0px;">保存</el-button>
     </header>
		<div id="content">
			<div class="left">
				<h4>{{visualParam.tablename}}</h4>
				<ul class="tab-list">
					<li @click="tabSwitch(0)" :class=" tabIndex == 0 ? 'selected' : '' ">数据设置</li>
					<li @click="tabSwitch(1)" :class=" tabIndex == 1 ? 'selected' : '' ">样式设置</li>
					<span class="run" @click="run"></span>
				</ul>
				<div class="tab-content">
					<div class="tab-content-one" v-show="tabIndex == 0">
						<div class="metrics">
							<el-form ref="option-set" :model="visualParam" label-width="100px">
								<div class="visilize-info">
									<h5>视图信息</h5>
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
									<el-form-item label="sql语句">
							            <el-input v-model="visualParam.vwhere">
											<el-button slot="append" icon="el-icon-setting" @click="valdateSql"></el-button>
										</el-input>
							        </el-form-item>
								</div>
							</el-form>
							<el-form ref="option-set" :model="columnList" label-width="100px">
								<h5>数据列设置</h5>
							  	<div class="y-axios column-set" v-for="colData in columnList" style="position:relative; padding-top:20px; height: 80px; border-bottom: none;">
							        <el-form-item label="数据列">
							          <el-select v-model="colData.field" filterable allow-create default-first-option disabled>
							            <el-option
							              v-for="it in businessCats"
							              :label="it"
							              :value="it"
							              :key="it">
							            </el-option>
							          </el-select>
							          <i class="data-show icon iconfont db--right" @click="showYSet($event)"></i>
							        </el-form-item>
							        <el-form-item label="数据说明">
								        <el-input v-model="colData.colName"></el-input>
							        </el-form-item>
							        <el-form-item label="图形">
							          <el-select v-model="colData.colRadius" filterable allow-create default-first-option>
							            <el-option
							              v-for="it in colRadius"
							              :label="it.text"
							              :value="it.value"
							              :key="it.value">
							            </el-option>
							          </el-select>
							        </el-form-item>
							        <el-form-item label="label">
								        <el-switch v-model="colData.colLabel"></el-switch>
							        </el-form-item>
							        <el-form-item label="label位置" v-show="colData.colLabel">
							          <el-select v-model="colData.colLabelPos" filterable allow-create default-first-option>
							            <el-option
							              v-for="it in labelPos"
							              :label="it.txt"
							              :value="it.value"
							              :key="it.value">
							            </el-option>
							          </el-select>
							        </el-form-item>
							        <!-- <el-form-item label="label线">
								        <el-switch v-model="colData.colLabelline"></el-switch>
							        </el-form-item> -->
							        <el-form-item label="南丁格尔图">
								        <el-switch v-model="colData.colRoseType"></el-switch>
							        </el-form-item>
								</div>
							</el-form>
						</div>
					</div>
					<div class="tab-content-two" v-show="tabIndex == 1">
						<div class="panl-setting">
							<el-form ref="option-set" :model="visualParam" label-width="100px">
							  	<div class="y-axios" style="padding-top: 0px; border-bottom: 0px;">
								  	<h5>标题设置</h5>
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
								 		<el-input v-model="visualParam.echartTitColor"></el-input>
								 		<el-color-picker v-model="visualParam.echartTitColor" size="medium"></el-color-picker>
								 	</el-form-item>
								</div>
								<div class="x-axios">
									<h5>图例设置</h5>
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
								    <el-form-item label="图例类型">
								    	<el-select v-model="visualParam.legendType" placeholder="请选择图例布局">
									    	<el-option
										      v-for="item in legendType"
										      :key="item.value"
										      :label="item.txt"
										      :value="item.value">
										    </el-option>
								    	</el-select>
								    </el-form-item>
								    <el-form-item label="展示图例">
								    	<el-checkbox-group v-model="legendSel">
									    <el-checkbox v-for="item in legendData" :label="item" :key="item">{{item}}</el-checkbox>
									  </el-checkbox-group>
								    </el-form-item>
							    </div>
							    <div class="x-axios">
								    <h5>其他设置</h5>
								    <el-form-item label="显示提示">
								    	<el-switch v-model="visualParam.tooltipShow"></el-switch>
								    </el-form-item>
								    <el-form-item label="表盘颜色">
								    	<el-input v-model="visualParam.background"></el-input>
								    	<el-color-picker v-model="visualParam.background" size="medium"></el-color-picker>
							        </el-form-item>
						        </div>
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
import Config from '../../config.js'
export default {
  	name: 'bar',
  	props: ['vid','businessCats','bid'],
 	data(){
   		return {
   			basic_url: Config.dev_url,
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
			legendType: [
				{
   					txt: '普通图例',
   					value: 'plain'
   				},
   				{
   					txt: '翻页图例',
   					value: 'scroll'
   				}
			],
   			labelPos: [
   				{
   					txt: '外侧',
   					value: 'outside'
   				},
   				{
   					txt: '内部',
   					value: 'inside'
   				},
   				{
   					txt: '中心',
   					value: 'center'
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

      		colRadius: [
      			{
      				text: '饼状图',
      				value: '0%,50%'
      			},
      			{
      				text: '环形图',
      				value: '50%,70%'
      			}
      		],

      		columnList: [],
      		colstacks:[],
      		colors: ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
      		legendSel: [],
      		legendData: []
    	}
    },
    methods: {
		valdateSql(){
			var url = this.basic_url + '/show/sqlValid';
			this.$axios.post(url,{
				'visualize': {
					'vid': this.vid,
					'vwhere': this.visualizename.vwhere
				}
	        }).then((res) => {
				if(res.data.code==1){
					this.$message({
						type: 'success',
						message: res.data.message,
					});
					this.save();
				}else{
					this.$message({
						type: 'error',
						message: res.data.message,
					})
				}
	        }).catch((err) => {
	            this.$message({
	                type: 'error',
	                message: '网络错误，请重试',
	                showClose: true
	            })
			});
		},
    	returnVisual(){
    		this.$router.push({
	        	path: '/visualizeList', 
	        })
    	},
    	showYSet(e){
    		var h = $(e.target).parents(".y-axios").height();
    		if(h != 400){
				$(e.target).parents(".y-axios").height("400");
				$(e.target).parents(".y-axios").find(".db--right").removeClass("db--right").addClass("db--down");
    		}else{
	    		$(e.target).parents(".y-axios").height("60");
	    		$(e.target).parents(".y-axios").find(".db--down").removeClass("db--down").addClass("db--right");
    		}
    	},
    	showSet(e){
			var h = $(e.target).parents(".y-axios").height();
    		if(h != 320){
				$(e.target).parents(".y-axios").height("320");
				$(e.target).parents(".y-axios").find(".db--right").removeClass("db--right").addClass("db--down");
    		}else{
	    		$(e.target).parents(".y-axios").height("60");
	    		$(e.target).parents(".y-axios").find(".db--down").removeClass("db--down").addClass("db--right");
    		}
    	},
    	returnDb(){
    	    this.$router.push({
	        	path: '/dashboardEdit', 
	        	query: { 
	        	  bid: this.bid,
	        	  businesscategorys: this.businessCats
	        	}
	        })
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
	        var myChart = this.$echarts.init(document.getElementById('echart-box'));
			var param = this.visualParam;
			var echartData = this.echartData;
			this.dealPos = this.dealLegendPos(this.visualParam.legendPos,'legendPos');
			this.dealTitPos = this.dealLegendPos(this.visualParam.echartTitPos,'titPos');
			myChart.clear();
	        var seriesData = [];
	        var legendData = this.legendData;
	        var legendSelO = this.legendSel;

	        var legendSel = {};
	        for(var i=0; i<echartData.showValue[0].length; i++){
	        	var colObj = this.columnList[i];
	        	var radius = !!colObj.colRadius ? colObj.colRadius.split(',') : ['0%','50%'];
	        	var len = this.columnList.length;
	        	var center = [];
	        	if(len==1){
					center = ['50%', '50%'];
	        	}else{
	        		if(i==0){
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

	        console.log(seriesData);

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
					left: this.dealTitPos.left,
					top: this.dealTitPos.top,
					bottom: this.dealTitPos.bottom,
					right: this.dealTitPos.right,
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
					left: this.dealPos.left,
					top: this.dealPos.top,
					bottom: this.dealPos.bottom,
					right: this.dealPos.right,
			        data: legendData,
			        selected: legendSel
			    },

			    series: seriesData
	        };
	        myChart.setOption(option);
	        myChart.resize();
	    },
		requestData(){
			var url = this.basic_url + '/show/visualize';
			this.$axios.post(url,{
	            integerId: this.vid,
	        }).then((res) => {
	        	var data = res.data;
	        	this.visualParam = JSON.parse(JSON.stringify(data));
				this.legendSel = !!data.legendSelData && data.legendSelData!='' ? data.legendSelData.split(',') : [];

	        	var url1 = this.basic_url + '/show/visualizeData';
		        this.$axios.post(url1,{
		            integerId: this.vid,
		        }).then((res) => {
		        	var data = res.data;
		        	this.echartData = JSON.parse(JSON.stringify(data));
		        	for(var i=0; i<data.columnList.length;i++){
		        		if(data.columnList[i].colLabel=='true'){
		        			data.columnList[i].colLabel = true;
		        		}else{
							data.columnList[i].colLabel = false;
		        		}
		        	}
		        	this.columnList = data.columnList;
		        	this.visualParam.columnList = this.columnList;
		        }).catch((err) => {
		            this.$message({
		                type: 'error',
		                message: '网络错误，请重试',
		                showClose: true
		            })
		        })
	        }).catch((err) => {
	            this.$message({
	                type: 'error',
	                message: '网络错误，请重试',
	                showClose: true
	            })
	        });
		},
		run(){
			this.initEchart();
		},
		save(){
			var url = this.basic_url + '/show/visualize?vid='+this.vid;
			this.visualParam.legendSelData = this.legendSel.join(',');
			var obj = {
				'columnMaps': this.columnList,
				'visualize': this.visualParam
			};
			this.$axios.put(url,obj
	        ).then((res) => {
	        	if(res.data.code == 1){
	        		this.$message({
		                type: 'success',
		                message: '保存成功！',
		                showClose: true
		            })
		            // if(!this.bid){
		            // 	this.$router.push({
					//         path: '/visualizeList'
					//     })
					// }
					this.$router.go(0);
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
    	$(".tab-content").height($(window).height()-120);
    	$(".right").height($(window).height()-50);
    	$("#echart-box").height($(window).height()-50);
    	setTimeout(function(){
			_this.initEchart();
    	},1000);
    	window.onresize = function() {
	        _this.initEchart();
	    }
    }
}
</script>

<style lang="scss" scoped>
  @import '../line/line';
</style>

