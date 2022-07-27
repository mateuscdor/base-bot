class Response {
  constructor(schema = {}) {
    this._status = schema.status || 200;
    this._code = schema.code || "BB000";
    this._data = schema.data || "";
    this._message = schema.message || "";
  }

  static result(status = 200, data = "") {
    return { status, data };
  }

  static error(
    status = 400,
    code = "BB000",
    message = "Seu dado não pode ser processado."
  ) {
    return { status, code, message };
  }

  static errorDefault(code = "BB000") {
    return {
      status: 500,
      code,
      message: "Serviço indisponível no momento. Tente novamente mais tarde.",
    };
  }

  handleStatus() {
    switch (this._status) {
      case 201:
      case 204:
      case 403:
      case 404:
        return this._status;
    }

    if (this._status < 300) {
      return 200;
    }

    if (this._status < 400) {
      return 200;
    }

    if (this._status < 500) {
      return 400;
    }

    if (this._status >= 500) {
      return 500;
    }

    return 500;
  }

  handleMessage() {
    const status = this.handleStatus();

    switch (status) {
      case 201:
      case 204:
        return "";
    }

    if (status === 200) {
      if (!!this._data) {
        return this._data;
      }
      return "";
    }

    if (status >= 400) {
      return { code: this._code, message: this._message };
    }

    return Response.errorDefault(this._code);
  }

  static json(res = null, schema = {}) {
    const response = new Response(schema);
    const status = response.handleStatus();
    const message = response.handleMessage();

    return res?.status(status).json(message);
  }
}

module.exports = Response;
