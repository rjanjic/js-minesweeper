<script>
    import Mine from './Mine.svelte';
    import Flag from './Flag.svelte';

    export let onMouseDown = () => {};
    export let exploded = false;
    export let isOpen = false;
    export let isMined = false;
    export let isFlagged = false;
    export let count = 0;
    export let gameFinished = false;
</script>

<style>
    .field {
        position: relative;
        color: transparent;
        float: left;
        display: block;
        text-align: center;
        width: 24px;
        height: 24px;
        font-size: 16px;
        font-weight: bold;
        line-height: 20px;
        cursor: pointer;
        border: 2px solid;
        border-color: #eee #999 #999 #eee;
        background-color: #ccc;
    }

    .open {
        background-color: #bbb;
        border-width: 1px;
        border-color: #999;
        padding: 1px;
        cursor: default;
    }

    .count-0 {
        color: transparent;
    }

    .count-1 {
        color: #33c;
    }

    .count-2 {
        color: #060;
    }

    .count-3 {
        color: #c00;
    }

    .count-4 {
        color: #606;
    }

    .count-5 {
        color: #066;
    }

    .count-6,
    .count-7,
    .count-8 {
        color: #000;
    }

    .mined {
        padding: 2px;
    }

    .flag {
        padding: 5px 8px;
    }

    .flag-wrong::before,
    .flag-wrong::after {
        content: '';
        display: block;
        width: 26px;
        border: 1px solid #f00;
        transform: rotate(45deg);
        top: 9px;
        left: -3px;
        position: absolute;
    }

    .flag-wrong::after {
        transform: rotate(-45deg);
    }

    .mined.exploded {
        padding: 3px;
        background-color: #f00;
    }
</style>

<span
    class="field count-{count}"
    class:exploded={exploded}
    class:open={isOpen}
    class:flag={isFlagged}
    class:mined={gameFinished && isMined && !isFlagged}
    class:flag-wrong={gameFinished && !isMined && isFlagged}
    on:mousedown={onMouseDown}
>
    {#if isFlagged}
        <Flag />
    {:else if isMined && gameFinished || exploded}
        <Mine />
    {:else if isOpen && count}
        {count}
    {/if}
</span>
