import { prepareRandomArticle } from '@_src/factories/article.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { waitForResponse } from '@_src/utils/wait.util';

test.describe('Verify articles', () => {
  test('reject new articles with empty title @GAD-R04-01 @GAD-R07-03 @logged', async ({
    addArticleView,
    page,
  }) => {
    // Arrange
    const expectedAlertText = 'Article was not created';
    const expectedResponseCode = 422;
    const articleData = prepareRandomArticle();

    articleData.title = '';

    const responsePromise = waitForResponse({ page, url: '/api/articles' });

    // Act
    await addArticleView.createArticle(articleData);
    const response = await responsePromise;

    // Assert
    await expect(addArticleView.alertPopup).toHaveText(expectedAlertText);
    expect(response.status()).toBe(expectedResponseCode);
  });

  test('reject new articles with empty body @GAD-R04-01 @GAD-R07-03 @logged', async ({
    addArticleView,
    page,
  }) => {
    // Arrange
    const expectedErrorMessage = 'Article was not created';
    const expectedResponseCode = 422;

    const articleData = prepareRandomArticle();

    articleData.body = '';

    const responsePromise = waitForResponse({ page, url: '/api/articles' });

    // Act
    await addArticleView.createArticle(articleData);
    const response = await responsePromise;

    // Assert
    await expect(addArticleView.alertPopup).toHaveText(expectedErrorMessage);
    expect(response.status()).toBe(expectedResponseCode);
  });

  test.describe('title length', () => {
    test('reject new article with title exceeding 128 signs @GAD-R04-02 @GAD-R07-03 @logged', async ({
      addArticleView,
      page,
    }) => {
      // Arrange
      const expectedErrorMessage = 'Article was not created';
      const expectedResponseCode = 422;

      const articleData = prepareRandomArticle(129);

      const responsePromise = waitForResponse({ page, url: '/api/articles' });

      // Act
      await addArticleView.createArticle(articleData);
      const response = await responsePromise;

      // Assert
      await expect(addArticleView.alertPopup).toHaveText(expectedErrorMessage);
      expect(response.status()).toBe(expectedResponseCode);
    });

    test('create article with 128 signs title @GAD-R04-02 @GAD-R07-03 @logged', async ({
      addArticleView,
      page,
    }) => {
      // Arrange
      const expectedResponseCode = 201;

      const articleData = prepareRandomArticle(128);

      const responsePromise = waitForResponse({ page, url: '/api/articles' });

      // Act
      const articlePage = await addArticleView.createArticle(articleData);
      const response = await responsePromise;

      // Assert
      await expect(articlePage.articleTitle).toHaveText(articleData.title);
      expect(response.status()).toBe(expectedResponseCode);
    });
  });

  test('should return created article from API @GAD-R07-04 @logged', async ({
    addArticleView,
    page,
  }) => {
    // Arrange
    const articleData = prepareRandomArticle();

    const waitParams = {
      page,
      url: '/api/articles',
      method: 'GET',
      text: articleData.title,
    };
    const responsePromise = waitForResponse(waitParams);

    // Act
    const articlePage = await addArticleView.createArticle(articleData);
    const response = await responsePromise;

    // Assert
    await expect(articlePage.articleTitle).toHaveText(articleData.title);
    expect(response.ok()).toBeTruthy();
  });
});
