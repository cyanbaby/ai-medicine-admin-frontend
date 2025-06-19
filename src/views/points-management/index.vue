<template>
  <div class="app-container absolute inset-0 flex flex-col">
    <div class="app-header mb-4 flex-shrink-0 flex">
      <div class="inline-flex ml-auto">
        <el-button type="primary" @click="handleAdd">添加积分记录</el-button>
        <el-button type="primary" @click="handleAdjustPoints"
          >调整用户积分</el-button
        >
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
        <!-- 积分记录ID Column -->
        <el-table-column label="记录ID" width="80">
          <template v-slot="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>

        <!-- 用户名 Column -->
        <el-table-column width="180px" label="用户名">
          <template v-slot="scope">
            <span>{{ scope.row.username }}</span>
          </template>
        </el-table-column>

        <!-- 积分数量 Column -->
        <el-table-column width="120px" label="积分数量">
          <template v-slot="scope">
            <span>{{ scope.row.points }}</span>
          </template>
        </el-table-column>

        <!-- 积分原因 Column -->
        <el-table-column width="150px" label="积分原因">
          <template v-slot="scope">
            <el-tag>
              {{ reasonTextMap[scope.row.reason] || scope.row.reason }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 详细描述 Column -->
        <el-table-column label="详细描述">
          <template v-slot="scope">
            <span>{{ scope.row.description }}</span>
          </template>
        </el-table-column>

        <!-- 创建时间 Column -->
        <el-table-column label="创建时间">
          <template v-slot="scope">
            <span>{{ formatDateTime(scope.row.created_at) }}</span>
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
          <el-descriptions-item label="记录ID">{{
            currentRow.id
          }}</el-descriptions-item>
          <el-descriptions-item label="用户名">{{
            currentRow.username
          }}</el-descriptions-item>
          <el-descriptions-item label="积分数量">{{
            currentRow.points
          }}</el-descriptions-item>
          <el-descriptions-item label="积分原因">{{
            reasonTextMap[currentRow.reason] || currentRow.reason
          }}</el-descriptions-item>
          <el-descriptions-item label="积分说明" :span="2">{{
            currentRow.description
          }}</el-descriptions-item>
          <el-descriptions-item label="创建时间" :span="2">{{
            formatDateTime(currentRow.created_at)
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
        <!-- <el-form-item label="用户名">
          <el-input v-model="addForm.username" />
        </el-form-item> -->
        <el-form-item label="积分数量">
          <el-input v-model="addForm.points" />
        </el-form-item>
        <el-form-item label="积分原因">
          <el-select
            v-model="addForm.reason"
            placeholder="请选择积分原因"
            filterable
          >
            <el-option
              v-for="option in reasonOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
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
    <el-dialog
      title="编辑"
      v-model="editDialogVisible"
      width="620px"
      :before-close="() => (editDialogVisible = false)"
    >
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled />
        </el-form-item>
        <el-form-item label="积分数量">
          <el-input v-model="editForm.points" />
        </el-form-item>
        <el-form-item label="积分原因">
          <el-select
            v-model="editForm.reason"
            placeholder="请选择积分原因"
            filterable
          >
            <el-option
              v-for="option in reasonOptions"
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

    <!-- 积分调整弹窗 -->
    <el-dialog
      title="调整用户积分"
      v-model="adjustDialogVisible"
      width="620px"
      :before-close="() => (adjustDialogVisible = false)"
    >
      <el-form :model="adjustForm" label-width="100px">
        <el-form-item label="选择用户">
          <el-select
            v-model="adjustForm.user_id"
            placeholder="请选择用户"
            filterable
          >
            <el-option
              v-for="user in userOptions"
              :key="user.user_id"
              :label="user.username"
              :value="user.user_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="积分数量">
          <el-input v-model="adjustForm.points" />
        </el-form-item>
        <el-form-item label="积分原因">
          <el-select
            v-model="adjustForm.reason"
            placeholder="请选择积分原因"
            filterable
          >
            <el-option
              v-for="option in reasonOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="adjustForm.description" type="textarea" rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="adjustDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAdjust">确认</el-button>
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
import { getUserProfileList } from '@/api/profile';
import {
  getPointsList as getList,
  createPoint as addItem,
  getPointDetail as getDetail,
  updatePoint as updateItem,
  deletePoint as deleteItem,
  adjustPoints
} from '@/api/points';
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
      editDialogVisible: false,
      editForm: {} as any,
      addDialogVisible: false,
      addForm: {
        username: '',
        points: '',
        reason: '',
        description: ''
      } as any,
      adjustDialogVisible: false,
      adjustForm: {
        user_id: '',
        points: '',
        reason: '',
        description: ''
      } as any,
      userOptions: [] as any[],
      reasonOptions: [
        { value: 'registration', label: '注册奖励' },
        { value: 'login', label: '登录奖励' },
        { value: 'post', label: '发帖奖励' },
        { value: 'comment', label: '评论奖励' },
        { value: 'like', label: '点赞奖励' },
        { value: 'share', label: '分享奖励' },
        { value: 'purchase', label: '购买/消费' },
        { value: 'admin', label: '管理员调整' },
        { value: 'recharge', label: '用户充值' },
        { value: 'other', label: '其他' }
      ]
    };
  },
  computed: {
    reasonTextMap() {
      return this.reasonOptions.reduce((acc, option) => {
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
        username: '',
        points: '',
        reason: '',
        description: ''
      };
      this.addDialogVisible = true;
    },
    submitEdit() {
      updateItem(this.editForm.id, this.editForm)
        .then(() => {
          ElNotification({
            title: 'Success',
            message: '保存成功',
            type: 'success',
            duration: 2000
          });
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
          ElNotification({
            title: 'Success',
            message: '添加成功',
            type: 'success',
            duration: 2000
          });
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
          ElNotification({
            title: 'Success',
            message: '删除成功',
            type: 'success',
            duration: 2000
          });
          this.getList();
        });
      });
    },
    handleAdjustPoints() {
      getUserProfileList({ page: 1, pageSize: 1000 }).then((res) => {
        this.userOptions = res.data.results;
        this.adjustForm = {
          user_id: '',
          points: '',
          reason: '',
          description: ''
        };
        this.adjustDialogVisible = true;
      });
    },
    submitAdjust() {
      adjustPoints(this.adjustForm).then(() => {
        ElNotification({
          title: 'Success',
          message: '积分调整成功',
          type: 'success',
          duration: 2000
        });
        this.adjustDialogVisible = false;
        this.getList();
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
