<template>
    <div class="home-container">
      <!-- タブメニュー -->
      <div class="tabs">
        <button
          :class="{ active: activeTab === 'game' }"
          @click="activeTab = 'game'"
        >
          Game
        </button>
        <button
          :class="{ active: activeTab === 'sbtList' }"
          @click="activeTab = 'sbtList'"
        >
          SBT List
        </button>
      </div>
  
      <!-- タブコンテンツ -->
      <div class="tab-content">
        <Game v-if="activeTab === 'game'" />
        <NWCheck v-else-if="activeTab === 'nwcheck'" />
        <SBTList v-else-if="activeTab === 'sbtList'" />

      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from "vue";
  import Game from "./Game.vue";
  import SBTList from "./SBTList.vue";
  import NWCheck from "./NWCheck.vue";
  
  export default defineComponent({
    name: "Home",
    components: {
      Game,
      SBTList,
      NWCheck,
    },
    setup() {
      const activeTab = ref("nwcheck");
      return { activeTab };
    },
  });
  </script>
  
  <style scoped>
  .home-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 1rem;
  }
  
  .tabs {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 1rem;
  }
  
  .tabs button {
    padding: 0.75rem 1.5rem;
    border: 1px solid #ccc;
    background-color: #f5f5f5;
    cursor: pointer;
    font-size: 16px;
    border-radius: 4px;
    transition: background-color 0.3s, border-color 0.3s;
  }
  
  .tabs button:hover {
    background-color: #eaeaea;
  }
  
  .tabs button.active {
    background-color: #007bff;
    color: #fff;
    border-color: #007bff;
  }
  
  .tab-content {
    border: 1px solid #ddd;
    padding: 1rem;
    border-radius: 4px;
    background-color: #fff;
  }
  </style>
  