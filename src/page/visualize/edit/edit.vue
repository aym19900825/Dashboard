<template>
  <div class="edit">
    <v-nav></v-nav>
    <div class="edit-content">
      <v-line></v-line>
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
      
    }
  },
  methods: {
    
  },
  components: {
    'v-nav': Nav,
    'v-line': Line,
  }
}
</script>

<style lang="scss" scoped>
@import './edit';
</style>
