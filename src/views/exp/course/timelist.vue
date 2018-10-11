<template>
  <div style="overflow:auto">
    <el-dialog
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
      :title="'ID-'+courseid"
      width="500px"
      @close="closeDialog">
      <el-table
        :data="timelistshow"
        border
        fit
        highlight-current-row
        style="height:500px;overflow:auto">
        <el-table-column label="星期" align="center" width="200px">
          <template slot-scope="scope">
            <span>{{ date[scope.row.wk].name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="时间段" width="300px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.st }}-{{ scope.row.et }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Timelist',
  props: {
    timelistdata: {
      type: String | null | Array,
      required: true
    },
    courseid: {
      type: Number | String,
      required: true
    }
  },
  data() {
    return {
      timelistshow: null,
      dialogFormVisible: true,
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
      ]
    }
  },
  created() {
    console.log(this.timelistdata)
    if (!(this.timelistdata instanceof Array)) {
      this.timelistshow = JSON.parse(this.timelistdata)// 转换为数组
      console.log(this.timelistshow)
    } else {
      this.timelistshow = this.timelistdata
    }
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.timelistshow = ''
          this.$emit('updateifshow', this.dialogFormVisible)
          // this.ifshowadd=false;
          done()
        })
        .catch(_ => {})
    },
    closeDialog() {
      this.timelistshow = ''
      this.dialogFormVisible = false
      this.$emit('updateifshow', this.dialogFormVisible)
    }
  }
}
</script>

