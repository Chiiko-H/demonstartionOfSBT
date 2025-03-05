<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

// 3x3 のマスを管理
const gridSize = 3;
const grid = ref(Array(gridSize * gridSize).fill(false));

// ゲームのスコアとタイマー
const score = ref(0);
const timeLeft = ref(30);
const isGameClear = ref(false); 
let gameInterval: number | undefined;
let timerInterval: number | undefined;

// ランダムにモグラを出現させる
const spawnMole = () => {
  grid.value.fill(false);
  const randomIndex = Math.floor(Math.random() * grid.value.length);
  grid.value[randomIndex] = true;
};

// モグラを叩く
const hitMole = (index: number) => {
  if (grid.value[index]) {
    score.value += 1;
    grid.value[index] = false; // モグラを消す

    if (score.value >= 25) {
      isGameClear.value = true;
      stopGame(); // ゲーム停止
    }
  }
};

// ゲーム開始
const startGame = () => {
  score.value = 0;
  timeLeft.value = 30;
  isGameClear.value = false; // クリア状態リセット
  spawnMole();

  gameInterval = setInterval(spawnMole, 1000);
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value -= 1;
    } else {
      stopGame();
    }
  }, 1000);
};


// ゲーム停止
const stopGame = () => {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
};

onMounted(startGame);
onUnmounted(stopGame);
</script>

<template>
  <div class="game-container">
    <h1>モグラたたき</h1>
    <h2>ステージ1:スコア{{requiredClicks}}でクリア</h2>
    <p>残り時間: {{ timeLeft }} 秒</p>
    <p>スコア: {{ score }}</p>
    <p v-if="isGameClear">🎉 ゲームクリア！ 🎉
        <button @click="completeStage">次のステージへ</button>
    </p>
    <div class="grid">
      <button
        v-for="(mole, index) in grid"
        :key="index"
        :class="{ mole: mole }"
        @click="hitMole(index)"
      ></button>
    </div>
    <button @click="startGame">リスタート</button>
  </div>
</template>

<style scoped>
.game-container {
  text-align: center;
  font-family: Arial, sans-serif;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 80px);
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

button {
  width: 80px;
  height: 80px;
  border: 2px solid black;
  background-color: lightgray;
  cursor: pointer;
}

button.mole {
  background-color: brown;
}
</style>
