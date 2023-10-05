export interface Line {
   cell: number;
   type: LineType;
}

export enum LineType {
   Vertical,
   Horizontal,
   Cross,
}
