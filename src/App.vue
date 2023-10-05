<template>
   <div class="board">
      <div :class="'cell ' + (cell.editable ? '' : 'readonly')" v-for="(cell, i) in board.cells" :key="i">
         <span v-if="!cell.editable">{{ cell.value }}</span>
         <input v-else v-model="cell.value" type="number" min="1" max="9" @input="(e) => validateInput(i, (e as InputEvent).data!)" />
         <div v-if="board.lines[i] === 0 || board.lines[i] === 2" class="vl"></div>
         <div v-if="board.lines[i] === 1 || board.lines[i] === 2" class="hl"></div>
      </div>
   </div>
   <div class="buttons">
      <select @change="changePreset">
         <option v-for="(preset, i) in presets" :key="i">{{ preset.name }}</option>
      </select>
      <button v-on:click="solve">Solve</button>
      <button v-on:click="stop()">Stop</button>
   </div>
   <div class="logs">
      <div v-for="(log, i) in logs" :key="i">{{ logs[logs.length - i - 1] }}</div>
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
      const preset = (this.presets as any[]).find((x) => x.name === selected);
      this.board.loadPreset(preset.cells, preset.lines);
   }

   solve() {
      this.logs = this.solver.run(this.board as Board);
   }

   stop() {
      this.solver.stop();
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
   position: relative;
}
.cell span {
   line-height: 1.5;
}
.cell.readonly {
   background-color: #eee;
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
.logs {
   height: 200px;
   overflow: auto;
   display: flex;
   flex-direction: column-reverse;
   max-width: 30vw;
   min-width: 250px;
   margin: 0 auto;
}

.cell,
input {
   font-family: 'Courier New', Courier, monospace;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
   -webkit-appearance: none;
   margin: 0;
}

.hl,
.vl {
   position: absolute;
   background-color: #000;
   opacity: 0.1;
}

.vl {
   width: 10%;
   height: 100%;
   top: 0%;
   left: 45%;
}

.hl {
   width: 100%;
   height: 10%;
   top: 45%;
   left: 0;
}
</style>
