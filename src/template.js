import styles from './index.scss';

export default `
<div id="js-container" class="${styles['container']}">
    <div class="${styles['header']}">
        <div id="js-mines" class="${styles['counter']} ${styles['counter--left']}">
            <div class="${styles['number']} js-number">
                <span class="${styles['number__inner']} ${styles['number__inner--top']}"></span>
                <span class="${styles['number__inner']} ${styles['number__inner--bottom']}"></span>
            </div>
            <div class="${styles['number']} js-number">
                <span class="${styles['number__inner']} ${styles['number__inner--top']}"></span>
                <span class="${styles['number__inner']} ${styles['number__inner--bottom']}"></span>
            </div>
            <div class="${styles['number']} js-number">
                <span class="${styles['number__inner']} ${styles['number__inner--top']}"></span>
                <span class="${styles['number__inner']} ${styles['number__inner--bottom']}"></span>
            </div>
        </div>
        <div id="js-smiley" class="${styles['smiley']}">
            <span class="${styles['smiley__ic']}"></span>
        </div>
        <div id="js-time" class="${styles['counter']} ${styles['counter--right']}">
            <div class="${styles['number']} js-number">
                <span class="${styles['number__inner']} ${styles['number__inner--top']}"></span>
                <span class="${styles['number__inner']} ${styles['number__inner--bottom']}"></span>
            </div>
            <div class="${styles['number']} js-number">
                <span class="${styles['number__inner']} ${styles['number__inner--top']}"></span>
                <span class="${styles['number__inner']} ${styles['number__inner--bottom']}"></span>
            </div>
            <div class="${styles['number']} js-number">
                <span class="${styles['number__inner']} ${styles['number__inner--top']}"></span>
                <span class="${styles['number__inner']} ${styles['number__inner--bottom']}"></span>
            </div>
        </div>
    </div>
    <div id="js-table" class="${styles['field-table']}"></div>
</div>
`;
