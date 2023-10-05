import Cell from './cell';
import { Line, LineType } from './line';

export default class Board {
   public cells: Cell[] = [];
   public lines: LineType[] = [];

   public constructor() {
      this.reset();
   }

   public loadPreset(list: number[], lines: Line[]) {
      for (let i = 0; i < 81; i++) this.cells[i].value = list[i] ? list[i] : null;
      this.freeze();
      this.lines = [];
      if (lines) lines.forEach((x) => (this.lines[x.cell] = x.type));
   }

   private freeze() {
      this.cells.forEach((x) => (x.editable = !x.value));
   }

   private reset() {
      for (let i = 0; i < 81; i++) this.cells[i] = new Cell();
   }

   public getErrors() {
      let errors = 0;
      for (let i = 0; i < 81; i++) {
         if (!this.isValid(i % 9, Math.floor(i / 9))) errors++;
      }
      return errors;
   }

   // This method is optimized for validating batch of cells by only looking to the right ones and bottom ones.
   private isValid(x: number, y: number) {
      const value = this.getCell(x, y);
      if (!value) return true;
      for (let x2 = x + 1; x2 < 9; x2++) if (value === this.getCell(x2, y)) return false; // same row
      for (let y2 = y + 1; y2 < 9; y2++) if (value === this.getCell(x, y2)) return false; // same column

      const index = x + 9 * y;
      if (this.lines[index] === 1 || this.lines[index] === 2) {
         const left = this.getCell(x - 1, y) ?? 0; //we assume data is correct so no checks for worng indexes
         const right = this.getCell(x + 1, y) ?? 0;
         if (left + right !== value * 2) return false;
      }
      if (this.lines[index] === 0 || this.lines[index] === 2) {
         const top = this.getCell(x, y - 1) ?? 0; //we assume data is correct so no checks for worng indexes
         const bottom = this.getCell(x, y + 1) ?? 0;
         if (top + bottom !== value * 2) return false;
      }

      const startRow = Math.floor(y / 3) * 3;
      const startCol = Math.floor(x / 3) * 3;
      for (let i = startRow; i < startRow + 3; i++)
         for (let j = startCol; j < startCol + 3; j++) {
            if (x !== j && y !== i && value === this.getCell(j, i)) return false; // same square
         }

      return true;
   }

   private getCell = (x: number, y: number) => this.cells[x + y * 9].value;
}
