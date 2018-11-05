<template>
  <div class="nav">
   		<nav :style="{height: navH}">
			<span class="logo" @click="dashboard">Dashboard</span>
			<ul>
				<li :style="{background: showItem == 'visualize' ? '#0079A5' : '#005571'}">
          <i class="icon iconfont db--zhexiantu"></i>
          <router-link :to="{path:'/visualizeList'}" >视图</router-link>
				</li>
        <li :style="{background: showItem == 'dashboard' ? '#0079A5' : '#005571'}">
          <i class="icon iconfont db--dashboard"></i>
          <router-link :to="{path:'/dashboardList'}" >仪表板</router-link>
        </li>
				<!-- <li :style="{background: showItem == 'model' ? '#0079A5' : '#005571'}">
          <i class="icon iconfont db--view-dashboard"></i>
          <router-link :to="{path:'/model'}" >模块</router-link>
				</li>
        <li :style="{background: showItem == 'system' ? '#0079A5' : '#005571'}">
          <i class="icon iconfont db--view-dashboard"></i>
          <a href="javascript:;"  @click = "showMenu">系统管理</a>
          <ul v-show="secShow || showItem == 'user' || showItem == 'role'">
            <li :style="{background: showItem == 'user' ? '#0079A5' : '#005571'}">
              <router-link :to="{path:'/user'}" >用户管理</router-link>
            </li>
            <li :style="{background: showItem == 'role' ? '#0079A5' : '#005571'}">
              <router-link :to="{path:'/role'}" >角色管理</router-link>
            </li>
          </ul>
        </li> -->
			</ul>
		</nav>
  </div>
</template>

<script>
export default {
  	name: 'nav',
 	  data(){
   		return {
        secShow: false,
        navH : 600
    	}
    },
    props: ['showItem'],
    methods: {
    	showMenu(){
        this.secShow = !this.secShow;
        this.showItem = 'system';
      },
      dashboard(){
        this.$router.replace('/visualizeList');
      }
    },
    mounted(){
      $(".nav").height($(window).height());
    }
}
</script>

<style lang="scss" scoped>
  @import './nav';
</style>

