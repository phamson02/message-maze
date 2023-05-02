const mazeSketch = (p) => {
    let cellSize;
    let generatedMaze;

    p.getGeneratedMaze = () => {
        return generatedMaze;
    };

    p.getCellSize = () => {
        return cellSize;
    };

    p.setup = () => {
        let canvas = p.createCanvas(800, 800);
        canvas.parent('maze-container');
        p.noLoop();

        let generateBtn = p.select('#generate-btn');
        generateBtn.mousePressed(handleGenerateMaze);
    };

    function handleGenerateMaze() {
        let inputText = p.select('#input-text').value();

        // Remove all non-alphabet characters
        inputText = inputText.replace(/[^a-zA-Z]/g, ' ');

        // Remove all redundant, leading, and trailing spaces
        inputText = inputText.replace(/\s+/g, ' ').trim();

        p.select('#input-text').value(inputText);

        if (inputText.length > 30) {
            alert('Input text is too long!');
            return;
        }

        if (inputText.length === 0) {
            alert('Input text is empty!');
            return;
        }

        // Disable the "Generate Maze" button and display loading text
        let generateBtn = p.select('#generate-btn');
        generateBtn.attribute('disabled', '');
        let loadingText = p.select('#loading-text');
        loadingText.show();

        generateMazeWithTextSolution(inputText).then((maze) => {
            // Enable the "Generate Maze" button and hide the loading text
            generateBtn.removeAttribute('disabled');
            loadingText.hide();

            // Clear the canvas before drawing the new maze
            p.clear();
            p.background(51);

            generatedMaze = maze;

            // Calculate the appropriate canvas size and cell size
            const maxWidth = p.min(p.windowWidth, 800);
            const maxHeight = p.min(p.windowHeight, 800);
            cellSize = p.min(maxWidth / generatedMaze.cols, maxHeight / generatedMaze.rows);
            p.resizeCanvas(cellSize * generatedMaze.cols, cellSize * generatedMaze.rows);

            // Redraw both maze and solution canvases
            p.redraw();
            solutionInstance.redrawMaze();

            // Show the maze and solution canvases
            document.getElementById('maze-container').style.display = 'block';
            document.getElementById('solution-container').style.display = 'block';
        });
    };

    p.draw = () => {
        if (generatedMaze) {
            p.background(51);
            generatedMaze.show(p, cellSize, false);
        }
    };
};

const solutionSketch = (p) => {
    let cellSize;
    let generatedMaze;

    p.setup = () => {
        let canvas = p.createCanvas(800, 800);
        canvas.parent('solution-container');
        p.noLoop();
    };

    p.draw = () => {
        if (generatedMaze) {
            p.background(51);
            generatedMaze.show(p, cellSize, true);
        }
    };

    p.redrawMaze = () => {
        generatedMaze = mazeInstance.getGeneratedMaze();
        cellSize = mazeInstance.getCellSize();

        p.resizeCanvas(cellSize * generatedMaze.cols, cellSize * generatedMaze.rows);

        p.redraw();
    };
};


let mazeInstance = new p5(mazeSketch);
let solutionInstance = new p5(solutionSketch);
