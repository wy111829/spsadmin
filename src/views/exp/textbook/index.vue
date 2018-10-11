<template>
  <div class="app-container">
    <div class="filter-container">
      <div style="float: right">
        <el-button type="primary" @click="formInit()">添加教材</el-button>
      </div>
      年级：
      <el-select v-model="data.query.gradeId" placeholder="请选择年级" @change="queryChange">
        <el-option :key="0" :value="0" label="不限制" />
        <el-option
          v-for="item in grades"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      科目：
      <el-select v-model="data.query.subjectId" placeholder="请选择科目" @change="queryChange">
        <el-option :key="0" :value="0" label="不限制" />
        <el-option
          v-for="item in subjects"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </div>

    <el-table v-loading.body="data.loading" :data="data.list" border highlight-current-row style="width: 100%">
      <el-table-column prop="id" label="ID" width="120" align="center" />
      <el-table-column label="年级" width="120" align="center">
        <template slot-scope="scope">
          {{ grades[scope.row.gradeId].name }}
        </template>
      </el-table-column>
      <el-table-column label="科目" width="120" align="center">
        <template slot-scope="scope">
          {{ subjects[scope.row.subjectId].name }}
        </template>
      </el-table-column>
      <el-table-column prop="teachingName" label="教材" />
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
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="formInit(scope.row.id)">编辑</el-button>
          <el-button type="danger" size="small" @click="delDetail(scope.row)">删除</el-button>
        </template>
      </el-table-column>
      <template slot="empty">暂无相关数据</template>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        :current-page="data.page.current"
        :total="data.page.total"
        :page-size="data.page.size"
        :page-sizes="[10]"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog v-if="form.visible" :title="'教材' + (form.data.id > 0 ? '编辑' : '添加')" :visible.sync="form.visible">
      <el-form :model="form.data">
        <el-form-item label="教材名称" label-width="100px">
          <el-input v-model="form.data.teachingName" auto-complete="off" />
        </el-form-item>
        <el-form-item label="年级" label-width="100px">
          <el-select v-model="form.data.gradeId" placeholder="请选择年级">
            <el-option
              v-for="item in grades"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="科目" label-width="100px">
          <el-select v-model="form.data.subjectId" placeholder="请选择科目">
            <el-option
              v-for="item in subjects"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="地区" label-width="100px">
          <el-checkbox :indeterminate="form.indeterminate" v-model="form.checkAll" @change="handleProvinceCheckAll">全选</el-checkbox>
          <el-checkbox-group v-model="form.provinces" @change="handleProvinceChange">
            <el-checkbox v-for="province in provinces" :label="province.id" :key="province.id" style="margin: 0 30px 0 0">{{ province.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="form.visible = false">取 消</el-button>
        <el-button type="primary" @click="formSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getDictionary, getList, getDetail, addDetail, editDetail, delDetail } from '@/api/exp/textbook'

const defaultForm = {
  id: '',
  gradeId: '',
  subjectId: '',
  teachingName: '',
  areas: ''
}

export default {
  name: 'Textbook',
  data() {
    return {
      data: {
        loading: false,
        query: {
          gradeId: 0,
          subjectId: 0
        },
        list: [],
        page: {
          current: 1,
          total: 0,
          size: 10
        }
      },
      form: {
        data: Object.assign({}, defaultForm),
        provinces: [],
        provincesId: [],
        checkAll: false,
        indeterminate: true,
        visible: false
      },
      grades: {},
      subjects: {},
      provinces: {}
    }
  },
  created() {
    this.getDictionary()
    setTimeout(() => {
      this.getList()
    }, 500)
  },
  methods: {
    queryChange(select) {
      this.data.page.current = 1
      this.getList()
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
        this.form.provincesId.push(provinces[i].id)
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
    getList() {
      this.data.loading = true
      const query = {
        gradeId: this.data.query.gradeId,
        subjectId: this.data.query.subjectId,
        curpage: this.data.page.current - 1
      }
      getList(query).then(response => {
        this.data.page.current = response.data.curpage
        this.data.page.size = response.data.perpage
        this.data.page.total = response.data.total
        this.data.list = response.data.result
        this.data.loading = false
      }).catch(() => {})
    },
    formInit(id) {
      if (id === undefined || id === 0) {
        this.form.data = Object.assign({}, defaultForm)
        this.form.provinces = this.form.provincesId
        this.form.checkAll = true
        this.form.indeterminate = false
        this.form.visible = true
      } else {
        getDetail(id).then(response => {
          this.form.data.id = response.data.teachingInfo.id
          this.form.data.gradeId = response.data.teachingInfo.gradeId
          this.form.data.subjectId = response.data.teachingInfo.subjectId
          this.form.data.teachingName = response.data.teachingInfo.teachingName
          if (response.data.selected_areas.length === 0) {
            this.form.provinces = this.form.provincesId
          } else if (response.data.selected_areas.length === 1 && response.data.selected_areas[0] === 0) {
            this.form.provinces = this.form.provincesId
          } else {
            this.form.provinces = response.data.selected_areas
          }
          const checkedCount = this.form.provinces.length
          const provincesCount = this.form.provincesId.length
          this.form.checkAll = checkedCount === provincesCount
          this.form.indeterminate = checkedCount > 0 && checkedCount < provincesCount
          this.form.visible = true
        }).catch(() => {})
      }
    },
    formSubmit() {
      const data = {
        gradeId: this.form.data.gradeId,
        subjectId: this.form.data.subjectId,
        teachingName: this.form.data.teachingName,
        areas: this.form.provinces.join(',')
      }
      if (this.form.data.id > 0) {
        this.$set(data, 'id', this.form.data.id)
        editDetail(data).then(response => {
          if (response.stat === 1) {
            this.$notify({
              title: '编辑成功',
              message: this.form.data.teachingName + '”编辑成功！',
              type: 'success'
            })
            this.form.visible = false
            this.getList()
          }
        }).catch(() => {})
      } else {
        addDetail(data).then(response => {
          if (response.stat === 1) {
            this.$notify({
              title: '添加成功',
              message: this.form.data.teachingName + '”添加成功！',
              type: 'success'
            })
            this.form.visible = false
            this.getList()
          }
        }).catch(() => {})
      }
    },
    delDetail(obj) {
      this.$confirm('此操作将删除《' + obj.teachingName + '》，是否继续？', '删除教材', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delDetail(obj.id).then(response => {
          this.$notify({
            title: '删除成功',
            message: '《' + obj.teachingName + '》删除成功！',
            type: 'success'
          })
          this.getList()
        }).catch(() => {})
      })
    },
    handleProvinceCheckAll(val) {
      this.form.provinces = val ? this.form.provincesId : []
      this.form.indeterminate = false
    },
    handleProvinceChange(value) {
      const checkedCount = value.length
      const provincesCount = this.form.provincesId.length
      this.form.checkAll = checkedCount === provincesCount
      this.form.indeterminate = checkedCount > 0 && checkedCount < provincesCount
    },
    handleSizeChange(size) {
      this.data.page.size = size
      this.getList()
    },
    handleCurrentChange(page) {
      this.data.page.current = page
      this.getList()
    }
  }
}
</script>

