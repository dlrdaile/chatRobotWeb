<template>
  <div class="login-container">
    <el-form
        ref="ruleForm"
        :model="loginForm"
        status-icon
        :rules="rules"
        label-width="80px"
        style="margin-top: 80px"
        label-position="left"
    >
      <!--      <el-form-item label="用户" prop="username">-->
      <!--        <el-input-->
      <!--          v-model="loginForm.username"-->
      <!--          type="text"-->
      <!--          autocomplete="on"-->
      <!--          :placeholder="'admin or email'"-->
      <!--          prefix-icon="el-icon-user-solid"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="api_key" prop="api_key" >
        <el-input
            v-model="loginForm.api_key"
            type="password"
            autocomplete="on"
            :show-password="true"
            placeholder="api_key"
            prefix-icon="el-icon-lock"
            clearable
        />
      </el-form-item>
      <el-form-item label="platform" prop="llm_platform" >
        <el-select v-model="loginForm.llm_platform" clearable placeholder="请选择大模型平台" @change="changeLLMPlatform">
          <el-option
              v-for="item in llm_platform_list"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="model" prop="llm_model" >
        <el-select v-model="loginForm.llm_model" clearable placeholder="请选择大模型模型">
          <el-option
              v-for="item in llm_model_list"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="bottom-position">
        <el-button :loading="loading" type="primary" @click="submitForm('ruleForm')">提交</el-button>
<!--        <el-button @click="$refs.ruleForm.">重置</el-button>-->
      </el-form-item>

    </el-form>
    <!--    <Vcode :show="isShow" @success="success" @close="close" />-->
  </div>
</template>

<script>
// import Vcode from 'vue-puzzle-vcode'

import {Message} from "element-ui";

export default {
  name: 'Login',
  // components: {
  //   Vcode
  // },
  data() {
    return {
      isShow: false,
      loginForm: {
        // username: '',
        api_key: '',
        client_id: this.$store.getters.client_id,
        llm_model: '',
        llm_platform: '',
      },
      llm_platform_list: [
        {
          value: 'ZhiPu',
          label: '智谱清言'
        },
        {
          value: 'TongYi',
          label: '通义千问'
        }
      ],
      llm_model_list: [
        {
          value: 'glm-4',
          label: 'glm-4'
        }
      ],
      rules: {
        // username: [
        //   { required: true, message: '请输入用户名', trigger: 'blur' },
        //   { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        // ],
        api_key: [
          {required: true, message: '请输入api_key', trigger: 'blur'},
          {min: 10, max: 100, message: '长度在 10 到 100 个字符', trigger: 'blur'}
        ],
        llm_platform: [
          {required: true, message: '请选择大模型平台', trigger: 'change'}
        ],
        llm_model: [
          {required: true, message: '请选择大模型模型', trigger: 'change'}
        ]
      },
      loading: false
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    },
  },
  // computed: {
  //   llm_model_list: function () {
  //     if (this.loginForm.llm_platform === 'ZhiPu') {
  //       return [
  //         {
  //           value: 'ZhiPu',
  //           label: '张学友'
  //         },
  //         {
  //           value: 'ZhiPu',
  //           label: '张学友'
  //         }
  //       ]
  //     } else if (this.loginForm.llm_platform === 'TongYi') {
  //       return [
  //         {
  //           value: 'TongYi',
  //           label: '阿里'
  //         },
  //         {
  //           value: 'TongYi',
  //           label: '阿里'
  //         }
  //       ]
  //     }
  //     return []
  //   },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.isShow = true
          console.log(valid)
          this.success(valid)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    changeLLMPlatform(select_value) {
      if (select_value === "ZhiPu") {
        this.llm_model_list = [
          {
            value: 'glm-4',
            label: 'glm-4'
          }
        ]
      } else if (select_value === "TongYi") {
        this.llm_model_list = [
          {
            value: 'qwen-turbo',
            label: 'qwen-turbo'
          },
          {
            value: 'qwen-plus',
            label: 'qwen-plus'
          },
          {
            value: 'qwen-max',
            label: 'qwen-max'
          },
          {
            value: 'qwen-max-longcontext',
            label: 'qwen-max-longcontext'
          }
        ]
      }
      return []
    },
    success(msg) {
      this.isShow = false // 通过验证后，需要手动隐藏模态框
      this.loading = true
      this.$store
          .dispatch('api_key_valid/validateApiKey', this.loginForm)
          .then(() => {
            Message({
              message: '校验成功',
              type: 'success'
            })
            this.$router.push({path: '/chat'})
                .then(() => {
                  this.loading = false
                  // setTimeout(() => {
                  //   this.$store
                  //       .dispatch('api_key_valid/validateApiKey', this.loginForm)
                  //       .then(
                  //           () => {
                  //           }
                  //       ).catch((e) => {
                  //     console.log(e)
                  //     this.$router.push({"path": "/login"})
                  //   })
                  // }, 10000)
                }).catch((e) => {
              console.log(e)
            })
            // 循环校验validate,设置定时器

          })
          .catch(() => {
            this.loading = false;
            // this.$router.push({ path: this.redirect || '/' })
          })
    },
    // 用户点击遮罩层，应该关闭模态框
    close() {
      this.loading = false;
    }
  }
}
</script>

<style scoped>

</style>
