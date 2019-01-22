<template>
  <div class="edit">
    <v-nav showItem="visualize"></v-nav>
    <div class="edit-content">
      <v-number :vid="vid" :businessCats="businessCats" :bid="bid" ref="lines"></v-number>
    </div>
  </div>
</template>

<script>
import Nav from '../../../components/common/nav/nav.vue'
import Number from '../../../components/number/number.vue'
export default {
  name: 'pie',
  data () {
    return {
      vid: '',
      businessCats: [],
      bid: ''
    }
  },
  components: {
    'v-nav': Nav,
    'v-number': Number,
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
