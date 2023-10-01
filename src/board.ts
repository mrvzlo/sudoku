import Cell from './cell';

export default class Board {
   public cells: Cell[] = [];

   public constructor() {
      this.reset();
   }

   public loadPreset(list: number[]) {
      for (let i = 0; i < 81; i++) this.cells[i].value = list[i] ? list[i] : null;
      this.freeze();
   }

   private freeze() {
      this.cells.forEach((x) => (x.editable = !x.value));
   }

   private reset() {
      for (let i = 0; i < 81; i++) this.cells[i] = new Cell();
   }

   public getErrorsCount() {
      let errors = 0;
      for (let i = 0; i < 9; i++)
         for (let j = 0; j < 9; j++) {
            if (!this.isValid(i, j)) errors++;
         }
      return errors;
   }

   // This method is optimized for validating batch of cells by only looking to the right ones and bottom ones.
   private isValid(x: number, y: number) {
      const value = this.getCell(x, y);
      if (!value) return true;
      for (let x2 = x + 1; x2 < 9; x2++) if (value === this.getCell(x2, y)) return false; // same row
      for (let y2 = y + 1; y2 < 9; y2++) if (value === this.getCell(x, y2)) return false; // same column

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
