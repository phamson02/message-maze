function combineHorizontally(mazesList) {
    const mazeHeight = mazesList[0].rows;
    let mazeWidth = 0;

    for (const maze of mazesList) {
        mazeWidth += maze.cols;
        if (mazeHeight !== maze.rows) {
            throw new Error("Maze heights are not the same");
        }
    }

    const combinedMaze = new Maze(mazeWidth, mazeHeight);
    combinedMaze.grid = mazesList[0].grid;
    let widthTemp = 0;

    for (let j = 1; j < mazesList.length; j++) {
        widthTemp += mazesList[j - 1].cols;

        for (const row of mazesList[j].grid) {
            for (const cell of row) {
                cell.i += widthTemp;
            }
        }

        for (const solutionCell of mazesList[j].solutionCells) {
            solutionCell.i += widthTemp;
        }

        mazesList[j - 1].endCell().removeWall(mazesList[j].startCell());

        for (let i = 0; i < mazeHeight; i++) {
            combinedMaze.grid[i].push(...mazesList[j].grid[i]);
        }
    }

    combinedMaze.setStart(mazesList[0].startCell().i, mazesList[0].startCell().j);
    combinedMaze.setEnd(mazesList[mazesList.length - 1].endCell().i, mazesList[mazesList.length - 1].endCell().j);

    for (const maze of mazesList) {
        combinedMaze.solutionCells.push(...maze.solutionCells);
    }

    return combinedMaze;
}

function combineVertically(mazesList) {
    const mazeWidth = mazesList[0].cols;
    let mazeHeight = 0;

    for (const maze of mazesList) {
        mazeHeight += maze.rows;
        if (mazeWidth !== maze.cols) {
            throw new Error("Maze widths are not the same");
        }
    }

    const combinedMaze = new Maze(mazeWidth, mazeHeight);
    combinedMaze.grid = mazesList[0].grid;
    let heightTemp = 0;

    for (let j = 1; j < mazesList.length; j++) {
        heightTemp += mazesList[j - 1].rows;

        for (const row of mazesList[j].grid) {
            for (const cell of row) {
                cell.j += heightTemp;
            }
        }

        for (const solutionCell of mazesList[j].solutionCells) {
            solutionCell.j += heightTemp;
        }

        mazesList[j - 1].endCell().removeWall(mazesList[j].startCell());

        combinedMaze.grid.push(...mazesList[j].grid);
    }

    combinedMaze.setStart(mazesList[0].startCell().i, mazesList[0].startCell().j);
    combinedMaze.setEnd(mazesList[mazesList.length - 1].endCell().i, mazesList[mazesList.length - 1].endCell().j);

    for (const maze of mazesList) {
        combinedMaze.solutionCells.push(...maze.solutionCells);
    }

    return combinedMaze;
}
