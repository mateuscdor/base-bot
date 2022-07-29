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
  notify(...args) {
    this.observers.forEach((observer) => observer(observer, ...args));
  }
}

module.exports = Observer;
