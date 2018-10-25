<template>
  <div>
   		<nav>
			<span class="logo">Dashboard</span>
			<ul>
				<li :style="{background: showItem == 'visualize' ? '#0079A5' : '#005571'}">
          <i class="icon iconfont db--zhexiantu"></i>
          <router-link :to="{path:'/visualizeList'}" >视图</router-link>
				</li>
        <li :style="{background: showItem == 'dashboard' ? '#0079A5' : '#005571'}">
          <i class="icon iconfont db--dashboard"></i>
          <router-link :to="{path:'/dashboardList'}" >仪表板</router-link>
        </li>
				<li :style="{background: showItem == 'model' ? '#0079A5' : '#005571'}">
          <i class="icon iconfont db--view-dashboard"></i>
          <router-link :to="{path:'/dashboardList'}" >模块</router-link>
				</li>
			</ul>
		</nav>
  </div>
</template>

<script>
export default {
  	name: 'nav',
 	  data(){
   		return {
        
    	}
    },
    props: ['showItem'],
    methods: {
    	
    },
    mounted(){
      console.log(this.showItem);
    }
}
</script>

<style lang="scss" scoped>
  @import './nav';
</style>

