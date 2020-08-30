export default class CardList {
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