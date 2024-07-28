import { prepareRandomArticle } from '@_src/factories/article.factory';
import { ArticlePage } from '@_src/pages/article.page';
import { ArticlesPage } from '@_src/pages/articles.page';
import { AddArticleView } from '@_src/views/add-article.view';
import { expect, test } from '@playwright/test';

test.describe('Verify articles', () => {
  let articlesPage: ArticlesPage;
  let addArticlesView: AddArticleView;

  test.beforeEach(async ({ page }) => {
    articlesPage = new ArticlesPage(page);

    await articlesPage.goto();
    addArticlesView = await articlesPage.clickAddArticleButtonLogged();

    await expect.soft(addArticlesView.addNewHeader).toBeVisible();
  });

  test('reject new articles with empty title @GAD-R04-01 @logged', async () => {
    // Arrange
    const expectedAlertText = 'Article was not created';
    const articleData = prepareRandomArticle();

    articleData.title = '';

    // Act
    await addArticlesView.createArticle(articleData);

    // Assert
    await expect(addArticlesView.alertPopup).toHaveText(expectedAlertText);
  });

  test('reject new articles with empty body @GAD-R04-01 @logged', async () => {
    // Arrange
    const expectedErrorMessage = 'Article was not created';
    const articleData = prepareRandomArticle();

    articleData.body = '';

    // Act
    await addArticlesView.createArticle(articleData);

    // Assert
    await expect(addArticlesView.alertPopup).toHaveText(expectedErrorMessage);
  });

  test.describe('title length', () => {
    test('reject new article with title exceeding 128 signs @GAD-R04-02 @logged', async () => {
      // Arrange
      const expectedErrorMessage = 'Article was not created';
      const articleData = prepareRandomArticle(129);
      // Act
      await addArticlesView.createArticle(articleData);

      // Assert
      await expect(addArticlesView.alertPopup).toHaveText(expectedErrorMessage);
    });

    test('create article with 128 signs title @GAD-R04-02 @logged', async ({
      page,
    }) => {
      // Arrange
      const articlePage = new ArticlePage(page);
      const articleData = prepareRandomArticle(128);

      // Act
      await addArticlesView.createArticle(articleData);

      // Assert
      await expect(articlePage.articleTitle).toHaveText(articleData.title);
    });
  });
});
