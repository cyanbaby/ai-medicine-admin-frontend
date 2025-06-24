<template>
  <div class="app-container absolute inset-0 flex flex-col">
    <div
      class="app-header mb-4 flex-shrink-0 flex items-center flex-wrap gap-4"
    >
      <el-input
        v-model="searchForm.username"
        placeholder="用户名"
        clearable
        class="search-ctrl"
      />
      <el-input
        v-model="searchForm.email"
        placeholder="邮箱"
        clearable
        class="search-ctrl"
      />
      <el-select
        v-model="searchForm.is_staff"
        placeholder="是否为工作人员"
        clearable
        class="search-ctrl"
      >
        <el-option label="是" :value="true" />
        <el-option label="否" :value="false" />
      </el-select>
      <el-select
        v-model="searchForm.is_superuser"
        placeholder="是否为超级管理员"
        clearable
        class="search-ctrl"
      >
        <el-option label="是" :value="true" />
        <el-option label="否" :value="false" />
      </el-select>
      <el-select
        v-model="searchForm.is_email_verified"
        placeholder="邮箱是否验证"
        clearable
        class="search-ctrl"
      >
        <el-option label="是" :value="true" />
        <el-option label="否" :value="false" />
      </el-select>
      <el-select
        v-model="searchForm.user_tier"
        placeholder="用户等级"
        clearable
        class="search-ctrl"
      >
        <el-option label="basic" value="basic" />
        <el-option label="premium" value="premium" />
        <el-option label="enterprise" value="enterprise" />
      </el-select>
      <el-select
        v-model="searchForm.is_premium"
        placeholder="是否高级用户"
        clearable
        class="search-ctrl"
      >
        <el-option label="是" :value="true" />
        <el-option label="否" :value="false" />
      </el-select>
      <el-select
        v-model="searchForm.is_enterprise"
        placeholder="是否企业用户"
        clearable
        class="search-ctrl"
      >
        <el-option label="是" :value="true" />
        <el-option label="否" :value="false" />
      </el-select>

      <el-button type="primary" @click="getList">搜索</el-button>
      <el-button type="info" class="ml-0" plain @click="resetSearch">重置</el-button>
    </div>

    <div :class="`app-body flex-1 overflow-hidden ${tableWrapOnlyClass}`">
      <el-table
        v-loading="listLoading"
        class="w-full"
        :data="list"
        :height="height"
        style="width: 100%"
      >
        <!-- 用户ID Column -->
        <el-table-column label="用户ID" width="80">
          <template v-slot="scope">
            <span>{{ scope.row.user_id }}</span>
          </template>
        </el-table-column>

        <!-- 用户名 Column -->
        <el-table-column width="180px" label="用户名">
          <template v-slot="scope">
            <span>{{ scope.row.username }}</span>
          </template>
        </el-table-column>

        <!-- 邮箱 Column -->
        <el-table-column width="220px" label="邮箱">
          <template v-slot="scope">
            <span>{{ scope.row.email }}</span>
          </template>
        </el-table-column>

        <!-- 姓名 Column -->
        <el-table-column width="150px" label="姓名">
          <template v-slot="scope">
            <span>{{ scope.row.first_name }} {{ scope.row.last_name }}</span>
          </template>
        </el-table-column>

        <!-- 是否为工作人员 Column -->
        <el-table-column width="130px" label="是否为工作人员">
          <template v-slot="scope">
            <el-tag :type="scope.row.is_staff ? 'success' : 'info'">
              {{ scope.row.is_staff ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 是否为超级管理员 Column -->
        <el-table-column width="150px" label="是否为超级管理员">
          <template v-slot="scope">
            <el-tag :type="scope.row.is_superuser ? 'success' : 'info'">
              {{ scope.row.is_superuser ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 积分 Column -->
        <el-table-column width="100px" label="积分">
          <template v-slot="scope">
            <span>{{ scope.row.points }}</span>
          </template>
        </el-table-column>

        <!-- 更新时间 Column -->
        <el-table-column width="180px" label="最后更新时间">
          <template v-slot="scope">
            <span>{{ formatDateTime(scope.row.updated_at) }}</span>
          </template>
        </el-table-column>

        <!-- 邮箱是否已验证 Column -->
        <el-table-column width="150px" label="邮箱是否已验证">
          <template v-slot="scope">
            <el-tag :type="scope.row.is_email_verified ? 'success' : 'info'">
              {{ scope.row.is_email_verified ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 用户等级 Column -->
        <el-table-column width="120px" label="用户等级">
          <template v-slot="scope">
            <span>{{ scope.row.user_tier_display }}</span>
          </template>
        </el-table-column>

        <!-- 是否为高级用户 Column -->
        <el-table-column width="150px" label="是否为高级用户">
          <template v-slot="scope">
            <el-tag :type="scope.row.is_premium ? 'success' : 'info'">
              {{ scope.row.is_premium ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 是否为企业用户 Column -->
        <el-table-column width="150px" label="是否为企业用户">
          <template v-slot="scope">
            <el-tag :type="scope.row.is_enterprise ? 'success' : 'info'">
              {{ scope.row.is_enterprise ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 创建时间 Column -->
        <el-table-column width="200px" label="创建时间">
          <template v-slot="scope">
            <span>{{ formatDateTime(scope.row.created_at) }}</span>
          </template>
        </el-table-column>

        <!-- Actions Column -->
        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="150px"
        >
          <template v-slot="scope">
            <!-- <el-button
              type="text"
              size="small"
              @click="handleDetail(scope.row)"
            >
              详情
            </el-button> -->
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
    <!-- 添加在 el-table 下方，pagination 上方 -->

    <el-dialog
      title="用户详情"
      v-model="dialogVisible"
      width="620px"
      :before-close="handleClose"
    >
      <div v-if="currentUser">
        <el-descriptions :column="2" border class="user-detail-descriptions">
          <el-descriptions-item label="用户ID">{{
            currentUser.user_id
          }}</el-descriptions-item>
          <el-descriptions-item label="用户名">{{
            currentUser.username
          }}</el-descriptions-item>

          <el-descriptions-item label="邮箱">{{
            currentUser.email
          }}</el-descriptions-item>
          <el-descriptions-item label="姓名"
            >{{ currentUser.first_name }}
            {{ currentUser.last_name }}</el-descriptions-item
          >

          <el-descriptions-item label="是否为工作人员">{{
            currentUser.is_staff ? '是' : '否'
          }}</el-descriptions-item>
          <el-descriptions-item label="是否为超级管理员">{{
            currentUser.is_superuser ? '是' : '否'
          }}</el-descriptions-item>

          <el-descriptions-item label="积分">{{
            currentUser.points
          }}</el-descriptions-item>
          <el-descriptions-item label="邮箱是否验证">{{
            currentUser.is_email_verified ? '是' : '否'
          }}</el-descriptions-item>

          <el-descriptions-item label="用户等级">{{
            currentUser.user_tier_display
          }}</el-descriptions-item>
          <el-descriptions-item label="是否为高级用户">{{
            currentUser.is_premium ? '是' : '否'
          }}</el-descriptions-item>

          <el-descriptions-item label="是否为企业用户">{{
            currentUser.is_enterprise ? '是' : '否'
          }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{
            formatDateTime(currentUser.created_at)
          }}</el-descriptions-item>

          <el-descriptions-item label="最后更新时间">{{
            formatDateTime(currentUser.updated_at)
          }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 编辑弹窗 -->
    <el-dialog title="编辑用户信息" v-model="editDialogVisible" width="600px">
      <el-form :model="editForm" label-width="120px">
        <el-form-item label="邮箱"
          ><el-input v-model="editForm.email"
        /></el-form-item>
        <el-form-item label="名"
          ><el-input v-model="editForm.first_name"
        /></el-form-item>
        <el-form-item label="姓"
          ><el-input v-model="editForm.last_name"
        /></el-form-item>
        <el-form-item label="邮箱已验证">
          <el-switch v-model="editForm.is_email_verified" />
        </el-form-item>
        <el-form-item label="简介"
          ><el-input v-model="editForm.bio" type="textarea"
        /></el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker
            v-model="editForm.date_of_birth"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="手机号"
          ><el-input v-model="editForm.phone_number"
        /></el-form-item>
        <!-- <el-form-item label="头像链接"
          ><el-input v-model="editForm.avatar"
        /></el-form-item> -->
        <el-form-item label="机构"
          ><el-input v-model="editForm.institution"
        /></el-form-item>
        <el-form-item label="研究领域"
          ><el-input v-model="editForm.research_field"
        /></el-form-item>
        <el-form-item label="用户等级">
          <el-select v-model="editForm.user_tier" placeholder="请选择">
            <el-option label="basic" value="basic" />
            <el-option label="premium" value="premium" />
            <el-option label="enterprise" value="enterprise" />
          </el-select>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { nanoid } from 'nanoid';
import { debounce, isNumber } from 'lodash';
import {
  getUserProfileList as getList,
  getUserProfileDetail as getDeital,
  updateUserProfile as updateItem
} from '@/api/profile';
import { defineComponent } from 'vue';
import Pagination from '@/components/Pagination'; // Secondary package based on el-pagination
import { formatDateTime } from '@/utils';

const searchForm = {
  username: '', // 用户名
  email: '', // 邮箱
  is_staff: '', // 是否为工作人员
  is_superuser: '', // 是否为超级管理员
  is_email_verified: '', // 邮箱是否已验证
  user_tier: '', // 用户等级
  is_premium: '', // 是否为高级用户
  is_enterprise: '' // 是否为企业用户
};

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
        limit: 20
      },
      dialogVisible: false, // 控制弹窗显示
      currentUser: null as any, // 当前选中用户详情
      editDialogVisible: false,
      searchForm,
      editForm: {
        email: '',
        first_name: '',
        last_name: '',
        is_email_verified: false,
        bio: '',
        date_of_birth: '',
        phone_number: '',
        avatar: '',
        institution: '',
        research_field: '',
        user_tier: 'basic'
      } as any,
      search: ''
    };
  },
  watch: {},
  created() {
    this.debouncedSetHeight = debounce(this.setHeight, 500);
    this.getList();
  },
  mounted() {
    this.setHeight();
    this.observerTableParent();
  },
  unmounted() {},
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
        pageSize: this.listQuery.limit,
        ...this.searchForm
      })
        .then((res) => {
          const data = res.data;
          this.list = data.results;
          this.total = data.count;
          // this.listQuery.page = data.page;
          // this.listQuery.limit = data.pageSize;
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    resetSearch() {
      this.searchForm = {
        ...searchForm
      };
      this.listQuery.page = 1;
      this.getList();
    },
    formatDateTime,
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      };
      return statusMap[status];
    },
    handleDetail(user: any) {
      getDeital(user.user_id).then((res) => {
        this.currentUser = res.data;
        this.dialogVisible = true;
      });
    },
    handleEdit(row) {
      getDeital(row.user_id).then((res) => {
        console.log(res.data);
        this.editForm = res.data;
        this.editDialogVisible = true;
      });
    },
    async submitEdit() {
      try {
        await updateItem(this.editForm.user_id, this.editForm);
        ElNotification({
          title: 'Success',
          message: '修改成功',
          type: 'success',
          duration: 2000
        });

        this.editDialogVisible = false;
        this.getList(); // 重新拉取数据
      } catch (error) {
        console.log(error);
      }
    },
    handleClose() {
      this.dialogVisible = false;
      this.currentUser = null;
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
