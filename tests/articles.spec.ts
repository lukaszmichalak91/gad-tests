import { randomNewArticle } from '../src/factories/article.factory';
import { AddArticleModel } from '../src/models/article.model';
import { ArticlePage } from '../src/pages/article.page';
import { ArticlesPage } from '../src/pages/articles.page';
import { LoginPage } from '../src/pages/login.page';
import { testUser1 } from '../src/test-data/user.data';
import { AddArticlesView } from '../src/views/add-article.view';
import { expect, test } from '@playwright/test';

test.describe('Verify articles', () => {
  let loginPage: LoginPage;
  let articlesPage: ArticlesPage;
  let addArticlesView: AddArticlesView;

  let articleData: AddArticleModel;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    articlesPage = new ArticlesPage(page);
    addArticlesView = new AddArticlesView(page);

    await loginPage.goto();
    await loginPage.login(testUser1);
    await articlesPage.goto();
    await articlesPage.addArticleButtonLogged.click();

    articleData = randomNewArticle();

    await expect.soft(addArticlesView.header).toBeVisible();
  });
  test('create new article @GAD-R04-01', async ({ page }) => {
    // Arrange
    const articlePage = new ArticlePage(page);

    // Act
    await addArticlesView.createArticle(articleData);

    // Assert
    await expect(articlePage.articleTitle).toHaveText(articleData.title);
    await expect(articlePage.articleBody).toHaveText(articleData.body, {
      useInnerText: true,
    });
  });

  test('reject new articles with empty title @GAD-R04-01', async () => {
    // Arrange
    const expectedAlertText = 'Article was not created';
    articleData.title = '';

    // Act
    await addArticlesView.createArticle(articleData);

    // Assert
    await expect(addArticlesView.alertPopup).toHaveText(expectedAlertText);
  });

  test('reject new articles with empty body @GAD-R04-01', async () => {
    // Arrange
    const expectedErrorMessage = 'Article was not created';
    articleData.body = '';

    // Act
    await addArticlesView.createArticle(articleData);

    // Assert
    await expect(addArticlesView.alertPopup).toHaveText(expectedErrorMessage);
  });
});
