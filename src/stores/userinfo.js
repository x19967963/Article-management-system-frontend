import { defineStore } from "pinia";
import {ref} from 'vue'
const useUserInfoStore =  defineStore('userInfo',()=>{
    //定義狀態相關
    const info = ref({})

    const setInfo = (newInfo)=>{
        info.value = newInfo
    }

    const removeInfo = ()=>{
        info.value={}
    }

    return {info, setInfo, removeInfo}

},{presist:true})

export default useUserInfoStore;