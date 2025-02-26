<!-- src/App.vue -->
<template>
  <div id="app">
    <Home />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Home from '../src/components/Home.vue';

export default defineComponent({
  name: "App",
  components: {
    Home,
  },
});
</script>

<style>
/* グローバルスタイルを必要に応じて追加 */
body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background-color: #f0f0f0;
}
</style>
