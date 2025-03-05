<!-- src/components/Game.vue -->
<template>
    <div class="game-wrapper">
      <!-- 現在のステージを表示 -->
      <component
        v-if="!showMint && !allStagesComplete"
        :is="currentStageComponent"
        @stage-complete="handleStageComplete"
        @stage-fail="handleStageFail"
      />
      
      <!-- ミント処理を表示 -->
      <Mint
        v-else-if="showMint"
        :stageNumber="currentStageIndex + 1"
        @mint-complete="handleMintComplete"
      />
      
      <!-- すべてのステージが完了したときのオーバーレイ -->
      <div v-if="allStagesComplete" class="final-overlay">
        <h2>すべてのステージをクリアしました！</h2>
        <button @click="restartGame">もう一度プレイ</button>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, computed } from "vue";
  import Stage1 from "./Stage1.vue";
  import Stage2 from "./Stage2.vue";
  // 追加のステージがあればインポート
  import Mint from "./Mint.vue";
  
  export default defineComponent({
    name: "Game",
    components: {
      Stage1,
      Stage2,
      Mint,
    },
    setup() {
      const currentStageIndex = ref(0);
      const stages = [Stage1, Stage2 /*, Stage3 */];
      const allStagesComplete = ref(false);
      const showMint = ref(false);
  
      /**
       * 現在のステージコンポーネントを取得します。
       */
      const currentStageComponent = computed(() => stages[currentStageIndex.value]);
  
      /**
       * ステージが完了したときの処理
       */
      const handleStageComplete = () => {
        showMint.value = true;
      };
  
      /**
       * ステージが失敗したときの処理
       */
      const handleStageFail = () => {
        // alert("ゲームオーバー！リスタートします。");
        // restartGame();
      };
  
      /**
       * ミント処理が完了したときの処理
       */
      const handleMintComplete = () => {
        if (currentStageIndex.value < stages.length - 1) {
          currentStageIndex.value += 1;
        } else {
          allStagesComplete.value = true;
        }
        showMint.value = false;
      };
  
      /**
       * ゲームをリスタートします。
       */
      const restartGame = () => {
        currentStageIndex.value = 0;
        allStagesComplete.value = false;
        showMint.value = false;
      };
  
      return {
        currentStageComponent,
        handleStageComplete,
        handleStageFail,
        handleMintComplete,
        allStagesComplete,
        showMint,
        restartGame,
        currentStageIndex, // ゲームの現在のステージ番号を返す
      };
    },
  });
  </script>
  
  <style scoped>
  .game-wrapper {
    position: relative;
    width: 800px;
    height: 600px;
    margin: 0 auto;
  }
  
  .final-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 800px;
    height: 600px;
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 800px;
    height: 600px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  button {
    padding: 10px 20px;
    font-size: 16px;
    margin-top: 20px;
    cursor: pointer;
  }
  </style>
  