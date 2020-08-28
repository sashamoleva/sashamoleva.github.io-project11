class CardList {
    /*ГОТОВО REVIEW. Надо исправить, если сейчас параметр  cards не используется, его не надо и задавать. */
    constructor(container, func) {
        this.container = container;
        this.func = func;
    }
    addNewCard(name, link) {
        this.container.appendChild(this.func(name, link))
      }
    render(result) {
        for (const elem of Object.values(result)) {
            this.addNewCard(elem.name,elem.link);
        }
    };
}