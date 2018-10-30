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
              <el-button size="mini" type="danger" @click="del(scope.$index, scope.row)">删除</el-button>
              <el-button size="mini" type="success" @click="set(scope.$index, scope.row)" style="margin-left: 10px;margin-right: 10px;">配置模块</el-button>
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
        <el-button type="primary" @click="add" v-if="!isEditRole">确 定</el-button>
        <el-button type="primary" @click="saveEdit" v-if="isEditRole">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="角色模块信息" :visible.sync="modelDailog"  width="500px" :before-close="resetRole">
      <el-form :model="modelRole"  label-width="80px">
        <el-form-item label="角色">
          <el-input v-model="modelRole.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="配置模块">
         <el-select
           v-model="modelRole.modelroles" multiple filterable default-first-option placeholder="请配置魔模块">
           <el-option
             v-for="item in modelList"
             :key="item.modelid"
             :label="item.modelname"
             :value="item.modelid"
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

      dailog: false,
      isEditRole: true,
      editRoleId: '',

      role: {
        rolename: '',
        rolestatus: '',
        roledesc: '',
      },
      isSet: false,
      modelDailog: false,
      modelRole: {
        name: '',
        modelroles: []
      },
      modelList: {
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
    del(index, row){
      var url = '/api/system/role/' + row.roleid;
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
            this.$message({
                type: 'success',
                message: '新增成功',
                showClose: true
            });
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
    edit(index, row){
      var url = '/api/system/roleData';
      this.$axios.post(url,{
        "integerId": row.roleid
        }).then((res) => {
         this.role.roledesc = res.data.roledesc;
            this.role.rolename = res.data.rolename;
            this.role.rolestatus = res.data.rolestatus;
           
            this.dailog = true;
            this.isEditRole = true;
            this.editRoleId = res.data.roleid;
      }).catch((err) => {
          this.$message({
              type: 'error',
              message: '网络错误，请重试',
              showClose: true
          })
      })
    },
    saveEdit(){
      var url = '/api/system/role?roleid=' + this.editRoleId;
      this.$axios.put(url,this.role).then((res) => {
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
                  message: '角色名已经存在！',
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
              this.reset();
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
    // set(){
    //   this.modelDailog = true;
    // },
    showSet(index, row){
      var url = '/api/system/userRoleList';
      this.$axios.put(url,{
        integerId: row.roleid
      }).then((res) => {
         if(res.data.code != 1){
            this.$message({
                type: 'error',
                message: '网络错误，请重试',
                showClose: true
            })
         }else{
            this.modelDailog = true;
            this.modelRole.modelroles= res.data;
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
      var url = '/api/system/roleModels';
      this.$axios.put(url,{
        "roleid": 1,
        "modelDtoList": [
            {
            "rolemodelid":"",
            "roleid":1,
            "modelid":1
            },
            {
            "rolemodelid":"",
            "roleid":1,
            "modelid":2
            },
            {
            "rolemodelid":"",
            "roleid":1,
            "modelid":3
            }]
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
      this.modelRole = {
        name: '',
        modelroles: []
      };
      this.modelDailog = false;
    },
    reset(){
      this.role = {
        "roledesc": "",
        "rolename": "",
        "rolestatus": "",
      },
      this.dailog = false;
      this.isEditRole = false;
    },
    requestData(){
      var _this = this;
      var url = '/api/system/roleList?page=' + this.page.currentPage + '&' + this.page.pageSize;
      this.$axios.post(url,{
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
    getModels(){
      var _this = this;
      var url = '/api/system/modelList?page=' + this.page.currentPage + '&' + this.page.pageSize;
      this.$axios.post(url,{
        "modelname": "工具"
      }).then((res) => {
          this.modelList = res.data.modelList;
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
    this.getModels();
  }
}
</script>

<style lang="scss" scoped>
@import '../sys';
</style>
