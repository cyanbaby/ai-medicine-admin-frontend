<template>
  <div class="app-container absolute inset-0 flex flex-col">
    <!-- <div class="app-header mb-4 flex-shrink-0 flex">
      <div class="inline-flex ml-auto">
        <el-button type="primary" @click="handleAdd">添加工作流</el-button>
      </div>
    </div> -->
    <div :class="`app-body flex-1 overflow-hidden ${tableWrapOnlyClass}`">
      <el-table
        v-loading="listLoading"
        class="w-full"
        :data="list"
        :height="height"
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="工作流名称" />
        <el-table-column prop="creator_name" label="创建者" />
        <el-table-column prop="template_name" label="模板名称" />
        <el-table-column prop="execution_count" label="执行次数" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag
              :type="
                scope.row.status === 'active'
                  ? 'success'
                  : scope.row.status === 'draft'
                  ? 'info'
                  : 'warning'
              "
            >
              {{
                scope.row.status === 'active'
                  ? '活跃'
                  : scope.row.status === 'draft'
                  ? '草稿'
                  : scope.row.status === 'archived'
                  ? '已归档'
                  : '已删除'
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created" label="创建时间">
          <template #default="scope">
            {{ formatDateTime(scope.row.created) }}
          </template>
        </el-table-column>
        <el-table-column prop="modified" label="修改时间">
          <template #default="scope">
            {{ formatDateTime(scope.row.modified) }}
          </template>
        </el-table-column>
        <el-table-column prop="last_execution" label="上次执行">
          <template #default="scope">
            {{
              scope.row.last_execution
                ? formatDateTime(scope.row.last_execution)
                : '-'
            }}
          </template>
        </el-table-column>
        <el-table-column prop="instance_count" label="实例数量" />
        <el-table-column prop="is_template" label="是否模板">
          <template #default="scope">
            <el-tag :type="scope.row.is_template ? 'success' : 'info'">
              {{ scope.row.is_template ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- Actions Column -->
        <!-- width="325px" -->
        <el-table-column fixed="right" label="操作" width="200px">
          <template v-slot="scope">
            <el-button
              type="primary"
              size="small"
              plain
              @click="handleDetail(scope.row)"
              >详情</el-button
            >
            <!-- <el-button
              type="success"
              plain
              size="small"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            > -->

            <el-button
              type="danger"
              size="small"
              plain
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
            <!-- <el-button type="text" size="small" @click="handleEdit(scope.row)"
              >编辑</el-button
            > -->

            <!-- <el-button
              v-if="scope.row.status !== 'archived'"
              type="text"
              size="small"
              @click="handleArchive(scope.row)"
              >归档</el-button
            > -->
            <!-- <el-button
              v-if="scope.row.status === 'archived'"
              type="text"
              size="small"
              @click="handleRestore(scope.row)"
              >恢复</el-button
            > -->

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
          <el-descriptions-item label="工作流ID">{{
            currentRow.id
          }}</el-descriptions-item>
          <el-descriptions-item label="工作流名称">{{
            currentRow.name
          }}</el-descriptions-item>
          <el-descriptions-item label="创建者">{{
            currentRow.creator_name
          }}</el-descriptions-item>
          <el-descriptions-item label="模板名称">{{
            currentRow.template_name
          }}</el-descriptions-item>
          <el-descriptions-item label="执行次数">{{
            currentRow.execution_count
          }}</el-descriptions-item>
          <el-descriptions-item label="工作流状态">{{
            currentRow.status
          }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{
            formatDateTime(currentRow.created)
          }}</el-descriptions-item>
          <el-descriptions-item label="修改时间">{{
            formatDateTime(currentRow.modified)
          }}</el-descriptions-item>
          <el-descriptions-item label="上次执行时间">{{
            currentRow.last_execution
          }}</el-descriptions-item>
          <el-descriptions-item label="实例数量">{{
            currentRow.instance_count
          }}</el-descriptions-item>
          <el-descriptions-item label="是否为模板">{{
            currentRow.is_template ? '是' : '否'
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
        <el-form-item label="工作流名称">
          <el-input v-model="addForm.name" />
        </el-form-item>
        <el-form-item label="工作流描述">
          <el-input v-model="addForm.description" type="textarea" rows="3" />
        </el-form-item>
        <!-- <el-form-item label="工作流模板">
          <el-select v-model="addForm.template">
            <el-option
              v-for="option in templateOptions"
              :key="option.id"
              :label="option.name"
              :value="option.id"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="状态">
          <el-select v-model="addForm.status">
            <el-option label="草稿" value="draft" />
            <el-option label="活跃" value="active" />
            <el-option label="已归档" value="archived" />
            <el-option label="已删除" value="deleted" />
          </el-select>
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
  getThreadsList,
  createThread,
  getThreadDetail,
  updateThread,
  patchThread,
  deleteThread,
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

import {
  getWorkflowsList,
  createWorkflow,
  getWorkflowDetail,
  updateWorkflow,
  patchWorkflow,
  deleteWorkflow,
  archiveWorkflow,
  createWorkflowInstance,
  recordWorkflowExecution,
  restoreWorkflow,
  softDeleteWorkflow
} from '@/api/workflows';

import { ElMessage, ElMessageBox } from 'element-plus';
import { API_BASE_URL } from '@/utils/constant';

export default defineComponent({
  name: 'UserProfile',
  components: { Pagination },
  data() {
    return {
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
        pageSize: 1000
      }).then((res) => {
        const data = res.data;
        this.modelOptions = data.results;
      });
    },
    getList() {
      getWorkflowsList({
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
      getWorkflowDetail(row.id).then((res) => {
        this.currentRow = res.data;
        this.dialogVisible = true;
      });
    },
    handleEdit(row) {
      getThreadDetail(row.id).then((res) => {
        this.editForm = res.data;
        this.editDialogVisible = true;
      });
    },
    handleAdd() {
      this.addForm = {
        name: undefined, // 工作流名称
        description: undefined, // 工作流描述
        creator: 0, // 创建者的用户 ID
        creator_name: undefined, // 创建者名称
        template: 0, // 使用的工作流模板 ID
        template_name: undefined, // 使用的工作流模板名称
        execution_count: 0, // 执行次数
        execution_history: undefined, // 执行历史记录
        status: 'draft', // 工作流状态, draft - 草稿, active - 活跃, archived - 已归档, deleted - 已删除
        metadata: undefined, // 工作流的额外元数据
        created: undefined, // 创建时间
        modified: undefined, // 修改时间
        last_execution: undefined, // 上次执行时间
        instance_count: undefined // 工作流实例的数量
      };
      this.addDialogVisible = true;
    },
    submitEdit() {
      updateModel(this.editForm.id, this.editForm)
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
      createWorkflow(this.addForm)
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
        deleteWorkflow(row.id).then(() => {
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
