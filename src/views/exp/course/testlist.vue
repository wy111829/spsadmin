<template>
  <div>
    <el-table :data="testlist" border highlight-current-row style="width: 100%">
      <el-table-column prop="Id" label="试题ID" width="150" align="center"/>
      <el-table-column prop="Title" label="试题名称" width="200" align="center"/>
      <el-table-column prop="Answer" label="试题答案" width="200" align="center"/>
      <el-table-column prop="TypeDesc" label="试题类型" width="150" align="center"/>
      <el-table-column prop="operate" label="操作" width="300" align="center">
        <template slot-scope="scope">
          <el-button @click="update(scope.row)">编辑</el-button>
          <el-button @click="changeanswer(scope.row)">更新答案</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { gettestlist } from '@/api/exp/liveexpconfig'
export default {
  name: 'Testlist',
  data() {
    return {
      testlist: null,
      planId: null
    }
  },
  created() {
    // 获取值
    if (this.$route.query.planId) {
      this.planId = this.$route.query.planId
      console.log(this.planId)
    }
    this.planId = 222546
    this.gettestlist()
  },
  methods: {
    gettestlist() { // 获取试题列表
      gettestlist(this.planId).then(response => {
        if (response.stat === 1) {
          this.testlist = response.data
          console.log(this.testlist)
        }
      })
    },
    update(value) {
      console.log(value)
      this.$router.push({
        path: '/experience/testupdate'
      })
    }
  }
}
</script>

