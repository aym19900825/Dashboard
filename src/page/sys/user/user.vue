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
          <el-table-column prop="name" label="名称">
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
              <el-button size="mini" type="danger" @click="del(scope.$index, scope.row)">删除</el-button>
              <el-button size="mini" type="success" @click="showSet(scope.$index, scope.row)" style="margin-left: 10px;margin-right: 10px;">配置角色</el-button>
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetUser">取 消</el-button>
        <el-button type="primary" @click="add" v-show="!isEditUser">确 定</el-button>
        <el-button type="primary" @click="saveEdit" v-show="isEditUser">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="配置角色" :visible.sync="roleDailog"  width="500px" :before-close="resetRole">
      <el-form :model="userRole"  label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="userRole.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="配置角色">
         <el-select
           v-model="userRole.userroles" multiple filterable default-first-option placeholder="请配置用户角色">
           <el-option
             v-for="item in rolelist"
             :key="item.roleid"
             :label="item.roledesc"
             :value="item.roleid"
             >
           </el-option>
         </el-select>
       </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetRole">取 消</el-button>
        <el-button type="primary" @click="saveSet">确 定</el-button>
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

      isSet: false,
      roleDailog: false,

      userDailog: false,
      isEditUser: false,
      editUserId: '',

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

      userRole: {
        username: '',
        userroles: [],
        userid: 0
      },
      selInitRole: [],
      rolelist: [
        // 'roleid': 3,
        // 'roledesc': "管理员hk1",
        // 'rolename': "adminhk1",
        // 'rolestatus': null,
      ]
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
    del(index, row){
      var url = '/api/system/user/' + row.userid;
      this.$axios.delete(url,{}).then((res) => {
         if(res.data.code != 1){
            this.$message({
                type: 'error',
                message: '网络错误，请重试',
                showClose: true
            })
         }else{
            this.$message({
                type: 'success',
                message: '删除成功',
                showClose: true
            });
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
    // set(){
    //   this.roleDailog = true;
    // },
    showUser(){
      this.userDailog = true;
    },
    add(){
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
    edit(index, row){
      var url = '/api/system/userData';
      this.$axios.post(url,{
        "integerId": row.userid
        }).then((res) => {
          this.user.name = res.data.name;
          this.user.address = res.data.address;
          this.user.describe = res.data.describe;
          this.user.email = res.data.email;
          this.user.mobile = res.data.mobile;
          this.user.sex = res.data.sex;
          this.user.username = res.data.username;
          this.user.userstatus = res.data.userstatus;
          this.user.department = res.data.department;
          this.user.userroles = [];
          this.userDailog = true;
          this.isEditUser = true;
          this.editUserId = res.data.userid;
      }).catch((err) => {
          this.$message({
              type: 'error',
              message: '网络错误，请重试',
              showClose: true
          })
      })
    },
    saveEdit(){
      var url = '/api/system/user?userid=' + this.editUserId;
      this.$axios.put(url,this.user).then((res) => {
         if(res.data.code != 1){
            this.$message({
                type: 'error',
                message: '网络错误，请重试',
                showClose: true
            })
         }else{
            if(res.data.code != 1){
              if(res.data.message == 'Already exists!'){
                this.$message({
                  type: 'error',
                  message: '用户名已经存在！',
                  showClose: true
                 })
              }else{
                this.$message({
                  type: 'error',
                  message: '网络错误，请重试',
                  showClose: true
                });
              }
            }else{
              this.$message({
                type: 'success',
                message: '修改成功！',
                showClose: true
              });
              this.resetUser();
              this.requestData();
            }
         }
      }).catch((err) => {
          this.$message({
              type: 'error',
              message: '网络错误，请重试',
              showClose: true
          })
      })
    },
    showSet(index, row){
      var url = '/api/system/userRoleList';
      this.$axios.post(url,{
        integerId: row.userid
      }).then((res) => {
        this.roleDailog = true;
        this.userRole.username = row.name;
        this.userRole.userid = row.userid;
        for(var i=0; i<res.data.length; i++){
          this.userRole.userroles.push(res.data[i].roleid);
          this.selInitRole.push(res.data[i]);
        }
      }).catch((err) => {
          this.$message({
              type: 'error',
              message: '网络错误，请重试',
              showClose: true
          })
      })
    },
    saveSet(){
      var url = '/api/system/userRoles';
      var userid = this.userRole.userid;
      var param = {
        userid: userid,
        roleList: [],
      };
      var selRole = this.selInitRole;
      var roleList = this.userRole.userroles;
      var tmpSelRole = JSON.parse(JSON.stringify(this.selInitRole));;
      for(var i=0; i<roleList.length; i++ ){
        var flag = true;
        for(var j=0; j<selRole.length; j++){
          if(selRole[j].roleid == roleList[i]){
            param.roleList.push({
              "userroleid": selRole[j].userroleid,
              "roleid": roleList[i],
              "userid": userid
            });
            tmpSelRole = tmpSelRole.filter(function(item){
              return item.roleid != roleList[i]
            });
            flag = false;
          }
        }
        if(flag){
          param.roleList.push({
            "userroleid": "",
            "roleid": roleList[i],
            "userid": userid
          });
        }
      }

      if(tmpSelRole.length){
        param.deleteList = [];
        for(var k=0; k<tmpSelRole.length; k++){
          param.deleteList.push(tmpSelRole[k].userroleid);
        }
      }

      this.$axios.post(url,param).then((res) => {
         if(res.data.code != 1){
            this.$message({
                type: 'error',
                message: '网络错误，请重试',
                showClose: true
            })
         }else{
            this.$message({
              type: 'success',
              message: '配置成功！',
              showClose: true
            });
            this.resetRole();
         }
      }).catch((err) => {
          this.$message({
              type: 'error',
              message: '网络错误，请重试',
              showClose: true
          })
      })
    },
    resetRole(){
      this.userRole = {
        username: '',
        userroles: [],
        userid: 0
      };
      this.selInitRole = [];
      this.roleDailog = false;
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
        userroles: []
      };
      this.userDailog = false;
      this.isEditUser = false;
    },
    getRoleList(){
      var url = '/api/system/roleList?page=0&size=10';
      this.$axios.post(url,{}).then((res) => {
          this.rolelist = res.data.roleList;
      }).catch((err) => {
          this.$message({
              type: 'error',
              message: '网络错误，请重试',
              showClose: true
          })
      })
    },
    requestData(){
      var _this = this;
      var url = '/api/system/userList?page=' + this.page.currentPage + '&' + this.page.pageSize;
      this.$axios.post(url,{}).then((res) => {
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
    this.getRoleList();
  }
}
</script>

<style lang="scss" scoped>
@import '../sys';
</style>
