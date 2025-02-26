<template>
    <div class="network-check">
      <p v-if="!isCorrectNetwork" class="error">
        正しいネットワークに接続されていません。{{nwName}}ネットワークに切り替えてください。
      </p>
      <p v-else>
        正しいネットワークに接続されています！
      </p>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from "vue";
  import { checkNetwork } from "../utils/network"; //
  
  export default defineComponent({
    name: "NetworkChecker",
    setup() {
      // Amoy = 80002 , Hardhat local = 31337
      const expectedChainId: number = 31337; //80002;
      const isCorrectNetwork = ref<boolean | null>(null);
      let nwName = "Unknown";
      switch(expectedChainId){
          case 80002:
            nwName = "Polygon Amoy";
            break;
          case 31337:
            nwName = "Hardhat Local";
            break;
          default:
            nwName = "Unknown";
        };
  
      const verifyNetwork = async () => {      
        try {
          isCorrectNetwork.value = await checkNetwork(expectedChainId);
        } catch (error: any) {
          console.error("ネットワークチェックエラー:", error);
          isCorrectNetwork.value = false;
        }
      };
  
      onMounted(() => {
        verifyNetwork();
      });
  
      return { isCorrectNetwork, nwName };
    },
  });
  </script>
  
  <style scoped>
  .error {
    color: red;
    font-weight: bold;
  }
  </style>
  