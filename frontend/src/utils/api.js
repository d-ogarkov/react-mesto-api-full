import {apiSettings} from './utils';

class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._authUrl = options.authUrl;
  }

  _sendRequest(path, options = {}) {
    // Объект с опциями запроса нужно объединить с заголовками авторизации для дальнейшей передачи в fetch
    // По умолчанию опции запроса пустые (для обычного GET-запроса без body)
    let optionsWithHeaders = {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    };
    optionsWithHeaders = Object.assign(options, optionsWithHeaders);

    return fetch(`${this._baseUrl}/${path}`, optionsWithHeaders)
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        // Если ошибка, отклоняем промис
        return Promise.reject(`Ошибка: ${res.status}`);
      }
    })
    .catch((err) => console.log(err));
  }

  // Регистрация пользователя
  // В случае ошибки здесь ее не ловим, возвращаем только Promise.reject
  register(email, password) {
    return fetch(`${this._authUrl}/signup`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password})
    })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return Promise.reject(`Ошибка: ${res.status}`);
      }
    })
    .then((res) => {
      return res;
    })
  }

  // Авторизация пользователя
  // В случае ошибки здесь ее не ловим, возвращаем только Promise.reject
  authorize(email, password) {
    return fetch(`${this._authUrl}/signin`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password})
    })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return Promise.reject(`Ошибка: ${res.status}`);
      }
    })
    .then((data) => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        return data;
      } else {
        return Promise.reject(`Ошибка: нет токена`);
      }
    })
  }

  // Проверка токена пользователя
  getContent(token) {
    return fetch(`${this._authUrl}/users/me`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return Promise.reject(`Ошибка: ${res.status}`);
      }
    })
    .then(data => data)
  }

  // Далее функции работы с данными
  getUserInfo() {
    return this._sendRequest('users/me');
  }

  setUserInfo({ name, about }) {
    return this._sendRequest('users/me', {
      method: 'PATCH',
      body: JSON.stringify({
        name: name,
        about: about
      })
    });
  }

  getInitialCards() {
    return this._sendRequest('cards');
  }

  addCard({ name, link }) {
    return this._sendRequest('cards', {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        link: link
      })
    });
  }

  deleteCard(id) {
    return this._sendRequest(`cards/${id}`, {
      method: 'DELETE'
    });
  }

  setLike(id) {
    return this._sendRequest(`cards/${id}/likes`, {
      method: 'PUT'
    });
  }

  unsetLike(id) {
    return this._sendRequest(`cards/${id}/likes`, {
      method: 'DELETE'
    });
  }

  changeLikeCardStatus(id, isLiked) {
    return isLiked ? this.setLike(id) : this.unsetLike(id);
  }

  setAvatar({ avatar }) {
    return this._sendRequest('users/me/avatar', {
      method: 'PATCH',
      body: JSON.stringify({
        avatar: avatar
      })
    });
  }

}

// Экспортируем сразу экземпляр класса Api с нужными параметрами
export const api = new Api({
  baseUrl: apiSettings.baseUrl,
  authUrl: apiSettings.authUrl,
});
