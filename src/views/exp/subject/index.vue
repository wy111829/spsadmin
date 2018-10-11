<template>
  <div v-loading="loading" class="app-container">
    <el-card v-for="(subject,key) in subjects" :key="key" class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ subject.name }}</span>
        <span style="font-size: 12px">[{{ subject.alias }}]</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="getModules(key, false)">刷新</el-button>
      </div>
      <el-table v-loading="subject.loading" :data="subject.modules" height="250" border style="width: 100%">
        <el-table-column prop="id" label="ID" align="center" />
        <el-table-column label="模块">
          <template slot-scope="scope">
            <span v-if="scope.row.id > 0 && scope.row.edit !== true">{{ scope.row.moduleName }}</span>
            <el-input v-if="scope.row.id == 0 || scope.row.edit == true" v-model="scope.row.moduleName" placeholder="请输入模块名称" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.id == 0 || scope.row.edit == true"
              :disabled="scope.row.disabled"
              type="success"
              size="small"
              @click="saveModule(scope.row, key)"
            >保存</el-button>
            <el-button
              v-if="false && scope.row.id > 0 && scope.row.edit != true"
              type="primary"
              size="small"
              @click="editModule(scope.row)"
            >编辑</el-button>
            <el-button
              v-if="scope.row.id > 0 && scope.row.edit != true"
              :disabled="scope.row.disabled"
              type="danger"
              size="small"
              @click="delModule(scope.row, key)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 30%;
    float: left;
    margin: 10px;
  }
</style>

<script>
import { getList, getModules, addModule, delModule } from '@/api/exp/subject'

const defaultForm = {
  id: '',
  moduleName: ''
}

export default {
  name: 'Subject',
  data() {
    return {
      loading: false,
      subjects: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getList().then(response => {
        for (var i in response.data) {
          const subject = response.data[i]
          this.$set(subject, 'loading', true)
          this.$set(subject, 'modules', [])
          this.subjects.push(subject)
        }
        this.loading = false
        setTimeout(() => {
          this.getModules(0, true)
        }, 500)
      }).catch(() => {})
    },
    getModules(i, go) {
      if (this.subjects[i] !== undefined) {
        this.subjects[i].loading = true
        getModules(this.subjects[i].id).then(response => {
          this.subjects[i].modules = response.data
          this.subjects[i].modules.push(Object.assign({}, defaultForm))
          this.subjects[i].loading = false
          if (go) {
            setTimeout(() => {
              this.getModules(i + 1, true)
            }, 500)
          }
        }).catch(() => {})
      }
    },
    editModule(obj) {
      this.$set(obj, 'edit', true)
    },
    saveModule(obj, i) {
      this.$set(obj, 'disabled', true)
      const data = {
        id: this.subjects[i].id,
        moduleName: obj.moduleName
      }
      if (obj.id) {
        console.log(obj)
      } else {
        addModule(data).then(response => {
          this.getModules(i, false)
          this.$set(obj, 'disabled', false)
        }).catch(() => {
          this.$set(obj, 'disabled', false)
        })
      }
    },
    delModule(obj, i) {
      this.$confirm('此操作将删除《' + obj.subjectName + '》学科的“' + obj.moduleName + '”模块，是否继续？', '删除模块', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$set(obj, 'disabled', true)
        delModule(obj.id).then(response => {
          this.getModules(i, false)
          this.$set(obj, 'disabled', false)
        }).catch(() => {
          this.$set(obj, 'disabled', false)
        })
      })
    }
  }
}
</script>

