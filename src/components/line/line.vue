<template>
  <div>
     <header>
     	<span>折线图设计</span>
		<el-button type="warning" size="small">保存</el-button>
		<el-button type="primary" size="small">编辑</el-button>
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
  	name: 'line',
 	data(){
   		return {
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
    	initEchart(){
			var myChart = this.$echarts.init(document.getElementById('echart-box'));
			myChart.clear();
			var param = this.lineParam;
			var option = {
				title: {
					text: param.title.text,
					textStyle: {
						color: param.title.textStyle.color,
						fontSize: param.title.textStyle.fontSize
					}
				},
				legend: {
					show: true,
					orient: 'horizontal', //图例水平或者垂直
					left: 'auto',
					top: 'auto',
					bottom: 'auto',
					right: 'auto',
			        data: ['邮件营销']
			    },
			    tooltip: {
	   				show: param.tooltip.show,
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
		},
		run(){
			this.initEchart();
		}
    },
    mounted(){

    }
}
</script>

<style lang="scss" scoped>
  @import './line';
</style>

