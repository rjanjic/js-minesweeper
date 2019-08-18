<script>
    export let finished;
    export let victory;
    export let onClick;
</script>
<style>
    .smiley {
        position: absolute;
        left: 50%;
        top: 50%;
        display: block;
        text-align: center;
        width: 32px;
        height: 32px;
        margin: -16px;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
        border: 2px solid;
        border-color: #eee #999 #999 #eee;
        background-color: #ccc;
    }

    .smiley:active {
        border-color: #999 #eee #eee #999;
    }

    .smiley__ic {
        position: relative;
        margin: 2px;
        display: block;
        width: 24px;
        height: 24px;
        border: 2px solid #000;
        border-radius: 20px;
        background-color: #ff0;
    }

    .smiley__ic--finished {
        background-color: #f00;
    }

    .smiley__ic--victory {
        background-color: #0f0;
    }

    .smiley__ic::before,
    .smiley__ic::after {
        content: '';
        position: absolute;
    }

    .smiley__ic::before {
        top: 6px;
        left: 50%;
        width: 8px;
        height: 4px;
        margin-left: -4px;
        border-left: 2px solid #000;
        border-right: 2px solid #000;
    }

    .smiley__ic::after {
        top: 12px;
        left: 50%;
        width: 12px;
        height: 5px;
        margin-left: -6px;
        border: 2px solid;
        border-width: 0 2px 2px;
        border-radius: 0 0 8px 8px;
    }
    .smiley__ic--finished::after {
        top: 10px;
        width: 8px;
        margin-left: -4px;
        border-width: 0 0 2px;
        border-radius: 0;
    }
</style>
<div class="smiley" on:click={onClick}>
    <span class="smiley__ic {victory ? 'smiley__ic--victory' : ''} {finished ? 'smiley__ic--finished' : ''}"></span>
</div>