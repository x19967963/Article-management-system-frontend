<script setup>
import { ref } from 'vue'
import useUserInfoStore from '@/stores/userinfo.js';
const userInfoStore = useUserInfoStore();
const userInfo = ref({...userInfoStore.info})
const rules = {
    nickname: [
        { required: true, message: '請輸入用戶暱稱', trigger: 'blur' },
        {
            pattern: /^\S{2,10}$/,
            message: '暱稱必须是2-10位的非空字符串',
            trigger: 'blur'
        }
    ],
    email: [
        { required: true, message: '請輸入信箱', trigger: 'blur' },
        { type: 'email', message: '信箱格式不正確', trigger: 'blur' }
    ]
}

//修改個人訊息
import { userInfoUpdateService } from '@/api/user.js';
import { ElMessage } from 'element-plus';
const updateUserInfo = async ()=>{
    //調用接口
    let result = await userInfoUpdateService(userInfo.value);
    ElMessage.success(result.msg ? result.msg:'修改成功')
    //修改pinia中的個人訊息
    userInfoStore.setInfo(userInfo.value)
}

</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>基本資料</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="userInfo" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="登入名稱">
                        <el-input v-model="userInfo.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="暱稱" prop="nickname">
                        <el-input v-model="userInfo.nickname"></el-input>
                    </el-form-item>
                    <el-form-item label="信箱" prop="email">
                        <el-input v-model="userInfo.email"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateUserInfo">提交修改</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>