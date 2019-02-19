<template>
  <div>
     <header>
     	<span>{{visualParam.visualizename}}</span>
     	<el-button type="info" size="small" @click="returnVisual">返回视图列表</el-button>
		<el-button type="warning" size="small" v-if="!bid" @click="reset">取消</el-button>
		<el-button type="info" size="small" v-if="bid" @click="returnDb">返回Dashboard</el-button>
		<el-button type="primary" size="small" style="margin-right: 0px;" @click="save">保存</el-button>
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
							<el-form ref="option-set" :model="columnList" label-width="80px">
								<h5>数据列设置
									<el-button size="mini" type="primary" style="float: right;" @click="addcol">+</el-button>
								</h5>
							  	<div class="y-axios column-set" v-for="(colData, index) in columnList" style="position:relative;padding-top: 25px;">
							  		<i class="data-show icon iconfont db--close" @click="closeCol(index,colData)"></i>
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
							        <el-form-item label="数据颜色">
							   		    <el-input v-model="colData.colColor"></el-input>
							   		    <el-color-picker v-model="colData.colColor" size="medium"></el-color-picker>
							        </el-form-item>
							        <el-form-item label="数据说明">
							          <el-input v-model="colData.colName"></el-input>
							        </el-form-item>
							        <el-form-item label="数据宽度">
							          <el-input v-model="colData.colWidth"></el-input>
							        </el-form-item>
							        <el-form-item label="曲线平滑">
							          <el-switch v-model="colData.colSmooth"></el-switch>
							        </el-form-item>
							        <el-form-item label="曲线阶梯">
							        <el-select v-model="colData.colstep" filterable allow-create default-first-option>
							            <el-option
							              v-for="it in colsteps"
							              :label="it.text"
							              :value="it.value"
							              :key="it.value">
							            </el-option>
							          </el-select>
							        </el-form-item>
							        <el-form-item label="数据面积">
							          <el-switch v-model="colData.colAreaStyle"></el-switch>
							        </el-form-item>
							         <el-form-item label="面积颜色" v-show="colData.colAreaStyle">
							   		    <el-input v-model="colData.colAreaColor"></el-input>
							   		    <el-color-picker v-model="colData.colAreaColor" size="medium"></el-color-picker>
							        </el-form-item>
							        <el-form-item label="堆叠数据">
							          <el-input v-model="colData.colStack"></el-input>
							        </el-form-item>
							        <el-form-item label="lable">
								        <el-switch v-model="colData.colLabel"></el-switch>
							        </el-form-item>
							        <el-form-item label="lable位置" v-show="colData.colLabel">
							          <el-select v-model="colData.colLabelPos" filterable allow-create default-first-option>
							            <el-option
							              v-for="it in labelPos"
							              :label="it.txt"
							              :value="it.value"
							              :key="it.value">
							            </el-option>
							          </el-select>
							        </el-form-item>
							        <el-form-item label="最大值">
							          <el-switch v-model="colData.colMax"></el-switch>
							        </el-form-item>
							        <el-form-item label="最小值">
							          <el-switch v-model="colData.colMin"></el-switch>
							        </el-form-item>
							        <el-form-item label="平均值">
							          <el-switch v-model="colData.colAverage"></el-switch>
							        </el-form-item>
							        <el-form-item label="类型">
							          <el-select v-model="colData.colType" placeholder="请选择数据类型" width="100%">
							            <el-option label="折线图" value="line"></el-option>
							            <el-option label="柱状图" value="bar"></el-option>
							          </el-select>
							        </el-form-item>
									<el-form-item label="对应Y轴">
							          <el-input v-model="colData.colYIndex"></el-input>
							        </el-form-item>
								</div>
							</el-form>
						</div>
					</div>
					<div class="tab-content-two" v-show="tabIndex == 1">
						<div class="panl-setting">
							<el-form ref="option-set" :model="visualParam" label-width="80px">
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
							    </div>
							    <div class="x-axios">
								    <h5>其他设置</h5>
								    <el-form-item label="显示提示">
								    	<el-switch v-model="visualParam.tooltipShow"></el-switch>
								    </el-form-item>
								    <el-form-item label="区域组件">
								    	<el-switch v-model="visualParam.dataZoom"></el-switch>
								    </el-form-item>
								    <el-form-item label="表盘颜色">
								    	<el-input v-model="visualParam.background"></el-input>
								    	<el-color-picker v-model="visualParam.background" size="medium"></el-color-picker>
							        </el-form-item>
						        </div>
						        <div class="x-axios">
							        <h5>x轴设置</h5>
						        	<el-form-item label="x轴标注">
							          	<el-input v-model="visualParam.xname"></el-input>
							        </el-form-item>
							        <el-form-item label="x轴单位">
							          	<el-input v-model="visualParam.xAxisLabel"></el-input>
							        </el-form-item>
							        <el-form-item label="轴线">
							          	<el-switch v-model="visualParam.xAxisLine"></el-switch>
							        </el-form-item>
							        <el-form-item label="分割线">
							          	<el-switch v-model="visualParam.xSplitLine"></el-switch>
							        </el-form-item>
							        <el-form-item label="坐标留白">
							           <el-switch v-model="visualParam.xBoundaryGap"></el-switch>
							        </el-form-item>
									<el-form-item label="轴线居中">
										<el-switch v-model="visualParam.alignWithLabel"></el-switch>
							        </el-form-item>
							         <el-form-item label="X->Y" v-show="orientYList.length==1">
							          	<el-switch v-model="visualParam.xToy"></el-switch>
							        </el-form-item>
						        </div>
							</el-form>
							<el-form ref="option-set" :model="orientYList" label-width="80px">
								<div>
						        	<h5>Y轴设置
										<el-button size="mini" type="primary" style="float: right;" @click="addYSet">+</el-button>
						        	</h5>

						        	<div class="y-axios column-set y-set" style="position:relative;padding-top: 25px;" v-for="(yItem, index) in orientYList">
						        		<i class="data-show icon iconfont db--close" @click="closeSet(index,yItem)"></i>
						        		<el-form-item label="y轴标注">
								          <el-input v-model="yItem.yname"></el-input>
								          <i class="data-show icon iconfont db--right" @click="showSet($event)"></i>
								          
								        </el-form-item>
								        <el-form-item label="y轴单位">
								          <el-input v-model="yItem.yAxisLabel"></el-input>
								        </el-form-item>
								        <el-form-item label="y轴类型">
										    <el-select v-model="yItem.ytypes" placeholder="y轴类型">
										    	<el-option
											      v-for="item in ytypes"
											      :key="item.value"
											      :label="item.text"
											      :value="item.value">
											    </el-option>
											</el-select>
										</el-form-item>
								        <el-form-item label="轴线">
								          <el-switch v-model="yItem.yAxisLine"></el-switch>
								        </el-form-item>
								        <el-form-item label="分隔线">
								          <el-switch v-model="yItem.ySplitLine"></el-switch>
								        </el-form-item>
								        <el-form-item label="翻转">
									       <el-switch v-model="yItem.yInverse"></el-switch>
								        </el-form-item>
						        	</div>
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
		<el-dialog title="新增数据列" :visible.sync="colForm" width="560px" :before-close="resetNewCol">
	        <div class="y-axios column-set" style="position:relative; height: 50px; border-bottom: none;">
	        	<el-form label-position="right" label-width="120px" :model="colData">
			        <el-form-item label="数据列">
			          <el-select v-model="colData.field" filterable allow-create default-first-option>
			            <el-option
			              v-for="it in colDatas"
			              :label="it.field"
			              :value="it.field"
			              :key="it.field">
			            </el-option>
			          </el-select>
			        </el-form-item>
			    </el-form>
			</div>
	        <div slot="footer" class="dialog-footer">
	        	<el-button @click="resetNewCol">取 消</el-button>
	        	<el-button type="primary" @click="saveAddCol">确 定</el-button>
	        </div>
	    </el-dialog>
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

   			labelPos: [
   				{
   					txt: '顶部',
   					value: 'top'
   				},
   				{
   					txt: '左侧',
   					value: 'left'
   				},
   				{
   					txt: '右侧',
   					value: 'right'
   				},
   				{
   					txt: '底部',
   					value: 'bottom'
   				},
   				{
   					txt: '内部',
   					value: 'inside'
   				},
   				{
   					txt: '内部左侧',
   					value: 'insideLeft'
   				},
   				{
   					txt: '内部右侧',
   					value: 'insideRight'
   				},
   				{
   					txt: '内部底部',
   					value: 'insideBottom'
   				},
   				{
   					txt: '内部左上方',
   					value: 'insideTopLeft'
   				},
   				{
   					txt: '内部左下方',
   					value: 'insideBottomLeft'
   				},
   				{
   					txt: '内部右上方',
   					value: 'insideTopRight'
   				},
   				{
   					txt: '内部右下方',
   					value: 'insideBottomRight'
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

      		columnList: [],
      		colstacks:[],
      		orientYList: [],
      		yDeleteList: [],
      		colors: ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
      		colsteps: [
      			{
					text: '不显示',
      				value: false
      			},
      			{
      				text: '当前点',
      				value: 'start'
      			},
      			{
      				text: '中间点',
      				value: 'middle'
      			},
      			{
      				text: '拐弯点',
      				value: 'end'
      			},
      		],
      		ytypes: [
      			{
      				text: '数值轴',
      				value: 'value'
      			},
      			{
      				text: '类目轴',
      				value: 'category'
      			},
      			{
      				text: 'time',
      				value: '时间轴'
      			},
      			{
      				text: '对数轴',
      				value: 'log'
      			},
      		],

      		colForm: false,
			colData: {
				'field': '',
				'colColor': '',	
				'colName': '',
				'colWidth': '',
				'colSmooth': true,
				'colstep': '',
				'colAreaStyle': false,
				'colAreaColor': '',
				'colStack': '',
				'colLabel': false,
				'colLabelPos': '',
				'colMax': false,
				'colMin': false,
				'colAverage': false,
				'colType': 'line',
				'colYIndex': 0,
			},
			colDatas: [],
			deleteColumnList: []
    	}
    },
    methods: {
		valdateSql(){
			var url = this.basic_url + '/show/sqlValid';
			this.$axios.post(url,{
				vid: this.vid,
				vwhere: this.visualParam.vwhere,
				dbid: this.visualParam.dbid
	        }).then((res) => {
				if(res.data.message.indexOf('不')==-1){
					this.$message({
						type: 'success',
						message: res.data.message,
						showClose: true
					});
					this.save();
				}else{
					this.$message({
						type: 'error',
						message: res.data.message,
						showClose: true
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
    	closeCol(index,colData){
    		if(this.columnList.length == 1){
    			this.$message({
		            message: '数据列不可为空',
		            type: 'warning'
		        });
    		}else{
    			this.$confirm('确认将删除此数据列设置吗？删除后视图设置会自动保存', '提示', {
		            confirmButtonText: '确定',
		            cancelButtonText: '取消',
		            type: 'warning'
		        }).then(() => {
		        	this.columnList.splice(index,1);
		        	if(colData.columnmid){
		    			this.deleteColumnList.push(colData.columnmid);
		    		}
		    		this.save('del');
		        }).catch(() => {});
    		}
    	},
    	saveAddCol(){
    		this.$confirm('确认将添加此数据列设置吗？添加后视图设置会自动保存', '提示', {
	            confirmButtonText: '确定',
	            cancelButtonText: '取消',
	            type: 'warning'
	        }).then(() => {
	        	for(var i=0; i<this.colDatas.length; i++){
	    			if(this.colDatas[i].field == this.colData.field){
	    				this.colData.type = this.colDatas[i].type;
	    			}
	    		}
	    		this.columnList.push(JSON.parse(JSON.stringify(this.colData)));
	    		this.resetNewCol();
	    		this.save();
	        }).catch(() => {});
    	},
    	resetNewCol(){
    		this.colData = {
				'field': '',
				'colColor': '',	
				'colName': '',
				'colWidth': '',
				'colSmooth': true,
				'colstep': '',
				'colAreaStyle': false,
				'colAreaColor': '',
				'colStack': '',
				'colLabel': false,
				'colLabelPos': '',
				'colMax': false,
				'colMin': false,
				'colAverage': false,
				'colType': 'line',
				'colYIndex': 0,
			};
			this.colForm = false;
    	},
    	addcol(){
    		this.colForm = true;
    		this.getCols();
    	},
    	getCols(){
    		var url = this.basic_url + '/show/columnList?tablename=' + this.visualParam.sourcetablename +'&dbid='+ this.visualParam.dbid +'&vid=' + this.visualParam.vid;
    		this.$axios.get(url, {}).then((res) => {
	        	this.colDatas = res.data;
	        }).catch((err) => {
	            this.$message({
	                type: 'error',
	                message: '网络错误，请重试',
	                showClose: true
	            })
	        })
    	},
    	closeSet(index, yItem){
    		if(index==0){
    			this.$message({
		            message: '此y轴不可删除',
		            type: 'error'
		        });
    		}else{
    			this.$confirm('确定删除此Y轴设置吗?', '提示', {
			        confirmButtonText: '确定',
			        cancelButtonText: '取消',
			        type: 'warning'
			    }).then(() => {
			        if(yItem.orientyid){
						this.yDeleteList.push(yItem.orientyid);
	    			}
	    			this.orientYList.splice(index,1);
			    }).catch(() => {})
    		}
    	},
    	addYSet(){
    		var newObj = {
    			yAxisLabel:  '',
        		yAxisLine: true,
        		yInverse: false,
        		ySplitLine: false,
        		yaxisLabelPos: '',
        		ylineColor: '',
        		yname: '',
        		ytype: 'value'
    		};
    		this.orientYList.push(newObj);
    	},
    	showYSet(e){
    		var h = $(e.target).parents(".y-axios").height();
    		if(h != 960){
				$(e.target).parents(".y-axios").height("960");
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
    	initEchart(){
			var myChart = this.$echarts.init(document.getElementById('echart-box'));
			var param = this.visualParam;
			var echartData = this.echartData;
			this.dealPos = this.dealLegendPos(this.visualParam.legendPos,'legendPos');
			this.dealTitPos = this.dealLegendPos(this.visualParam.echartTitPos,'titPos');
			this.dealLegendPos();
			var seriesData = [];
			var colSets = this.columnList;
			var lengdData = [];
			var colors = [];

			if(param.xToy){
				var xSet = {};
				var ySet = {};
				xSet = {
			    	name: this.orientYList[0].yname,
			        type: 'value',
			        splitLine: {show: this.orientYList[0].ySplitLine},
		            inverse: this.orientYList[0].yInverse,
		            axisLine: {
			            show: this.orientYList[0].yAxisLine
			        },
			        axisLabel: {
		                formatter: '{value}'+(!!this.orientYList[0].yAxisLabel&&this.orientYList[0].yAxisLabel!='null'?this.orientYList[0].yAxisLabel:'')
		            }
			    };
			    ySet = {
			    	name: param.xname,
			        type: 'category',
			        data: echartData.showKey,
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
			        data: echartData.showKey,
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
		            },
		            boundaryGap: param.xBoundaryGap
			    };
			    for(var k=0; k<this.orientYList.length; k++ ){
			    	var thisY = this.orientYList[k];
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
					type: !!colSets[i].colType ? colSets[i].colType : 'line',
					name: colSets[i].colName,
					label: {
						show: colSets[i].colLabel,
						position: colSets[i].colLabelPos
					},
					barWidth: colSets[i].colWidth,
					markPoint: {
						data: []
					},
					smooth: colSets[i].colSmooth,
					step: colSets[i].colstep
				};
				if(colSets[i].colYIndex&&colSets[i].colYIndex>this.orientYList.length-1){
					colSets[i].colYIndex = 0;
				}
				obj.yAxisIndex =  colSets[i].colYIndex;

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
			myChart.clear();
			var option = {
				backgroundColor: param.background,
				color: colors,
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
				legend: {
					show: param.legendShow,
					orient: param.legendOrient, //图例水平或者垂直
					left: this.dealPos.left,
					top: this.dealPos.top,
					bottom: this.dealPos.bottom,
					right: this.dealPos.right,
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
		},
		requestData(){
			var url = this.basic_url + '/show/visualize';
			this.$axios.post(url,{
	            integerId: this.vid,
	        }).then((res) => {
	        	var data = res.data;
	        	this.visualParam = JSON.parse(JSON.stringify(data));
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
		        	this.orientYList = data.orientYList;
		        	var obj = {
		        		yAxisLabel:  this.visualParam.yAxisLabel,
		        		yAxisLine: this.visualParam.yAxisLine,
		        		yInverse: this.visualParam.yInverse,
		        		ySplitLine: this.visualParam.ySplitLine,
		        		yaxisLabelPos: this.visualParam.yaxisLabelPos,
		        		ylineColor: this.visualParam.ylineColor,
		        		yname: this.visualParam.yname,
		        		ytype: this.visualParam.ytype
		        	};
		        	this.orientYList.unshift(obj);
		        	console.log(this.orientYList);
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
		save(opt){
			var url = this.basic_url + '/show/visualize?vid='+this.vid;
			this.visualParam.yname = this.orientYList[0].yname;
			this.visualParam.yAxisLabel = this.orientYList[0].yAxisLabel;
			this.visualParam.yAxisLine = this.orientYList[0].yAxisLine;
			this.visualParam.ySplitLine = this.orientYList[0].ySplitLine;
			this.visualParam.yInverse = this.orientYList[0].yInverse;
			this.orientYList.splice(0,1);
			var obj = {
				'columnMaps': this.columnList,
				'visualize': this.visualParam,
				'yList': this.orientYList,
				'yDeleteList': this.yDeleteList,
				'deleteColumnList': this.deleteColumnList
			};
			this.$axios.put(url,obj
	        ).then((res) => {
	        	if(res.data.code == 1){
	        		if(opt=='del'){
						this.$message({
			                type: 'success',
			                message: '删除成功！',
			                showClose: true
			            })
	        		}else{
	        			this.$message({
			                type: 'success',
			                message: '保存成功！',
			                showClose: true
			            })
	        		}
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
  @import './line';
</style>

