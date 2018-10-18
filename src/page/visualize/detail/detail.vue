<template>
  <div class="detail">
    <v-nav></v-nav>
    <div class="detail-content">
       <p>类型选择</p>
        <ul>
          <li>
            <div @click="lineRouter">
              <i class="icon iconfont db--icon-line-graph"></i>
              <span>折线图</span>
            </div>
          </li>
          <li>
            <div @click="barRouter">
              <i class="icon iconfont db--icon-bar"></i>
              <span>柱状图</span>
            </div>
          </li>
          <li>
            <div @click="pieRouter">
              <i class="icon iconfont db--bingzhuangtu"></i>
              <span>饼状图</span>
            </div>
          </li>
          <li>
            <div>
              <i class="icon iconfont db--table"></i>
              <span>table表</span>
            </div>
          </li>
        </ul>
    </div>
  </div>
</template>

<script>
import Nav from '../../../components/common/nav/nav.vue'
export default {
  name: 'detail',
  data () {
    return {
      
    }
  },
  methods: {
    lineRouter(){
      this.$router.replace('/edit');
    },
    barRouter(){
      this.$router.replace('/edit');
    },
    pieRouter(){
      this.$router.replace('/edit');
    }
  },
  components: {
    'v-nav': Nav
  }
}
</script>

<style lang="scss" scoped>
@import './detail';
</style>
