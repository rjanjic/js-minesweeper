<script>
    import Smiley from './Smiley.svelte';
    import Counter from './Counter.svelte';
    import Field from './Field.svelte';

    const rows = 16;
    const cols = 30;
    const mines = 99;

    let minesLeft = mines;
    let fieldsLeft = rows * cols - mines;
    let interval = null;
    let time = 0;
    let gameStarted = false;
    let gameFinished = false;
    let gameVictory = false;
    let map = [];

    const getCellIndex = (x, y) => y * cols + x;

    const getIndexCords = i => ({
        x: i - Math.floor(i / cols) * cols,
        y: Math.floor(i / cols),
    });

    const getCell = (x, y) => map[getCellIndex(x, y)];

    const getCellByIndex = index => map[index];

    const setCell = (x = 0, y = 0, data = {}) => {
        const i = getCellIndex(x, y);
        map[i] = Object.assign(map[i], data);
    };

    const getInitialMap = (x, y) => [...Array(x * y)].map(_ => ({
         isMined: false,
         isFlagged: false,
         isOpen: false,
         exploded: false,
         count: 0,
     }));

    const handleMouseDown = i => event => {
        event.preventDefault();
        const shouldFlag = event.which === 3 || event.button === 2;
        const { x, y } = getIndexCords(i);
        if (shouldFlag) {
            flagField(x, y);
            return;
        }
        openField(x, y);
    };

    const generateFieldMap = (cols, rows, mines) => {
        map = getInitialMap(cols, rows);

        for (let i = 0; i < mines; i++) {
            setRandomMine();
        }

        for (let i = 0; i < rows * cols; i++) {
            const { x, y } = getIndexCords(i);
            const { isMined } = getCell(x, y);
            if (!isMined) {
                setCell(x, y, {
                    count: getSurroundingCount(x, y),
                });
            }
        }

        return map;
    };

    const setRandomMine = () => {
        const i = Math.floor(Math.random() * rows * cols);
        const { x, y } = getIndexCords(i);
        const { isMined } = getCell(x, y);
        if (!isMined) {
            setCell(x, y, {
                isMined: true,
            });
            return;
        }
        setRandomMine();
    };

    const getSurroundingFields = (x, y) => [
            { x: x - 1, y: y - 1 },
            { x: x - 1, y: y },
            { x: x - 1, y: y + 1 },
            { x: x, y: y - 1 },
            { x: x, y: y + 1 },
            { x: x + 1, y: y - 1 },
            { x: x + 1, y: y },
            { x: x + 1, y: y + 1 },
        ]
        .filter(({ x, y }) => x >= 0 && y >= 0 && x < cols && y < rows)
        // .map(getCellIndex);

   const getSurroundingCount = (x, y) => getSurroundingFields(x, y)
          .map(({ x, y }) => getCell(x, y).isMined ? 1 : 0)
          .reduce((sum, value) => sum + value, 0);

    const openField = (x, y) => {
        const { isOpen, isFlagged, isMined, count } = getCell(x, y);

        if (!isOpen) {
            if (!gameStarted) {
                gameStarted = true;
                interval = setInterval(handleInterval, 1000);
            }

            if (isFlagged) return;

            if (isMined) {
                setCell(x, y, { exploded: true });
                finishGame();
                return;
            }

            setCell(x, y, { isOpen: true });

            if (--fieldsLeft === 0) {
                finishGame();
                return;
            }

            if (count === 0) {
                const surrounding = getSurroundingFields(x, y);
                for (const { x, y } of surrounding) {
                    openField(x, y);
                }
            }
        }
    };

    const handleInterval = () => {
        ++time;
    };

    const flagField = (x, y) => {
        const { isOpen, isFlagged } = getCell(x, y);
        const shouldFlag = !isFlagged && minesLeft > 0;
        if (isOpen) return;

        setCell(x, y, {
            isFlagged: shouldFlag,
        });

        if (shouldFlag) {
            --minesLeft;
            return;
        }
        if (isFlagged) {
            ++minesLeft;
        }
    };

    const finishGame = () => {
        clearInterval(interval);
        gameFinished = true;
        if (fieldsLeft === 0) {
            gameVictory = true;
        }
    };

    const clearPreviousGame = () => {
        clearInterval(interval);
        gameStarted = false;
        minesLeft = mines;
        fieldsLeft = rows * cols - mines;
        time = 0;
        gameFinished = false;
        gameVictory = false;
    };

    map = generateFieldMap(cols, rows, mines);

    const startGame = () => {
        clearPreviousGame();
        map = generateFieldMap(cols, rows, mines);
    };
</script>

<style>
    .container {
        user-select: none;
        width: 724px;
    }

    .header {
        position: relative;
        border: 2px solid;
        border-color: #eee #999 #999 #eee;
        background-color: #ccc;
        width: 724px;
    }

    .header::after {
        display: block;
        content: '';
        clear: both;
    }

    .field-table {
        width: 724px;
        height: 388px;
        border: 2px solid;
        border-color: #eee #999 #999 #eee;
        background-color: #ccc;
    }

    .finished {
        pointer-events: none;
    }
</style>

<div class="container" on:contextmenu={event => event.preventDefault()}>
    <div class="header">
        <Counter
            position="left"
            number={minesLeft}
        />
        <Smiley
            onClick={startGame}
            finished={gameFinished}
            victory={gameVictory}
        />
        <Counter
            position="right"
            number={time}
        />
    </div>
    <div class="field-table" class:finished={gameFinished}>
        {#each map as { exploded, isOpen, isMined, isFlagged, count }, i}
            <Field
                {exploded}
                {isOpen}
                {isMined}
                {isFlagged}
                {count}
                {gameFinished}
                onMouseDown={handleMouseDown(i)}
            />
        {/each}
    </div>
</div>

