<template>
  <div class="dashboard-container inset-0 absolute">
    <div class="h-full flex justify-center items-center">
      <el-image
        style="width: 400px; height: 400px; margin-bottom: 20%"
        src="https://iconfont.alicdn.com/p/illus/preview_image/I05BTMQvOPvB/aba9d715-63fb-4481-8330-6d8db2a1d5c8.png"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { mapState } from 'pinia';
// import adminDashboard from './admin';
// import editorDashboard from './editor';
import store from '@/store';

export default defineComponent({
  name: 'Dashboard',
  // components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    };
  },
  computed: {
    ...mapState(store.user, ['roles'])
  },
  created() {
    console.log('dashboard created');
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard';
    }
  }
});
</script>
