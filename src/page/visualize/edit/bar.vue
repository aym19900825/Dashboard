<template>
  <div class="edit">
    <v-nav showItem="visualize"></v-nav>
    <div class="edit-content">
      <v-bar :vid="vid" :businessCats="businessCats"></v-bar>
    </div>
  </div>
</template>

<script>
import Nav from '../../../components/common/nav/nav.vue'
import Bar from '../../../components/bar/bar.vue'
export default {
  name: 'edit',
  data () {
    return {
      vid: '',
      businessCats: []
    }
  },
  methods: {

  },
  components: {
    'v-nav': Nav,
    'v-bar': Bar,
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
