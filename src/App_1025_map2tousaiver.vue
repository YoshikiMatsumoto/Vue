<!-- 以下の機能を搭載
・色可変スライダー
・スマホ縦3ライン
・PC縦3ライン
・WebSocket自動スライダと作業者〇
・マップとテーブルの切り替え〇
・2024_10_25_httpで動作確定
・ -->


<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>
        <img src="@/assets/kagome.png" alt="Kagome Logo" class="header-logo" />
      </v-toolbar-title>
      <v-btn @click="showMap = !showMap">
        {{ showMap ? 'テーブル表示' : 'マップ表示' }}
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container v-if="!showMap">
        <v-row>
          <v-col v-for="line in ['SA', 'SB', 'SC']" :key="line" cols="12" md="4">
            <v-card>
              <v-card-title>
                カゴメDX 作業ナビゲーションシステム11 ({{ line }})
              </v-card-title>
              <v-card-text>
                <v-data-table :headers="headers" :items="getTasksForLine(line)" class="elevation-1">
                  <template v-slot:item="{ item }">
                    <tr v-if="item.taskName !== 'パレット'" :class="rowClass(item)">
                      <td>{{ item.taskName }}</td>
                      <td>{{ formatTime(item.remainingTime) }}</td>
                      <td>
                        <v-btn icon @click="toggleColorPicker(item)">
                          <v-icon>mdi-tune</v-icon>
                        </v-btn>
                      </td>
                      <td>
                        <v-select
                          v-model="item.worker"
                          :items="workerNames"
                          label="作業者"
                          outlined
                          dense
                          hide-details
                          class="worker-select"
                          @change="updateWorker(item)"
                        ></v-select>
                      </td>
                      <td>
                        <v-btn icon @click="showHistoryDialog(item)">
                          <v-icon>mdi-history</v-icon> <!-- 履歴ボタン -->
                        </v-btn>
                      </td>
                    </tr>


                    
                    <tr v-else>
                      <td>{{ item.taskName }}</td>
                      <td>
                        <v-icon>{{ item.palletPresence ? 'mdi-cube' : 'mdi-pallet-off' }}</v-icon>
                      </td>
                      <td>
                        <v-icon>{{ item.inspectionStatus ? 'mdi-check-circle' : 'mdi-eye' }}</v-icon>
                      </td>
                      <td>
                        <v-icon>{{ item.transportCall ? 'mdi-forklift' : 'mdi-forklift-off' }}</v-icon>
                      </td>
                      <td>
                        <v-select
                          v-model="item.worker"
                          :items="workerNames"
                          label="作業者"
                          outlined
                          dense
                          hide-details
                          class="worker-select"
                          @change="updateWorker(item)"
                        ></v-select>
                      </td>
                      <td>
                        <v-btn icon @click="showHistoryDialog(item)">
                          <v-icon>mdi-history</v-icon> <!-- 履歴ボタン -->
                        </v-btn>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- 色選択ダイアログ -->
        <v-dialog v-model="colorPickerDialog" max-width="600">
          <v-card>
            <v-card-title class="headline">色を選択</v-card-title>
            <v-card-text>
              <div v-if="selectedItem" class="color-slider">
                <div
                  class="color-slider-background"
                  :style="`background: linear-gradient(to right, red ${selectedItem.thresholds[0]}%, yellow ${selectedItem.thresholds[0]}% ${selectedItem.thresholds[1]}%, green ${selectedItem.thresholds[1]}%);`"
                ></div>
                <v-range-slider
                  v-model="selectedItem.thresholds"
                  :min="0"
                  :max="100"
                  thumb-label
                  @input="updateThresholds"
                  label="閾値"
                  color="primary"
                ></v-range-slider>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="closeColorPicker">OK</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- 履歴ダイアログ -->
        <v-dialog v-model="historyDialog" max-width="800">
          <v-card>
            <v-card-title class="headline">履歴</v-card-title>
            <v-card-text>
              <v-data-table :headers="historyHeaders" :items="selectedItem?.history" class="elevation-1"></v-data-table>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="historyDialog = false">閉じる</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
      <MapDisplay v-else :tasks="tasks" />
    </v-main>
  </v-app>
</template>

<script>
import MapDisplay from '@/components/MapDisplay2.vue';

export default {

  components: {
    MapDisplay,
  },

  data() {
    return {
      headers: [
        { text: '工程名', value: 'taskName' },
        { text: '残り時間', value: 'remainingTime' },
        { text: 'チェック', value: 'completed', align: 'center' },
        { text: '作業者', value: 'worker', align: 'center' },
      ],
      tasks: {
        SA: this.createLineTasks('SA'),
        SB: this.createLineTasks('SB'),
        SC: this.createLineTasks('SC'),
      },
      workerNames: ['A', 'B', 'C'],
      colorPickerDialog: false,
      selectedItem: null,
      lastTimestamp: null,
      requestId: null,
      ws: null,
      historyDialog: false,
      historyHeaders: [
        { text: '作業名', value: 'taskName' },
        { text: '交換済み', value: 'status' },
        { text: '日時', value: 'timestamp' },
      ],
      showMap: false,
    };
  },


  mounted() {
    this.getServerUrl();
    this.startTimers();
    this.setupWebSocket();
  },


  beforeDestroy() {
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
    }
    if (this.ws) {
      this.ws.close();
    }
  },


  methods: {

    // ライン毎のタスクを生成する関数
    createLineTasks(line) {
      return [
        { line, taskName: 'Sストロー', remainingTime: 630, originalTime: 630, completed: false, thresholds: [20, 80], worker: '', history: [] },
        { line, taskName: 'Sメルト', remainingTime: 8100, originalTime: 8100, completed: false, thresholds: [20, 80], worker: '', history: [] },
        { line, taskName: '段ボール', remainingTime: 1900, originalTime: 1900, completed: false, thresholds: [20, 80], worker: '', history: [] },
        { line, taskName: '段ボメルト', remainingTime: 19500, originalTime: 19500, completed: false, thresholds: [20, 80], worker: '', history: [] },
        { line, taskName: 'シュリンク', remainingTime: 3000, originalTime: 3000, completed: false, thresholds: [20, 80], worker: '', history: [] },
        { line, taskName: 'ストレッチ', remainingTime: 21000, originalTime: 21000, completed: false, thresholds: [20, 80], worker: '', history: [] },
        { line, taskName: 'パレット', remainingTime: 0, originalTime: 0, completed: false, thresholds: [20, 80], 
          palletPresence: true, inspectionStatus: true, transportCall: true, worker: '', history: [] },
      ];
    },

    // http側のデータテーブルを生成する関数
    getTasksForLine(line) {
      return this.tasks[line];
    },


    // 現在のURLからWebSocketのURLを生成
    // getServerUrl() {
    //   const protocol = 'ws:';
    //   const host = window.location.hostname;
    //   const port = '8080';
    //   this.serverUrl = `${protocol}//${host}${port ? ':' + port : ''}`;
    //   console.log('WebSocket URL:', this.serverUrl);
    // },

    //devサブディレクトリあり
        getServerUrl() {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.hostname;
      const port = window.location.port || '8080'; // 現在のポートを使用するか、デフォルトを8080に設定
      const basePath = process.env.NODE_ENV === 'production' ? '/dev' : '';
      this.serverUrl = `${protocol}//${host}:${port}${basePath}`;
      console.log('WebSocket URL:', this.serverUrl);
    },


    // Websocket機能の関数
    setupWebSocket() {
      console.log('Connecting to WebSocket:', this.serverUrl);
      this.ws = new WebSocket(this.serverUrl);

      this.ws.onopen = () => {
        // console.log('WebSocket connection established');
        this.sendTaskUpdate(); // 接続時に現在のタスク状態を送信
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'updateTasks') {
            console.log('Received task update:', data.tasks);
            this.tasks = data.tasks;
            this.$forceUpdate(); // 画面を強制的に更新
          }
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
        // 再接続を試みる
        setTimeout(() => this.setupWebSocket(), 5000);
      };

      // this.ws.onerror = (error) => {
      //   console.error('WebSocket error:', error );
      // };
    },




    // タイマーの関数
    startTimers() {
  const updateTime = (timestamp) => {
    if (!this.lastTimestamp) this.lastTimestamp = timestamp;
    const elapsed = timestamp - this.lastTimestamp;

    if (elapsed >= 1000) {
      Object.values(this.tasks).forEach(lineTasks => {
        lineTasks.forEach(task => {
          if (!task.completed && task.remainingTime > 0) {
            task.remainingTime -= Math.floor(elapsed / 1000);
          }
        });
      });
      this.lastTimestamp = timestamp;
    }

    this.requestId = requestAnimationFrame(updateTime);
  };
  this.requestId = requestAnimationFrame(updateTime);
},

    // http側に時間を返す関数
    formatTime(seconds) {
      if (isNaN(seconds) || seconds === null) {
        return '0時間0分0秒';
      }
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      // const secs = seconds % 60;
      return `${hours}時間${minutes}分`;
    },



    // スライダー調整関数
    toggleColorPicker(item) {
      this.selectedItem = item;
      this.colorPickerDialog = true;
    },

    // スライダーを閉じる関数
    closeColorPicker() {
      this.colorPickerDialog = false;
    },

    // スライダーの閾値をアップデートする関数
    updateThresholds() {
  if (this.selectedItem) {
    const { line, taskName } = this.selectedItem;
    const taskIndex = this.tasks[line].findIndex(task => task.taskName === taskName);
    if (taskIndex !== -1) {
      this.$set(this.tasks[line], taskIndex, { ...this.selectedItem });
      this.sendTaskUpdate();
    }
  }
},

    // 作業者名をアップデートする関数
    updateWorker(item) {
      console.log('Worker updated:', item.line, item.taskName, item.worker);
      const lineIndex = this.tasks[item.line].findIndex(task => task.taskName === item.taskName);
      if (lineIndex !== -1) {
        this.$set(this.tasks[item.line], lineIndex, { ...item });
      }
      this.sendTaskUpdate();
    },


    // タスクアップデートの関数
    sendTaskUpdate() {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        const data = {
          type: 'updateTasks',
          tasks: this.tasks,
        };
        // console.log('Sending task update:', data);
        this.ws.send(JSON.stringify(data));
      } else {
        console.warn('WebSocket is not open. Cannot send update.');
      }
    },




    // 色変化の関数
    rowClass(item) {
      const percentage = (item.remainingTime / item.originalTime) * 100;
      let className = '';
      if (percentage <= item.thresholds[0]) {
        className = 'red lighten-2';
      } else if (percentage <= item.thresholds[1]) {
        className = 'yellow lighten-2';
      } else {
        className = 'green lighten-2';
      }
      return className;
    },

    showHistoryDialog(item) {
      this.selectedItem = item;
      this.historyDialog = true;
    },
  },
};
</script>

<style>
.header-logo {
  height: 50px;
}
.worker-select {
  max-width: 100px;
  min-width: 60px;
}
.red {
  background-color: red !important;
}
.yellow {
  background-color: yellow !important;
}
.green {
  background-color: green !important;
}
.color-slider {
  position: relative;
  height: 48px;
  margin-top: 24px;
}
.color-slider-background {
  position: absolute;
  top: 12px;
  left: 0;
  right: 0;
  height: 12px;
  pointer-events: none;
  z-index: -1;
}
</style>