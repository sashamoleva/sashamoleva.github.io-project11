import Popup from "./popup.js";
export default class PopupImage extends Popup {
    constructor(popup,pic){
        super(popup);
        this.pic = pic;
    }
    openFull(link) {
        //this.popup.classList.add('popup_is-opened');
        super.open();
        this.pic.src = `${link}`;
    }
  }