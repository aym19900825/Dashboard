<template>
  <div class="list">
    <v-nav showItem="visualize"></v-nav>
    <div class="list-content">
       <!-- <p>视图</p> -->
       <div class="empty-content" style="display: none;">
          <span>您还没有创建任何视图哦！</span>
          <el-button type="success" icon="el-icon-plus" @click="choose">新建</el-button>
       </div>
       <div class="table-box">
          <p>
            <span>视图列表</span>
            <!-- <el-button type="danger" icon="el-icon-delete" size="small" style="margin-right: 10px; margin-left: 6px;"></el-button> -->
            <el-button type="success" icon="el-icon-plus" size="small" style="margin-left: 20px;" @click="choose">新增</el-button>
            <el-button type="warning" icon="el-icon-plus" size="small" @click="exportExcel">导出</el-button>
          </p>
          <el-row :gutter="20" style="display: flex;align-items:center;border-bottom: 1px solid #ccc; margin-left: 0px;margin-right: 0px;height: 60px;">
            <el-col :span="12"> 
              <el-input placeholder="请选择名称" v-model="searchData.visualizename"></el-input>
            </el-col>
            <el-col :span="6">
              <el-input placeholder="请选择类型" v-model="searchData.type"></el-input>
            </el-col>
            <el-col :span="6">
              <el-button icon="el-icon-search" @click="search"></el-button>
            </el-col>
          </el-row>
         <el-table ref="listTable" :data="list" tooltip-effect="dark"
          style="width: 100%">
          <!-- <el-table-column type="selection" width="55"></el-table-column> -->
          <el-table-column prop="visualizename" label="名称"  show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="type" label="类型" width="150">
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="delVisual(scope.$index, scope.row)">删除</el-button>
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
    <el-dialog title="visualize" :visible.sync="visualizeForm" width="560px" :before-close="resetVisual">
      <el-form :model="newVisualize"  label-position="top" label-width="120px">
        <el-form-item label="名称">
          <el-input v-model="newVisualize.visualizename"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="newVisualize.visualizedescription"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="newVisualize.type" placeholder="请选择活动区域" width="100%">
            <el-option label="折线图" value="line"></el-option>
            <el-option label="饼图" value="pie"></el-option>
            <el-option label="柱状图" value="bar"></el-option>
          </el-select>
        </el-form-item>
        <!--  <el-form-item label="y轴数据类型">
          <el-select v-model="newVisualize.ytype" placeholder="y轴数据类型">
            <el-option label="double" value="double"></el-option>
            <el-option label="float" value="float"></el-option>
            <el-option label="int" value="int"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="菜单编组">
          <el-select v-model="newVisualize.businesscategory" filterable allow-create default-first-option
            placeholder="请选择或输入菜单编组">
            <el-option
              v-for="item in Businesscategorys"
              :label="item"
              :value="item"
              :key="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据库">
          <el-select v-model="newVisualize.dbid" placeholder="请选择数据库" width="100%" @change="getTable">
            <el-option :label="item.database" :value="item.dbid" v-for="item in databaseList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据表">
          <el-select v-model="newVisualize.sourcetablename" placeholder="请选择数据表" width="100%" @change="getCol">
            <el-option :label="item" :value="item" v-for="item in tableList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据列">
          <el-select v-model="newVisualize.columnList" placeholder="请选择数据列" width="100%" multiple>
            <el-option :label="item.field" :value="item.field"  v-for="item in columnList"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetVisual">取 消</el-button>
        <el-button type="primary" @click="addVisual">确 定</el-button>
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
      databaseList: [],
      tableList: [],
      columnList: [],

      page:{
        currentPage: 1,
        pageSize: 10,
        totalCount: 0,
      },
      list: [],

      visualizeForm: false,
      newVisualize: {
        visualizename: '',
        visualizedescription: '',
        type: '',
        businesscategory: '',
        dbid: '',
        sourcetablename: '',
        columnList: []
      },
      Businesscategorys: [],

      searchData: {
        "type": "",
        "visualizename": ""
      }
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
    choose(){
      this.visualizeForm = true;
      if(this.databaseList.length == 0){
        var url = '/api/show/databaseList';
        this.$axios.get(url,{}).then((res) => {
          this.databaseList = res.data;
        }).catch((err) => {
            this.$message({
                type: 'error',
                message: '网络错误，请重试',
                showClose: true
            })
        })
      }
    },
    getTable(val){
      console.log(val);
      var url = '/api/show/tableList';
      this.$axios.get(url,{}).then((res) => {
        this.tableList = res.data;
      }).catch((err) => {
          this.$message({
              type: 'error',
              message: '网络错误，请重试',
              showClose: true
          })
      })
    },
    getCol(val){
      console.log(val);
      var url = '/api/show/columnList?tablename=' + val;
      this.$axios.get(url,{}).then((res) => {
        this.columnList = res.data;
      }).catch((err) => {
          this.$message({
              type: 'error',
              message: '网络错误，请重试',
              showClose: true
          })
      })
    },
    edit(index,row){
      var url = '';
      switch(row.type){
        case  'line':
          url = '/editline';
          break;
        case  'pie':
          url = '/editpie';
          break;
        default:
          url = '/editbar';
          break;
      }
      this.$router.push({
        path: url, 
        query: { 
          vid: row.vid,
          businesscategorys: this.Businesscategorys
        }
      })
    },
    delVisual(index,row){
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
      var page =  _this.page.currentPage - 1;
      var url = '/api/show/visualizeList2?page=' +  page +'&size=' + _this.page.pageSize;
      this.$axios.post(url,_this.searchData).then((res) => {
          if(res.data.totalPages == 0 && _this.searchData.visualizename == '' && _this.searchData.type == ''){
            $('.empty-content').show();
            $('.table-box').hide();
          }else{
            $('.table-box').show();
            $('.empty-content').hide();
            _this.list = JSON.parse(JSON.stringify(res.data.visualizeList));
          }
          _this.page.totalCount = res.data.total;
          _this.Businesscategorys = res.data.distinctBusinesscategory;
      }).catch((err) => {
          this.$message({
              type: 'error',
              message: '网络错误，请重试',
              showClose: true
          })
      })
    },
    resetVisual(){
      this.visualizeForm = false;
      this.newVisualize = {
        visualizename: '',
        visualizedescription: '',
        type: '',
        businesscategory: '',
        dbid: '',
        sourcetablename: '',
        columnList: []
      };
    },
    addVisual(){
      var url = '/api/show/visualizeAdd';
      var obj = {
        'visualize': {
          'type': this.newVisualize.type,
          'visualizename': this.newVisualize.visualizename,
          'visualizedescription': this.newVisualize.visualizedescription,
          'businesscategory': this.newVisualize.businesscategory,
          'sourcetablename': this.newVisualize.sourcetablename,
          'dbid': this.newVisualize.dbid
        },
        'columnList': []
      };
      var colList = this.columnList;
      var selCol =  this.newVisualize.columnList;
      for(var i = 0; i < selCol.length; i++){
        for(var j=0; j<colList.length;j++){
          if(colList[j].field == selCol[i]){
            obj.columnList.push(colList[j]);
          }
        }
      }
      this.$axios.post(url,obj).then((res) => {
          if(res.data.code != 1){
              this.$message({
                  type: 'error',
                  message: '新增失败',
                  showClose: true
              })
          }
          this.resetVisual();
          this.requestData();
      }).catch((err) => {
          this.$message({
              type: 'error',
              message: '网络错误，请重试',
              showClose: true
          })
      })
    },
    exportExcel(){
     this.$confirm('确定导出视图?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        var url = '/api/show/excel/export';
        window.open(url) 
      }).catch(() => {});
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
