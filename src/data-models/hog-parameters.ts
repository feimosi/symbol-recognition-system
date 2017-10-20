/** Hog parameters */
export class HogParameters {
    /** Bins per histogram */
    public bins = 6;
    /** Length of block in number of cells */
    public blockSize: 10;
    /** Number of cells to slide block window by (block overlap) */
    public blockStride: 20;
    /** Length of cell in px */
    public cellSize: 50;
    /** Block normalization method */
    public norm: "L2";
}
