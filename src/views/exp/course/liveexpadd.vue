<template>
  <div>
    <el-dialog
      :visible.sync="dialogFormVisible"
      title="添加体验课课程配置"
      @close="closeDialog">
      <el-form ref="temp" :rules="rules" :model="temp" label-position="left" label-width="120px">
        <el-form-item label="年级" prop="gradeId">
          <el-select v-model="temp.gradeId" class="filter-item" placeholder="请选择">
            <el-option v-for="(item,index) in grades" :key="index" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="学科" prop="subjectId">
          <el-select v-model="temp.subjectId" class="filter-item" placeholder="请选择">
            <el-option v-for="(item,index) in subjects" :key="index" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <!-- 接口并无教材信息 -->
        <el-form-item label="教材" prop="teachingId">
          <el-select v-model="temp.teachingId" class="filter-item" placeholder="请选择">
            <el-option v-for="(item,index) in teachingconfig" :key="index" :label="item.teachingName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="学习情况" prop="difficultyId">
          <el-select v-model="temp.difficultyId" class="filter-item" placeholder="Please select">
            <el-option v-for="(item,index) in diffcult" :key="index" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <div><!--动态增减-->
          <div v-for="(item,index) in count" :key="index" class="showdatediv">
            <el-form-item label="上课星期时间">
              <el-select v-model="temp['weekList'][index]['wk']" class="filter-item" placeholder="Please select" @change="whathappen">
                <el-option v-for="(item,tab) in date" :key="tab" :label="item.name" :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-time-select
                v-model="temp.weekList[index]['st']"
                :picker-options="{
                  start: '07:30',
                  step: '00:15',
                  end: '23:00',
                }"
                placeholder="起始时间"
              />
              <el-time-select
                v-model="temp.weekList[index]['et']"
                :picker-options="{
                  start: '07:30',
                  step: '00:15',
                  end: '23:00',
                  minTime: temp.weekList[index]['st']
                }"
                placeholder="结束时间"
              />
            </el-form-item>
            <div class="marginsetdiv">
              <el-button v-if="count[index]" type="primary" @click="addDate()">新增</el-button>
              <el-button v-if="!count[index]" type="primary" @click="delDate(index)">删除</el-button>
            </div>
          </div>
        </div>
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="temp.courseName"/>
        </el-form-item>
        <el-form-item label="课程简介" prop="courseDesc">
          <el-input v-model="temp.courseDesc"/>
        </el-form-item>
        <el-form-item label="教师ID" prop="teacherId">
          <el-input v-model.number="temp.teacherId"/>
        </el-form-item>
        <el-form-item label="直播场次ID" prop="planId">
          <el-input v-model.number="temp.planId"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false,count=[1]">取消</el-button>
        <el-button type="primary" @click="addliveexp('temp')">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { addliveexpform, updateliveexpform } from '@/api/exp/liveexpconfig'
export default {
  name: 'Liveexpadd',
  props: {
    grades: {
      type: Array,
      required: true
    },
    subjects: {
      type: Array,
      required: true
    },
    diffcult: {
      type: Array,
      required: true
    },
    editrowdata: {
      type: Object | null,
      required: true
    },
    ifshowadd: {
      type: Boolean,
      required: true
    },
    teachingconfig: {
      type: Object | null,
      required: true
    }
  },
  data() {
    return {
      ed: '',
      rules: {
        gradeId: [{
          required: true,
          message: '请选择年级',
          trigger: 'change'
        }],
        subjectId: [{
          required: true,
          message: '请选择科目',
          trigger: 'change'
        }],
        difficultyId: [{
          required: true,
          message: '请选择学习情况',
          trigger: 'change'
        }],
        teachingId: [{
          required: true,
          message: '请选择教材',
          trigger: 'change'
        }],
        // wk: [{
        //   required: true,
        //   message: '请选择上课星期',
        //   trigger: 'change'
        // }],
        // st: [{
        //   required: true,
        //   message: '请填写上课开始时间',
        //   trigger: 'change'
        // }],
        // et: [{
        //   required: true,
        //   message: '请填写上课结束时间',
        //   trigger: 'change'
        // }],
        courseName: [{
          required: true,
          message: '请填写课程名称',
          trigger: 'blur'
        }],
        courseDesc: [{
          required: true,
          message: '请填写课程简介',
          trigger: 'blur'
        }],
        teacherId: [{
          required: true,
          message: '请填写教师ID'
          // trigger: 'blur'
        },
        { type: 'number', message: '教师ID必须为数字值' }
        ],
        planId: [{
          required: true,
          message: '请填写直播场次ID'
          // trigger: 'blur'
        },
        { type: 'number', message: '直播场次ID必须为数字值' }
        ]

      },
      time: '', // 时间设置
      temp: {
        'courseId': null,
        'gradeId': null, // 年级id
        'subjectId': null, // 学科id
        'difficultyId': null, // 难度id
        'courseName': null, // 课程名称
        'courseDesc': null, // 课程描述
        'planId': null, // 场次id
        'teacherId': null, // 教师id
        'teachingId': null, // 教材id
        // 'status': null,
        // 'isArts': null,
        // 'createTime': '2018-09-11T11:49:53+08:00',
        // 'updateTime': '2018-09-11T11:49:53+08:00',
        // 'coursejieshao': null,
        weekList: [// 时间
          {
            'wk': 0,
            'st': '7:30',
            'et': '8:30'
          }
        ]
      },
      date: [
        {
          id: 0,
          name: '周日'
        },
        {
          id: 1,
          name: '周一'
        },
        {
          id: 2,
          name: '周二'
        },
        {
          id: 3,
          name: '周三'
        },
        {
          id: 4,
          name: '周四'
        },
        {
          id: 5,
          name: '周五'
        },
        {
          id: 6,
          name: '周六'
        }
      ],
      dialogFormVisible: true, // 是否展示弹出框
      count: [1] // 显示有多少个时间div 初始状态下有一个
    }
  },

  created() {
    if (this.editrowdata != null) {
      this.temp.courseId = this.editrowdata.id
      this.temp.gradeId = this.editrowdata.gradeId// 这里的时间属性是time表示
      this.temp.subjectId = this.editrowdata.subjectId
      this.temp.difficultyId = this.editrowdata.difficultyId
      this.temp.courseName = this.editrowdata.courseName
      this.temp.courseDesc = this.editrowdata.courseDesc
      this.temp.planId = this.editrowdata.planId
      this.temp.teacherId = this.editrowdata.teacherId
      this.temp.teachingId = this.editrowdata.teachingId
      var time = JSON.parse(this.editrowdata.time)
      this.temp.weekList = time.splice(0, 1)
      for (let i = 0; i < time.length; i++) {
        this.temp.weekList.push(time[i])
      }
      for (let i = 1; i < this.temp.weekList.length; i++) {
        this.count.push(0)
        //     console.log(this.temp.weekList[i]['wk'])
      }
      console.log(this.temp.weekList)
    //   if (!(this.temp.time instanceof Array) && this.temp.time != null) {
    //     var time = JSON.parse(this.temp.time)
    //     this.temp.weekList = time // 要传给后台的是用weekList表示
    //     // delete this.temp.time
    //     this.temp.time = null
    //     console.log(this.temp.time)
    //     console.log(this.temp.weekList)
    //   }
    //   for (let i = 1; i < this.temp.weekList.length; i++) {
    //     this.count.push(0)
    //     console.log(this.temp.weekList[i]['wk'])
    //   }
    //   console.log(this.count)
    }
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$refs['temp'].resetFields()
          this.$emit('updateprop', this.dialogFormVisible)
          done()
        })
        .catch(_ => {})
    },
    addDate(index) { // 新增时间列表
      this.count.push(0)
      this.temp.weekList.push({
        'wk': null,
        'st': null,
        'et': null
      })
    },
    closeDialog() { // 点击关闭按钮
      this.count = [1]
      // this.addbuttonvalue = 1
      // this.editbuttonvalue = 0
      this.$refs['temp'].resetFields()
      this.$emit('updateprop', this.dialogFormVisible)
    },
    delDate(index) { // 删除日期
      if (this.count.length > 1) {
        this.count.splice(index, 1)
        this.temp.weekList.splice(index, 1)
      }
    },
    addliveexp(formName) { // 点击提交按钮 需要判断是添加提交还是编辑提交 可根据是否有editrowdata来判断
      const that = this
      if (that.editrowdata != null) { // 点击的是编辑按钮
        that.updateliveexp(formName)
      } else { // 点击的是添加按钮
        that.$refs[formName].validate((valid) => {
          if (valid) {
            that.temp.weekList = JSON.stringify(that.temp.weekList)
            addliveexpform(that.temp).then(response => { // 查询数据  需要返回page和limit以及查询条件
              if (response.stat === 1) { // 表示正确传来值
                this.$message({
                  message: '成功添加id为' + response.data + '的体验课', // 展示提示信息
                  type: 'success'
                })
                that.dialogFormVisible = false
                that.$refs['temp'].resetFields()// 重置form表单
                that.dialogFormVisible = false// dialog不显示
                that.$emit('updateprop', this.dialogFormVisible)// 告诉父组件 dialog不显示
                that.$emit('updatesuccess', 1)// 告诉父组件 添加成功  需要 刷新table
              } else {
                this.$message({
                  message: response.data, // 展示错误原因
                  type: 'waring'
                })
              }
            })
          } else {
            // 用户填写的信息不符合要求
          }
        })
      }
    },
    updateliveexp(formName) {
      const that = this
      that.temp.courseId = that.editrowdata.id
      that.temp.weekList = JSON.stringify(that.temp.weekList)
      that.$refs[formName].validate((valid) => {
        if (valid) {
          updateliveexpform(that.temp).then(response => { // 查询数据  需要返回page和limit以及查询条件
            if (response.stat === 1) { // 表示正确传来值
              this.$message({
                message: '课程id为' + response.data + '的，数据修改成功。'
              })
              this.$refs['temp'].resetFields()// 重置form表单
              this.dialogFormVisible = false // dialog不显示
              this.$emit('updateprop', this.dialogFormVisible)// 告诉父组件dialog不用显示了
              this.$emit('updatesuccess', 1)// 告诉父组件 修改成功  需要 刷新table
            } else {
              this.$message({
                message: response.data, // 展示错误原因
                type: 'waring'
              })
            }
          })
        } else {
          alert('cuowu')
        }
      })
    },
    whathappen(value) {
      console.log(value)

      // this.temp.weekList[index]['wk']=value
    }
  }
}
</script>
<style>
.el-dialog__body{
    display: flex;
    justify-content: center;
    align-items: center;
}
.el-form-item__label{
  text-align: right !important;
}
.el-form-item{
  display: flex;
  flex-direction: row
}
.el-form-item__content{
  margin-left: 0px !important
}
.showdatediv{
    border: 1px solid #dcdfe5;
    padding-top: 20px;
    margin-bottom: 10px;
}
.marginsetdiv{
  margin-left: 240px;
  margin-bottom: 3px
}

</style>

