import styles from './styles.css';

export const popupTemplate = `
    <div class=${styles.btnGroup}>
        <div class=${styles.minimizeBtn}>&#822;</div>
        <div class=${styles.closeBtn}>&#10005;</div>
    </div>
    <div class=${styles.header}>
        <div class=${styles.headerTitle}>{{name}}</div>
        <div class=${styles.headerSubtitle}>{{assortmentOfgoods}}</div>
    </div>
    <div>
        <div class=${styles.row}>
            <div class=${styles.address}>
                <div class=${styles.silverCircle}></div>
                {{address}}
            </div>
        </div>
        <div class=${styles.row}>
            <div class=${styles.periodicity}>
                <div class=${styles.timeIcon}></div>
                    {{periodicity}}
                </div>
        </div>
    </div>
`;
