<template>
  <div class="edit">
    <v-nav showItem="visualize"></v-nav>
    <div class="edit-content">
      <v-bar :vid="vid" :businessCats="businessCats" :bid="bid"></v-bar>
    </div>
  </div>
</template>

<script>
import Nav from '../../../components/common/nav/nav.vue'
import Bar from '../../../components/bar/bar.vue'
export default {
  name: 'bar',
  data () {
    return {
      vid: '',
      businessCats: []
    }
  },
  components: {
    'v-nav': Nav,
    'v-bar': Bar,
  },
  created(){
    this.vid = this.$route.query.vid;
    this.businessCats = this.$route.query.businesscategorys;
    this.bid = this.$route.query.bid;
  }
}
</script>

<style lang="scss" scoped>
@import './edit';
</style>
