<template>
  <div class="edit">
    <v-nav showItem="visualize"></v-nav>
    <div class="edit-content">
      <v-line :vid="vid" ref="lines" :businessCats="businessCats"></v-line>
    </div>
  </div>
</template>

<script>
import Nav from '../../../components/common/nav/nav.vue'
import Line from '../../../components/line/line.vue'
export default {
  name: 'edit',
  data () {
    return {
      vid: '',
      businessCats: [],
    }
  },
  methods: {
    
  },
  components: {
    'v-nav': Nav,
    'v-line': Line,
  },
  created(){
    this.vid = this.$route.query.vid;
    this.businessCats = this.$route.query.businesscategorys;
  }
}
</script>

<style lang="scss" scoped>
@import './edit';
</style>
