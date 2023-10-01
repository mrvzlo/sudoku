<template>
   <div class="board">
      <div class="cell" v-for="(cell, i) in board.cells" :key="i">
         <span v-if="!cell.editable">{{ cell.value }}</span>
         <input v-else v-model="cell.value" type="number" min="1" max="9" @input="(e) => validateInput(i, (e as InputEvent).data!)" />
      </div>
   </div>
   <div class="buttons">
      <select @change="changePreset">
         <option v-for="(preset, i) in presets" :key="i">{{ preset.name }}</option>
      </select>
      <button v-on:click="solve">Solve</button>
   </div>
   <div>
      <div v-for="(log, i) in logs" :key="i">{{ log }}</div>
   </div>
</template>

<script lang="ts">
import { reactive } from 'vue';
import { Vue } from 'vue-class-component';
import Board from './board';
import Solver from './solver';

export default class App extends Vue {
   board = reactive(new Board());
   presets = require('./presets.json');
   solver = new Solver();
   logs = reactive([] as string[]);

   validateInput(cell: number, data: string) {
      if (!data) return;
      if (!isNaN(+data) && +data <= 9 && +data >= 1) this.board.cells[cell].value = +data;
      else this.board.cells[cell].value = null;
   }

   changePreset(event: Event) {
      const selected = (event.target as HTMLInputElement).value;
      const cells = (this.presets as any[]).find((x) => x.name === selected).cells;
      this.board.loadPreset(cells);
   }

   solve() {
      this.logs = this.solver.run(this.board as Board);
   }
}
</script>

<style>
body {
   padding: 0;
   margin: 0;
}

app {
   display: flex;
}

.board {
   margin: 10px auto;
   width: 400px;
   display: flex;
   flex-wrap: wrap;
   text-align: center;
}

.cell {
   width: 40px;
   height: 40px;
   font-size: 30px;
   border: solid 2px #5551;
   margin-bottom: -2px;
   margin-right: -2px;
}

input {
   height: 100%;
   text-align-last: center;
   font-size: 30px;
   width: 100%;
   border-radius: 0;
   padding: 0;
   border: none;
}

.cell:nth-child(3n + 1) {
   border-left: solid 2px black;
}
.cell:nth-child(9n) {
   border-right: solid 2px black;
}
.cell:nth-child(-n + 9),
.cell:nth-child(n + 28):nth-child(-n + 36),
.cell:nth-child(n + 55):nth-child(-n + 63) {
   border-top: solid 2px black;
}
.cell:nth-child(n + 73) {
   border-bottom: solid 2px black;
}
.buttons {
   width: 400px;
   margin: 10px auto;
}
</style>
