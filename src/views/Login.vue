<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'  // 確保導入watch
import { ElMessage } from 'element-plus'
//控制註冊與登入表單的顯示， 預設顯示註冊
const isRegister = ref(false)
//定義數據模型
const registerData = ref({
    username:'',
    password:'',
    repassword:''
})
//註冊校驗密碼的函數
const checkRePassword = (rule, value, callback)=>{
    if(value===''){
        callback(new Error('請再次輸入密碼'))
    }else if(value !== registerData.value.password){
        callback(new Error('請確保兩次密碼一樣'))
    }else{
        callback()
    }
}

//定義註冊表單校驗規則
const rules = {
    username:[
        {required:true, message: "請輸入用戶名", trigger:'blur'},
        {min:5, max:16, message: "長度為5-16非空字符", trigger:'blur'}
    ],
    password:[
        {required:true, message: "請輸入密碼", trigger:'blur'},
        {min:5, max:16, message: "長度為5-16非空字符", trigger:'blur'}
    ],
    repassword:[
        {validator:checkRePassword, trigger:'blur'}
    ]
}

//調用註冊後台接口完成註冊
import { userRegisterService, userLoginService } from '@/api/user';
const register = async ()=>{
    //registerData是一個響應式物件，如果要獲取值，需要.value
    let result = await userRegisterService(registerData.value);
    ElMessage.success(result.msg? result.msg:('註冊成功'))
}

//定義函數，清空註冊模型的數據，因數據與登入綁定，當登入輸入資料，註冊資料會一樣
const clearRegister = ()=>{
    registerData.value={
        username:'',
        password:'',
        repassword:''
    }
}

// 定義是否記住用戶名和密碼
const rememberMe = ref(false)

// 從 localStorage 載入記住的使用者名稱和密碼
if (localStorage.getItem('rememberMe') === 'true') {
    rememberMe.value = true
    registerData.value.username = localStorage.getItem('username') || ''
    registerData.value.password = localStorage.getItem('password') || ''
}

// 监听 rememberMe 的变化
watch(rememberMe, (newValue) => {
    if (!newValue) {
        localStorage.removeItem('username')
        localStorage.removeItem('password')
        localStorage.removeItem('rememberMe')
    }
})

//登入
import { useRouter } from 'vue-router';
import { useTokenStore } from '@/stores/token.js';
//定義路由
const router = useRouter()
const tokenStore = useTokenStore();
const login = async () =>{
    //調用接口，完成登錄
    let result = await userLoginService(registerData.value);
    ElMessage.success(result.msg? result.msg:('登入成功'))
    //把得到的token存到pinia
    tokenStore.setToken(result.data)
    if (rememberMe.value) {
        localStorage.setItem('username', registerData.value.username)
        localStorage.setItem('password', registerData.value.password)
        localStorage.setItem('rememberMe', 'true')
    }
    //登入成功後，跳轉到首頁
    router.push('/')
}
</script>

<template>
    <el-row class="login-page">
        <el-col :span="12" class="bg"></el-col>
        <el-col :span="6" :offset="3" class="form">
            <!-- 網站名稱 -->
            <div class="site-title">
                文章管理系統
            </div>
            <!-- 註冊表單 -->
            <el-form ref="form" size="large" autocomplete="off" v-if="isRegister" :model="registerData" :rules="rules">
                <el-form-item>
                    <h1>註冊</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="請輸入用戶名" v-model="registerData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input :prefix-icon="Lock" type="password" placeholder="請輸入密碼" v-model="registerData.password"></el-input>
                </el-form-item>
                <el-form-item prop="repassword">
                    <el-input :prefix-icon="Lock" type="password" placeholder="請再次輸入密碼" v-model="registerData.repassword"></el-input>
                </el-form-item>
                <!-- 註冊按鈕 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="register">
                        註冊
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = false;clearRegister()">
                        ← 返回
                    </el-link>
                </el-form-item>
            </el-form>
            <!-- 登入表單 -->
            <el-form ref="form" size="large" autocomplete="off" v-else :model="registerData" :rules="rules">
                <el-form-item>
                    <h1>登入</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="請輸入用戶名" v-model="registerData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password" :prefix-icon="Lock" type="password" placeholder="請輸入密碼" v-model="registerData.password"></el-input>
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex">
                        <el-checkbox v-model="rememberMe">記住</el-checkbox>
                        <!-- <el-link type="primary" :underline="false">忘記密碼?</el-link> -->
                    </div>
                </el-form-item>
                <!-- 登入按鈕 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="login">登入</el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = true;clearRegister()">
                        註冊 →
                    </el-link>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style lang="scss" scoped>

.login-page {
    height: 100vh; 
    width: 100vw; 
    background: url('@/assets/news.webp') no-repeat center center / cover; 

    // 添加遮罩层
    &::before {
        content: ''; 
        position: absolute; 
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3); 
        z-index: 1; 
    }




    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;
        z-index: 2; 

      
          .el-form-item, .el-input__inner {
            color:white; 
        }

        .title {
            margin: 0 auto;
        }

        .button {
            width: 100%;
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
    .site-title {
            position: absolute;
            top: 50%; 
            left: 50px; 
            transform: translateY(-50%); 
            font-size: 50px; 
            font-weight: bold; 
            color: #fff; 
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); 
        }
}
</style>
