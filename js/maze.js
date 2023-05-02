class Maze {
    constructor(cols, rows, start = null, end = null, solutionCells = null) {
        this.cols = cols;
        this.rows = rows;
        this.grid = this.createGrid(cols, rows);
        this.start = start || { i: 0, j: 0 };
        this.end = end || { i: cols - 1, j: rows - 1 };
        this.solutionCells = solutionCells || [];
    }

    setStart(i, j) {
        this.start = { i, j };
    }

    setEnd(i, j) {
        this.end = { i, j };
    }

    startCell() {
        return this.grid[this.start.j][this.start.i];
    }

    endCell() {
        return this.grid[this.end.j][this.end.i];
    }

    createGrid(cols, rows) {
        let grid = new Array(rows);
        for (let j = 0; j < rows; j++) {
            grid[j] = new Array(cols);
            for (let i = 0; i < cols; i++) {
                grid[j][i] = new Cell(i, j);
            }
        }
        return grid;
    }

    getNeighbors(cell) {
        const neighbors = [];
        const i = cell.i;
        const j = cell.j;

        if (j > 0) neighbors.push(this.grid[j - 1][i]); // Top neighbor
        if (i > 0) neighbors.push(this.grid[j][i - 1]); // Left neighbor
        if (j < this.rows - 1) neighbors.push(this.grid[j + 1][i]); // Bottom neighbor
        if (i < this.cols - 1) neighbors.push(this.grid[j][i + 1]); // Right neighbor

        return neighbors;
    }

    cellAt(i, j) {
        return this.grid[j][i];
    }

    static fromJSON(jsonData) {
        const cols = jsonData.cols;
        const rows = jsonData.rows;
        const start = { i: jsonData.start[0], j: jsonData.start[1] };
        const end = { i: jsonData.end[0], j: jsonData.end[1] };
        const solutionCells = jsonData.solutionCells.map(cell => {
            return { i: cell[0], j: cell[1] };
        });
        const maze = new Maze(cols, rows, start, end, solutionCells);

        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
                const cellData = jsonData.grid[j][i];
                const cell = new Cell(cellData.i, cellData.j);
                cell.walls = cellData.walls;
                cell.visited = cellData.visited;
                maze.grid[j][i] = cell;
            }
        }

        return maze;
    }

    show(p, cellSize, showSolution) {
        for (let j = 0; j < this.rows; j++) {
            for (let i = 0; i < this.cols; i++) {
                this.grid[j][i].show(p, cellSize);
            }
        }

        // Draw solution
        if (showSolution) {
            for (const cellCoors of this.solutionCells) {
                const cell = this.cellAt(cellCoors.i, cellCoors.j);
                cell.highlight(p, cellSize, [255, 255, 0]);
            }
        };

        let startX = this.start.i * cellSize + cellSize / 2;
        let startY = this.start.j * cellSize + cellSize / 2;
        let endX = this.end.i * cellSize + cellSize / 2;
        let endY = this.end.j * cellSize + cellSize / 2;

        // Draw start point
        p.fill(0, 255, 0);
        p.noStroke();
        p.ellipse(startX, startY, cellSize / 2, cellSize / 2);

        // Draw end point
        p.fill(255, 0, 0);
        p.noStroke();
        p.ellipse(endX, endY, cellSize / 2, cellSize / 2);
    }
}
