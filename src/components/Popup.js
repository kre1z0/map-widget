import { popupTemplate } from '../templates/popup-template';
import styles from '../styles.css';
import mustache from 'mustache';

class Popup {
    constructor(container, props = {}, animationContent = false, closePopupCallback) {
        this.props = props;
        this.container = container;
        this.animationContent = animationContent;
        this.popup = null;
        this.closeBtn = null;
        this.closePopup = this.closePopup.bind(this);
        this.closePopupCallback = closePopupCallback;
    }

    closePopup() {
        this.popup.classList.add(styles.fadeOut);
        setTimeout(() => {
            this.container.removeChild(this.popup);
        }, 200);
        this.closePopupCallback();
    }

    renderPopup() {
        const popup = mustache.render(popupTemplate, this.props);
        const node = document.createElement('div');
        node.innerHTML = popup;
        node.classList.add(styles.popup);

        if (this.animationContent) {
            node.querySelector(':first-child').classList.add(styles.fadeIn);
        } else {
            node.classList.add(styles.fadeIn);
        }

        this.container.appendChild(node);
        this.closeBtn = node.querySelector(`.${styles.closeBtn}`);
        this.popup = node;
        this.closeBtn.addEventListener('click', this.closePopup);
    }
}

export default Popup;
