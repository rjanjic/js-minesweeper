<script>
    import CSS from './Number.scss';
    export let number = 0;
</script>
<div class="{CSS['number']} {CSS[`number--${number}`]}">
    <span class="{CSS['number__inner']} {CSS['number__inner--top']}"></span>
    <span class="{CSS['number__inner']} {CSS['number__inner--bottom']}"></span>
</div>