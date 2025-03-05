<template>
  <div class="stage">
    <h2>ステージ1: {{ timeLimit }}秒以内にモグラを{{ requiredScore }}匹叩いてください</h2>
    <p>スコア: {{ score }} / {{ requiredScore }}</p>
    <p>残り時間: {{ timeLeft }}秒</p>
    <div class="grid">
      <button
        v-for="(mole, index) in grid"
        :key="index"
        :class="{ mole: mole }"
        @click="hitMole(index)"
      ></button>
    </div>
    <div v-if="stageComplete" class="overlay">
      <h2>ステージ1クリア！</h2>
      <button @click="completeStage" class="msg">次のステージへ</button>
    </div>
    <div v-if="gameOver" class="overlay">
      <h2>ゲームオーバー</h2>
      <button @click="restartStage" class="msg">もう一度</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";

export default defineComponent({
  name: "Stage1",
  emits: ["stage-complete", "stage-fail"],
  setup(_, { emit }) {
    const gridSize = 3; // 3×3 のマス
    const grid = ref(Array(gridSize * gridSize).fill(false));
    const requiredScore = 25; // クリア条件
    const timeLimit = 40; // 秒
    const score = ref(0);
    const timeLeft = ref(timeLimit);
    const spawnInterval = ref(1000);
    const timer = ref<NodeJS.Timeout | null>(null);
    const moleTimer = ref<NodeJS.Timeout | null>(null);
    const gameOver = ref(false);
    const stageComplete = ref(false);



    /**
     * モグラをランダムに出現させる
     */
    const spawnMole = () => {
      grid.value.fill(false);
      const randomIndex = Math.floor(Math.random() * grid.value.length);
      grid.value[randomIndex] = true;
    };

    /**
     * モグラを叩いたときの処理
     */
    const hitMole = (index: number) => {
      if (gameOver.value || stageComplete.value) return;
      if (grid.value[index]) {
        score.value += 1;
        grid.value[index] = false; // モグラを消す
        // スコアが15以上なら出現頻度を速くする
        if (score.value === 15) {
              clearInterval(moleTimer.value!);
              spawnInterval.value = 700; // 0.7秒ごとに出現
              moleTimer.value = setInterval(spawnMole, spawnInterval.value);
            }

        // スコアが20以上ならさらに速く
        if (score.value === 20) {
          clearInterval(moleTimer.value!);
          spawnInterval.value = 500; // 0.5秒ごとに出現
          moleTimer.value = setInterval(spawnMole, spawnInterval.value);
        }
        if (score.value >= requiredScore) {
          stageComplete.value = true;
          stopGame();
          emit("stage-complete");
        }
      }
    };

    /**
     * ゲームのタイマーを開始
     */
    const startTimer = () => {
      timer.value = setInterval(() => {
        timeLeft.value -= 1;
        if (timeLeft.value <= 0) {
          stopGame();
          if (score.value < requiredScore) {
            gameOver.value = true;
            emit("stage-fail");
          }
        }
      }, 1000);
    };

    /**
     * ゲームを開始
     */
    const startGame = () => {
      score.value = 0;
      timeLeft.value = timeLimit;
      gameOver.value = false;
      stageComplete.value = false;
      spawnMole();

      startTimer();
      moleTimer.value = setInterval(spawnMole, spawnInterval.value);
    };

    /**
     * ゲームのタイマーを停止
     */
    const stopGame = () => {
      if (timer.value) clearInterval(timer.value);
      if (moleTimer.value) clearInterval(moleTimer.value);
    };

    /**
     * ステージをリスタート
     */
    const restartStage = () => {
      stopGame();
      startGame();
    };

    /**
     * ステージを完了し、次のステージへ進む
     */
    const completeStage = () => {
      emit("stage-complete");
    };

    onMounted(() => {
      startGame();
    });

    onBeforeUnmount(() => {
      stopGame();
    });

    return {
      score,
      timeLeft,
      timeLimit,
      requiredScore,
      grid,
      hitMole,
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
  background-color: #efaaef;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

button {
  width: 100px;
  height: 100px;
  border: 2px solid black;
  background-color: lightgray;
  cursor: pointer;
  background-size: cover; /* 画像をボタンにフィット */
  background-position: center;
}

button.msg {
  width: 200px;
}

button.mole {
  background-image: url("../assets/mole.png");
  background-color: brown;
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