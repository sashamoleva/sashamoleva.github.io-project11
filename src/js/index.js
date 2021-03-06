import "../index.css"
import Api from "./api.js";
import Card from "./card.js";
import CardList from "./cardlist.js";
import FormValidator from "./formvalidator.js";
import Popup from "./popup.js";
import PopupImage from "./popupimage.js";
import UserInfo from "./userinfo.js";


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

// Идентификаторы
//const myGroup = 'https://nomoreparties.co/cohort12'
const myGroup = process.env.NODE_ENV === 'development' ? 'http://nomoreparties.co/cohort12' : 'https://nomoreparties.co/cohort12';
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

  apiNewProfile.patchInfo()
    .then((result) => {
      userInfo.setUserInfo(result.name, result.about);
      userInfo.updateUserInfo();
      popUpEditUser.close();
  })
  .catch((err) => {
  console.log(err)
  });
});

popUpCloseButtonImage.addEventListener('click', () => popUpImage.close());
formAddCard.addEventListener('submit', addCard);
popUpEdit.addEventListener('submit', sendForm);