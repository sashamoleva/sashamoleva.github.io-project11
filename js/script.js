// Переменные
const placesList = document.querySelector('.places-list');
const popUpCard = document.querySelector('.popup');
const userButton = document.querySelector('.user-info__button');
const closePopup = document.querySelector('.popup__close');
const formAddCard = document.querySelector('.popup__form');
const inputText = document.querySelector('.popup__input_type_name');
const inputImg = document.querySelector('.popup__input_type_link-url');
const newCardAddButton = document.querySelector('.popup__button'); // Кнопка + при добавлении места
const errors = document.querySelectorAll('span.error'); // массив ошибок
// Новые переменные для EDIT
const popUpWindowEdit = document.getElementById('edit'); // поиск по id всплывающего окна пользователя
const editButton = document.querySelector('.user-info__edit-button'); // кнопка EDIT
const closeEditButton = document.querySelector('.popup__close-edit'); // закрыть окно EDIT (крестик)
const userInfoName = document.querySelector('.user-info__name'); // инфа о пользователе
const userInfoJob = document.querySelector('.user-info__job'); // инфа о пользователе
const userInfoAvatar = document.querySelector('.user-info__photo') // инфа о пользователе
// Переменные для форм
const popUpForm = document.forms.new;
const { name, link } = popUpForm.elements;
// Переменные для edit
const popUpEdit = document.forms.edit;
const { username: userName, about: userAbout } = popUpEdit.elements;
// Новые переменные для IMAGE
const imagePopUpWindow = document.getElementById('image'); // поиск по id всплывающего окна картинки
const popUpCloseButtonImage = document.querySelector('.popup__close-image'); // закрой всплыв. картинку
const imagePop = document.querySelector('.popup__image'); // сама картинка
// Новые переменные для валидации
const errUser = document.getElementById('user-name-error');
const errAbout = document.getElementById('about-error');
const errorMessages = {
  empty: 'Это обязательное поле',
  wrongLength: 'Должно быть от 2 до 30 символов'
};
// Идентификаторы
const myGroup = 'https://praktikum.tk/cohort12'
const myToken = '66e40620-3796-4303-b2f9-167ae02e8c8c';

//экземпляр для запроса данных пользователя
let apiProfile = new Api({
  url: `${myGroup}/users/me`,
  headers: {
    authorization: myToken,
    'Content-Type': 'application/json'
  }
});
//экземпляр для карточек
const apiCards = new Api({
  url: `${myGroup}/cards`,
  headers: {
    authorization: myToken,
    'Content-Type': 'application/json'
  }
});

// Создание экземпляров классов
const newCard = (name, link) => {
  const card = new Card(name, link);
  return card.create();
}
//получение мфссива карточек с сервера
const initialCards = apiCards.getInfo()
  .then((result) => {
    cardsList.render(result);
  })
  .catch((err) => {
    console.log(err)
  });

const cardsList = new CardList (placesList, newCard);
const popUpImage = new PopupImage(imagePopUpWindow,imagePop); //попап увеличения картинки
const popUpAddCard = new Popup(popUpCard) //попап добавления картинки
const popUpEditUser = new Popup(popUpWindowEdit) //попап редактирования пользователя
const userInfo = new UserInfo(userInfoName, userInfoJob, userInfoAvatar);
const validEdit = new FormValidator(popUpEdit);
const validCard = new FormValidator(popUpForm);

//получение ФИО с сервера
apiProfile.getInfo()
  .then((result) => {
    userInfo.updateUserInfoServer(result);
  })
  .catch((err) => {
    console.log(err)
  });

validEdit.setEventListeners();
validCard.setEventListeners();



// Функции

// добавление карточки
function addCard(event) {
  event.preventDefault();
  popUpAddCard.close();
  cardsList.addNewCard(inputText.value, inputImg.value)
  formAddCard.reset();
};


// значения инпутов в edit
function popUpPlaceholder(username, about) {
  userName.value = `${username}`;
  userAbout.value = `${about}`;
}

//функция удаления ошибки при закрытии формы
function resetError() {
  (function () {
    errors.forEach(error => error.textContent = "");
  })();
}

// Функция отправки формы
function sendForm(evt) {
  evt.preventDefault();
  const currentForm = evt.target;
  currentForm.reset();
};

// Слушатели событий
placesList.addEventListener('click', (event) => {
  if (event.target.classList.contains('place-card__image')) {
    popUpImage.openFull(event.target.style.backgroundImage.slice(5, -2))
  }
});

userButton.addEventListener('click', () => {
  popUpAddCard.open();
  validCard.setSubmitButtonState(newCardAddButton);
});
closePopup.addEventListener('click', () => {
  popUpAddCard.close();
  popUpForm.reset();
  resetError();
});

editButton.addEventListener('click', () => {
  popUpEditUser.open();
  popUpPlaceholder(userInfoName.textContent, userInfoJob.textContent);
});
closeEditButton.addEventListener('click', () => {
  popUpEditUser.close();
  resetError();
});

popUpEdit.addEventListener('submit', function(event) {
  event.preventDefault();
  const apiNewProfile = new Api ({
    url: `${myGroup}/users/me`,
    method: 'PATCH',
    headers: {
      authorization: myToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: userName.value,
      about: userAbout.value
    })
  });
/* ГОТОВО REVIEW. Надо исправить. К вызову метода apiNewProfile.patchInfo() должны
 быть присоединены блоки:
.then((result) => {
       ...
 })
 .catch((err) => {
    console.log(err)
  }),
как они у Вас присоединёны к другим методам Api при их вызове. Именно в методе then должна производиться обработка ответа от сервера, изменение
информации на странице и закрытие формы профиля.
После вызова apiNewProfile.patchInfo() в методе then, который у Вас здесь будет подсоединён  надо будет занести информацию о профиле в DOM-элементы
страницы. Эту информацию надо взять из объекта, который возвращает сервер при данном запросе (читайте внимательно в описании задания пункт
"3. Редактирование профиля" о том, что возвращает сервер при данном запросе).

Также в этом методе нужно обновить свойства класса UserInfo с информацией о пользователе, чтобы в них была актуальная информация. То есть в этом методе
then надо сначала обновить свойства, а потом внести информацию на страницу из полей объекта, который вернул сервер.

В этом же методе then, нужно произвести закрытие формы профиля, так как форма должна закрыться только после прихода успешного ответа и
заполнения элементов страницы информацией (не раньше).
Если же придёт неуспешный ответ (информация на сервере не сохранилась) форма вообще не должна закрываться - пользователь может выйти из формы по крестику,
когда Вы ему сообщите о неуспешности, или попробовать ещё раз.

Также не забудьте, что метод catch должен быть последним в цепочке промисов, чтобы он мог обнаружить ошибки из всех методов then, которые были до него.
Об этом можно прочитать здесь:
https://learn.javascript.ru/promise-error-handling
О методе класса Promise Promise.reject можно кратко прочитать здесь:
https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Promise

Так как сделано у Вас сейчас - изменение информации на странице и закрытие формы вне метода then - неправильно, так как ответ от сервера асинхронен,
а это значит, что пока придёт ответ от сервера выполняться все инструкции, находящиеся после вызова apiNewProfile.patchInfo(), а это неверно,
так как запрос может быть неуспешным, данные на сервере могут не сохраниться, а Вы их уже успеете поменять на странице и сохранить в свойствах класса,
откуда возникнет расхождение информации на сервере и на странице, чего быть не должно, так как везде информация должна быть одинаковой и пользователь
должен знать сохранилась информация на сервере или нет. Поэтому, если нужно произвести какие-то операции только после прихода ответа, эти операции
надо помещать в метод then, так как только там выполнение программы приостанавливается (как и в методах catch и finally) до прихода ответа.

*/
apiNewProfile.patchInfo()
    .then((result) => {
      userInfo.setUserInfo(result.name, result.about);
      userInfo.updateUserInfo();
      popUpEditUser.close();
  })
  .catch((err) => {
  console.log(err)
  });
  // userInfo.setUserInfo(userName.value, userAbout.value);
  // userInfo.updateUserInfo();
  // popUpEditUser.close();
});

popUpCloseButtonImage.addEventListener('click', () => popUpImage.close());
formAddCard.addEventListener('submit', addCard);
popUpEdit.addEventListener('submit', sendForm);



/*ГОТОВО REVIEW. Резюме.

Общение с сервером при загрузке страницы происходит правильно.
Требуется сделать обработку ответа сервера при сабмите формы профиля.

Что надо исправить.

1. К вызову метода apiNewProfile.patchInfo() должны быть присоединены блоки .then и .catch (подробный комментарий в этом файле).

2. Если сейчас параметр  cards не используется, его не надо и задавать (подробный комментарий в этом файле).



*/