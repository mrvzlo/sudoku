import Board from './board';
import Swap from './swap';

export default class Solver {
   private animationSpeed = 100;

   public run(board: Board) {
      const logs: string[] = [];
      this.generateGuess(board);
      const swaps = this.getSwaps(board);
      this.animatedLoop(board, swaps, logs);
      return logs;
   }

   private getSwaps(board: Board) {
      const editable = this.getEditableCells(board);
      const swaps: Swap[] = [];
      editable.forEach((a) =>
         editable.forEach((b) => {
            if (a !== b) swaps.push({ a, b });
         })
      );
      return swaps;
   }

   private getEditableCells(board: Board) {
      const cellIds = [];
      for (let i = 0; i < board.cells.length; i++) if (board.cells[i].editable) cellIds.push(i);
      return cellIds;
   }

   private generateGuess(board: Board) {
      for (let square = 0; square < 9; square++) {
         let options = [1, 2, 3, 4, 5, 6, 7, 8, 9];
         for (let i = 0; i < 9; i++) {
            const value = board.cells[this.getIndexFromSquare(square, i)].value;
            options = options.filter((x) => x !== value); // remove values which are already taken in a square
         }
         for (let i = 0; i < 9; i++) {
            const cell = board.cells[this.getIndexFromSquare(square, i)];
            if (cell.value) continue;
            cell.value = options.pop()!;
         }
      }
   }

   private getIndexFromSquare(square: number, cell: number) {
      const x = Math.floor(square % 3) * 3 + Math.floor(cell % 3);
      const y = Math.floor(square / 3) * 3 + Math.floor(cell / 3);
      return x + y * 9;
   }

   private findBestSwap(board: Board, swaps: Swap[]) {
      let bestResult = Infinity;
      let bestSwap!: Swap;
      swaps.forEach((x) => {
         const score = this.getGuessScore(x, board);
         if (score >= bestResult) return;
         bestResult = score;
         bestSwap = x;
      });
      return { bestResult, bestSwap };
   }

   private getGuessScore(swap: Swap, board: Board) {
      this.runSwap(swap, board);
      const errors = board.getErrorsCount();
      this.runSwap(swap, board); // Its cheaper to rollback array values swap than allocae memory for different array instances
      return errors;
   }

   private runSwap(swap: Swap, board: Board) {
      const a = board.cells[swap.a].value;
      const b = board.cells[swap.b].value;
      board.cells[swap.a].value = b;
      board.cells[swap.b].value = a;
   }

   private animatedLoop(board: Board, swaps: Swap[], logs: string[]) {
      let errors = board.getErrorsCount();
      if (swaps.length === 0 && errors > 0) {
         logs.push('Unsolveable');
         return;
      }

      let iterations = 0;
      logs.push(`0) ${errors} error(s)`);

      const runIteration = () => {
         iterations++;
         const result = this.findBestSwap(board, swaps);
         this.runSwap(result.bestSwap, board);
         errors = result.bestResult;
         logs.push(`${iterations}) ${errors} error(s), swap ${result.bestSwap.a} and ${result.bestSwap.b}`);

         if (errors > 0) setTimeout(() => runIteration(), this.animationSpeed);
      };

      if (errors > 0) runIteration();
   }
}
