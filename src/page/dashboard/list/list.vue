<template>
  <div class="list">
    <v-nav></v-nav>
    <div class="list-content">
       <p>仪表板</p>
       <div class="empty-content" style="display: none;">
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
          <el-table-column prop="dashboardname" label="名称"  show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="dashboarddescription" label="描述">
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="del(scope.$index, scope.row)">删除</el-button>
              <el-button size="mini" type="success" @click="edit(scope.$index, scope.row)" style="margin-left: 10px;margin-right: 10px;">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next"
            :total="page.totalCount">
          </el-pagination>
        </div>
       </div>
    </div>
    <el-dialog title="dashboard" :visible.sync="dashboardForm" width="560px" :before-close="resetDashboard">
      <el-form :model="newDashboard">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="newDashboard.dashboardname"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="newDashboard.dashboardshowname"></el-input>
        </el-form-item>
        <el-form-item label="业务场景" :label-width="formLabelWidth">
          <el-input v-model="newDashboard.businesscategory"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetDashboard">取 消</el-button>
        <el-button type="primary" @click="addDashboard">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Nav from '../../../components/common/nav/nav.vue'
export default {
  name: 'list',
  data () {
    return {
      page: {
        currentPage: 0,
        pageSize: 10,
        totalCount: 0,
      },
      dashboardForm: false,
      newDashboard: {
        "dashboardname": "",
        "dashboardshowname": "",
        "businesscategory": ""
      },
      list: []
    }
  },
  methods: {
    addDashboard(){
      var url = '/api/show/dashboardAdd';
      this.$axios.post(url,{
          "dashboardname": this.newDashboard.dashboardname,
          "dashboardshowname": this.newDashboard.dashboardshowname,
          "businesscategory": this.businesscategory
      }).then((res) => {
          if(res.data.code != 1){
              this.$message({
                  type: 'error',
                  message: '新增失败',
                  showClose: true
              })
          }
          this.resetDashboard();
          this.requestData();
      }).catch((err) => {
          this.$message({
              type: 'error',
              message: '网络错误，请重试',
              showClose: true
          })
      })
    },
    resetDashboard(){
      this.dashboardForm = false;
      this.newDashboard = {
        "dashboardname": "",
        "dashboardshowname": "",
        "businesscategory": ""
      };
    },
    choose(){
      this.dashboardForm = true;
      // this.$router.replace('/dashboardEdit');
    },
     edit(index,row){
      console.log(row.bid);
      this.$router.push({
        path: '/dashboardEdit', 
        query: { 
          bid: row.bid
        }
      })
    },
    requestData(){
      var _this = this;
      var url = '/api/show/dashboardList';
      this.$axios.post(url,{
        'page': _this.page.currentPage,
        'size': _this.page.pageSize
      }).then((res) => {
          if(res.data.totalPages == 0){
            $('.empty-content').show();
            _this.page.totalCount = res.data.totalPages;
          }else{
            $('.table-box').show();
            _this.page.totalCount = res.data.totalPages;
            _this.list = JSON.parse(JSON.stringify(res.data.visualizeList));
          }
      }).catch((err) => {
          this.$message({
              type: 'error',
              message: '网络错误，请重试',
              showClose: true
          })
      })
    }
  },
  components: {
    'v-nav': Nav
  },
  mounted(){
    this.requestData();
  }
}
</script>

<style lang="scss" scoped>
@import './list';
</style>
