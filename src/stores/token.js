//定義store
import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useTokenStore = defineStore('token',()=>{
    //定義狀態內容
    //1.響應變量
    const token = ref('')
    //2.定義一個函數，修改token的值
    const setToken = (newToken)=>{
        token.value = newToken
    }
    //3.函數，移除token的值
    const removeToken = ()=>{
        token.value=''
    }

    return {
        token, setToken, removeToken
    }
},{
    persist:true//持久化存
});