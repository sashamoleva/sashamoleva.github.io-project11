export default class FormValidator {
    constructor(form) {
        this.form = form;
      }
    checkInputValidity(input) {
        // const errUser = document.getElementById('user-name-error');
        // const errAbout = document.getElementById('about-error');
        const errorMessages = {
            empty: 'Это обязательное поле',
            wrongLength: 'Должно быть от 2 до 30 символов'
        };
        input.setCustomValidity("");
        if (input.validity.valueMissing) {
            input.setCustomValidity(errorMessages.empty);
            return false
        }
        if (input.validity.tooShort || input.validity.tooLong) {
            input.setCustomValidity(errorMessages.wrongLength);
            return false
        }
        return input.checkValidity();
    }

    setSubmitButtonState(button, state) {
        if (state) {
            button.removeAttribute('disabled', true);
            button.classList.add('popup__button_valid');
            button.classList.remove('popup__button_invalid');
          } else {
            button.setAttribute('disabled', true);
            button.classList.add('popup__button_invalid');
            button.classList.remove('popup__button_valid');
          }
    }
    isFieldValid(input) {
        const parent = input.closest('.popup__form');
        const errorElem = parent.querySelector(`#${input.id}-error`);
        const valid = this.checkInputValidity(input);
        errorElem.textContent = input.validationMessage;
        return valid;
        }
    setEventListeners() {
        const submit = this.form.querySelector('.button');
        const [...inputs] = this.form.querySelectorAll('input');
        this.form.addEventListener('input', (event) => {
            this.isFieldValid(event.target);
            if (inputs.every(this.checkInputValidity)) {
            this.setSubmitButtonState(submit, true);
            } else {
            this.setSubmitButtonState(submit, false);
            }
        })
    }
}
