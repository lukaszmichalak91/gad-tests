import { RESPONSE_TIMEOUT } from '@_pw-config';
import { prepareRandomArticle } from '@_src/factories/article.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';

test.describe('Verify articles', () => {
  test('reject new articles with empty title @GAD-R04-01 @logged', async ({
    addArticleView,
    page,
  }) => {
    // Arrange
    const expectedAlertText = 'Article was not created';
    const expectedResponseCode = 422;
    const articleData = prepareRandomArticle();

    articleData.title = '';

    const responsePromise = page.waitForResponse('/api/articles', {
      timeout: RESPONSE_TIMEOUT,
    });

    // Act
    await addArticleView.createArticle(articleData);
    const response = await responsePromise;

    // Assert
    await expect(addArticleView.alertPopup).toHaveText(expectedAlertText);
    expect(response.status()).toBe(expectedResponseCode);
  });

  test('reject new articles with empty body @GAD-R04-01 @logged', async ({
    addArticleView,
  }) => {
    // Arrange
    const expectedErrorMessage = 'Article was not created';
    const articleData = prepareRandomArticle();

    articleData.body = '';

    // Act
    await addArticleView.createArticle(articleData);

    // Assert
    await expect(addArticleView.alertPopup).toHaveText(expectedErrorMessage);
  });

  test.describe('title length', () => {
    test('reject new article with title exceeding 128 signs @GAD-R04-02 @logged', async ({
      addArticleView,
    }) => {
      // Arrange
      const expectedErrorMessage = 'Article was not created';
      const articleData = prepareRandomArticle(129);
      // Act
      await addArticleView.createArticle(articleData);

      // Assert
      await expect(addArticleView.alertPopup).toHaveText(expectedErrorMessage);
    });

    test('create article with 128 signs title @GAD-R04-02 @logged', async ({
      addArticleView,
    }) => {
      // Arrange
      const articleData = prepareRandomArticle(128);

      // Act
      const articlePage = await addArticleView.createArticle(articleData);

      // Assert
      await expect(articlePage.articleTitle).toHaveText(articleData.title);
    });
  });
});
