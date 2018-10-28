<template>
  <div class="list">
    <v-nav showItem="user"></v-nav>
    <div class="list-content">
       <p>模块</p>
       <div class="table-box">
          <p>
            <span>模块列表</span>
            <el-button type="success" icon="el-icon-plus" size="small" @click="show"></el-button>
          </p>
         <el-table ref="listTable" :data="list" tooltip-effect="dark"
          style="width: 100%">
          <el-table-column prop="modelname" label="">
          </el-table-column>
          <el-table-column prop="modeldesc" label="描述">
          </el-table-column>         
          <el-table-column prop="modelstatus" label="状态">
          </el-table-column>
          </el-table-column>
          <el-table-column label="操作" width="260">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="del(scope.$index, scope.row)">删除</el-button>
              <el-button size="mini" type="success" @click="set(scope.$index, scope.row)" style="margin-left: 10px;margin-right: 10px;">配置dashboard</el-button>
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
    <el-dialog title="模块信息" :visible.sync="modelDailog"  width="500px" :before-close="resetModel">
      <el-form :model="model"  label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="model.modelname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="model.modeldesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetModel">取 消</el-button>
        <el-button type="primary" @click="add" v-show="!isEdit">确 定</el-button>
        <el-button type="primary" @click="saveEdit" v-show="isEdit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="用户角色信息" :visible.sync="roleDailog"  width="500px" :before-close="resetRole">
      <el-form :model="userRole"  label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="userRole.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="配置角色">
         <el-select
           v-model="userroles" multiple filterable default-first-option placeholder="请配置用户角色">
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

      modelDailog: false,
      isEdit: false,
      editId: '',

      model: {
        modelname: "",
        modeldesc: ""
      },

      isSet: false,
      roleDailog: true,
      userRole: {
        username: '',
        userroles: []
      },

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
      var url = '/api/system/model/' + row.modelid;
      this.$axios.post(url,{}).then((res) => {
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
    set(){
      this.isSet = true;
    },
    show(){
      this.modelDailog = true;
    },
    add(){
      var url = '/api/system/modelAdd';
      this.$axios.post(url,this.model).then((res) => {
         if(res.data.code != 1){
            this.$message({
                type: 'error',
                message: '网络错误，请重试',
                showClose: true
            })
         }else{
            this.$message({
                type: 'success',
                message: '新增成功',
                showClose: true
            });
            this.resetModel();
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
      var url = '/api/system/modelData';
      this.$axios.post(url,{
        integerId: row.modelid
      }).then((res) => {
         if(res.data.code != 1){
            this.$message({
                type: 'error',
                message: '网络错误，请重试',
                showClose: true
            })
         }else{
            this.model.modelname = res.data.modelname;
            this.model.modeldes = res.data.modeldesc;

            this.modelDailog = true;
            this.isEdit = true;
            this.editId = res.data.modelid;
         }
      }).catch((err) => {
          this.$message({
              type: 'error',
              message: '网络错误，请重试',
              showClose: true
          })
      })
    },
    saveEdit(){
      var url = '/api/system/model?modelid=' + this.editId;
      this.$axios.put(url,this.model).then((res) => {
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
              this.resetModel();
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
      this.$axios.put(url,{
        integerId: row.userid
      }).then((res) => {
         if(res.data.code != 1){
            this.$message({
                type: 'error',
                message: '网络错误，请重试',
                showClose: true
            })
         }else{
            this.roleDailog = true;
            this.userRole.userroles = res.data;
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
      this.$axios.put(url,{
        userid: "1",
        roleList: [
          {
            "userroleid":"",
            "roleid":1,
            "userid":1
          },
          {
            "userroleid":"",
            "roleid":3,
            "userid":1
          }
        ]
      }).then((res) => {
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
        userroles: []
      };
      this.roleDailog = false;
    },
    resetModel(){
      this.modelDailog = false;
      this.isEdit = false;
      this.model = {
        modelname: "",
        modeldesc: ""
      };
    },
    getRoleList(){
      var url = '/api/system/roleList?page=0&size=10';
      this.$axios.post(url,{}).then((res) => {
          if(res.data.code == 1){
            this.rolelist = res.data.userList;
          }
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
      var url = '/api/system/modelList?page=' + this.page.currentPage + '&' + this.page.pageSize;
      this.$axios.post(url,{
        "modelname": "工具"
      }).then((res) => {
          this.list = res.data.modelList;
          this.page.totalCount = res.data.totalPages;
      }).catch((err) => {
          this.$message({
              type: 'error',
              message: '网络错误，请重试',
              showClose: true
          })
      })
    },
    getDashboards(){
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
