<script setup>
import { ref } from 'vue'
import useUserInfoStore from '@/stores/userinfo.js';
const userInfoStore = useUserInfoStore();
const userInfo = ref({...userInfoStore.info})

//定義數據模型
const resetPwdData = ref({
    oldPwd:'',
    newPwd:'',
    rePwd:''
})


//註冊校驗密碼的函數
const checkRePassword = (rule, value, callback)=>{
    if(value===''){
        callback(new Error('請再次輸入密碼'))
    }else if(value !== resetPwdData.value.newPwd){
        callback(new Error('請確保兩次密碼一樣'))
    }else{
        callback()
    }
}

//定義註冊表單校驗規則
const rules = {
    oldPwd:[
        {required:true, message: "請輸入舊密碼", trigger:'blur'},
        {min:5, max:16, message: "長度為5-16非空字符", trigger:'blur'}
    ],
    newPwd:[
        {required:true, message: "請輸入新密碼", trigger:'blur'},
        {min:5, max:16, message: "長度為5-16非空字符", trigger:'blur'}
    ],
    rePwd:[
        {validator:checkRePassword, trigger:'blur'}
    ]
}

//修改個人訊息
import { userPwdUpdateService } from '@/api/user.js';
import { ElMessage } from 'element-plus';
const updateUserPassword = async ()=>{
    //調用接口
    let result = await userPwdUpdateService(resetPwdData.value);
    ElMessage.success(result.msg ? result.msg:'修改成功')
    //修改pinia中的個人訊息
    userInfoStore.info.password(resetPwdData.value)
}

</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>重置密碼</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="resetPwdData" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="輸入舊密碼" prop="oldPwd">
                        <el-input type="password" v-model="resetPwdData.oldPwd"></el-input>
                    </el-form-item>
                    <el-form-item label="輸入新密碼" prop="newPwd">
                        <el-input type="password" v-model="resetPwdData.newPwd"></el-input>
                    </el-form-item>
                    <el-form-item label="再次輸新密碼" prop="rePwd">
                        <el-input type="password" v-model="resetPwdData.rePwd"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateUserPassword">提交修改</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>
