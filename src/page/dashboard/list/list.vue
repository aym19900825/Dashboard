<template>
  <div class="list">
    <v-nav showItem="dashboard"></v-nav>
    <div class="list-content">
       <!-- <p>仪表板</p> -->
       <div class="empty-content" style="display: none;">
          <span>您还没有创建任何仪表板哦！</span>
          <el-button type="success" icon="el-icon-plus" @click="choose">新建</el-button>
       </div>
       <div class="table-box"  style="display: none;">
          <p>
            <span>仪表板列表</span>
            <!-- <el-button type="danger" icon="el-icon-delete" size="small" style="margin-right: 10px; margin-left: 6px;"></el-button> -->
            <el-button type="success" icon="el-icon-plus" size="small" @click="choose">新增</el-button>
          </p>
          <el-row :gutter="20" style="display: flex;align-items:center;border-bottom: 1px solid #ccc; margin-left: 0px;margin-right: 0px;height: 60px;">
            <el-col :span="6"> 
              <el-input placeholder="请输入名称" v-model="searchData.dashboardname" @keyup.enter.native="search"></el-input>
            </el-col>
            <el-col :span="6">
              <el-input placeholder="请输入描述" v-model="searchData.dashboarddescription" @keyup.enter.native="search"></el-input>
            </el-col>
            <el-col :span="6">
              <el-input placeholder="请输入菜单编组" v-model="searchData.businesscategory" @keyup.enter.native="search"></el-input>
            </el-col>
            <el-col :span="6">
              <el-button icon="el-icon-search" @click="search"></el-button>
            </el-col>
          </el-row>
         <el-table ref="listTable" :data="list" tooltip-effect="dark"
          style="width: 100%">
          <!-- @selection-change="handleSelectionChange"> -->
          <!-- <el-table-column type="selection" width="55"></el-table-column> -->
          <el-table-column prop="dashboardname" label="名称"  show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="dashboarddescription" label="描述">
          </el-table-column>
          <el-table-column prop="businesscategory" label="菜单编组">
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="delDashboard(scope.$index, scope.row)">删除</el-button>
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
    <el-dialog title="仪表板" :visible.sync="dashboardForm" width="560px" :before-close="resetDashboard">
      <el-form :model="newDashboard" ref="dashboardForm":rules="rules" label-width="120">
        <el-form-item label="名称" prop="dashboardname">
          <el-input v-model="newDashboard.dashboardname"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="dashboardshowname">
          <el-input v-model="newDashboard.dashboardshowname"></el-input>
        </el-form-item>
         <el-form-item label="菜单编组" prop="businesscategory">
          <el-select v-model="newDashboard.businesscategory" filterable allow-create default-first-option
            placeholder="请选择或输入菜单编组">
            <el-option
              v-for="item in businesscategorys"
              :label="item"
              :value="item"
              :key="item">
            </el-option>
          </el-select>
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
import Config from '../../../config.js'
export default {
  name: 'list',
  data () {
    return {
      basic_url: Config.dev_url,
      page: {
        currentPage: 1,
        pageSize: 10,
        totalCount: 0,
      },
      dashboardForm: false,
      businesscategorys: [],
      newDashboard: {
        'dashboardname': '',
        'dashboardshowname': '',
        'businesscategory': ''
      },
      list: [],
      searchData: {
        'dashboardname': '',
        'dashboarddescription': '',
        'businesscategory': ''
      },

      rules: {
        dashboardname: [
          { required: true, message: '请输入仪表板名称', trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    addDashboard(){
      this.$refs['dashboardForm'].validate((valid)=>{
        if(valid){
          var url = this.basic_url + '/show/dashboardAdd';
          this.$axios.post(url,{
            "dashboardname": this.newDashboard.dashboardname,
            "dashboardshowname": this.newDashboard.dashboardshowname,
            "businesscategory": this.newDashboard.businesscategory
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
        }
      });
    },
    resetDashboard(){
      this.dashboardForm = false;
      this.newDashboard = {
        'dashboardname': '',
        'dashboardshowname': '',
        'businesscategory': ''
      };
      this.$refs['dashboardForm'].resetFields();
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.requestData();
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.requestData();
    },
    choose(){
      this.dashboardForm = true;
      // this.$router.replace('/dashboardEdit');
    },
    edit(index,row){
      this.$router.push({
        path: '/dashboardEdit', 
        query: { 
          bid: row.bid,
          businesscategorys: this.businesscategorys
        }
      })
    },
    delDashboard(index,row){
      var _this = this;
      var url = this.basic_url + '/show/dashboard/'+row.bid;
      this.$confirm('确定删除此视图?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.$axios.delete(url,{}).then((res) => {
          if(res.data.code != 1){
            _this.$message({
              type: 'error',
              message: '删除失败，请重试',
              showClose: true
            })
          }else{
            _this.$message({
              type: 'success',
              message: '删除成功',
              showClose: true
            })
          }
          _this.requestData();
        }).catch((err) => {
            _this.$message({
                type: 'error',
                message: '网络错误，请重试',
                showClose: true
            })
        })
      }).catch(() => {});
    },
    search(){
      this.page.currentPage = 1;
      this.requestData();
    },
    requestData(){
      var _this = this;
      var page = _this.page.currentPage - 1;
      var url = this.basic_url + '/show/dashboardList2?page=' + page + '&size=' + _this.page.pageSize;
      this.$axios.post(url,this.searchData).then((res) => {
          if(res.data.totalPages == 0 && _this.searchData.dashboardname == '' && _this.searchData.dashboarddescription == ''){
            $('.empty-content').show();
            $('.table-box').hide();
            _this.page.totalCount = res.data.total;
          }else{
            $('.table-box').show();
            $('.empty-content').hide();
            _this.page.totalCount = res.data.total;
            _this.businesscategorys = res.data.distinctBusinesscategory;
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
    $(".list-content").height($(window).height());
  }
}
</script>

<style lang="scss" scoped>
@import './list';
</style>
