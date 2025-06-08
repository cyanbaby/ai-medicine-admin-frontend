<template>
  <div class="app-container">
    <el-table v-loading="listLoading" class="w-full" :data="list" border fit highlight-current-row style="width: 100%">

      <!-- 用户ID Column -->
      <el-table-column align="center" label="用户ID" width="80">
        <template v-slot="scope">
          <span>{{ scope.row.user_id }}</span>
        </template>
      </el-table-column>

      <!-- 用户名 Column -->
      <el-table-column width="180px" align="center" label="用户名">
        <template v-slot="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <!-- 邮箱 Column -->
      <el-table-column width="220px" align="center" label="邮箱">
        <template v-slot="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>

      <!-- 姓名 Column -->
      <el-table-column width="150px" align="center" label="姓名">
        <template v-slot="scope">
          <span>{{ scope.row.first_name }} {{ scope.row.last_name }}</span>
        </template>
      </el-table-column>

      <!-- 是否为工作人员 Column -->
      <el-table-column width="130px" align="center" label="是否为工作人员">
        <template v-slot="scope">
          <span>{{ scope.row.is_staff ? '是' : '否' }}</span>
        </template>
      </el-table-column>

      <!-- 是否为超级管理员 Column -->
      <el-table-column width="150px" align="center" label="是否为超级管理员">
        <template v-slot="scope">
          <span>{{ scope.row.is_superuser ? '是' : '否' }}</span>
        </template>
      </el-table-column>

      <!-- 积分 Column -->
      <el-table-column width="100px" align="center" label="积分">
        <template v-slot="scope">
          <span>{{ scope.row.points }}</span>
        </template>
      </el-table-column>

      <!-- 更新时间 Column -->
      <el-table-column width="180px" align="center" label="最后更新时间">
        <template v-slot="scope">
          <span>{{ formatDateTime(scope.row.updated_at) }}</span>
        </template>
      </el-table-column>

      <!-- 邮箱是否已验证 Column -->
      <el-table-column width="150px" align="center" label="邮箱是否已验证">
        <template v-slot="scope">
          <span>{{ scope.row.is_email_verified ? '是' : '否' }}</span>
        </template>
      </el-table-column>

      <!-- 用户等级 Column -->
      <el-table-column width="120px" align="center" label="用户等级">
        <template v-slot="scope">
          <span>{{ scope.row.user_tier_display }}</span>
        </template>
      </el-table-column>

      <!-- 是否为高级用户 Column -->
      <el-table-column width="150px" align="center" label="是否为高级用户">
        <template v-slot="scope">
          <span>{{ scope.row.is_premium ? '是' : '否' }}</span>
        </template>
      </el-table-column>

      <!-- 是否为企业用户 Column -->
      <el-table-column width="150px" align="center" label="是否为企业用户">
        <template v-slot="scope">
          <span>{{ scope.row.is_enterprise ? '是' : '否' }}</span>
        </template>
      </el-table-column>

      <!-- 创建时间 Column -->
      <!-- width="180px" -->
      <el-table-column align="center" label="创建时间">
        <template v-slot="scope">
          <span>{{ formatDateTime(scope.row.created_at) }}</span>
        </template>
      </el-table-column>

      <!-- Actions Column -->
      <el-table-column align="center" fixed="right" label="操作">
        <template v-slot="scope">
          <el-button type="text" size="small" @click="handleDetail(scope.row)">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- Pagination Component -->
    <pagination v-show="total > 0" :total="total" v-model:page="listQuery.page" v-model:limit="listQuery.limit"
      @pagination="getList" />

    <!-- 添加在 el-table 下方，pagination 上方 -->

    <el-dialog title="用户详情" v-model="dialogVisible" width="620px" :before-close="handleClose">
      <div v-if="currentUser">
        <el-descriptions :column="2" border class="user-detail-descriptions">
          <el-descriptions-item label="用户ID">{{ currentUser.user_id }}</el-descriptions-item>
          <el-descriptions-item label="用户名">{{ currentUser.username }}</el-descriptions-item>

          <el-descriptions-item label="邮箱">{{ currentUser.email }}</el-descriptions-item>
          <el-descriptions-item label="姓名">{{ currentUser.first_name }} {{ currentUser.last_name
            }}</el-descriptions-item>

          <el-descriptions-item label="是否为工作人员">{{ currentUser.is_staff ? '是' : '否' }}</el-descriptions-item>
          <el-descriptions-item label="是否为超级管理员">{{ currentUser.is_superuser ? '是' : '否' }}</el-descriptions-item>

          <el-descriptions-item label="积分">{{ currentUser.points }}</el-descriptions-item>
          <el-descriptions-item label="邮箱是否验证">{{ currentUser.is_email_verified ? '是' : '否' }}</el-descriptions-item>

          <el-descriptions-item label="用户等级">{{ currentUser.user_tier_display }}</el-descriptions-item>
          <el-descriptions-item label="是否为高级用户">{{ currentUser.is_premium ? '是' : '否' }}</el-descriptions-item>

          <el-descriptions-item label="是否为企业用户">{{ currentUser.is_enterprise ? '是' : '否' }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ formatDateTime(currentUser.created_at) }}</el-descriptions-item>

          <el-descriptions-item label="最后更新时间">{{ formatDateTime(currentUser.updated_at) }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>


  </div>
</template>

<script lang="ts">

import { getUserProfileList, getUserProfileDetail } from '@/api/profile';
import { defineComponent } from 'vue';
import Pagination from '@/components/Pagination'; // Secondary package based on el-pagination
import { formatDateTime } from '@/utils';



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
      dialogVisible: false,        // 控制弹窗显示
      currentUser: null as any     // 当前选中用户详情

    };
  },
  watch: {

  },
  created() {
    this.getList();
  },
  mounted() {

  },
  unmounted() {

  },
  methods: {
    getList() {

      getUserProfileList({
        page: 1,
        pageSize: 10
      }).then(res => {
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
      getUserProfileDetail(user.user_id).then(res => {
        this.currentUser = res.data;
        this.dialogVisible = true;
      });
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