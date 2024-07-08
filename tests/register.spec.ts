import { RegisterUser } from '../src/models/user.model';
import { LoginPage } from '../src/pages/login.page';
import { RegisterPage } from '../src/pages/register.page';
import { WelcomePage } from '../src/pages/welcome.page';
import { faker } from '@faker-js/faker/locale/en';
import { expect, test } from '@playwright/test';

test.describe('Verify register', () => {
  test('register with correct data and login @GAD-R03-01 @GAD-R03-02 @GAD-R03-03', async ({
    page,
  }) => {
    // Arrange
    const registerUserData: RegisterUser = {
      userFirstName: faker.person.firstName().replace(/[^A-Za-z]/g, ''),
      userLastName: faker.person.lastName().replace(/[^A-Za-z]/g, ''),
      userEmail: '',
      userPassword: faker.internet.password(),
    };

    registerUserData.userEmail = faker.internet.email({
      firstName: registerUserData.userFirstName,
      lastName: registerUserData.userLastName,
    });

    const registerPage = new RegisterPage(page);

    // Act
    await registerPage.goto();
    await registerPage.register(registerUserData);

    const expectedAlertPopup = 'User created';
    // Assert
    await expect(registerPage.alertPopup).toHaveText(expectedAlertPopup);
    const loginPage = new LoginPage(page);
    await loginPage.waitForPageToLoadUrl();
    const titleLogin = await loginPage.title();
    expect.soft(titleLogin).toContain('Login');

    // Assert
    await loginPage.login({
      userEmail: registerUserData.userEmail,
      userPassword: registerUserData.userPassword,
    });

    const welcomePage = new WelcomePage(page);
    const titleWelcome = await welcomePage.title();
    expect(titleWelcome).toContain('Welcome');
  });

  test('not registered with incorrect data and - not valid email @GAD-R03-04', async ({
    page,
  }) => {
    const registerUserData: RegisterUser = {
      userFirstName: faker.person.firstName().replace(/[^A-Za-z]/g, ''),
      userLastName: faker.person.lastName().replace(/[^A-Za-z]/g, ''),
      userEmail: '#$%',
      userPassword: faker.internet.password(),
    };

    const expectedErrorText = 'Please provide a valid email address';
    const registerPage = new RegisterPage(page);

    // Act
    await registerPage.goto();
    await registerPage.register(registerUserData);

    // Assert
    await expect(registerPage.emailErrorText).toHaveText(expectedErrorText);
  });

  test('not registered with incorrect data and - email not provided @GAD-R03-04', async ({
    page,
  }) => {
    // Arrange
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.userFirstNameInput.fill(
      faker.person.firstName().replace(/[^A-Za-z]/g, ''),
    );
    await registerPage.userLastNameInput.fill(
      faker.person.lastName().replace(/[^A-Za-z]/g, ''),
    );
    await registerPage.passwordInput.fill(faker.internet.password());

    const expectedErrorText = 'This field is required';

    // Act
    await registerPage.registerButton.click();

    // Assert
    await expect(registerPage.emailErrorText).toHaveText(expectedErrorText);
  });
});
