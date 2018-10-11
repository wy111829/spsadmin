<template>
  <div>
    <el-table
      :data="speechtabledata"
      border
      style="width:100%">
      <el-table-column prop="Name" width="200" label="话术类型" align="center"/>
      <el-table-column width="200" label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="speechupdate(scope.row.Id)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 老师评语和答题正确率弹出框 -->
    <el-dialog :visible.sync="comment" title="修改配置" width="40%" @close="closeDialog">
      <el-form ref="commentform" v-model="commentform">
        <el-form-item prop="general">
          <h1>答题正确率0%-40%</h1>
          <el-input v-model="commentform.general" :rows="3" type="textarea" placeholder="请输入老师评语"/>
        </el-form-item>
        <el-form-item prop="good">
          <h1>答题正确率40%-80%</h1>
          <el-input v-model="commentform.good" :rows="3" type="textarea" placeholder="请输入老师评语"/>
        </el-form-item>
        <el-form-item prop="excellent">
          <h1>答题正确率80%-100%</h1>
          <el-input v-model="commentform.excellent" :rows="3" type="textarea" placeholder="请输入老师评语"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addComment()">提交</el-button>
        <el-button @click="closeDialog()">取消</el-button>
      </div>
    </el-dialog>

    <!-- 答题时间弹出框 -->
    <el-dialog :visible.sync="time" title="修改配置" width="40%" @close="closeDialog">
      <el-form ref="commentform" v-model="commentform">
        <el-form-item prop="general">
          <h1>时间长于平均时间</h1>
          <el-input v-model="commentform.general" :rows="3" type="textarea" placeholder="请输入答题时间评语">这是老师评语:</el-input>
        </el-form-item>
        <el-form-item prop="good">
          <h1>时间短于平均时间</h1>
          <el-input v-model="commentform.good" :rows="3" type="textarea" placeholder="请输入答题时间评语">这是老师评语:</el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addComment('commentform')">提交</el-button>
        <el-button @click="closeDialog()">取消</el-button>
      </div>
    </el-dialog>
    <!-- 知识牵引话术配置 -->
    <el-dialog
      :visible.sync="knowledge"
      title="知识牵引话术配置"
      @close="closeDialog">
      <el-form ref="commentform" :model="knowledgeform" label-position="right" label-width="120px">
        <el-form-item label="年级" prop="gradeId">
          <el-select v-model="knowledgeform.gradeId" class="filter-item" placeholder="请选择">
            <el-option v-for="(item,index) in grades" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="学科" prop="subjectId">
          <el-select v-model="knowledgeform.subjectId" class="filter-item" placeholder="请选择">
            <el-option v-for="(item,index) in subjects" :key="index" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="教材" prop="teachingId">
          <el-select v-model="knowledgeform.teachingId" class="filter-item" placeholder="请选择">
            <el-option v-for="(item,index) in teachingconfig" :key="index" :label="item.teachingName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="课程难度" prop="difficultyId">
          <el-select v-model="knowledgeform.difficultyId" class="filter-item" placeholder="请选择">
            <el-option v-for="(item,index) in diffcult" :key="index" :label="item.Name" :value="item.Id"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <h1>知识牵引话术</h1>
          <el-input v-model="knowledgeform.content" :rows="3" type="textarea" placeholder="请输入数据"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addKnowledge()">提交</el-button>
        <el-button @click="closeDialog()">取消</el-button>
      </div>
    </el-dialog>

    <!-- 学习模块分析 -->
    <el-dialog :visible.sync="ifshowmodules" title="修改配置" width="40%" @close="closeDialog">
      <el-form ref="commentform" :model="commentform" :rules="rules" label-position="right" label-width="80px">
        <el-form-item label="学科" prop="subjectId">
          <el-select v-model="commentform.subjectId" class="filter-item" placeholder="请选择" @change="changemodule">
            <el-option v-for="(item,index) in subjects" :key="index" :label="item.subjectName" :value="item.subjectId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="学习模块" prop="moduleId">
          <el-select v-model="commentform.moduleId" class="filter-item" placeholder="请选择">
            <el-option v-for="(item,index) in newmodules" :key="index" :label="item.moduleName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="general">
          <h1>答题正确率0%-40%</h1>
          <el-input v-model="commentform.general" :rows="3" type="textarea" placeholder="请输入老师评语"/>
        </el-form-item>
        <el-form-item prop="good">
          <h1>答题正确率40%-80%</h1>
          <el-input v-model="commentform.good" :rows="3" type="textarea" placeholder="请输入老师评语"/>
        </el-form-item>
        <el-form-item prop="excellent">
          <h1>答题正确率80%-100%</h1>
          <el-input v-model="commentform.excellent" :rows="3" type="textarea" placeholder="请输入老师评语"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addComment('commentform')">提交</el-button>
        <el-button @click="closeDialog()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getCourseWordList, getCommentInfo, addCommentInfo, getKnowledgeInfo, addKnowledgeInfo } from '@/api/exp/speech'
export default {
  name: 'Speech',
  data() {
    return {
      speechtabledata: null,
      form: null,
      comment: false, // 确定老师评语和答题正确率弹出框是否显示
      // correctrate:false,//确定正确率弹出框是否显示
      time: false, // 确定答题时间弹出框是否显示
      knowledge: false, // 确定知识牵引弹出框是否显示
      ifshowmodul: false, // 确定学习模块分析弹出框是否显示
      commentdata: null, // 评论初始化数据
      ifshowmodules: null, // 用于学习模块分析
      ifshowsubjects: null, // 用于学习模块分析
      commentform: {
        wordId: null, // 话术类型id
        moduleId: null, // 模块ID
        subjectId: null, // 学科id
        general: null, // 正确率40-80话术
        good: null, // 正确率40-80话术
        excellent: null// 正确率80-100话术
      },
      knowledgeform: {// 知识点话术
        gradeId: 1,
        subjectId: 1,
        teachingId: 0,
        difficultyId: 1,
        content: null
      },
      grades: null, // 年级初始信息
      subjects: null, // 学科初始信息
      teachingconfig: null, // 教材初始信息
      diffcult: null, // 难易程度初始信息
      modules: null, // 学习模块下拉框显示需要
      newmodules: [], // 改变学科 学习模块也更新
      rules: {
        moduleId: [
          { required: true, message: '请选择学习模块', trigger: 'change' }
        ],
        subjectId: [
          { required: true, message: '请选择学科', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    const that = this
    that.getCourseWordList()
  },
  methods: {
    speechupdate(id) { // 点击编辑按钮 弹出数据
      const that = this
      that.commentdata = null// 获取新宿句之前清空
      if (id === 1 || id === 2) {
        that.comment = true
        that.getCommentInfo(id)
      } else if (id === 3) {
        // 时间配置
        that.time = true
        that.getCommentInfo(id)
      } else if (id === 4) {
        that.knowledge = true
        that.getKnowledgeInfon(id)
      } else {
        that.ifshowmodules = true
        that.getCommentInfo(id)
      }
      that.commentform.wordId = id
      that.knowledgeform.wordId = id
      console.log(that.commentdata)
    },
    getCourseWordList() { // 获取表格数据
      const that = this
      getCourseWordList(that.form).then(response => {
        if (response.stat === 1) {
          that.speechtabledata = response.data
          console.log(this.speechtabledata)
        } else {
          this.$message({
            message: response.data,
            type: 'waring'
          })
        }
      })
    },
    getCommentInfo(wordId) { // 获取页面初始化数据
      const that = this
      if (wordId !== 5) { // 1-老师评语 2-答题正确率 3-答题时间
        getCommentInfo({ wordId: wordId }).then(response => {
          if (response.stat === 1) {
            that.commentdata = response.data.comments
            that.commentshow()
          } else {
            this.$message({
              message: response.data,
              type: 'waring'
            })
          }
        })
      } else {
        getCommentInfo({ wordId: wordId }).then(response => {
          if (response.stat === 1) {
            that.commentdata = response.data.comments
            that.modules = response.data.modules
            that.subjects = response.data.subjects
            that.commentshow()
            console.log(that.subjects)
          } else {
            this.$message({
              message: response.data,
              type: 'waring'
            })
          }
        })
      }
    },
    getKnowledgeInfon() { // 获取知识牵引话术信息
      const that = this
      getKnowledgeInfo(that.knowledgeform).then(response => {
        if (response.stat === 1) {
          that.diffcult = response.data.difficulty
          that.grades = response.data.grades
          that.subjects = response.data.subjects
          that.teachingconfig = response.data.teachingConfig
          that.knowledgeform.content = response.data.content
          console.log(that.knowledgeform.content)
          console.log(that.teachingconfig)
        }
      })
    },
    addComment(commentform) { // 修改评论
      const that = this
      this.$refs[commentform].validate((valid) => {
        if (valid) {
          addCommentInfo(that.commentform).then(response => {
            var type = (response.stat === 1 ? '修改成功' : response.data)
            this.$message({
              message: type
            })
            if (response.stat === 1) {
              that.$refs['commentform'].resetFields()// 重置表单
              that.comment = false// 关闭弹出框
              that.time = false
              that.ifshowmodules = false
            }
          })
        } else {
          alert('有错误')
        }
      })
    },
    commentshow() { // 确定在哪个位置显示哪个评论
      const that = this
      console.log(that.commentdata)
      console.log('评论测试')
      if (that.commentdata != null) {
        for (let i = 0; i < that.commentdata.length; i++) {
          var data = that.commentdata[i]
          if (data.type === 1 || data.type === 2 || data.type === 5) { // 表示老师评语和答题正确率 以及学习模块分析
            switch (data.kind) {
              case 1:that.commentform.general = data.content
                break
              case 2:that.commentform.good = data.content
                break
              case 3:that.commentform.excellent = data.content
                break
              default:
            }
          }
          if (data.type === 3) {
            switch (data.kind) {
              case 1:that.commentform.general = data.content// 时间长于平均值
                break
              case 2:that.commentform.good = data.content// 时间短于平均值
                break
              default:
            }
          }
        }
      }
    },
    addKnowledge() { // 知识点话术修改
      const that = this
      addKnowledgeInfo(that.knowledgeform).then(response => {
        var type = (response.stat === 1 ? '修改成功' : response.data)
        this.$message({
          message: type
        })
        if (response.stat === 1) {
          that.$refs['commentform'].resetFields()// 重置表单
          that.knowledge = false// 关闭弹出框
        }
      })
    },
    closeDialog() {
      this.comment = false
      this.time = false
      this.knowledge = false
      this.ifshowmodules = false
      this.$refs['commentform'].resetFields()
      // this.$refs['knowledgeform'].resetFields();//重置表单
    },
    changemodule(subjectId) { // 联动下拉框  当学科下拉框改变 模块下拉框做相应的改变
      console.log(subjectId)
      console.log(this.modules[0])
      for (let i = 0; i < this.modules.length; i++) {
        if (this.modules[i].subjectId === subjectId) {
          this.newmodules.push({
            'id': this.modules[i].id,
            'moduleName': this.modules[i].moduleName
          })
        } else {
          this.$message({
            message: '没有匹配的学习模块'
          })
        }
      }
      console.log(this.newmodules)
    }
  }
}
</script>
