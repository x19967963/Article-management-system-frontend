//訂製請求的實例

//導入axios  npm install axios
import axios from 'axios';
import { ElMessage } from 'element-plus'
//定義一個變數,記錄公共的前綴  ,  baseURL
const baseURL = '/api';
const instance = axios.create({baseURL})

import { useTokenStore } from '@/stores/token.js';
//添加請求攔截器
instance.interceptors.request.use(
    (config)=>{
        //請求的的回調
        //添加token
        const tokenStore = useTokenStore();
        //判斷有沒有token
        if(tokenStore.token){
            config.headers.Authorization = tokenStore.token
        }
        return config;
    },
    (err)=>{
        //請求錯誤的回調
        Promise.reject(err)
    }
)

import router from '@/router'
//添加響應的攔截器
instance.interceptors.response.use(
    result=>{
        //判斷業務狀態碼
        if(result.data.code ===0){
            return result.data;
        }
        //操作失敗
        // alert(result.data.msg?result.data.msg:'服務異常')
        ElMessage.error(result.data.msg?result.data.msg:'服務異常')
        //異步操作的狀態碼轉換為失敗
        return Promise.reject(result.data)
    },
    err=>{
        //判斷響應狀態碼，如果為401則說明未登入，顯示請登入，並跳轉登入頁面
        if(err.response.status===401){
            ElMessage.error('請先登入')
            router.push('/login')
        }else{
            ElMessage.error('服務異常')
        }
        return Promise.reject(err);//非同步的狀態轉換成失敗的狀態
    }
)

export default instance;