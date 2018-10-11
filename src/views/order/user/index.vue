<template>
  <div class="app-container">
    <div class="filter-container">
      <div style="float: right">
        <el-button type="primary" @click="createOrder">继续约课</el-button>
      </div>
      用户ID：
      <el-input v-model="userId" placeholder="请输入用户ID" prefix-icon="el-icon-search" style="width: 150px" />
      <el-button type="primary" @click="getOrder(userId)">查询</el-button>
    </div>

    <el-table v-loading.body="loading" :data="list" border highlight-current-row style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" align="center" />
      <el-table-column prop="courseName" label="课程名称" width="150" align="center" />
      <el-table-column label="年级" width="80" align="center">
        <template slot-scope="scope">
          {{ grades[scope.row.gradeId] ? grades[scope.row.gradeId].name : '未知' }}
        </template>
      </el-table-column>
      <el-table-column label="科目" width="80" align="center">
        <template slot-scope="scope">
          {{ subjects[scope.row.subjectId] ? subjects[scope.row.subjectId].name : '未知' }}
        </template>
      </el-table-column>
      <el-table-column label="地区" width="80" align="center">
        <template slot-scope="scope">
          {{ provinces[scope.row.areaId] ? provinces[scope.row.areaId].name : '不限' }}
        </template>
      </el-table-column>
      <el-table-column prop="planId" width="80" label="场次ID" />
      <el-table-column prop="teacherId" width="80" label="教师ID" />
      <el-table-column prop="difficultyId" width="80" label="难度ID" />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0" type="info">未 知</el-tag>
          <el-tag v-if="scope.row.type === 1" type="success">真约课</el-tag>
          <el-tag v-if="scope.row.type === 2" type="danger">假约课</el-tag>
          <el-tag v-if="scope.row.status === 1" type="primary">有效</el-tag>
          <el-tag v-if="scope.row.status === 0" type="warning">无效</el-tag>
          <el-tag v-if="scope.row.isStudy === 1" type="primary">有报告</el-tag>
          <el-tag v-if="scope.row.isStudy === 0" type="warning">无报告</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" width="180" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.startTime">{{ scope.row.startTime | parseTime }}</span>
          <span v-if="!scope.row.startTime">未知</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" width="180" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.endTime">{{ scope.row.endTime | parseTime }}</span>
          <span v-if="!scope.row.endTime">未知</span>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.createTime | parseTime }}
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.updateTime | parseTime }}
        </template>
      </el-table-column>
      <template slot="empty">
        <span v-if="userId">暂无相关数据</span>
        <span v-if="!userId">请输入用户ID查询</span>
      </template>
    </el-table>
  </div>
</template>
<script>
import { getDictionary, getOrder } from '@/api/order/user'

export default {
  name: 'UserOrder',
  data() {
    return {
      userId: '',
      loading: false,
      list: [],
      grades: {},
      subjects: {},
      provinces: {}
    }
  },
  created() {
    this.getDictionary()
    if (this.$route.query.userId) {
      this.userId = this.$route.query.userId
      setTimeout(() => {
        this.getOrder(this.userId)
      }, 500)
    }
  },
  methods: {
    createOrder() {
      this.$router.push({ path: '/experience/course/index', query: { userId: this.userId }})
    },
    parseGrade(grades) {
      this.grades = {}
      for (var i in grades) {
        this.$set(this.grades, grades[i].id, grades[i])
      }
    },
    parseSubject(subjects) {
      this.subjects = {}
      for (var i in subjects) {
        this.$set(this.subjects, subjects[i].id, subjects[i])
      }
    },
    parseProvince(provinces) {
      this.provinces = {}
      for (var i in provinces) {
        this.$set(this.provinces, provinces[i].id, provinces[i])
      }
    },
    getDictionary() {
      getDictionary().then(response => {
        this.parseGrade(response.data.grades)
        this.parseSubject(response.data.subjects)
        this.parseProvince(response.data.provinces)
      }).catch(() => {})
    },
    getOrder(userId) {
      this.loading = true
      this.userId = userId
      getOrder(userId).then(response => {
        this.list = response.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
