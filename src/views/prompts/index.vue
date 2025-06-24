<template>
  <div class="app-container absolute inset-0 flex flex-col">
    <!-- <div class="app-header mb-4 flex-shrink-0 flex">
      <div class="inline-flex ml-auto">
        <el-button type="primary" @click="handleAdd">添加提示词</el-button>
      </div>
    </div> -->

    <div
      class="app-header mb-4 flex-shrink-0 flex items-center flex-wrap gap-4"
    >
      <el-input
        v-model="searchForm.title"
        placeholder="标题"
        class="search-ctrl mr-2"
        clearable
      />
      <el-input
        v-model="searchForm.tags"
        placeholder="标签"
        class="search-ctrl mr-2"
        clearable
      />
      <el-input
        v-model="searchForm.directory"
        placeholder="目录"
        class="search-ctrl mr-2"
        clearable
      />
      <div style="width: 220px">
        <el-date-picker
          v-model="searchForm.created_time_range"
          type="daterange"
          value-format="YYYY-MM-DD"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="search-ctrl mr-2"
        />
      </div>

      <el-button type="primary" @click="getList">搜索</el-button>
      <el-button type="info" class="ml-0" plain @click="resetSearch"
        >重置</el-button
      >
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

        <!-- 目录 Column -->
        <el-table-column label="目录">
          <template v-slot="scope">
            <span>{{ scope.row.directory_name }}</span>
          </template>
        </el-table-column>

        <!-- 标签 Column -->
        <el-table-column label="标签">
          <template v-slot="scope">
            <span>{{ scope.row.tags }}</span>
          </template>
        </el-table-column>

        <!-- 创建时间 Column -->
        <el-table-column label="创建时间">
          <template v-slot="scope">
            <span>{{ formatDateTime(scope.row.created) }}</span>
          </template>
        </el-table-column>

        <!-- 修改时间 Column -->
        <el-table-column label="修改时间">
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
          <el-descriptions-item label="配置键">{{
            currentRow.key
          }}</el-descriptions-item>
          <el-descriptions-item label="配置值">{{
            currentRow.value
          }}</el-descriptions-item>
          <el-descriptions-item label="值类型">{{
            valueTypeTextMap[currentRow.value_type]
          }}</el-descriptions-item>
          <el-descriptions-item label="描述">{{
            currentRow.description
          }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{
            formatDateTime(currentRow.created_at)
          }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{
            formatDateTime(currentRow.updated_at)
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
        <el-form-item label="标题">
          <el-input v-model="addForm.title" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="提示词内容">
          <el-input v-model="addForm.content" type="textarea" rows="3" />
        </el-form-item>
        <el-form-item label="所属目录">
          <el-input-number v-model="addForm.directory" :min="0" />
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="addForm.tags" />
        </el-form-item>
        <el-form-item label="元数据">
          <el-input v-model="addForm.metadata" type="textarea" rows="3" />
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
        <el-form-item label="配置键">
          <el-input v-model="editForm.key" />
        </el-form-item>
        <el-form-item label="配置值">
          <el-input v-model="editForm.value" />
        </el-form-item>
        <el-form-item label="值类型">
          <!-- <el-input v-model="editForm.value_type" /> -->
          <el-select
            v-model="editForm.value_type"
            placeholder="请选择值类型"
            filterable
          >
            <el-option
              v-for="option in valueTypeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
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
import { nanoid } from 'nanoid';
import { debounce, isNumber } from 'lodash';

import { defineComponent } from 'vue';
import Pagination from '@/components/Pagination';
import { formatDateTime } from '@/utils';
import {
  getPromptsList as getList,
  createPrompt as createItem,
  getPromptById as getItemDetail,
  updatePrompt as updateItem,
  deletePrompt as deleteItem
} from '@/api/prompts';

import { ElMessage, ElMessageBox } from 'element-plus';

const searchForm = {
  title: '',
  tags: '',
  directory: '',
  created_time_range: [] // [起始时间, 结束时间]
};

export default defineComponent({
  name: 'UserProfile',
  components: { Pagination },
  data() {
    return {
      searchForm,
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
        title: '', // 标题 (minLength: 1, maxLength: 100)
        content: '', // 提示词内容 (minLength: 1)
        directory: 0, // 所属目录 (integer)
        tags: '', // 标签
        metadata: '' // 元数据
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
    resetSearch() {
      this.searchForm = {
        ...searchForm
      };
      this.searchForm.created_time_range = [];
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
    getList() {
      getList({
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
      getItemDetail(row.id).then((res) => {
        this.currentRow = res.data;
        this.dialogVisible = true;
      });
    },
    handleEdit(row) {
      getItemDetail(row.id).then((res) => {
        this.editForm = res.data;
        this.editDialogVisible = true;
      });
    },
    handleAdd() {
      this.addForm = {
        title: '',
        content: '',
        directory: 0,
        tags: '',
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
      createItem(this.addForm)
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
