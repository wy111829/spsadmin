<template>
  <div>
    <div class="app-container">
      <!-- 数据查询 -->
      <div class="filter-container">
        <el-form ref="form" v-model="form" :rules="rules" label-width="100px">
          <!-- <el-form-item  prop="showgrades"> -->
          年级:<el-select v-model="form.gradeId" style="width: 140px;" class="filter-item">
            <el-option v-for="(item,index) in grades" :key="index" :label="item.name" :value="item.id"/>
          </el-select>
          <!-- </el-form-item> -->
          <!-- <el-form-item prop="showsubjects"> -->
          科目：<el-select v-model="form.subjectId" style="width: 140px" class="filter-item">
            <el-option v-for="(item,index) in subjects" :key="index" :label="item.name" :value="item.id"/>
          </el-select>
          <!-- </el-form-item> -->
          <!-- <el-form-item prop="showdiffcult"> -->
          难度：<el-select v-model="form.difficultyId" class="filter-item" style="width: 140px">
            <el-option v-for="(item,index) in diffcult" :key="index" :label="item.name" :value="item.id"/>
          </el-select>
          <!-- </el-form-item> -->
          <!-- <el-form-item prop="showstatus"> -->
          状态：<el-select v-model="form.status" style="width: 140px" class="filter-item">
            <el-option v-for="(item,index) in status" :key="index" :label="item.name" :value="item.id"/>
          </el-select>
          <!-- </el-form-item> -->
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="onSubmit(form)">查询</el-button>
          <el-button class="filter-item addexpconfig" type="primary" icon="el-icon-add" @click="showadddialog()">添加体验课课程配置</el-button>
        </el-form>

      </div>
      <liveexpadd v-if="addifshow" :ifshowadd="addifshow" :grades="grades" :subjects="subjects" :diffcult="diffcult" :editrowdata="editrowdata" :teachingconfig="teaching" @updateprop="nweaddifshow" @updatesuccess="ifupdatesuccess"/><!--添加弹出框-->
      <!-- 表格 -->

      <el-table
        :data="list"
        border
        highlight-current-row
        style="width: 100%">
        <el-table-column label="ID" align="center" width="65">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="年级" width="80" align="center">
          <template slot-scope="scope">
            <span>{{ gradesnew[scope.row.gradeId] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学科" width="80" align="center">
          <template slot-scope="scope">
            <span>{{ subjectnew[scope.row.subjectId] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="难度" width="200" align="center">
          <template slot-scope="scope">
            <span>{{ newdiffcultname[scope.row.difficultyId] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="courseName" label="课程名称" width="150" align="center"/>
        <el-table-column prop="teacherId" label="教师ID" width="80" align="center"/>
        <el-table-column prop="planId" label="直播场次ID" align="center" width="95"/>
        <el-table-column label="所属科目" width="80" align="center">
          <template slot-scope="scope">
            <span>{{ allowkemu(scope.row.isArts) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template slot-scope="scope">
            <span>{{ status[scope.row.status+1].name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="oprate" label="操作" align="center" width="536" >
          <template slot-scope="scope">
            <el-button type="primary" width="94" @click="showtestlist(scope.row.planId)">试题列表</el-button>
            <el-button type="primary" width="94" @click="liveexpedit(scope.row)">编辑
            </el-button>
            <el-button type="primary" width="160" @click="cktimelist(scope.row.time,scope.row.id)">查看时间列表
            </el-button>
            <el-button type="primary" width="94" @click="setstatus(scope.row.id,scope.row.status)">{{ whattap(scope.row.status) }}
            </el-button>
            <el-button style="background-color:red" type="primary" width="94" @click="yueke(scope.row)">约课
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码展示 -->

      <div class="pagination-container">
        <!-- <el-pagination v-show="total>0" :current-page="form.perpage" :page-sizes="[10,20,30, 50]" :page-size="form.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" /> -->
        <el-pagination
          :page-sizes="[10]"
          :total="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
      </div>
    </div>
    <!-- 查看时间列表弹出框 -->
    <timelist v-if="ifshowtimelist" :timelistdata="timelistdata" :courseid="courseid" @updateifshow="timelistifshow"/>
    <!-- 测试使用  弹出约课需要填写的弹出框 -->
    <el-dialog
      :visible.sync="ifshowyueke"
      title="约课"
      @close="closeDialog">
      <el-form ref="yuekeform" :model="yuekeform" label-position="right" label-width="120px">
        <el-form-item label="用户ID" >
          <el-input v-model="yuekeform.userId"/>
        </el-form-item>
        <el-form-item label="场次ID">
          <el-input v-model="yuekeform.planId" readonly/>
        </el-form-item>
        <el-form-item label="年级">
          <el-input v-model="yuekeform.gradeId" readonly>{{ gradesnew[yuekeform.gradeId] }}</el-input>
        </el-form-item>
        <el-form-item label="学科">
          <el-input v-model="yuekeform.subjectId" readonly>{{ subjectnew[yuekeform.subjectId] }}</el-input>
        </el-form-item>
        <el-form-item label="学习时间">
          <el-select v-model="yuekeform.startTime" placeholder="请选择">
            <el-option v-for="(item,tab) in timearray" :key="tab" :label="'周'+item.wk+'开始时间:'+item.st+'结束时间:'+item.et" :value="tab"/>
          </el-select>
        </el-form-item>
        <el-form-item label="难度">
          <el-input v-model="yuekeform.difficultyId" readonly>{{ newdiffcultname[yuekeform.difficultyId] }}</el-input>
        </el-form-item>
        <el-form-item label="体验课配置ID">
          <el-input v-model="yuekeform.courseConfigId" readonly/>
        </el-form-item>
        <el-form-item label="教师ID">
          <el-input v-model="yuekeform.teacherId" readonly/>
        </el-form-item>
        <el-form-item label="订单课程名称">
          <el-input v-model="yuekeform.courseConfigName" readonly/>
        </el-form-item>
        <el-form-item label="地区" label-width="100px">
          <el-checkbox :indeterminate="formarea.indeterminate" v-model="formarea.checkAll" @change="handleProvinceCheckAll">全选</el-checkbox>
          <el-checkbox-group v-model="formarea.provinces" :min="1" :max="1" @change="handleProvinceChange">
            <el-checkbox v-for="province in provinces" :label="province.id" :key="province.id" style="margin: 0 30px 0 0">{{ province.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ifshowyueke=false">取消</el-button>
        <el-button type="primary" @click="commityueke()">提交</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import { getAllLiveExpConfig, setCourseStatus, addTestOrderRecode } from '@/api/exp/liveexpconfig'
import liveexpadd from './liveexpadd.vue'
import timelist from './timelist.vue'
import testlist from './testlist.vue'
import { getDictionary } from '@/api/exp/textbook'
/* Layout */
// import expquery from './query.vue'
export default {
  name: 'Exptable', // 体验课配置表格
  components: {
    liveexpadd,
    timelist,
    testlist
  },
  data() {
    return {
      form: {
        subjectId: 0,
        difficultyId: 0,
        gradeId: 0,
        status: -1,
        curpage: 1,
        limit: 10
      },
      list: null,
      subjects: null, // 科目
      grades: null, // 年级
      teaching: null, // 教材
      subjectStudy: null, // 难易程度
      diffcult: [
        {
          id: 0,
          name: '全部'
        },
        {
          id: 1,
          name: '基础一般，巩固课内知识'
        },
        {
          id: 2,
          name: '基础扎实，拓展思维能力'
        },
        {
          id: 3,
          name: '没学过英语'
        },
        {
          id: 4,
          name: '会简单单词'
        },
        {
          id: 5,
          name: '会简单句子'
        },
        {
          id: 6,
          name: '能流利沟通'
        },
        {
          id: 7,
          name: '仅校内学习'
        },
        {
          id: 8,
          name: '校外学习1年'
        },
        {
          id: 9,
          name: '校外学习2年'
        },
        {
          id: 10,
          name: '校外学习3年'
        }

      ], // 难易程度
      status: [
        {
          id: -1,
          name: '全部'
        }, {
          id: 0,
          name: '冻结'
        },
        {
          id: 1,
          name: '生效'
        }],
      rules: {
        gradeId: [{
          required: true,
          message: '请选择年级',
          trigger: 'blur'
        }],
        subjectId: [{
          required: true,
          message: '请选择科目',
          trigger: 'blur'
        }],
        difficultyId: [{
          required: true,
          message: '请选择难易程度',
          trigger: 'blur'
        }],
        status: [{
          required: true,
          message: '请选择状态',
          trigger: 'blur'
        }]
      },
      total: null, // 总的数据条数
      addifshow: false,
      gradesnew: {}, // 年级对应关系
      subjectnew: {}, // 课程对应的关系
      newdiffcultname: {}, // 难度
      // teachingConfig:{},//教材id和name对应关系
      editrowdata: null, // 编辑行的数据
      ifshowtimelist: false, // 是否显示时间列表
      timelistdata: null, // 时间列表
      courseid: '', // 用来显示时间列表弹出框title
      ifshowyueke: false, // 是否展示约课弹出框
      // userid:null,//当学生点击继续约课 会 携带 用户id 进来 需要接收 在点击约课提交时 提交
      yuekeform: {
        userId: null,
        planId: null,
        gradeId: null,
        subjectId: null,
        startTime: 1,
        endTime: 2,
        difficultyId: null,
        courseConfigId: null,
        teacherId: null,
        courseConfigName: null,
        areaId: null
      },
      formarea: {
        provinces: [],
        provincesId: [],
        checkAll: false,
        indeterminate: true,
        visible: false
      },
      timearray: [],
      provinces: {}
    }
  },
  created: function() {
    this.getexpinfo()
    if (this.$route.query.userId) {
      this.yuekeform.userId = this.$route.query.userId
    }
  },
  methods: {
    onSubmit(form) {
      const that = this
      that.getexpinfo()
    },
    allowkemu(value) {
      if (value === 1) {
        return '文科'
      } else {
        return '理科'
      }
    },
    nweaddifshow(data) { // 从子组件liveexpadd.vue获取的数据
      this.addifshow = data
    },
    ifupdatesuccess(data) { // 从子组件liveexpadd.vue获取数据 告诉父组件数据修改成功需要刷新table
      // 刷新表格
      if (data) {
        this.getexpinfo()
      }
    },
    getgradesname() { // 获取年级id和name的对应关系
      const that = this
      for (let i = 1; i < that.grades.length; i++) {
        that.$set(that.gradesnew, that.grades[i].id, that.grades[i].name)
      }
    },
    getteachingname() { // 获取教材id和name的对应关系
      const that = this
      for (let i = 0; i < that.teaching.length; i++) {
        that.$set(that.teachingConfig, that.teaching[i]['id'], that.teaching[i].teachingName)
      }
    },
    getsubjectnewname() { // 获取年级id和name的对应关系
      const that = this
      for (let i = 1; i < that.subjects.length; i++) {
        that.$set(that.subjectnew, that.subjects[i].id, that.subjects[i].name)
      }
    },
    getnewdiffcultname() { // 获取难度对应的名字
      const that = this
      for (let i = 1; i < that.diffcult.length; i++) {
        that.$set(that.newdiffcultname, that.diffcult[i].id, that.diffcult[i].name)
      }
    },
    getexpinfo() {
      const that = this
      that.form.curpage = that.form.curpage - 1// 传过来的数据是从第0页开始
      getAllLiveExpConfig(that.form).then(response => { // 查询数据  需要返回page和limit以及查询条件
        if (response.stat === 1) { // 表示正确传来值
          that.list = response.data.courses
          that.total = response.data.total// 总个数
          that.subjects = response.data.subjects// 课程名称
          that.teaching = response.data.teachingConfig// 教材
          that.subjectStudy = response.data.subjectStudy// 难易程度
          that.subjects.splice(0, 0, { name: '全部', id: 0 })
          that.grades = response.data.grades//
          that.grades.splice(0, 0, { name: '全部', id: 0 })
          that.getgradesname()
          that.getsubjectnewname()
          that.getnewdiffcultname()
        } else {
          this.$message({
            message: response.data, // 展示错误原因
            type: 'waring'
          })
        }
      })
    },
    handleCurrentChange(val) { // 分页
      this.form.curpage = val
      this.getexpinfo()
    },
    handleSizeChange(val) { // 分页
      this.form.limit = val
      this.getexpinfo()
    },
    liveexpedit(value) {
      // 得到该行的数据
      this.editrowdata = null// 每次编辑之前先清空
      this.editrowdata = value
      this.addifshow = true
    },
    showadddialog() { // 是否显示dialog
      this.addifshow = true
      this.editrowdata = null// 点击添加按钮 清空编辑数据
    },
    showtestlist(id) { // 显示试题列表c
      // 路由跳转
      this.$router.push({
        path: '/experience/test',
        query: { planId: id }
      })
    },
    cktimelist(value, id) { // 查看时间列表
      const that = this
      that.ifshowtimelist = true
      that.timelistdata = value
      that.courseid = id
    },
    timelistifshow(data) { // 子组件传值给父组件
      this.ifshowtimelist = data
    },
    setstatus(id, value) { // 设置体验课状态
      value = value === 1 ? 0 : 1
      console.log(value)
      setCourseStatus({ courseId: id, status: value }).then(response => {
        if (response.stat === 1) {
          this.$message({
            message: 'id为' + response.data.data + '的体验课状态修改成功', // 展示错误原因
            type: 'success'
          })
          this.getexpinfo()// 设置状态成功后 需要刷新table
        } else {
          this.$message({
            message: response.data// 展示错误原因

          })
        }
      }
      )
    },
    whattap(value) { // 显示冻结还是有效
      if (value === 1) { // 有效 则按钮应该是冻结
        return '冻结'
      } else {
        return '解冻'
      }
    },
    yueke(row) { // 约课使用（测试）
      console.log(row)
      this.getDictinory()
      var time = JSON.parse(row.time)
      for (let i = 0; i < time.length; i++) {
        this.timearray.push(time[i])
      }
      this.ifshowyueke = true
      this.yuekeform.planId = row.planId
      this.yuekeform.gradeId = row.gradeId
      this.yuekeform.subjectId = row.subjectId
      this.yuekeform.difficultyId = row.difficultyId
      this.yuekeform.courseConfigId = row.id
      this.yuekeform.teacherId = row.difficultyId
      this.yuekeform.courseConfigName = row.courseName
    },
    closeDialog() { // 点击关闭按钮
      this.$refs['yuekeform'].resetFields()
      this.ifshowyueke = false
    },
    commityueke() { // 提交约课信息
      console.log(this.yuekeform)
      console.log(this.time)
      // var index = this.yuekeform.startTime
      // var startTime=this.timearray[index].st
      // var endTime=this.timearray[index].et
      // this.yuekeform.startTime=this.gettimecho(startTime);
      // yuekeform.startTime=
      addTestOrderRecode(this.yuekeform).then(response => {
        if (response.stat === 1) {
          this.$message({
            message: '约课成功', // 展示错误原因
            type: 'success'
          })
          this.$refs['yuekeform'].resetFields()
          this.ifshowyueke = false
          this.$router.push({ path: '/order/user', query: { userId: this.yuekeform.userId }})
        }
      })
    },
    parseProvince(provinces) {
      this.provinces = {}
      for (var i in provinces) {
        this.formarea.provincesId.push(provinces[i].id)
        this.$set(this.provinces, provinces[i].id, provinces[i])
      }
      console.log(this.provinces)
    },
    getDictinory() { // 获取省
      getDictionary().then(response => {
        this.parseProvince(response.data.provinces)
        // console.log(response.data.provinces)
        // console.log(this.parseProvince)
      }).catch(() => {})
    },
    handleProvinceCheckAll(val) {
      this.formarea.provinces = val ? this.formarea.provincesId : []
      this.formarea.indeterminate = false
      this.yuekeform.areaId = 0
    },
    handleProvinceChange(value) {
      const checkedCount = value.length
      const provincesCount = this.formarea.provincesId.length
      this.formarea.checkAll = checkedCount === provincesCount
      this.formarea.indeterminate = checkedCount > 0 && checkedCount < provincesCount
      this.yuekeform.areaId = value[0]
    },
    gettimecho(value) { // 转化为时间戳
      var da = new Date(value)
      console.log(da.getTime() / 1000)
    }
  }

}
</script>
<style>
.addexpconfig{
    float: right;
    margin-top: 10px;
    margin-right: 20px;
}
</style>

