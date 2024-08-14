<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref } from 'vue'
const categorys = ref([

])
//聲明一個異步函數
import { articleCategoryListService,articleCategoryAddService, articleCategoryUpdateService,articleCategoryDeleteService } from '@/api/article';
const articleCategoryList = async()=>{
    let result = await articleCategoryListService();
    categorys.value = result.data;
}
articleCategoryList();

//控制添加分類彈窗
const dialogVisible = ref(false)

//新增分類資料模型
const categoryModel = ref({
    categoryName: '',
    categoryAlias: ''
})
//新增分類表單校驗
const rules = {
    categoryName: [
        { required: true, message: '請輸入分類名稱', trigger: 'blur' },
    ],
    categoryAlias: [
        { required: true, message: '請輸入分類別名', trigger: 'blur' },
    ]
}

//調用接口，添加表單
import { ElMessage } from 'element-plus';
const addCategory = async ()=>{
    //調用接口
    let result = await articleCategoryAddService(categoryModel.value);
    ElMessage.success(result.msg? result.msg:'添加成功')
    //調用獲取所有文章分類的函數
    articleCategoryList();
    dialogVisible.value=false;
}
//定義變量，控制標題名稱
const title = ref('')

//展示編輯彈窗
const showDialog = (row)=>{
    dialogVisible.value=true; title.value='編輯分類'
    //數據拷貝
    categoryModel.value.categoryName = row.categoryName;
    categoryModel.value.categoryAlias = row.categoryAlias;
    //擴展id屬性，將來需傳遞給後台，完成分類的修改
    categoryModel.value.id = row.id
}

//編輯分類
const upadteCategory = async ()=>{
    //調用接口
    let result = await articleCategoryUpdateService(categoryModel.value);
    ElMessage.success(result.msg? result.msg:'修改成功')
    //調用獲取所有分類的函數
    articleCategoryList();

    //隱藏彈窗
    dialogVisible.value=false;
}

//清空彈窗模型的數據
const clearData = ()=>{
    categoryModel.value.categoryName='';
    categoryModel.value.categoryAlias='';
}

//刪除分類
import { ElMessageBox } from 'element-plus';
const deleteCategory = (row)=>{
    //提示用戶確認框
    ElMessageBox.confirm(
        '你確定要刪除該分類訊息嗎?',
        '溫馨提示',
        {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
        }
    )
        .then(async () => {
            //調用接口
            let result = await articleCategoryDeleteService(row.id);
            ElMessage({
                type: 'success',
                message: '刪除成功',
            })
            //刷新列表
            articleCategoryList();
        })
        .catch( () => {
            ElMessage({
                type: 'info',
                message: '取消刪除',
            })
        })
}

</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>文章分類</span>
                <div class="extra">
                    <el-button type="primary" @click="dialogVisible=true;title='添加分類';clearData()">添加分類</el-button>
                </div>
            </div>
        </template>
        <el-table :data="categorys" style="width: 100%">
            <el-table-column label="序號" width="100" type="index"> </el-table-column>
            <el-table-column label="分類名稱" prop="categoryName"></el-table-column>
            <el-table-column label="分類別名" prop="categoryAlias"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteCategory(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="沒有數據" />
            </template>
        </el-table>

        <!-- 添加分類彈窗 -->
        <el-dialog v-model="dialogVisible" :title="title" width="30%">
            <el-form :model="categoryModel" :rules="rules" label-width="100px" style="padding-right: 30px">
                <el-form-item label="分類名稱" prop="categoryName">
                    <el-input v-model="categoryModel.categoryName" minlength="1" maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="分類別名" prop="categoryAlias">
                    <el-input v-model="categoryModel.categoryAlias" minlength="1" maxlength="15"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="title=='添加分類'?addCategory():upadteCategory()"> 確定 </el-button>
                </span>
            </template>
        </el-dialog>
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
</style>