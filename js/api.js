class Api {
    constructor(options) {
      this.url = options.url;
      this.method = options.method;
      this.headers = options.headers;
      this.body = options.body;
    }
    getInfo() {
      return fetch(this.url, {
        headers: this.headers
      })
      .then(res => {
        if(res.ok) {
          return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
      })
    }
    patchInfo() {
      return fetch(this.url, { 
        method: this.method,  
        headers: this.headers,
        body: this.body})
      .then(res => {
        if(res.ok) {
          return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
      })
    };
  }