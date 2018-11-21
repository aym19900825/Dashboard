<template>
  <div class="list">
    <v-nav showItem="database"></v-nav>
    <div class="list-content">
       <!-- <p>视图</p> -->
       <div class="empty-content" style="display: none;">
          <span>您还没有添加任何数据库哦！</span>
          <el-button type="success" icon="el-icon-plus" @click="choose">添加</el-button>
       </div>
       <div class="table-box">
          <p>
            <span>视图列表</span>
            <el-button type="success" icon="el-icon-plus" size="small" style="margin-left: 20px;" @click="choose">添加</el-button>
          </p>
         <el-table ref="listTable" :data="list" tooltip-effect="dark"
          style="width: 100%">
          <!-- <el-table-column type="selection" width="55"></el-table-column> -->
          <el-table-column prop="datasourcename" label="数据库名称"  show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="database" label="数据库" width="150">
          </el-table-column>
          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="delVisual(scope.row)">删除</el-button>
              <el-button size="mini" type="success" @click="edit(scope.row)" style="margin-left: 10px;margin-right: 10px;">编辑</el-button>
              <el-button size="mini" type="success" @click="test(scope.row)" style="margin-left: 10px;margin-right: 10px;">连接测试</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog title="数据库" :visible.sync="dbForm" width="560px" :before-close="reset">
      <el-form :model="newDataBase"  label-position="top" label-width="120px">
        <el-form-item label="IP地址">
          <el-input v-model="newDataBase.ip"></el-input>
        </el-form-item>
        <el-form-item label="端口号">
          <el-input v-model="newDataBase.port"></el-input>
        </el-form-item>
        <el-form-item label="数据库">
          <el-input v-model="newDataBase.database"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="newDataBase.user"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="newDataBase.password"></el-input>
        </el-form-item>
        <el-form-item label="数据库名称">
          <el-input v-model="newDataBase.datasourcename"></el-input>
        </el-form-item>
        <el-form-item label="数据库类型">
          <el-select v-model="newDataBase.dbtype" placeholder="请选择数据库" width="100%">
            <el-option :label="item" :value="item" v-for="item in dbType"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reset">取 消</el-button>
        <el-button type="primary" v-show="!editForm" @click="add">确 定</el-button>
        <el-button type="primary" v-show="editForm" @click="editSave">确 定</el-button>
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
      editForm: false,
      page:{
        currentPage: 1,
        pageSize: 10,
        totalCount: 0,
      },
      list: [],

      dbForm: false,
      newDataBase: {
        'ip': '',
        'port': '',
        'database': '',
        'user': '',
        'password': '',
        'datasourcename': '',
        'dbtype': ''
      },
      dbType: [
        'mysql',
        'oracle'
      ]
    }
  },
  methods: {
    test(row){
      var url = '/api/show/validateDatabase?dbid=' + row.dbid;
      this.$axios.get(url,{}).then((res) => {
          if(res.data.code == 1){
            this.$message({
                type: 'success',
                message: '测试连接成功',
                showClose: true
            })
          }else{
            this.$message({
              type: 'warning',
              message: '测试连接失败',
              showClose: true
            })
          }
      }).catch((err) => {
          this.$message({
              type: 'error',
              message: '网络错误，请重试',
              showClose: true
          })
      })
      
    },
    choose(){
      this.editForm = false;
      this.dbForm = true;
    },
    del(index,row){
      var _this = this;
      var url = '/api/show/visualize/'+row.vid;
      this.$confirm('确定删除此视图?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.$axios.delete(url,{}).then((res) => {
          if(res.data.code != 1){
            _this.$message({
              type: 'error',
              message: res.data.message,
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
    requestData(){
      var _this = this;
      var page =  _this.page.currentPage - 1;
      var url = '/api/show/databaseList?page=' +  page +'&size=' + _this.page.pageSize;
      this.$axios.get(url,{}).then((res) => {
          if(res.data.totalPages == 0){
            $('.empty-content').show();
            $('.table-box').hide();
          }else{
            $('.table-box').show();
            $('.empty-content').hide();
            _this.list = JSON.parse(JSON.stringify(res.data));
          }
          // _this.page.totalCount = res.data.total;
      }).catch((err) => {
          this.$message({
              type: 'error',
              message: '网络错误，请重试',
              showClose: true
          })
      })
    },
    reset(){
      this.dbForm = false;
      this.newDataBase = {
        'ip': '',
        'port': '',
        'database': '',
        'user': '',
        'password': '',
        'datasourcename': '',
        'dbtype': ''
      };
    },
    add(){
      var url = '/api/show/databaseAdd';
      this.$axios.post(url,this.newDataBase).then((res) => {
          if(res.data.code != 1){
            this.$message({
              type: 'error',
              message: res.data.message,
              showClose: true
            });
          }else{
            this.$message({
                type: 'success',
                message: '新增成功',
                showClose: true
            });
          }
          this.reset();
          this.requestData();
      }).catch((err) => {
          this.$message({
              type: 'error',
              message: '网络错误，请重试',
              showClose: true
          })
      })
    },
    edit(row){
      this.newDataBase = JSON.parse(JSON.stringify(row));
      this.dbForm = true;
      this.editForm = true;
    },
    editSave(){
      var url = '/api/show/databaseUpdate';
      this.$axios.put(url,this.newDataBase).then((res) => {
          if(res.data.code != 1){
            this.$message({
              type: 'error',
              message: res.data.message,
              showClose: true
            });
          }else{
            this.$message({
                type: 'success',
                message: '编辑成功',
                showClose: true
            });
          }
          this.reset();
          this.requestData();
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
