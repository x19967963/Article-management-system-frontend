<script setup>
import {
    Management,
    Promotion,
    UserFilled,
    User,
    Crop,
    EditPen,
    SwitchButton,
    CaretBottom
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'

import { userInfoService } from '@/api/user.js';
import useUserInfoStore from '@/stores/userinfo.js';
import { useTokenStore } from '@/stores/token.js';
const tokenStore = useTokenStore();
const userInfoStore = useUserInfoStore();
//調用函數，獲取用戶詳細訊息
const getUserInfo = async()=>{
    //調用接口
    let result = await userInfoService();
    //數據存到pinia中
    userInfoStore.setInfo(result.data);
}

getUserInfo();

//條目被點擊後，調用的函數
import { useRouter } from 'vue-router';
const router = useRouter();
import { ElMessage,ElMessageBox } from 'element-plus';
const handleCommand = (command)=>{
    //判斷指令
    if (command === 'logout'){
        //退出登入
        ElMessageBox.confirm(
        '你確定要登出嗎?',
        '溫馨提示',
        {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
        }
    )
        .then(async () => {
            //登出
            //1.清空pinia中存儲的token以及個人資訊
            tokenStore.removeToken()
            userInfoStore.removeInfo()
            //2.跳轉到登入頁面
            router.push('/login')
            ElMessage({
                type: 'success',
                message: '登出成功',
            })
        })
        .catch( () => {
            ElMessage({
                type: 'info',
                message: '取消登出',
            })
        })
    }else{
        //路由
        router.push('/user/'+command)
    }
}


</script>

<template>
    <el-container class="layout-container">
        <!-- 左侧菜单 -->
        <el-aside width="200px">
            <div class="el-aside__logo">文章管理系统</div>
            <el-menu active-text-color="#ffd04b" background-color="#232323"  text-color="#fff"
                router>
                <el-menu-item index="/article/category" >
                    <el-icon>
                        <Management />
                    </el-icon>
                    <span>文章分類</span>
                </el-menu-item>
                <el-menu-item index="/article/manage">
                    <el-icon>
                        <Promotion />
                    </el-icon>
                    <span>文章管理</span>
                </el-menu-item >
                <el-sub-menu >
                    <template #title>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>個人資料</span>
                    </template>
                    <el-menu-item index="/user/info">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>基本資料</span>
                    </el-menu-item>
                    <el-menu-item index="/user/resetPassword">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        <span>修改密碼</span>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>
        <!-- 右側主區域 -->
        <el-container>
            <!-- 頭部區域 -->
            <el-header>
                <div>使用者：<strong>{{userInfoStore.info.nickname}}</strong></div>
                <el-dropdown placement="bottom-end" @command="handleCommand">
                    <span class="el-dropdown__box">
                        <el-avatar :src="avatar" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <!-- command指令用途：條目被點擊後觸發，在事件函數上可以聲明一個函數，接收條目的指令 -->
                            <el-dropdown-item command="info" :icon="User">基本資料</el-dropdown-item>
                            <el-dropdown-item command="resetpassword" :icon="EditPen">修改密碼</el-dropdown-item>
                            <el-dropdown-item command="logout" :icon="SwitchButton">登出</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <!-- 中間區域 -->
            <el-main>
                <router-view></router-view>
            </el-main>
            <!-- 底部區域 -->
            <el-footer>文章筆記 ©2024 Created by JunHan</el-footer>
        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
    height: 100vh;

    .el-aside {
        background-color: #232323;

        &__logo {
            height: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff; 
            font-size: 24px; 
            font-weight: bold; 
        }

        .el-menu {
            border-right: none;
        }
    }

    .el-header {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-dropdown__box {
            display: flex;
            align-items: center;

            .el-icon {
                color: #999;
                margin-left: 10px;
            }

            &:active,
            &:focus {
                outline: none;
            }
        }
    }

    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
    }
}
</style>