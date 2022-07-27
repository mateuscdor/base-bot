class Observer {
  constructor() {
    this.observers = [];
  }

  /**
   * * Adiciona um novo observador
   * @param {*} observer
   * @returns
   */
  add(observer) {
    this.observers.push(observer);
    return observer;
  }

  /**
   * * Remove um observador
   * @param {*} observer
   */
  remove(observer) {
    const index = this.observers.indexOf(observer);
    this.observers = this.observers.splice(index + 1, this.observers.length);
    this.notify(index);
  }

  /**
   * * Retorna somente um ou todos observadores
   * @param {Number} index
   * @returns
   */
  get(index) {
    return index ? this.observers[index] : this.observers;
  }

  /**
   * * Notifica um ou todos observadores
   * @param { Number } index
   */
  notify(index) {
    this.observers.forEach((observer) => observer(index, observer));
  }
}

module.exports = Observer;
