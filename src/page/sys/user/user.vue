<template>
  <div class="list">
    <v-nav showItem="user"></v-nav>
    <div class="list-content">
       <p>用户</p>
       <div class="table-box">
          <p>
            <span>用户列表</span>
            <el-button type="success" icon="el-icon-plus" size="small" @click="showUser"></el-button>
          </p>
         <el-table ref="listTable" :data="list" tooltip-effect="dark"
          style="width: 100%">
          <el-table-column prop="username" label="名称">
          </el-table-column>
          <el-table-column prop="department" label="部门">
          </el-table-column>
          <el-table-column prop="mobile" label="电话">
          </el-table-column>
          <el-table-column label="角色" width="150">
            <template slot-scope="scope">
              <span v-for="item in scope.row.roles">{{item.userroleid}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="userstatus" label="用户状态">
          </el-table-column>
          </el-table-column>
          <el-table-column label="操作" width="260">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="delVisual(scope.$index, scope.row)">删除</el-button>
              <el-button size="mini" type="success" @click="setRole(scope.$index, scope.row)" style="margin-left: 10px;margin-right: 10px;">配置角色</el-button>
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
    <el-dialog title="用户信息" :visible.sync="userDailog"  width="500px" :before-close="resetUser">
      <el-form :model="user"  label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="user.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="user.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="user.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-input v-model="user.department" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户状态">
          <el-input v-model="user.userstatus" autocomplete="off"></el-input>
        </el-form-item>
       <!--  <el-form-item label="用户角色">
          <el-select
            v-model="userroles" multiple filterable default-first-option placeholder="请配置用户角色">
            <el-option
              v-for="item in roles"
              :key="item.roleid"
              :label="item.roledesc"
              :value="item.roleid">
            </el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetUser">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
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
      userDailog: false,
      user: {
        name: "",
        address: "",
        describe: "",
        email: "",
        mobile: "",
        sex: "",
        username: "",
        userstatus: "",
        department: "",
        userroles: []
      },
      // roles: [
      //   {
      //     "roleid": 3,
      //     "roledesc": "管理员hk1",
      //     "rolename": "adminhk1",
      //     "rolestatus": null,
      //     "sortnum": null,
      //   }
      // ]
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
    showUser(){
      this.userDailog = true;
    },
    addUser(){
      var url = '/api/system/userAdd';
      this.$axios.post(url,this.user).then((res) => {
         if(res.data.code != 1){
            this.$message({
                type: 'error',
                message: '网络错误，请重试',
                showClose: true
            })
         }else{
            this.resetUser();
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
    resetUser(){
      this.user = {
        name: "",
        address: "",
        describe: "",
        email: "",
        mobile: "",
        sex: "",
        username: "",
        userstatus: "",
        department: "",
        userroles: ""
      };
      this.userDailog = false;
    },
    requestData(){
      var _this = this;
      var url = '/api/system/userList?page=' + this.page.currentPage + '&' + this.page.pageSize;
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
