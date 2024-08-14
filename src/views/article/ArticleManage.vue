<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'

import { ref } from 'vue'

//文章分類資料模型
const categorys = ref([

])

//使用者搜尋時選取的分類id
const categoryId=ref('')

//用戶搜尋時選取的發布狀態
const state=ref('')

//文章列表数据模型
const articles = ref([

])


//分頁條資料模型
const pageNum = ref(1)//當前頁
const total = ref(20)//總條數
const pageSize = ref(3)//每頁條數

//當每頁條數發生了變化，呼叫此函數
const onSizeChange = (size) => {
    pageSize.value = size
    articleList()
}
//當前頁碼發生變化，呼叫此函數
const onCurrentChange = (num) => {
    pageNum.value = num
    articleList()
}

//獲取文章所有分類
import { articleCategoryListService, articleListService, articleAddService,articleUpdateService,articleDeleteService } from '@/api/article.js';
const articleCategoryList = async() =>{
    let result = await articleCategoryListService();
    categorys.value = result.data;
}

//獲取文章列表數據
const articleList = async ()=>{
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        categoryId: categoryId.value ? categoryId.value : null,
        state: state.value ? state.value : null
    }
    let result =  await articleListService(params);
    //渲染視圖(後端取得數據賦值給前端)
    total.value = result.data.total;
    articles.value = result.data.items;

    //處理數據，給數據模型擴展一個屬性categoryName，分類名稱
    for (let i = 0; i<articles.value.length;i++){
        let article = articles.value[i];
        for (let j = 0; j<categorys.value.length;j++){
            if (article.categoryId == categorys.value[j].id){
                article.categoryName = categorys.value[j].categoryName;
            }
        }
    }
}


articleCategoryList()
articleList();

//導入抽屜模型(添加文章)
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {Plus} from '@element-plus/icons-vue'
//控制抽屉是否显示
const visibleDrawer = ref(false)
//添加表单数据模型
const articleModel = ref({
    title: '',
    categoryId: '',
    coverImg: '',
    content:'',
    state:''
})

//添加文章
import { ElMessage } from 'element-plus';
const addArticle = async (clickState) => {
    //把發布狀態賦值給數據模型
    articleModel.value.state = clickState;
    //先將圖片賦值為空值
    articleModel.value.coverImg = "http://example.com/image.jpg";
    //調用接口
    let result = await articleAddService(articleModel.value);
    ElMessage.success(result.msg?result.msg:'添加成功');
    //讓抽屜消失
    visibleDrawer.value = false;
    //刷新當前列表
    articleList()
}

//定義變量，控制標題名稱
const title = ref('')

//展示編輯文章彈窗
const showDialog = (row)=>{
    visibleDrawer.value=true; title.value='編輯文章'
    //數據拷貝
    articleModel.value.title= row.title;
    articleModel.value.coverImg = row.coverImg;
    articleModel.value.content = row.content;
    articleModel.value.state = row.state;
    articleModel.value.categoryId = row.categoryId;
    //擴展id屬性，將來需傳遞給後台，完成分類的修改
    articleModel.value.id = row.id
}


//修改文章
const upadteArticle = async (clickState) => {
    //把發布狀態賦值給數據模型
    articleModel.value.state = clickState;
    //先將圖片賦值為空值
    articleModel.value.coverImg = "http://example.com/image.jpg";
    //調用接口
    let result = await articleUpdateService(articleModel.value);
    ElMessage.success(result.msg?result.msg:'修改成功');
    //讓抽屜消失
    visibleDrawer.value = false;
    //刷新當前列表
    articleList()
}

//刪除文章
import { ElMessageBox } from 'element-plus';
const deleteArticle = (row)=>{
    //提示用戶確認匡
    ElMessageBox.confirm(
        '你確定要刪除該文章訊息嗎?',
        '溫馨提示',
        {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
        }
    )
        .then(async () => {
            //調用接口
            let result = await articleDeleteService(row.id);
            ElMessage({
                type: 'success',
                message: '刪除成功',
            })
            //刷新列表
            articleList();
        })
        .catch( () => {
            ElMessage({
                type: 'info',
                message: '取消刪除',
            })
        })
}

//定義函數，清空先前添入文章模型的數據
const clearArticle = ()=>{
    articleModel.value={
        title: '',
        categoryId: '',
        coverImg: '',
        content:'',
        state:''
    }
}



</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>文章管理</span>
                <div class="extra">
                    <el-button type="primary" @click="visibleDrawer=true;title='添加文章';clearArticle()">添加文章</el-button>
                </div>
            </div>
        </template>
        <!-- 搜索表單 -->
        <el-form inline>
            <el-form-item label="文章分類：">
                <el-select placeholder="請選擇" v-model="categoryId">
                    <el-option 
                        v-for="c in categorys" 
                        :key="c.id" 
                        :label="c.categoryName"
                        :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="發布狀態：">
                <el-select placeholder="請選擇" v-model="state">
                    <el-option label="已發布" value="已發布"></el-option>
                    <el-option label="草稿" value="草稿"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="articleList">搜索</el-button>
                <el-button @click="categoryId='';state=''">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 文章列表 -->
        <el-table :data="articles" style="width: 100%">
            <el-table-column label="文章標題" width="400" prop="title"></el-table-column>
            <el-table-column label="分類" prop="categoryName"></el-table-column>
            <el-table-column label="發表時間" prop="createTime"> </el-table-column>
            <el-table-column label="狀態" prop="state"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteArticle(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="沒有數據" />
            </template>
        </el-table>
        <!-- 分頁條 -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5 ,10, 15]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
        <!-- 抽屉 -->
        <el-drawer v-model="visibleDrawer" title="添加文章" direction="rtl" size="50%">
            <!-- 添加文章表單 -->
            <el-form :model="articleModel" label-width="100px" >
                <el-form-item label="文章標題" >
                    <el-input v-model="articleModel.title" placeholder="請輸入標題"></el-input>
                </el-form-item>
                <el-form-item label="文章分類">
                    <el-select placeholder="請選擇" v-model="articleModel.categoryId">
                        <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文章内容">
                    <div class="editor">
                        <quill-editor              
                                    theme="snow"
                                    v-model:content="articleModel.content"
                                    contentType="html"
                                    >
                        </quill-editor>
                    </div>
                </el-form-item>
                <el-form-item> 
                    <el-button type="primary" @click="title=='添加文章'? addArticle('已發布') : upadteArticle('已發布')">發布</el-button>
                    <el-button type="info" @click="title=='添加文章'? addArticle('草稿') : upadteArticle('草稿')">草稿</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>    
    </el-card>
</template>
<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
/* 抽屜樣式 */
.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>