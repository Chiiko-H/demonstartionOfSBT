<!-- src/components/Mint.vue -->
<template>
  <div class="mint-container">
    <!-- ミント処理中 -->
    <div v-if="loading" class="spinner-container">
      <div class="spinner"></div>
      <p>ステージ {{ stageNumber }} のSBTをミント中…</p>
    </div>
    <!-- ミント完了後 -->
    <div v-else>
      <!-- エラーが発生している場合は表示 -->
      <p v-if="error" class="error">{{ error }}</p>
      <p v-else>ミント完了！</p>
      <button @click="onMintComplete">次のステージへ</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
// ブロックチェーン処理用の関数。各自の実装に合わせてパス等を調整してください。
import { mintSBT } from "../utils/blockchain";

export default defineComponent({
  name: "Mint",
  props: {
    // 親から渡される、クリアしたステージ番号（tokenId として利用）
    stageNumber: {
      type: Number,
      required: true,
    },
  },
  emits: ["mint-complete"],
  setup(props, { emit }) {
    const loading = ref(true);
    const error = ref("");

    // マウント時に自動でミント処理を実行する
    onMounted(async () => {
      try {
        // mintSBT 関数に stageNumber を渡してミント処理を実行
        await mintSBT(props.stageNumber);
      } catch (err: any) {
        console.error("ミント中エラー:", err);
        error.value = err.message || "ミント中にエラーが発生しました";
      } finally {
        loading.value = false;
      }
    });

    // 「次のステージへ」ボタン押下時、親にイベントを emit
    const onMintComplete = () => {
      emit("mint-complete");
    };

    return {
      loading,
      error,
      onMintComplete,
    };
  },
});
</script>

<style scoped>
.mint-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
}

/* スピナーのスタイル */
.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 6px solid #ccc;
  border-top-color: #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>
