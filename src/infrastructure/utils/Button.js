class Button {
  constructor(text = "", footer = "", headerType = 1) {
    this.text = text;
    this.footer = footer;
    this.templateButtons = [];
    this.buttons = [];
    this.headerType = headerType;
  }

  /**
   * * Retorna a mensagem normal/template
   * @param {String} button
   * @returns
   */
  get(button = "") {
    if (button == "template")
      return {
        text: this.text,
        footer: this.footer,
        templateButtons: this.templateButtons,
      };
    else
      return {
        text: this.text,
        footer: this.footer,
        buttons: this.buttons,
        headerType: this.headerType,
      };
  }

  /**
   * * Adiciona um botão a mensagem simples
   * @param {String} displayText
   * @param {Number} buttonId
   * @param {Number} type
   * @returns
   */
  add(displayText = "", buttonId = this.buttons.length + 1, type = 1) {
    this.buttons.push({ buttonId, buttonText: { displayText }, type });
    return this;
  }

  /**
   * * Adiciona um botão com uma url
   * @param {String} displayText
   * @param {String} url
   * @param {Number} index
   * @returns
   */
  addUrl(displayText = "", url = "", index = this.getLength() + 1) {
    this.templateButtons.push({
      index,
      urlButton: { displayText, url },
    });
    return this;
  }

  /**
   * * Adiciona um botão com um telefone
   * @param {String} displayText
   * @param {String} phoneNumber
   * @param {Number} index
   * @returns
   */
  addCall(displayText = "", phoneNumber = 123, index = this.getLength() + 1) {
    this.templateButtons.push({
      index,
      callButton: { displayText, phoneNumber },
    });
    return this;
  }

  /**
   * * Adiciona um botão respondivel
   * @param {String} displayText
   * @param {Number} id
   * @param {Number} index
   * @returns
   */
  addReply(
    displayText = "",
    id = this.getLength() + 1,
    index = this.getLength() + 1
  ) {
    this.templateButtons.push({
      index,
      quickReplyButton: { displayText, id },
    });
    return this;
  }

  /**
   * * Remove um botão
   * @param {Number} index
   */
  remove(index) {
    this.buttons = this.buttons.filter((button, buttonIndex) => {
      if (buttonIndex !== index) return button;
    });

    this.templateButtons = this.templateButtons.filter((button) => {
      if (button.index !== index) return button;
    });
  }

  /**
   * * Retorna a quantidades de botões existentes
   * @returns
   */
  getLength() {
    return this.templateButtons.length;
  }
}

module.exports = Button;
