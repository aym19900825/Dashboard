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
										<el-option label="文本图" value="text"></el-option>
										<el-option label="数值图" value="number"></el-option>
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
						</div>
					</div>
					<div class="tab-content-two" v-show="tabIndex == 1">
						<div class="panl-setting">
							<el-form ref="option-set" :model="visualParam" label-width="80px">
								<div class="x-axios">
									<h5>文本内容</h5>
									<el-form-item label="文本内容">
								   		<el-input v-model="visualParam.vwheredesc"></el-input>
								 	</el-form-item>
								 	<el-form-item label="文本位置">
								    	<el-select v-model="visualParam.legendPos" placeholder="请选择文本位置">
									    	<el-option
										      v-for="item in legendPos"
										      :key="item.value"
										      :label="item.txt"
										      :value="item.value">
										    </el-option>
								    	</el-select>
								    </el-form-item>
									<el-form-item label="前缀">
								   		<el-input v-model="visualParam.prefixwhere"></el-input>
								 	</el-form-item>
									 <el-form-item label="后缀">
								   		<el-input v-model="visualParam.suffixwhere"></el-input>
								 	</el-form-item>
							    </div>
							</el-form>
						</div>
					</div>
				</div>
			</div>
			<div class="right">
				<div id="echart-box">
					<div class="txtPos" :style="{transform: 'translateY('+textPos+')',textAlign: txtalign}">
						<h5 style="font-size: 30px;" v-text="show.countValue"></h5>
						<span v-text="show.prefixwhere"></span>
						<span v-text="show.vwheredesc" style="font-size: 24px;font-weight: bold;"></span>
						<span v-text="show.suffixwhere"></span>
						<span class="clearfix"></span>
					</div>
				</div>
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
			textPos: '',
			txtalign: '',
   			legendPos: [
				{
					txt: '上右',
   					value: 'topRight'
   				}, {
					txt: '上中',
   					value: 'topCenter'
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
   				},{
					txt: '居中',
   					value: 'centerCenter'
   				}
   			],

      		visualParam: {},
      		dealPos: {
      			top: 'auto',
      			left: 'auto',
      			right: 'auto',
      			bottom: 'auto',
      		},

      		colors: ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],

      		colForm: false,
			show: {
				'vwheredesc': '',
				'prefixwhere': '',
				'suffixwhere': '',
				'countValue': ''
			}
    	}
    },
    methods: {
		valdateSql(){
			var url = this.basic_url + '/show/sqlCountValid';
			this.$axios.post(url,{
				vid: this.vid,
				vwhere: this.visualParam.vwhere,
				dbid: this.visualParam.dbid
	        }).then((res) => {
				if(res.data.message.indexOf('不')==-1){
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
		dealLegendPos(data){
			switch(data){
				case 'topCenter':
					this.textPos = '-300%';
					this.txtalign = 'center';
					break;
				case 'topRight':
					this.textPos = '-300%';
					this.txtalign = 'right';
					break;
				case 'topLeft':
					this.textPos = '-300%';
					this.txtalign = 'left';
					break;
				case 'bottomCenter':
					this.textPos = '200%';
					this.txtalign = 'center';
					break;
				case 'bottomLeft':
					this.textPos = '200%';
					this.txtalign = 'left';
					break;
				case 'centerCenter':
					this.textPos = '-50%';
					this.txtalign = 'center';
					break;
				default:
					this.textPos = '200%';
					this.txtalign = 'right';
					break;
			}
		},
    	initEchart(){
			this.show.vwheredesc = this.visualParam.vwheredesc;
			this.show.prefixwhere = this.visualParam.prefixwhere;
			this.show.suffixwhere = this.visualParam.suffixwhere;
			this.show.countValue = this.echartData.countValue;
			this.dealLegendPos(this.visualParam.legendPos);
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
			var obj = {
				'visualize': this.visualParam,
			};
			this.$axios.put(url,obj
	        ).then((res) => {
	        	if(res.data.code == 1){
	        		this.$message({
						type: 'success',
						message: '保存成功！',
						showClose: true
					});
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
    mounted(){
    	var _this = this;
    	this.requestData();
    	$(".tab-content").height($(window).height()-120);
    	$(".right").height($(window).height()-50);
    	// $("#echart-box").height($(window).height()-50);
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

