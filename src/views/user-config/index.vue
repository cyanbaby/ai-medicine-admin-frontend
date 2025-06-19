<template>
  <div class="app-container absolute inset-0 flex flex-col">
    <div class="app-header mb-4 flex-shrink-0 flex">
      <div class="inline-flex ml-auto">
        <el-button type="primary" @click="handleAdd">添加配置</el-button>
      </div>
    </div>
    <div :class="`app-body flex-1 overflow-hidden ${tableWrapOnlyClass}`">
      <el-table
        v-loading="listLoading"
        class="w-full"
        :data="list"
        :height="height"
        style="width: 100%"
      >
        <!-- 配置项键 Column -->
        <el-table-column label="配置项键">
          <template v-slot="scope">
            <span>{{ scope.row.key }}</span>
          </template>
        </el-table-column>

        <!-- 配置值 Column -->
        <el-table-column label="配置值">
          <template v-slot="scope">
            <span>{{ scope.row.value }}</span>
          </template>
        </el-table-column>

        <!-- 配置类别 Column -->
        <el-table-column label="配置类别">
          <template v-slot="scope">
            <span>{{ scope.row.category_name }}</span>
          </template>
        </el-table-column>

        <!-- 完整键名 Column -->
        <!-- <el-table-column label="完整键名">
          <template v-slot="scope">
            <span>{{ scope.row.full_key }}</span>
          </template>
        </el-table-column> -->

        <!-- 是否启用 Column -->
        <el-table-column label="是否启用">
          <template v-slot="scope">
            <el-tag :type="scope.row.is_active ? 'success' : 'info'" disable-transitions>
              {{ scope.row.is_active ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 创建时间 Column -->
        <el-table-column label="创建时间">
          <template v-slot="scope">
            <span>{{ formatDateTime(scope.row.created) }}</span>
          </template>
        </el-table-column>

        <!-- 更新时间 Column -->
        <el-table-column label="更新时间">
          <template v-slot="scope">
            <span>{{ formatDateTime(scope.row.modified) }}</span>
          </template>
        </el-table-column>
        <!-- Actions Column -->
        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="200px"
        >
          <template v-slot="scope">
            <el-button
              type="primary"
              size="small"
              plain
              @click="handleDetail(scope.row)"
              >详情</el-button
            >
            <el-button
              type="success"
              plain
              size="small"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >

            <el-button
              type="danger"
              size="small"
              plain
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="flex-shrink-0 overflow-hidden">
      <pagination
        v-show="total > 0"
        class="pagination-wrapper"
        :total="total"
        v-model:page="listQuery.page"
        v-model:limit="listQuery.limit"
        @pagination="getList"
      />
    </div>

    <!-- 积分详情弹窗 -->
    <el-dialog
      title="详情"
      v-model="dialogVisible"
      width="620px"
      :before-close="handleClose"
    >
      <div v-if="currentRow">
        <el-descriptions :column="2" border class="user-detail-descriptions">
          <el-descriptions-item label="ID">{{
            currentRow.id
          }}</el-descriptions-item>
          <el-descriptions-item label="配置类别">{{
            currentRow.category_name
          }}</el-descriptions-item>
          <el-descriptions-item label="配置键">{{
            currentRow.key
          }}</el-descriptions-item>
          <el-descriptions-item label="配置值">{{
            currentRow.value
          }}</el-descriptions-item>
          <el-descriptions-item label="完整键名">{{
            currentRow.full_key
          }}</el-descriptions-item>
          <el-descriptions-item label="是否启用">{{
            currentRow.is_active ? '是' : '否'
          }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{
            formatDateTime(currentRow.created)
          }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{
            formatDateTime(currentRow.modified)
          }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>

    <!-- 添加弹窗 -->
    <el-dialog
      title="添加"
      v-model="addDialogVisible"
      width="620px"
      :before-close="() => (addDialogVisible = false)"
    >
      <el-form :model="addForm" label-width="100px">
        <el-form-item label="配置类别">
          <el-select v-model="addForm.category" placeholder="请选择配置类别">
            <el-option label="通用1" :value="1" />
            <el-option label="通用2" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="配置键">
          <el-input v-model="addForm.key" />
        </el-form-item>
        <el-form-item label="配置值">
          <el-input v-model="addForm.value" />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="addForm.is_active" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAdd">保存</el-button>
      </template>
    </el-dialog>

    <!-- 编辑弹窗 -->
    <el-dialog
      title="编辑"
      v-model="editDialogVisible"
      width="620px"
      :before-close="() => (editDialogVisible = false)"
    >
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="配置类别">
          <el-select v-model="editForm.category" placeholder="请选择配置类别">
            <el-option label="通用1" :value="1" />
            <el-option label="通用2" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="配置键">
          <el-input v-model="editForm.key" />
        </el-form-item>
        <el-form-item label="配置值">
          <el-input v-model="editForm.value" />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="editForm.is_active" />
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
import { nanoid } from 'nanoid';
import { debounce, isNumber } from 'lodash';

import { defineComponent } from 'vue';
import Pagination from '@/components/Pagination';
import { formatDateTime } from '@/utils';

import {
  getUserConfigsList as getConfigsList,
  createUserConfig as createConfig,
  getUserConfigDetail as getConfigDetail,
  updateUserConfig as updateConfig,
  deleteUserConfig as deleteConfig
} from '@/api/user-configs';

// import { getUserConfigsList, createUserConfig, getUserConfigDetail, updateUserConfig, patchUserConfig, deleteUserConfig, batchCreateUserConfigs, batchUpdateUserConfigs } from '@/api/user-configs';

import { ElMessage, ElMessageBox } from 'element-plus';

export default defineComponent({
  name: 'UserProfile',
  components: { Pagination },
  data() {
    return {
      tableWrapOnlyClass: 'nona-class-' + nanoid(),
      height: '',
      debouncedSetHeight: null as any,
      observer: null as any,
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
        category: 1, // 配置类别
        key: '', // 配置键名
        value: '', // 配置值
        is_active: true // 是否启用
      } as any,
      valueTypeOptions: [
        { label: '字符串类型', value: 'string' },
        { label: '整数类型', value: 'integer' },
        { label: '浮点数类型', value: 'float' },
        { label: '布尔类型', value: 'boolean' },
        { label: 'JSON对象类型', value: 'json' }
      ]
    };
  },
  computed: {
    valueTypeTextMap() {
      return this.valueTypeOptions.reduce((acc, option) => {
        acc[option.value] = option.label;
        return acc;
      }, {} as Record<string, string>);
    }
  },
  created() {
    this.debouncedSetHeight = debounce(this.setHeight, 500);
    this.getList();
  },
  mounted() {
    this.setHeight();
    this.observerTableParent();
  },
  methods: {
    // 监听表格父节点变化
    observerTableParent() {
      const targetNode = document.querySelector(`.${this.tableWrapOnlyClass}`);

      if (this.observer) {
        this.observer.disconnect();
      }

      this.observer = new ResizeObserver((mutations) => {
        mutations.forEach(() => {
          this.debouncedSetHeight();
        });
      });

      var config = { attributes: true, childList: true, subtree: true };

      this.observer.observe(targetNode, config);
    },
    setHeight() {
      this.$nextTick(() => {
        const height = (
          document.querySelector(`.${this.tableWrapOnlyClass}`) as any
        )?.offsetHeight;

        if (isNumber(height)) {
          this.height = height - 24 + 'px';
        }
      });
    },
    getList() {
      getConfigsList({
        page: this.listQuery.page,
        pageSize: this.listQuery.limit
      })
        .then((res) => {
          const data = res.data;
          this.list = data.results;
          this.total = data.count;
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    formatDateTime,
    handleDetail(row: any) {
      getConfigDetail(row.id).then((res) => {
        this.currentRow = res.data;
        this.dialogVisible = true;
      });
    },
    handleEdit(row) {
      getConfigDetail(row.id).then((res) => {
        this.editForm = res.data;
        this.editDialogVisible = true;
      });
    },
    handleAdd() {
      this.addForm = {
        key: '',
        value: '',
        category: 1,
        is_active: true
      };
      this.addDialogVisible = true;
    },
    submitEdit() {
      updateConfig(this.editForm.id, this.editForm)
        .then(() => {
          ElMessage.success('保存成功');
          this.editDialogVisible = false;
          this.getList();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    submitAdd() {
      createConfig(this.addForm)
        .then(() => {
          ElMessage.success('添加成功');
          this.addDialogVisible = false;
          this.getList();
        })
        .catch((err) => {
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
        deleteConfig(row.id).then(() => {
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
