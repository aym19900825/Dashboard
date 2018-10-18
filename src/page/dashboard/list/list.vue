<template>
  <div class="list">
    <v-nav></v-nav>
    <div class="list-content">
       <p>仪表板</p>
       <div class="empty-content">
          <span>您还没有创建任何仪表板哦！</span>
          <el-button type="success" icon="el-icon-plus" @click="choose">新建</el-button>
       </div>
       <div class="table-box"  style="display: none;">
          <p>
            <span>仪表板列表</span>
            <el-button type="danger" icon="el-icon-delete" size="small" style="margin-right: 10px; margin-left: 6px;"></el-button>
            <el-button type="success" icon="el-icon-plus" size="small" @click="choose"></el-button>
          </p>
         <el-table ref="listTable" :data="list" tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="tit" label="名称"  show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="type" label="描述">
          </el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage4"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400">
          </el-pagination>
        </div>
       </div>
    </div>
  </div>
</template>

<script>
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
      this.$router.replace('/dashboardEdit');
    }
  },
  components: {
    'v-nav': Nav
  }
}
</script>

<style lang="scss" scoped>
@import './list';
</style>
