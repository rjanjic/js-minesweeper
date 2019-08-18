<script>
	import Smiley from './Smiley.svelte';
	import Counter from './Counter.svelte';
	import FieldCSS from './Field.scss';
	import MineCSS from './Mine.scss';
	import FlagCSS from './Flag.scss';

	import { cn, cIf } from './utils';

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

	const handleMouseDown = (x, y) => event => {
		event.preventDefault();
		const shouldFlag = event.which === 3 || event.button === 2;
		if (shouldFlag) {
			flagField(x, y);
			return;
		}
		openField(x, y);
	};

	const generateFieldMap = (cols, rows, mines) => {
		map = [];
		for (let y = 0; y < rows; y++) {
			const row = [];
			for (let x = 0; x < cols; x++) {
				row.push({
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
			}
		}
		return map;
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
	};

	const getFieldValue = (x, y) => {
		return map[y][x].isMined ? 1 : 0;
	};

	const getSurroundingFields = (x, y) => [
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

	const getSurroundingCount = (x, y) => {
		const sum = [];
		const surrounding = getSurroundingFields(x, y);
		for (const { x, y } of surrounding) {
			sum.push(getFieldValue(x, y));
		}
		return sum.reduce((sum, value) => sum + value, 0);
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

	const handleInterval = () => {
		++time;
		console.log(time)
	};

	const flagField = (x, y) => {
		const { isOpen, isFlagged } = getField(x, y);
		const shouldFlag = !isFlagged && minesLeft > 0;
		if (isOpen) return;

		updateField(x, y, { isFlagged: shouldFlag });

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
		margin: 20px auto;
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

    .field-table--finished {
        pointer-events: none;
    }
</style>

<div class="container" on:contextmenu="{event => event.preventDefault()}" >
    <div class="header">
		<Counter position="left" number={minesLeft} />
        <Smiley 
			onClick={startGame}
			finished={gameFinished}
			victory={gameVictory}
		/>
		<Counter position="right" number={time}/>
    </div>
    <div class="{cn(
			'field-table', 
			cIf('field-table--finished', gameFinished)
		)}">
		{#each map as row, y}
			{#each row as { exploded, isOpen, isMined, isFlagged, count }, x}
				<span on:mousedown="{handleMouseDown(x, y)}" class="{cn(
						cIf(FieldCSS['field']),
						cIf(FieldCSS['field--exploded'], exploded),
						cIf(FieldCSS['field--open'], isOpen),
						cIf(FieldCSS['field--flag'], isFlagged),
						cIf(FieldCSS['field--mined'], gameFinished && isMined && !isFlagged),
						cIf(FieldCSS['field--flag-wrong'], gameFinished && !isMined && isFlagged),
						cIf(FieldCSS[`field--count-${count}`], isOpen && count),
					)}">
					{#if isFlagged}
						<span class="{FlagCSS['mast']}">
							<span class="{FlagCSS['mast__flag']}"></span>
						</span>
					{:else if isMined && gameFinished || exploded}
						<span class="{MineCSS['mine']}">
							<span class="{MineCSS['mine']}">
								<span class="{MineCSS['mine__shadow']}"></span>
							</span>
						</span>
					{:else if isOpen && count}
						{count}
					{/if}
				</span>
			{/each}
		{/each}
	</div>
</div>