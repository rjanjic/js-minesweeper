import { containerTpl, mineTpl, flagTpl } from './template';
import styles from './index.scss';

const rows = 16;
const cols = 30;
const mines = 99;
let minesLeft = mines;
let fieldsLeft = rows * cols - mines;
let interval = null;
let time = 0;
let gameStarted = false;
let map = [];

const minesweeperEl = document.createElement("div");
minesweeperEl.innerHTML = containerTpl;
document.body.appendChild(minesweeperEl);

const containerEl = document.getElementById("js-container");
const tableEl = document.getElementById("js-table");
const smileyEl = document.getElementById("js-smiley");
const timeEl = document.getElementById("js-time");
const minesEl = document.getElementById("js-mines");

const generateFieldMap = (cols, rows, mines) => {
    map = [];
    for (let y = 0; y < rows; y++) {
        const row = [];
        for (let x = 0; x < cols; x++) {
            const fieldEl = document.createElement("span");
            fieldEl.classList.add(styles['field']);
            fieldEl.addEventListener("field-change", handleCustomEvent);
            fieldEl.addEventListener("mousedown", function(event) {
                event.preventDefault();
                const shouldFlag = event.which === 3 || event.button === 2;
                const customEvent = new CustomEvent("field-change", {
                    detail: { x, y, shouldFlag }
                });
                this.dispatchEvent(customEvent);
            });
            row.push({
                el: fieldEl,
                isMined: false,
                isFlagged: false,
                isOpen: false,
                exploded: false
            });
        }
        map.push(row);
    }

    for (let i = 0; i < mines; i++) {
        setRandomMine();
    }

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const { el, isMined } = getField(x, y);
            if (!isMined) {
                updateField(x, y, {
                    count: getSurroundingCount(x, y)
                });
            }
            tableEl.appendChild(el);
        }
    }
};

const setRandomMine = () => {
    const y = Math.floor(Math.random() * rows);
    const x = Math.floor(Math.random() * cols);
    if (!getField(x, y).isMined) {
        updateField(x, y, { isMined: true });
        return;
    }
    setRandomMine();
};

const getField = (x, y) => map[y][x];

const updateField = (x, y, data) => {
    map[y][x] = Object.assign(map[y][x], data);

    const { el, count, isMined } = getField(x, y);

    if (data.exploded) {
        el.classList.add(styles['field--open']);
        el.classList.add(styles['field--exploded']);
    }

    if (data.isOpen) {
        el.classList.add(
            styles['field--open'],
            styles[`field--count-${count}`]
        );
    }

    if (data.isMined) {
        el.classList.add(styles['field--mined']);
        el.innerHTML = mineTpl;
    }

    if (data.count) {
        el.innerHTML = count;
    }

    if (data.isFlagged !== undefined) {
        el.classList.toggle(styles['field--flag'], data.isFlagged);
        el.classList.toggle(styles['field--flag-wrong'], data.isFlagged && !isMined);

        if (data.isFlagged) {
            el.innerHTML = (isMined ? flagTpl : `${mineTpl}${flagTpl}`);
        } else {
            el.innerHTML =  (isMined ? mineTpl : count);
        }
    }
};

const getFieldValue = (x, y) => {
    return map[y][x].isMined ? 1 : 0;
};

const getSurroundingFields = (x, y) => {
    return [
        { x: x - 1, y: y - 1 },
        { x: x - 1, y: y },
        { x: x - 1, y: y + 1 },
        { x: x, y: y - 1 },
        { x: x, y: y + 1 },
        { x: x + 1, y: y - 1 },
        { x: x + 1, y: y },
        { x: x + 1, y: y + 1 }
    ].filter(({ x, y }) => {
        return x >= 0 && y >= 0 && x < cols && y < rows;
    });
};

const getSurroundingCount = (x, y) => {
    const sum = [];
    const surrounding = getSurroundingFields(x, y);
    for (const { x, y } of surrounding) {
        sum.push(getFieldValue(x, y));
    }
    return sum.reduce((sum, value) => {
        return sum + value;
    }, 0);
};

const openField = (x, y) => {
    const { isOpen, isFlagged, isMined, count } = getField(x, y);

    if (!isOpen) {
        if (!gameStarted) {
            gameStarted = true;
            interval = setInterval(handleInterval, 1000);
        }

        if (isFlagged) return;

        if (isMined) {
            updateField(x, y, { exploded: true });
            finishGame();
            return;
        }

        updateField(x, y, { isOpen: true });

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

const updateCounterClasses = (el, val) => {
    for (let i = 0; i < 10; i++) {
        el.classList.toggle(styles[`number--${i}`], i === val);
    }
};

const updateCounter = (el, number) => {
    if (number > 999) return;
    const numbers = `${number}`.padStart(3, "0").split('');
    const numbersEl = el.querySelectorAll('.js-number');

    for (let i = 0, l = numbers.length; i < l; i++) {
        updateCounterClasses(numbersEl[i], parseInt(numbers[i]));
    }
};

const handleInterval = () => {
    updateCounter(timeEl, ++time);
};

const flagField = (x, y) => {
    const { isOpen, isFlagged, el } = getField(x, y);
    const shouldFlag = !isFlagged && minesLeft > 0;
    if (isOpen) return;

    updateField(x, y, { isFlagged: shouldFlag });

    if (shouldFlag) {
        updateCounter(minesEl, --minesLeft);
        return;
    }
    if (isFlagged) {
        updateCounter(minesEl, ++minesLeft);
    }
};

const handleCustomEvent = event => {
    const { x, y, shouldFlag } = event.detail;
    if (shouldFlag) {
        flagField(x, y);
        return;
    }
    openField(x, y);
};

const finishGame = () => {
    clearInterval(interval);
    containerEl.classList.add(styles['is-finished']);
    if (fieldsLeft === 0) {
        containerEl.classList.add(styles['is-victory']);
    }
};

const clearPreviousGame = () => {
    clearInterval(interval);
    gameStarted = false;
    minesLeft = mines;
    fieldsLeft = rows * cols - mines;
    time = 0;
    tableEl.innerHTML = "";
    containerEl.classList.remove(styles['is-finished']);
    updateCounter(timeEl, 0);
    updateCounter(minesEl, mines);
};

const startGame = () => {
    clearPreviousGame();
    generateFieldMap(cols, rows, mines); // 30 x 16 with 99 mines
};

containerEl.addEventListener("contextmenu", event => event.preventDefault(), false);
smileyEl.addEventListener("click", startGame);
startGame();
