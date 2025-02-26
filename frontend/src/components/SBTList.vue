<template>
    <div class="sbt-list-container">
      <h2>私のSBTコレクション</h2>
      <div v-if="loading" class="loading">SBTを読み込み中…</div>
      <div v-else>
        <div v-if="sbtList.length === 0" class="no-sbt">
          SBTが見つかりませんでした。
        </div>
        <div v-else class="sbt-list">
          <div class="sbt-item" v-for="sbt in sbtList" :key="sbt.tokenId">
            <img
              v-if="sbt.metadata.image"
              :src="sbt.metadata.image"
              alt="SBT画像"
              class="sbt-image"
            />
            <div class="sbt-info">
              <h3 class="sbt-name">{{ sbt.metadata.name || ('SBT #' + sbt.tokenId) }}</h3>
              <!--<p class="sbt-token">Token ID: {{ sbt.tokenId }}</p>-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from "vue";
  import { getSBTList } from "../utils/blockchain";
  
  export default defineComponent({
    name: "SBTList",
    setup() {
      const loading = ref(true);
      const sbtList = ref<Array<{ tokenId: number; metadata: any }>>([]);
  
      const loadSBTs = async () => {
        try {
          const list = await getSBTList();
          sbtList.value = list;
        } catch (error) {
          console.error("SBT一覧の取得に失敗しました:", error);
        } finally {
          loading.value = false;
        }
      };
  
      onMounted(() => {
        loadSBTs();
      });
  
      return { loading, sbtList };
    },
  });
  </script>
  
  <style scoped>
  .sbt-list-container {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
    padding: 2rem;
  }
  
  .loading {
    font-size: 1.2rem;
    color: #555;
  }
  
  .no-sbt {
    font-size: 1.2rem;
    color: #777;
    margin-top: 1rem;
  }
  
  .sbt-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    margin-top: 1.5rem;
  }
  
  .sbt-item {
    width: 200px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #fafafa;
    padding: 1rem;
    text-align: center;
  }
  
  .sbt-image {
    width: 100%;
    height: auto;
    border-radius: 4px;
    object-fit: cover;
  }
  
  .sbt-info {
    margin-top: 0.5rem;
  }
  
  .sbt-name {
    font-weight: bold;
    margin: 0.5rem 0 0.2rem;
    font-size: 1.1rem;
  }
  
  .sbt-token {
    font-size: 0.9rem;
    color: #666;
  }
  </style>
  