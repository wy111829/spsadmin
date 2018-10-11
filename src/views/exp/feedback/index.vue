<template>
  <div v-loading="loading" class="app-container">
    <el-card v-for="(subject,key) in subjects" :key="key" class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ subject.name }}</span>
        <span style="font-size: 12px">[{{ subject.alias }}]</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="getInfo(key, false)">刷新</el-button>
      </div>
      <el-form v-loading="subject.loading" :model="subject.info" label-width="80px">
        <el-form-item label="问题">
          <el-input v-model="subject.info.title" />
        </el-form-item>
        <el-form-item label="选项一">
          <span style="float: right">
            默认：<el-switch v-model="subject.info.defaultOption" :active-value="1" />
          </span>
          <el-input v-model="subject.info.option1" style="width: 60%;" />
        </el-form-item>
        <el-form-item label="选项二">
          <span style="float: right">
            默认：<el-switch v-model="subject.info.defaultOption" :active-value="2" />
          </span>
          <el-input v-model="subject.info.option2" style="width: 60%;" />
        </el-form-item>
        <el-form-item label="选项三">
          <span style="float: right">
            默认：<el-switch v-model="subject.info.defaultOption" :active-value="3" />
          </span>
          <el-input v-model="subject.info.option3" style="width: 60%;" />
        </el-form-item>
        <el-form-item label="">
          <el-button :disabled="subject.info.disabled" type="primary" @click="editInfo(subject.info, key)">保存</el-button>
        </el-form-item>
      </el-form>
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
import { getList, getInfo, editInfo } from '@/api/exp/feedback'

const defaultForm = {
  subjectId: '',
  title: '',
  option1: '',
  option2: '',
  option3: '',
  defaultOption: ''
}

export default {
  name: 'Feedback',
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
          this.$set(subject, 'info', Object.assign({}, defaultForm))
          this.$set(subject.info, 'subjectId', subject.id)
          this.subjects.push(subject)
        }
        this.loading = false
        setTimeout(() => {
          this.getInfo(0, true)
        }, 500)
      }).catch(() => {})
    },
    getInfo(i, go) {
      if (this.subjects[i] !== undefined) {
        this.subjects[i].loading = true
        getInfo(this.subjects[i].id).then(response => {
          if (response.data !== null) {
            this.subjects[i].info = response.data
          }
          this.subjects[i].loading = false
          if (go) {
            setTimeout(() => {
              this.getInfo(i + 1, true)
            }, 500)
          } else {
            this.$message({
              message: '刷新成功',
              type: 'success'
            })
          }
        }).catch(() => {})
      }
    },
    editInfo(obj, i) {
      this.$set(obj, 'disabled', true)
      let msg = ''
      switch (obj.defaultOption) {
        case 1:
          if (obj.option1 === '') {
            msg = '不能设置空选项为默认选项'
          }
          break
        case 2:
          if (obj.option2 === '') {
            msg = '不能设置空选项为默认选项'
          }
          break
        case 3:
          if (obj.option3 === '') {
            msg = '不能设置空选项为默认选项'
          }
          break
      }
      if (obj.option1 === '' && obj.option2 === '' && obj.option3 === '') {
        msg = '选项不能全为空'
      } else if (obj.option1 === '' && (obj.option2 !== '' || obj.option3 !== '')) {
        msg = '选项一不能为空'
      } else if (obj.option2 === '' && obj.option3 !== '') {
        msg = '选项二不能为空'
      }
      if (obj.title === '') {
        msg = '问题不能为空'
      }
      if (msg === '') {
        editInfo(obj).then(response => {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.$set(obj, 'disabled', false)
        }).catch(() => {
          this.$set(obj, 'disabled', false)
        })
      } else {
        this.$message.error(msg)
        this.$set(obj, 'disabled', false)
      }
    }
  }
}
</script>

