import { RegisterUser } from '../models/user.model';
import { BasePage } from './base.page';
import { Page } from '@playwright/test';

export class RegisterPage extends BasePage {
  url = 'register.html';

  userFirstNameInput = this.page.getByTestId('firstname-input');
  userLastNameInput = this.page.getByTestId('lastname-input');
  emailInput = this.page.getByTestId('email-input');
  passwordInput = this.page.getByTestId('password-input');
  registerButton = this.page.getByTestId('register-button');

  alertPopup = this.page.getByTestId('alert-popup');
  emailErrorText = this.page.locator('#octavalidate_email');

  constructor(page: Page) {
    super(page);
  }

  async register(registerUserData: RegisterUser): Promise<void> {
    await this.userFirstNameInput.fill(registerUserData.userFirstName);
    await this.userLastNameInput.fill(registerUserData.userLastName);
    await this.emailInput.fill(registerUserData.userEmail);
    await this.passwordInput.fill(registerUserData.userPassword);
    await this.registerButton.click();
  }
}
