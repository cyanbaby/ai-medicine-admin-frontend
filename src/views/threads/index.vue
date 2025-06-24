<template>
  <div class="app-container absolute inset-0 flex flex-col">
    <div
      class="app-header mb-4 flex-shrink-0 flex items-center flex-wrap gap-4"
    >
      <el-input
        v-model="searchForm.title"
        placeholder="对话标题"
        clearable
        class="search-ctrl"
      />
      <el-input
        v-model="searchForm.user_name"
        placeholder="用户名"
        clearable
        class="search-ctrl"
      />
      <el-select
        v-model="searchForm.status"
        placeholder="状态"
        clearable
        class="search-ctrl"
      >
        <el-option label="活跃" value="active" />
        <el-option label="已归档" value="archived" />
      </el-select>
      <el-select
        v-model="searchForm.llm"
        placeholder="所属模型"
        clearable
        filterable
        class="search-ctrl"
      >
        <el-option
          v-for="model in modelOptions"
          :key="model.id"
          :label="model.display_name"
          :value="model.id"
        />
      </el-select>
      <div style="width: 220px">
        <el-date-picker
          v-model="searchForm.date_range"
          type="daterange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          class="search-ctrl"
        />
      </div>

      <el-button type="primary" @click="getList">搜索</el-button>
      <el-button type="info" class="ml-0" plain @click="resetSearch"
        >重置</el-button
      >

      <div class="inline-flex ml-auto">
        <el-button type="primary" @click="handleAdd">添加对话线程</el-button>
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
        <!-- ID Column -->
        <el-table-column label="ID">
          <template v-slot="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>

        <!-- 标题 Column -->
        <el-table-column label="标题">
          <template v-slot="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>

        <!-- 用户名 Column -->
        <el-table-column label="用户名">
          <template v-slot="scope">
            <span>{{ scope.row.user_name }}</span>
          </template>
        </el-table-column>

        <!-- 模型信息 Column -->
        <el-table-column label="模型">
          <template v-slot="scope">
            <div class="flex items-center">
              <img
                v-if="scope.row.llm_detail?.icon_path"
                :src="`${API_BASE_URL}/${scope.row.llm_detail.icon_path}`"
                class="w-6 h-6 mr-2"
              />
              <span>{{ scope.row.llm_detail?.display_name }}</span>
            </div>
          </template>
        </el-table-column>

        <!-- 消息数量 Column -->
        <el-table-column label="消息数">
          <template v-slot="scope">
            <span>{{ scope.row.message_count }}</span>
          </template>
        </el-table-column>

        <!-- 状态 Column -->
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'info'">
              {{ scope.row.status === 'active' ? '活跃' : '已归档' }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 最后消息时间 Column -->
        <el-table-column label="最后消息">
          <template v-slot="scope">
            <span>{{ formatDateTime(scope.row.last_message_at) }}</span>
          </template>
        </el-table-column>

        <!-- 创建时间 Column -->
        <el-table-column label="创建时间">
          <template v-slot="scope">
            <span>{{ formatDateTime(scope.row.created) }}</span>
          </template>
        </el-table-column>

        <!-- Actions Column -->
        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="325px"
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
            <el-button
              v-if="scope.row.status !== 'archived'"
              type="success"
              size="small"
              @click="handleArchive(scope.row)"
              >归档</el-button
            >
            <el-button
              v-if="scope.row.status === 'archived'"
              type="success"
              size="small"
              @click="handleRestore(scope.row)"
              >恢复</el-button
            >

            <!-- <el-button
              type="text"
              size="small"
              @click="handleClickSoftDelete(scope.row)"
              >软删除</el-button
            > -->
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

    <el-dialog
      title="详情"
      v-model="dialogVisible"
      width="800px"
      :before-close="handleClose"
    >
      <div v-if="currentRow">
        <el-descriptions :column="2" border class="user-detail-descriptions">
          <el-descriptions-item label="对话ID">{{
            currentRow.id
          }}</el-descriptions-item>
          <el-descriptions-item label="对话标题">{{
            currentRow.title
          }}</el-descriptions-item>
          <el-descriptions-item label="创建用户">{{
            currentRow.user_name
          }}</el-descriptions-item>
          <el-descriptions-item label="模型名称">{{
            currentRow.llm_detail.display_name
          }}</el-descriptions-item>
          <el-descriptions-item label="模型标识">{{
            currentRow.llm_detail.name
          }}</el-descriptions-item>
          <el-descriptions-item label="模型状态">{{
            currentRow.llm_detail.is_enabled ? '启用' : '禁用'
          }}</el-descriptions-item>
          <el-descriptions-item label="消息数量">{{
            currentRow.message_count
          }}</el-descriptions-item>
          <el-descriptions-item label="最后消息时间">{{
            formatDateTime(currentRow.last_message_at)
          }}</el-descriptions-item>
          <el-descriptions-item label="对话状态">{{
            currentRow.status
          }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{
            formatDateTime(currentRow.created)
          }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{
            formatDateTime(currentRow.modified)
          }}</el-descriptions-item>
          <el-descriptions-item label="最近执行">{{
            currentRow.last_execution
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
      <el-form :model="addForm" label-width="120px">
        <el-form-item label="对话标题">
          <el-input v-model="addForm.title" />
        </el-form-item>
        <el-form-item label="语言模型">
          <el-select v-model="addForm.llm">
            <el-option
              v-for="option in modelOptions"
              :key="option.id"
              :label="option.name"
              :value="option.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="高级响应模式">
          <el-switch v-model="addForm.is_advanced_response" />
        </el-form-item>
        <el-form-item label="扩展记忆">
          <el-switch v-model="addForm.is_extended_memory" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="addForm.status">
            <el-option label="活跃" value="active" />
            <el-option label="已归档" value="archived" />
            <el-option label="已删除" value="deleted" />
          </el-select>
        </el-form-item>
        <el-form-item label="初始上下文">
          <el-input v-model="addForm.context" type="textarea" rows="3" />
        </el-form-item>
        <el-form-item label="元数据">
          <el-input v-model="addForm.metadata" type="textarea" rows="2" />
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
      <el-form :model="editForm" label-width="120px">
        <el-form-item label="对话标题">
          <el-input v-model="editForm.title" />
        </el-form-item>
        <el-form-item label="语言模型">
          <el-select v-model="editForm.llm">
            <el-option
              v-for="option in modelOptions"
              :key="option.id"
              :label="option.name"
              :value="option.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="高级响应模式">
          <el-switch v-model="editForm.is_advanced_response" />
        </el-form-item>
        <el-form-item label="扩展记忆">
          <el-switch v-model="editForm.is_extended_memory" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editForm.status">
            <el-option label="活跃" value="active" />
            <el-option label="已归档" value="archived" />
            <el-option label="已删除" value="deleted" />
          </el-select>
        </el-form-item>
        <el-form-item label="初始上下文">
          <el-input v-model="editForm.context" type="textarea" rows="3" />
        </el-form-item>
        <el-form-item label="元数据">
          <el-input v-model="editForm.metadata" type="textarea" rows="2" />
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
  getThreadsList as getList,
  createThread as addItem,
  getThreadDetail as getDetail,
  deleteThread as deleteItem,
  updateThread as updateItem,
  patchThread,
  archiveThread,
  restoreThread,
  softDeleteThread,
  getActiveThreads,
  batchArchiveThreads,
  searchThreads
} from '@/api/threads';

import {
  getModelsList,
  createModel,
  getModelDetail,
  updateModel,
  deleteModel
} from '@/api/full-models';

import { ElMessage, ElMessageBox } from 'element-plus';
import { API_BASE_URL } from '@/utils/constant';

const searchForm = {
  title: '',
  user_name: '',
  status: '',
  llm: '',
  date_range: []
};

export default defineComponent({
  name: 'UserProfile',
  components: { Pagination },
  data() {
    return {
      searchForm,
      API_BASE_URL,
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
        name: '',
        display_name: '',
        description: '',
        provider: 'openai',
        api_base_url: '',
        api_key: '',
        api_secret: '',
        is_enabled: true,
        is_premium: true,
        icon_path: '',
        context_window: undefined,
        max_tokens: undefined,
        temperature_range: undefined,
        price_per_1k_tokens: '3',
        price_per_1k_output_tokens: '',
        metadata: ''
      } as any,
      valueTypeOptions: [
        { label: '字符串类型', value: 'string' },
        { label: '整数类型', value: 'integer' },
        { label: '浮点数类型', value: 'float' },
        { label: '布尔类型', value: 'boolean' },
        { label: 'JSON对象类型', value: 'json' }
      ],
      modelOptions: [] as any[]
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
    this.getModels();
    this.getList();
  },
  mounted() {
    this.setHeight();
    this.observerTableParent();
  },
  methods: {
    resetSearch() {
      this.searchForm = {
        ...searchForm
      };
      this.searchForm.date_range = [];
      this.listQuery.page = 1;
      this.getList();
    },
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
    getModels() {
      getModelsList({
        page: 1,
        pageSize: 1000,
        ...searchForm
      }).then((res) => {
        const data = res.data;
        this.modelOptions = data.results;
      });
    },
    getList() {
      getList({
        page: this.listQuery.page,
        pageSize: this.listQuery.limit,
        ...searchForm
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
      getDetail(row.id).then((res) => {
        this.currentRow = res.data;
        this.dialogVisible = true;
      });
    },
    handleEdit(row) {
      getDetail(row.id).then((res) => {
        this.editForm = res.data;
        this.editDialogVisible = true;
      });
    },
    handleAdd() {
      this.addForm = {
        name: '',
        display_name: '',
        description: '',
        provider: 'openai',
        api_base_url: '',
        api_key: '',
        api_secret: '',
        is_enabled: true,
        is_premium: true,
        icon_path: '',
        context_window: 1,
        max_tokens: 1,
        temperature_range: 1,
        price_per_1k_tokens: '1',
        price_per_1k_output_tokens: '1',
        metadata: ''
      };
      this.addDialogVisible = true;
    },
    submitEdit() {
      updateItem(this.editForm.id, this.editForm)
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
      addItem(this.addForm)
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
        deleteItem(row.id).then(() => {
          ElMessage.success('删除成功');
          this.getList();
        });
      });
    },

    handleArchive(row) {
      ElMessageBox.confirm('确定要归档吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        archiveThread(row.id).then(() => {
          ElMessage.success('归档成功');
          this.getList();
        });
      });
    },

    // handleRestore
    handleRestore(row) {
      ElMessageBox.confirm('确定要恢复线程吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        restoreThread(row.id).then(() => {
          ElMessage.success('恢复成功');
          this.getList();
        });
      });
    }
    // handleClickSoftDelete(row) {
    //   ElMessageBox.confirm('确定要软删除线程吗？', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     softDeleteThread(row.id).then(() => {
    //       ElMessage.success('软删除成功');
    //       this.getList();
    //     });
    //   });
    // }
  }
});
</script>

<style lang="scss" scoped>
::v-deep {
  .user-detail-descriptions {
    margin: 20px 0;

    .el-descriptions__label {
      width: 120px;
      font-weight: bold;
      background-color: #f5f7fa;
    }

    .el-descriptions__content {
      color: #606266;
    }
  }
}
</style>
