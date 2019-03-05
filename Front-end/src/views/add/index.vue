<template>
  <div class="add">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="标题" label-width="100px" prop="title">
        <el-input v-model="form.title" style="width: 40%;"></el-input>
      </el-form-item>
      <el-form-item label="分类" label-width="100px" prop="type">
        <el-select v-model="form.type" filterable allow-create default-first-option placeholder="请选择分类" style="width: 40%">
          <el-option
            v-for="item in typeList"
            :key="item.Type_Id"
            :label="item.Type_Name"
            :value="item.Type_Name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="内容" label-width="100px" prop="content" style="width: 80%;">
        <quill-editor v-model="form.content"
                      style="height: 400px;line-height: 20px;"
                      :options="editorOption">
        </quill-editor>
      </el-form-item>
      <el-form-item style="margin-top: 100px;width: 80%;text-align: right;">
        <el-button @click="resetFormData('form')">重置</el-button>
        <el-button type="warning" :loading=isSaving @click="saveFormData">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import api from '@/api/index'
import qs from 'qs'
export default {
  data () {
    return {
      form: {
        title: '',
        type: '',
        content: ''
      },
      typeList: [],
      editorOption: {
        modules: {
          toolbar: [
            [{'size': ['small', false, 'large']}],
            [{'header': [1, 2, 3, 4, 5, 6, false]}],
            [{'font': []}],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{'header': 1}, {'header': 2}],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            [{'direction': 'rtl'}],
            [{'color': []}, {'background': []}],
            // [{'image': ''}],
            ['clean']
          ]
        },
        placeholder: '在此输入内容'
      },
      rules: {
        title: [
          { required: true, message: '请填写note标题', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择note所属分类', trigger: 'change' }
        ],
        content: [
          { required: true }
        ]
      },
      isSaving: false
    }
  },
  methods: {
    getNoteTypeList () {
      this.typeList = []
      api.NoteList.getNoteTypeList().then(res => {
        if (res.code === 200) {
          this.typeList.push(...res.data.content)
        }
      })
    },
    getNoteOne (e) {
      api.NoteList.getOne(e).then(res => {
        if (res.code === 200) {
          this.form.title = res.data.Note_Name
          this.form.content = res.data.Note_Content
          this.form.type = res.data.Note_Type

          const _id = 'id'
          this.form[_id] = res.data.Note_Id
        }
      })
    },
    resetFormData (formName) {
      this.$refs[formName].resetFields()
    },
    saveFormData () {
      if (!this.form.title.trim()) {
        this.$message({
          message: '请输入标题',
          type: 'warning',
          duration: 1000
        })
      } else if (!this.form.content.trim()) {
        this.$message({
          message: '请输入内容',
          type: 'warning',
          duration: 1000
        })
      } else if (this.form.type === '') {
        this.$message({
          message: '请选择分类',
          type: 'warning',
          duration: 1000
        })
      } else {
        if (this.$route.query.NoteId) {
          let time = new Date()
          let key = 'Note_Time'
          this.form[key] = time.getTime()
          const _params = qs.stringify(this.form)
          api.NoteList.updateNote(_params).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '更新note成功',
                type: 'success',
                duration: 1000
              })

              setTimeout(() => {
                this.$router.push({
                  path: '/note-list'
                })
              }, 1500)
            }
          })
        } else {
          let time = new Date()
          const key = 'time'
          this.form[key] = time.getTime()
          const _params = qs.stringify(this.form)
          api.NoteList.addNote(_params).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '新增note成功',
                type: 'success',
                duration: 1000
              })

              setTimeout(() => {
                this.$router.push({
                  path: '/note-list'
                })
              }, 1500)
            }
          })
        }
      }
    }
  },
  created () {
    this.getNoteTypeList()
    if (this.$route.query.NoteId) {
      this.getNoteOne(parseInt(this.$route.query.NoteId))
    }
  }
}
</script>

<style lang="scss" scoped>
.add {
  width: 100%;
  height: 100%;
  padding: 100px 0 0;
}
</style>
