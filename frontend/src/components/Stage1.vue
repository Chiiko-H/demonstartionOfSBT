<template>
    <div class="stage">
      <h2>ステージ1: {{ timeLimit }}秒以内に{{requiredClicks}}回クリックしてください</h2>
      <button @click="handleClick">クリック</button>
      <p>クリック数: {{ clickCount }} / 10</p>
      <p>残り時間: {{ timeLeft }}秒</p>
      <div v-if="stageComplete" class="overlay">
        <h2>ステージ1クリア！</h2>
        <button @click="completeStage">次のステージへ</button>
      </div>
      <div v-if="gameOver" class="overlay">
        <h2>ゲームオーバー</h2>
        <button @click="restartStage">リスタート</button>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted, onBeforeUnmount, watch } from "vue";
  
  export default defineComponent({
    name: "Stage1",
    emits: ["stage-complete", "stage-fail"],
    setup(_, { emit }) {
      const clickCount = ref(0);
      const timeLeft = ref(15);
      const timer = ref<NodeJS.Timeout | null>(null);
      const gameOver = ref(false);
      const stageComplete = ref(false);
  
      const requiredClicks = 10;
      const timeLimit = 15; // 秒
  
      /**
       * ボタンがクリックされたときの処理
       */
      const handleClick = () => {
        if (gameOver.value || stageComplete.value) return;
        clickCount.value += 1;
        if (clickCount.value >= requiredClicks) {
          stageComplete.value = true;
          emit("stage-complete");
        }
      };
  
      /**
       * タイマーを開始します。
       */
      const startTimer = () => {
        timer.value = setInterval(() => {
          timeLeft.value -= 1;
          if (timeLeft.value <= 0) {
            clearInterval(timer.value!);
            timer.value = null;
            if (clickCount.value < requiredClicks) {
              gameOver.value = true;
              emit("stage-fail");
            }
          }
        }, 1000);
      };
  
      /**
       * ステージをリスタートします。
       */
      const restartStage = () => {
        clickCount.value = 0;
        timeLeft.value = 15;
        gameOver.value = false;
        stageComplete.value = false;
        startTimer();
      };
  
      /**
       * ステージを完了し、次のステージへ進みます。
       */
      const completeStage = () => {
        emit("stage-complete");
      };
  
      onMounted(() => {
        startTimer();
      });
  
      onBeforeUnmount(() => {
        if (timer.value) {
          clearInterval(timer.value);
        }
      });
  
      watch(stageComplete, (val) => {
        if (val && timer.value) {
          clearInterval(timer.value);
          timer.value = null;
        }
      });
  
      watch(gameOver, (val) => {
        if (val && timer.value) {
          clearInterval(timer.value);
          timer.value = null;
        }
      });
  
      return {
        clickCount,
        timeLeft,
        timeLimit,
        requiredClicks,
        handleClick,
        gameOver,
        stageComplete,
        restartStage,
        completeStage,
      };
    },
  });
  </script>
  
  <style scoped>
  .stage {
    position: relative;
    width: 800px;
    height: 600px;
    margin: 0 auto;
    border: 2px solid #000;
    background-color: #87ceeb; /* 空の色 */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  button {
    padding: 10px 20px;
    font-size: 24px;
    margin-top: 20px;
    cursor: pointer;
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
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  </style>
  