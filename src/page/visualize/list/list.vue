<template>
  <div class="list">
    <v-nav></v-nav>
    <div class="list-content">
       <p>视图</p>
       <div class="empty-content" style="display: none;">
          <span>您还没有创建任何视图哦！</span>
          <el-button type="success" icon="el-icon-plus" @click="choose">新建</el-button>
       </div>
       <div class="table-box">
          <p>
            <span>视图列表</span>
            <el-button type="danger" icon="el-icon-delete" size="small" style="margin-right: 10px; margin-left: 6px;"></el-button>
            <el-button type="success" icon="el-icon-plus" size="small" @click="choose"></el-button>
          </p>
         <el-table ref="listTable" :data="list" tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="tit" label="名称"  show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="type" label="类型" width="150">
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
          tit: '上映电影---top50',
          type: 'line'
        },{
          tit: '上映电影---top100',
          type: 'line'
        }
      ]
    }
  },
  methods: {
    choose(){
      this.$router.replace('/detail');
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
