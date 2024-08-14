import request from '@/utils/request.js'
import { useTokenStore } from '@/stores/token.js'

//文章分類列表查詢
export const articleCategoryListService = ()=>{
    return request.get('/category')
}

//文章分類添加
export const articleCategoryAddService = (categoryData)=>{
    return request.post('/category', categoryData)
}

//文章分類修改
export const articleCategoryUpdateService = (categoryData)=>{
    return request.put('/category',categoryData)
}

//文章分類刪除
export const articleCategoryDeleteService = (id) =>{
    return request.delete('/category?id='+id)
}

//文章列表查詢
export const articleListService = (params) =>{
    return request.get('/article' ,{params:params})
}

//文章添加
export const articleAddService = (articleData)=>{
    return request.post('/article',articleData);
}

//文章修改
export const articleUpdateService = (articleData)=>{
    return request.put('/article',articleData);
}

//文章刪除
export const articleDeleteService = (id) =>{
    return request.delete('/article?id='+id)
}