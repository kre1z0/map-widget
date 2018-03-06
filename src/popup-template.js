import styles from "./styles.css";

export const popupTemplate = `
    <div class=${styles.header}>
        <div>Ярмарка</div>
        <div>Сельскохозяйственная продукция, овощи, фрукты, ягоды, орехи, зелень</div>
    </div>
    <div class="body">
        <div class="item">
            <div class="circle"/>
            <div>Россия, Иркутская областазование, посёлок Мегет, Садовая улица</div>
        </div>
        <div class="item">
            <div class="icon"/>
            <div>с 01.01.2018 по 31.12.2018</div>
        </div>
    </div>
`;