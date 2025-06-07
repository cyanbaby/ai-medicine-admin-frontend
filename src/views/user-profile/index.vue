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
          <router-link :to="'/example/edit/' + scope.row.user_id">
            <el-button type="text" size="small" :icon="IconEdit">
              详情
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>


    <!-- Pagination Component -->
    <pagination v-show="total > 0" :total="total" v-model:page="listQuery.page" v-model:limit="listQuery.limit"
      @pagination="getList" />
  </div>
</template>

<script lang="ts">

import { getUserProfileList } from '@/api/profile';
import { defineComponent } from 'vue';
import Pagination from '@/components/Pagination'; // Secondary package based on el-pagination
import { formatDateTime } from '@/utils';
import { Edit as IconEdit } from '@element-plus/icons-vue';

const results = [
  {
    "user_id": 9,  // 用户ID
    "username": "fw123",  // 用户名
    "email": "fw123@fwe.com",  // 邮箱
    "first_name": "easonwaii",  // 名字
    "last_name": "",  // 姓氏
    "is_staff": false,  // 是否为工作人员
    "is_superuser": false,  // 是否为超级管理员
    "points": 0,  // 积分
    "updated_at": "2025-06-02T06:13:25.271978Z",  // 更新时间
    "is_email_verified": false,  // 邮箱是否已验证
    "bio": "",  // 个人简介
    "date_of_birth": null,  // 出生日期
    "phone_number": "",  // 电话号码
    "avatar": null,  // 头像
    "created_at": "2025-06-02T06:13:25.271958Z",  // 创建时间
    "institution": "",  // 所在机构
    "research_field": "",  // 研究领域
    "user_tier": "basic",  // 用户等级
    "user_tier_display": "Basic User",  // 用户等级显示
    "is_premium": false,  // 是否为高级用户
    "is_enterprise": false,  // 是否为企业用户
    "tier_level": 1  // 等级层级
  },
  {
    "user_id": 12,
    "username": "fw123456",
    "email": "fw123456@fwe.com",
    "first_name": "123",
    "last_name": "",
    "is_staff": false,
    "is_superuser": false,
    "points": 0,
    "updated_at": "2025-06-02T01:34:54.607455Z",
    "is_email_verified": false,
    "bio": "",
    "date_of_birth": null,
    "phone_number": "",
    "avatar": null,
    "created_at": "2025-06-02T01:34:54.605755Z",
    "institution": "",
    "research_field": "",
    "user_tier": "basic",
    "user_tier_display": "Basic User",
    "is_premium": false,
    "is_enterprise": false,
    "tier_level": 1
  },
  {
    "user_id": 13,
    "username": "fw1234567",
    "email": "fw1234567@fwe.com",
    "first_name": "123",
    "last_name": "",
    "is_staff": false,
    "is_superuser": false,
    "points": 0,
    "updated_at": "2025-06-02T01:41:04.131072Z",
    "is_email_verified": false,
    "bio": "",
    "date_of_birth": null,
    "phone_number": "",
    "avatar": null,
    "created_at": "2025-06-02T01:41:04.129117Z",
    "institution": "",
    "research_field": "",
    "user_tier": "basic",
    "user_tier_display": "Basic User",
    "is_premium": false,
    "is_enterprise": false,
    "tier_level": 1
  },
  {
    "user_id": 14,
    "username": "fw12345678",
    "email": "fw12345678@fwe.com",
    "first_name": "123",
    "last_name": "",
    "is_staff": false,
    "is_superuser": false,
    "points": 0,
    "updated_at": "2025-06-02T02:01:08.973716Z",
    "is_email_verified": false,
    "bio": "",
    "date_of_birth": null,
    "phone_number": "",
    "avatar": null,
    "created_at": "2025-06-02T02:01:08.973705Z",
    "institution": "",
    "research_field": "",
    "user_tier": "basic",
    "user_tier_display": "Basic User",
    "is_premium": false,
    "is_enterprise": false,
    "tier_level": 1
  },
  {
    "user_id": 15,
    "username": "fw123456789",
    "email": "fw123456789@fwe.com",
    "first_name": "123",
    "last_name": "",
    "is_staff": false,
    "is_superuser": false,
    "points": 0,
    "updated_at": "2025-06-02T02:01:27.541134Z",
    "is_email_verified": false,
    "bio": "",
    "date_of_birth": null,
    "phone_number": "",
    "avatar": null,
    "created_at": "2025-06-02T02:01:27.541127Z",
    "institution": "",
    "research_field": "",
    "user_tier": "basic",
    "user_tier_display": "Basic User",
    "is_premium": false,
    "is_enterprise": false,
    "tier_level": 1
  },
  {
    "user_id": 16,
    "username": "fw1234567890",
    "email": "fw1234567890@fwe.com",
    "first_name": "123",
    "last_name": "",
    "is_staff": false,
    "is_superuser": false,
    "points": 0,
    "updated_at": "2025-06-02T02:02:31.369891Z",
    "is_email_verified": false,
    "bio": "",
    "date_of_birth": null,
    "phone_number": "",
    "avatar": null,
    "created_at": "2025-06-02T02:02:31.369884Z",
    "institution": "",
    "research_field": "",
    "user_tier": "basic",
    "user_tier_display": "Basic User",
    "is_premium": false,
    "is_enterprise": false,
    "tier_level": 1
  },
  {
    "user_id": 17,
    "username": "fw1234567111",
    "email": "fw1234567111@fwe.com",
    "first_name": "123",
    "last_name": "",
    "is_staff": false,
    "is_superuser": false,
    "points": 0,
    "updated_at": "2025-06-02T02:12:01.300885Z",
    "is_email_verified": false,
    "bio": "",
    "date_of_birth": null,
    "phone_number": "",
    "avatar": null,
    "created_at": "2025-06-02T02:12:01.295226Z",
    "institution": "fwe",
    "research_field": "clinical",
    "user_tier": "basic",
    "user_tier_display": "Basic User",
    "is_premium": false,
    "is_enterprise": false,
    "tier_level": 1
  },
  {
    "user_id": 18,
    "username": "fw321",
    "email": "fw321@fwe.com",
    "first_name": "easonwaii",
    "last_name": "",
    "is_staff": false,
    "is_superuser": false,
    "points": 0,
    "updated_at": "2025-06-02T06:10:55.780701Z",
    "is_email_verified": false,
    "bio": "",
    "date_of_birth": null,
    "phone_number": "",
    "avatar": null,
    "created_at": "2025-06-02T06:10:55.774840Z",
    "institution": "123",
    "research_field": "basic",
    "user_tier": "basic",
    "user_tier_display": "Basic User",
    "is_premium": false,
    "is_enterprise": false,
    "tier_level": 1
  },
  {
    "user_id": 2,
    "username": "eason",
    "email": "eason@eason.com",
    "first_name": "",
    "last_name": "",
    "is_staff": true,
    "is_superuser": true,
    "points": 0,
    "updated_at": "2025-06-07T10:54:05.157681Z",
    "is_email_verified": false,
    "bio": "",
    "date_of_birth": null,
    "phone_number": "",
    "avatar": null,
    "created_at": "2025-06-07T10:54:05.157662Z",
    "institution": "",
    "research_field": "",
    "user_tier": "basic",
    "user_tier_display": "Basic User",
    "is_premium": false,
    "is_enterprise": false,
    "tier_level": 1
  },
  {
    "user_id": 19,
    "username": "cyan",
    "email": "cyan@example.com",
    "first_name": "",
    "last_name": "",
    "is_staff": false,
    "is_superuser": false,
    "points": 0,
    "updated_at": "2025-06-07T06:02:54.758228Z",
    "is_email_verified": false,
    "bio": "",
    "date_of_birth": null,
    "phone_number": "",
    "avatar": null,
    "created_at": "2025-06-07T06:02:54.739867Z",
    "institution": "",
    "research_field": "",
    "user_tier": "basic",
    "user_tier_display": "Basic User",
    "is_premium": false,
    "is_enterprise": false,
    "tier_level": 1
  }
]

export default defineComponent({
  name: 'UserProfile',
  components: { Pagination },
  data() {


    return {
      list: results,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10
      }

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
  }
});
</script>

<style lang="scss" scoped></style>