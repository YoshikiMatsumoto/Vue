<!-- 2024_11_06
マップ機能概要
・ページ上部KAGOME⇒横のボタンでページ遷移する
・時間タスクで作業者A,B,Cの予約が入っていないと「予約なし」
・予約が入っていると「A,B,C」のいずれかが表示される
・作業者向けというよりかは「監督者側」を意識したページを作成していた
・予約機能は、時間ページのタスク項目名と連動する仕組みで実装している -->


<!-- App.Vue側よりMapDisplay2が呼出される -->
<template>
  <div class="map-container">
    <v-tabs v-model="activeTab">
      <!-- SA,SB,SCの3ラインに対応してタブが生成される -->
      <v-tab v-for="line in ['SA', 'SB', 'SC']" :key="line">
        {{ line }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="activeTab">
      <!-- 各タブに対応するコンテンツを表示する -->
      <v-tab-item v-for="line in ['SA', 'SB', 'SC']" :key="line">
        <div class="map">
          <!-- 工場の作業場所が図面で表示される -->
          <img src="@/assets/map.png" alt="Map" class="map-image" />
          <!-- 各作業を表す要素で地図上の指定された位置に表示される -->
          <div v-for="(task, index) in getTasksForLine(line)" :key="index" class="task" :style="getPositionStyle(index)">
            <!-- 作業名を表示する -->
            <div class="task-header">
              <span>{{ task.taskName }}</span>
            </div>
            <!-- 作業の進捗に応じて色付けされた行を表示する -->
            <div :class="rowClass(task)">{{ formatTime(task.remainingTime) }}</div>
            <!-- 作業担当者を表示する -->
            <div class="task-worker">{{ task.worker || '予約なし' }}</div>
          </div>
        </div>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
export default {

  // 親コンポーネントから渡されるtasksオブジェクトを受け取る
  props: {
    tasks: {
      type: Object,
      required: true
    }
  },


  data() {
    return {
      activeTab: null, //現在選択されているタブを管理する
    };
  },


  methods: {


    // 秒数を分や時間に変換する関数
    // 最終的には一柳さんの実装部分に合わせて表示する予定です
    getTasksForLine(line) {
      return this.tasks[line];
    },


    // 秒数を分や時間に変換する関数
    // 最終的には一柳さんの実装部分に合わせて表示する予定です
    formatTime(seconds) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hours}時間${minutes}分${secs}秒`;
    },


    // マップ上の部品を表示させる関数
    // マップ上に表示されている時間と予約機能の位置を変更したい際に使用する
    getPositionStyle(index) {
      const positions = [
        { top: '10%', left: '10%' }, // ストローの位置を表示
        { top: '10%', left: '30%' }, // メルト1の位置を表示
        { top: '10%', left: '50%' }, // メルト2の位置を表示
        { top: '10%', left: '70%' }, // メルト3の位置を表示
        { top: '50%', left: '10%' }, // 段ボールの位置を表示
        { top: '50%', left: '30%' }, // シュリンクの位置を表示
        { top: '50%', left: '50%' }, // ストレッチの位置を表示
        ];
      return positions[index];
    },


    // 要素に適応するCSSクラスを返す関数
    // tasks.reminderとtask.originalTimeを比較して作業進捗を計算して色を返す
    rowClass(task) {
      let className = '';
      if (task.worker) {
        className = 'green lighten-2';
      } else {
        const percentage = (task.remainingTime / task.originalTime) * 100;
        if (percentage <= task.thresholds[0]) {
          className = 'red lighten-2';
        } else if (percentage <= task.thresholds[1]) {
          className = 'yellow lighten-2';
        } else {
          className = 'green lighten-2';
        }
      }
      return className;
    },


  }
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.map {
  position: relative;
  flex-grow: 1;
  overflow: hidden;
}
.map-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.task {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 5px;
  border: 1px solid black;
  width: 120px;
}
.task-header {
  font-weight: bold;
}
.task-worker {
  font-style: italic;
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
</style>