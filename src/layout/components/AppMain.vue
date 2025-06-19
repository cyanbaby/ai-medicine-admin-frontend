<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script>
import { defineComponent } from 'vue';
import store from '@/store';

export default defineComponent({
  name: 'AppMain',
  computed: {
    cachedViews() {
      return store.tagsView().cachedViews;
    }
  }
});
</script>

<style lang="scss" scoped>
.app-main {
  position: relative;
  width: 100%;
  min-height: calc(100vh - 50px);
  overflow: hidden;
  background-color: #f5f5f5;
}

::v-deep(.el-table th.el-table__cell) {
  background-color: #f5f5f5;

  .cell {
    color: rgba(0, 0, 0, 0.88);
    font-weight: 600;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
      'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    transition: background 0.2s ease;
  }
}

.app-container {
  margin: 16px;
  background-color: #fff;
  border-radius: 6px;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
