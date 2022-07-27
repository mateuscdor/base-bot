class List {
  constructor(title = "", text = "", footer = "", buttonText = "") {
    this.title = title;
    this.text = text;
    this.footer = footer;
    this.buttonText = buttonText;
    this.sections = [];
  }

  /**
   * * Retorna a mensagem de lista
   * @returns
   */
  get() {
    return {
      title: this.title,
      text: this.text,
      footer: this.footer,
      buttonText: this.buttonText,
      sections: this.sections,
    };
  }

  /**
   * * Adiciona uma seção
   * @param {String} title
   * @param {Array} rows
   * @returns
   */
  addSection(title = "", rows = []) {
    const index = this.sections.length;
    this.sections.push({ title, rows });
    const t = this;
    t.add = function add() {
      t.addRow(index, ...arguments);
      return t;
    };
    return t;
  }

  /**
   * * Adiciona uma fileira a lista
   * @param {Number} index
   * @param {String} title
   * @param {String} description
   * @param {Number} rowId
   * @returns
   */
  addRow(index, title, description, rowId) {
    return this.sections[index].rows.push({ title, description, rowId });
  }
}

module.exports = List;
