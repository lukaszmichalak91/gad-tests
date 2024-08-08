import { expect, test } from '@_src/fixtures/merge.fixture';
import {
  ArticlePayload,
  Headers,
  apiLinks,
  getAuthorizationHeader,
  prepareArticlePayload,
} from '@_src/utils/api.util';
import { APIResponse } from '@playwright/test';

test.describe('Verify articles CRUD operations @crud', () => {
  test('should not create an article without a logged-in user @GAD-R09-01', async ({
    request,
  }) => {
    // Arrange
    const expectedStatusCode = 401;
    const articleData = prepareArticlePayload();

    // Arrange
    const response = await request.post(apiLinks.articlesUrl, {
      data: articleData,
    });

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
  });

  test.describe('crud operations', () => {
    let responseArticle: APIResponse;
    let headers: Headers;
    let articleData: ArticlePayload;

    test.beforeAll('should login', async ({ request }) => {
      headers = await getAuthorizationHeader(request);
    });

    test.beforeEach('should create an article', async ({ request }) => {
      articleData = prepareArticlePayload();
      responseArticle = await request.post(apiLinks.articlesUrl, {
        headers,
        data: articleData,
      });
    });

    test('should create an article with a logged-in user @GAD-R09-01', async () => {
      // Arrange
      const expectedStatusCode = 201;

      // Assert
      const actualResponseStatus = responseArticle.status();
      expect(
        actualResponseStatus,
        `expect status code ${expectedStatusCode}, receiver ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      const articleJson = await responseArticle.json();
      expect.soft(articleJson.title).toEqual(articleData.title);
      expect.soft(articleJson.body).toEqual(articleData.body);
    });

    test('should delete an article with a logged-in user @GAD-R09-03', async ({
      request,
    }) => {
      // Arrange
      const expectedStatusCode = 200;
      const articleJson = await responseArticle.json();
      const articleId = articleJson.id;

      // Act
      const responseArticleDelete = await request.delete(
        `${apiLinks.articlesUrl}/${articleId}`,
        {
          headers,
        },
      );

      // Assert
      const actualResponseStatus = responseArticleDelete.status();
      expect(
        actualResponseStatus,
        `expect status code ${expectedStatusCode}, receiver ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      // Assert check deleted article
      const responseArticleGet = await request.get(
        `${apiLinks.articlesUrl}/${articleId}`,
      );

      const expectedDeletedArticleStatusCode = 404;
      expect(
        responseArticleGet.status(),
        `expect status code ${expectedDeletedArticleStatusCode}, receiver ${responseArticleGet.status()}`,
      ).toBe(expectedDeletedArticleStatusCode);
    });

    test('should not delete an article with a non logged-in user GAD-R09-03', async ({
      request,
    }) => {
      // Arrange
      const expectedStatusCode = 401;
      const articleJson = await responseArticle.json();
      const articleId = articleJson.id;

      // Act
      const responseArticleDelete = await request.delete(
        `${apiLinks.articlesUrl}/${articleId}`,
      );

      // Assert
      const actualResponseStatus = responseArticleDelete.status();
      expect(
        actualResponseStatus,
        `expect status code ${expectedStatusCode}, receiver ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      // Assert check not deleted article
      const responseArticleGet = await request.get(
        `${apiLinks.articlesUrl}/${articleId}`,
      );

      const expectedNotDeletedArticleStatusCode = 200;
      expect(
        responseArticleGet.status(),
        `expect status code ${expectedNotDeletedArticleStatusCode}, receiver ${responseArticleGet.status()}`,
      ).toBe(expectedNotDeletedArticleStatusCode);
    });
  });
});
