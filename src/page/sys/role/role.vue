<template>
  <div class="list">
    <v-nav showItem="role"></v-nav>
    <div class="list-content">
       <p>角色</p>
       <div class="table-box">
          <p>
            <span>角色列表</span>
            <el-button type="success" icon="el-icon-plus" size="small" @click="show"></el-button>
          </p>
         <el-table ref="listTable" :data="list" tooltip-effect="dark"
          style="width: 100%">
          <el-table-column prop="rolename" label="角色名称">
          </el-table-column>
          <el-table-column prop="roledesc" label="角色描述">
          </el-table-column>
          <el-table-column prop="rolestatus" label="角色状态">
          </el-table-column>
          </el-table-column>
          <el-table-column label="操作" width="260">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="delVisual(scope.$index, scope.row)">删除</el-button>
              <el-button size="mini" type="success" @click="setRole(scope.$index, scope.row)" style="margin-left: 10px;margin-right: 10px;">配置模块</el-button>
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
    <el-dialog title="角色信息" :visible.sync="dailog"  width="500px" :before-close="reset">
      <el-form :model="role"  label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="role.rolename" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="role.roledesc" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色状态">
          <el-input v-model="role.rolestatus" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reset">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Nav from '../../../components/common/nav/nav.vue'
export default {
  name: 'user',
  data () {
    return {
      page:{
        currentPage: 0,
        pageSize: 10,
        totalCount: 0,
      },
      list: [],
      dailog: false,
      role: {
        "roledesc": "",
        "rolename": "",
        "rolestatus": "",
      },
    }
  },
  methods: {
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.requestData();
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.requestData();
    },
    show(){
      this.dailog = true;
    },
    add(){
      var url = '/api/system/roleAdd';
      this.$axios.post(url,this.role).then((res) => {
         if(res.data.code != 1){
            this.$message({
                type: 'error',
                message: '网络错误，请重试',
                showClose: true
            })
         }else{
            this.reset();
            this.requestData();
         }
      }).catch((err) => {
          this.$message({
              type: 'error',
              message: '网络错误，请重试',
              showClose: true
          })
      })
    },
    reset(){
      this.role = {
        "roledesc": "",
        "rolename": "",
        "rolestatus": "",
      },
      this.dailog = false;
    },
    requestData(){
      var _this = this;
      var url = '/api/system/roleList?page=' + this.page.currentPage + '&' + this.page.pageSize;
      this.$axios.post(url,{
        'rolename': 'ad',
      }).then((res) => {
          this.list = res.data.roleList;
          this.page.totalCount = res.data.totalPages;
      }).catch((err) => {
          this.$message({
              type: 'error',
              message: '网络错误，请重试',
              showClose: true
          })
      })
    },
    getRoles(){
      var _this = this;
      var url = '/api/system/roleList?page=' + this.page.currentPage + '&' + this.page.pageSize;
      this.$axios.post(url,{
        'name': 'admin',
        'username': '管'
      }).then((res) => {
          this.list = res.data.userList;
          this.page.totalCount = res.data.totalPages;
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
@import '../sys';
</style>
