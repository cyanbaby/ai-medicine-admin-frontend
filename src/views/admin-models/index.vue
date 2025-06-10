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
        border
        style="width: 100%"
      >
        <!-- ID Column -->
        <el-table-column label="ID" width="80">
          <template v-slot="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>

        <!-- 模型名称 Column -->
        <el-table-column label="模型名称" width="180">
          <template v-slot="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <!-- 显示名称 Column -->
        <el-table-column label="显示名称" width="180">
          <template v-slot="scope">
            <span>{{ scope.row.display_name }}</span>
          </template>
        </el-table-column>

        <!-- 描述 Column -->
        <el-table-column label="描述">
          <template v-slot="scope">
            <span>{{ scope.row.description }}</span>
          </template>
        </el-table-column>

        <!-- 提供商 Column -->
        <el-table-column label="提供商" width="120">
          <template v-slot="scope">
            <span>{{ scope.row.provider }}</span>
          </template>
        </el-table-column>

        <!-- 状态 Column -->
        <el-table-column label="状态" width="100">
          <template v-slot="scope">
            <el-tag :type="scope.row.is_enabled ? 'success' : 'info'">
              {{ scope.row.is_enabled ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 付费状态 Column -->
        <el-table-column label="付费状态" width="100">
          <template v-slot="scope">
            <el-tag :type="scope.row.is_premium ? 'warning' : 'info'">
              {{ scope.row.is_premium ? '付费' : '免费' }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 创建时间 Column -->
        <el-table-column label="创建时间" width="180">
          <template v-slot="scope">
            <span>{{ formatDateTime(scope.row.created) }}</span>
          </template>
        </el-table-column>

        <!-- 更新时间 Column -->
        <el-table-column label="更新时间" width="180">
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
            <el-button type="text" size="small" @click="handleDetail(scope.row)"
              >详情</el-button
            >
            <el-button type="text" size="small" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button type="text" size="small" @click="handleDelete(scope.row)"
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
          <el-descriptions-item label="模型名称">{{
            currentRow.display_name
          }}</el-descriptions-item>
          <el-descriptions-item label="模型标识">{{
            currentRow.name
          }}</el-descriptions-item>
          <el-descriptions-item label="提供商">{{
            currentRow.provider
          }}</el-descriptions-item>
          <el-descriptions-item label="API基础URL">{{
            currentRow.api_base_url
          }}</el-descriptions-item>
          <el-descriptions-item label="是否启用">{{
            currentRow.is_enabled ? '是' : '否'
          }}</el-descriptions-item>
          <el-descriptions-item label="是否高级版">{{
            currentRow.is_premium ? '是' : '否'
          }}</el-descriptions-item>
          <el-descriptions-item label="上下文窗口">{{
            currentRow.context_window
          }}</el-descriptions-item>
          <el-descriptions-item label="最大Token数">{{
            currentRow.max_tokens
          }}</el-descriptions-item>
          <el-descriptions-item label="温度范围">{{
            `${currentRow.temperature_range.min} - ${currentRow.temperature_range.max}`
          }}</el-descriptions-item>
          <el-descriptions-item label="默认温度">{{
            currentRow.temperature_range.default
          }}</el-descriptions-item>
          <el-descriptions-item label="输入Token价格">{{
            currentRow.price_per_1k_tokens
          }}</el-descriptions-item>
          <el-descriptions-item label="输出Token价格">{{
            currentRow.price_per_1k_output_tokens
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
      <el-form :model="addForm" label-width="120px">
        <el-form-item label="模型名称">
          <el-input v-model="addForm.name" />
        </el-form-item>
        <el-form-item label="显示名称">
          <el-input v-model="addForm.display_name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="addForm.description" type="textarea" rows="3" />
        </el-form-item>
        <el-form-item label="提供商">
          <el-input v-model="addForm.provider" />
        </el-form-item>
        <el-form-item label="API基础URL">
          <el-input v-model="addForm.api_base_url" />
        </el-form-item>
        <el-form-item label="API密钥 key">
          <el-input v-model="addForm.api_key" />
        </el-form-item>
        <el-form-item label="API密钥 secret">
          <el-input v-model="addForm.api_secret" />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="addForm.is_enabled" />
        </el-form-item>
        <el-form-item label="是否高级版">
          <el-switch v-model="addForm.is_premium" />
        </el-form-item>
        <el-form-item label="上下文窗口">
          <el-input-number v-model="addForm.context_window" :min="1" />
        </el-form-item>
        <el-form-item label="最大Token数">
          <el-input-number v-model="addForm.max_tokens" :min="1" />
        </el-form-item>
        <!-- <el-form-item label="温度范围">
          <el-input v-model="addForm.temperature_range" />
        </el-form-item> -->
        <el-form-item label="输入Token价格">
          <el-input v-model="addForm.price_per_1k_tokens" />
        </el-form-item>
        <el-form-item label="输出Token价格">
          <el-input v-model="addForm.price_per_1k_output_tokens" />
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
        <el-form-item label="模型名称">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="显示名称">
          <el-input v-model="editForm.display_name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editForm.description" type="textarea" rows="3" />
        </el-form-item>
        <el-form-item label="提供商">
          <el-input v-model="editForm.provider" />
        </el-form-item>
        <el-form-item label="API基础URL">
          <el-input v-model="editForm.api_base_url" />
        </el-form-item>
        <el-form-item label="API密钥 key">
          <el-input v-model="editForm.api_key" />
        </el-form-item>
        <el-form-item label="API密钥 secret">
          <el-input v-model="editForm.api_secret" />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="editForm.is_enabled" />
        </el-form-item>
        <el-form-item label="是否高级版">
          <el-switch v-model="editForm.is_premium" />
        </el-form-item>
        <el-form-item label="上下文窗口">
          <el-input-number v-model="editForm.context_window" :min="1" />
        </el-form-item>
        <el-form-item label="最大Token数">
          <el-input-number v-model="editForm.max_tokens" :min="1" />
        </el-form-item>
        <!-- <el-form-item label="温度范围">
          <el-input v-model="editForm.temperature_range" />
        </el-form-item> -->
        <el-form-item label="输入Token价格">
          <el-input v-model="editForm.price_per_1k_tokens" />
        </el-form-item>
        <el-form-item label="输出Token价格">
          <el-input v-model="editForm.price_per_1k_output_tokens" />
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
  getModelsList,
  createModel,
  getModelDetail,
  updateModel,
  deleteModel
} from '@/api/models';

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
      getModelsList({
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
      getModelDetail(row.id).then((res) => {
        this.currentRow = res.data;
        this.dialogVisible = true;
      });
    },
    handleEdit(row) {
      getModelDetail(row.id).then((res) => {
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
      createModel(this.addForm)
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
        deleteModel(row.id).then(() => {
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
