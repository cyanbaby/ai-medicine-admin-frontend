<template>
    <div class="app-container">
        <div class="app-header text-right mb-4">
            <el-button type="primary" @click="handleAdd">添加积分记录</el-button>
        </div>
        <el-table v-loading="listLoading" class="w-full" :data="list" border fit highlight-current-row
            style="width: 100%">
            
            <!-- 配置项键 Column -->
            <el-table-column label="配置项键" width="180">
                <template v-slot="scope">
                    <span>{{ scope.row.key }}</span>
                </template>
            </el-table-column>

            <!-- 配置值 Column -->
            <el-table-column label="配置值" width="180">
                <template v-slot="scope">
                    <span>{{ scope.row.value }}</span>
                </template>
            </el-table-column>

            <!-- 值类型 Column -->
            <el-table-column label="值类型" width="120">
                <template v-slot="scope">
                    <span>{{ scope.row.value_type }}</span>
                </template>
            </el-table-column>

            <!-- 描述 Column -->
            <el-table-column label="描述">
                <template v-slot="scope">
                    <span>{{ scope.row.description }}</span>
                </template>
            </el-table-column>

            <!-- 创建时间 Column -->
            <el-table-column label="创建时间" width="180">
                <template v-slot="scope">
                    <span>{{ formatDateTime(scope.row.created_at) }}</span>
                </template>
            </el-table-column>

            <!-- 更新时间 Column -->
            <el-table-column label="更新时间" width="180">
                <template v-slot="scope">
                    <span>{{ formatDateTime(scope.row.updated_at) }}</span>
                </template>
            </el-table-column>
            <!-- Actions Column -->
            <el-table-column align="center" fixed="right" label="操作" width="200px">
                <template v-slot="scope">
                    <el-button type="text" size="small" @click="handleDetail(scope.row)">详情</el-button>
                    <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- Pagination Component -->
        <pagination v-show="total > 0" :total="total" v-model:page="listQuery.page" v-model:limit="listQuery.limit"
            @pagination="getList" />

        <!-- 积分详情弹窗 -->
        <el-dialog title="详情" v-model="dialogVisible" width="620px" :before-close="handleClose">
            <div v-if="currentRow">
                <el-descriptions :column="2" border class="user-detail-descriptions">
                    <el-descriptions-item label="配置键">{{ currentRow.key }}</el-descriptions-item>
                    <el-descriptions-item label="配置值">{{ currentRow.value }}</el-descriptions-item>
                    <el-descriptions-item label="值类型">{{ currentRow.value_type }}</el-descriptions-item>
                    <el-descriptions-item label="描述">{{ currentRow.description }}</el-descriptions-item>
                    <el-descriptions-item label="创建时间">{{ formatDateTime(currentRow.created_at) }}</el-descriptions-item>
                    <el-descriptions-item label="更新时间">{{ formatDateTime(currentRow.updated_at) }}</el-descriptions-item>
                </el-descriptions>
            </div>
        </el-dialog>

        <!-- 添加弹窗 -->
        <el-dialog title="添加" v-model="addDialogVisible" width="620px" :before-close="() => (addDialogVisible = false)">
            <el-form :model="addForm" label-width="100px">
                <!-- <el-form-item label="用户名">
                    <el-input v-model="addForm.username" />
                </el-form-item> -->
                <el-form-item label="积分数量">
                    <el-input v-model="addForm.points" />
                </el-form-item>
                <el-form-item label="积分原因">
                    <el-input v-model="addForm.reason" />
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="addForm.description" type="textarea" rows="3" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="addDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitAdd">保存</el-button>
            </template>
        </el-dialog>

        <!-- 编辑弹窗 -->
        <el-dialog title="编辑" v-model="editDialogVisible" width="620px"
            :before-close="() => (editDialogVisible = false)">
            <el-form :model="editForm" label-width="100px">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled />
                </el-form-item>
                <el-form-item label="积分数量">
                    <el-input v-model="editForm.points" />
                </el-form-item>
                <el-form-item label="积分原因">
                    <el-input v-model="editForm.reason" />
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="editForm.description" type="textarea" rows="3" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitEdit">保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Pagination from '@/components/Pagination';
import { formatDateTime } from '@/utils';
import { getPointsList, createPoint, getPointDetail, updatePoint, deletePoint } from '@/api/points';
import { getConfigsList, createConfig, getConfigDetail, updateConfig, patchConfig, deleteConfig, getSpecificConfig, setSpecificConfig } from '@/api/configs';


import { ElMessage, ElMessageBox } from 'element-plus';

export default defineComponent({
    name: 'UserProfile',
    components: { Pagination },
    data() {
        return {
            list: [],
            total: 0,
            listLoading: false,
            listQuery: {
                page: 1,
                limit: 10
            },
            dialogVisible: false,
            currentRow: null as any,
            reasonTextMap: {},
            editDialogVisible: false,
            editForm: {} as any,
            addDialogVisible: false,
            addForm: {
                username: '',
                points: '',
                reason: '',
                description: ''
            } as any
        };
    },
    created() {
        this.getList();
    },
    methods: {
        getList() {
            getConfigsList({ page: this.listQuery.page, pageSize: this.listQuery.limit }).then(res => {
                const data = res.data;
                this.list = data.results;
                this.total = data.count;
            }).finally(() => {
                this.listLoading = false;
            });
        },
        formatDateTime,
        handleDetail(row: any) {
            getConfigDetail(row.id).then(res => {
                this.currentRow = res.data;
                this.dialogVisible = true;
            });
        },
        handleEdit(row) {
            getPointDetail(row.id).then(res => {
                this.editForm = res.data;
                this.editDialogVisible = true;
            });
        },
        handleAdd() {
            this.addForm = {
                username: '',
                points: '',
                reason: '',
                description: ''
            };
            this.addDialogVisible = true;
        },
        submitEdit() {
            updatePoint(this.editForm.id, this.editForm).then(() => {
                ElMessage.success('保存成功');
                this.editDialogVisible = false;
                this.getList();
            }).catch(err => {
                console.log(err);
            });
        },
        submitAdd() {
            createPoint(this.addForm).then(() => {
                ElMessage.success('添加成功');
                this.addDialogVisible = false;
                this.getList();
            }).catch(err => {
                console.log(err);
            });
        },
        handleClose() {
            this.dialogVisible = false;
            this.currentRow = null;
        },
        handleDelete(row) {
            ElMessageBox.confirm('确定要删除吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deletePoint(row.id).then(() => {
                    ElMessage.success('删除成功');
                    this.getList();
                });
            });
        }
    }
});
</script>

<style lang="scss" scoped>
.user-detail-descriptions {
    margin: 20px 0;

    .el-descriptions__label {
        font-weight: bold;
        background-color: #f5f7fa;
    }

    .el-descriptions__content {
        color: #606266;
    }
}
</style>