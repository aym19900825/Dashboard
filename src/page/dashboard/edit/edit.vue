<template>
  <div class="list">
    <v-nav></v-nav>
    <div class="list-content">
       <p>仪表板</p>
       <div class="grid-stack">
          <div class="grid-stack-item" data-gs-x="2" data-gs-y="2" data-gs-width="4" data-gs-height="2">
              <div class="grid-stack-item-content"></div>
          </div>
          <div class="grid-stack-item" data-gs-x="4" data-gs-y="3" data-gs-width="4" data-gs-height="4">
               <div class="grid-stack-item-content"></div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'gridstack'
import 'lodash'
import 'gridstack/dist/gridstack.css'
import Nav from '../../../components/common/nav/nav.vue'

export default {
  name: 'list',
  data () {
    return {
      list: [
        {
          tit: '上映电影',
          type: '这是上映电影的dashboard'
        },{
          tit: '电影',
          type: '这是电影的dashboard'
        }
      ]
    }
  },
  methods: {
    choose(){
      this.$router.replace('/detail');
    }
  },
  mounted(){
     $('.grid-stack').gridstack({});
  },
  components: {
    'v-nav': Nav
  }
}
</script>

<style lang="scss" scoped>
@import './edit';
</style>
