class UserInfo {
    constructor(nameContainer, aboutContainer, avatarContainer) {
      this.nameContainer = nameContainer;
      this.aboutContainer = aboutContainer;
      this.avatarContainer = avatarContainer;
    }
    setUserInfo(name, about) {
      this.name = name;
      this.about = about;
    }
      updateUserInfo() {
        this.nameContainer.textContent = this.name;
        this.aboutContainer.textContent = this.about;
      }
      updateUserInfoServer(result) {
        this.nameContainer.textContent = result.name;
        this.aboutContainer.textContent = result.about;
        this.avatarContainer.style.backgroundImage = `url(${result.avatar})`;
      }
  }
