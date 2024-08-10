import { expect, test } from '@_src/fixtures/merge.fixture';
import {
  CommentPayload,
  Headers,
  apiLinks,
  getAuthorizationHeader,
  prepareArticlePayload,
  prepareCommentPayload,
} from '@_src/utils/api.util';
import { APIResponse } from '@playwright/test';

test.describe('Verify comment CRUD operations @crud @GAD-R09-02', () => {
  test.describe('crud operations', () => {
    let headers: Headers;
    let articleId: number;
    let commentData: CommentPayload;
    let responseArticle: APIResponse;
    let responseComment: APIResponse;

    test.beforeAll('login and create article', async ({ request }) => {
      headers = await getAuthorizationHeader(request);

      const articleData = prepareArticlePayload();
      responseArticle = await request.post(apiLinks.articlesUrl, {
        headers,
        data: articleData,
      });
      const article = await responseArticle.json();
      articleId = article.id;

      // assert article created
      const expectedStatusCode = 200;
      await expect(async () => {
        const responseArticleCreated = await request.get(
          `${apiLinks.articlesUrl}/${articleId}`,
        );
        expect(
          responseArticleCreated.status(),
          `Expected status: ${expectedStatusCode} and observed: ${responseArticleCreated.status()}`,
        ).toBe(expectedStatusCode);
      }).toPass({ timeout: 2_000 });
    });

    test('should not create a comment without a logged-in user', async ({
      request,
    }) => {
      // Arrange
      const expectedStatusCode = 401;
      const commentData = prepareCommentPayload(articleId);

      // Arrange
      const response = await request.post(apiLinks.commentsUrl, {
        data: commentData,
      });

      // Assert
      expect(response.status()).toBe(expectedStatusCode);
    });

    test.beforeEach('should create a comment', async ({ request }) => {
      commentData = prepareCommentPayload(articleId);
      responseComment = await request.post(apiLinks.commentsUrl, {
        headers,
        data: commentData,
      });

      // assert comment exists
      const commentJson = await responseComment.json();

      const expectedStatusCode = 200;
      await expect(async () => {
        const responseCommentCreated = await request.get(
          `${apiLinks.commentsUrl}/${commentJson.id}`,
        );
        expect(
          responseCommentCreated.status(),
          `Expected status: ${expectedStatusCode} and observed: ${responseCommentCreated.status()}`,
        ).toBe(expectedStatusCode);
      }).toPass({ timeout: 2_000 });
    });

    test('should create a comment with a logged-in user', async () => {
      // Arrange
      const expectedStatusCode = 201;

      // Assert
      const actualResponseStatus = responseComment.status();
      expect(
        actualResponseStatus,
        `expect status code ${expectedStatusCode}, receiver ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      const comment = await responseComment.json();
      expect.soft(comment.body).toEqual(commentData.body);
      expect.soft(comment.article_id).toEqual(commentData.article_id);
    });

    test('should delete an comment with a logged-in user @GAD-R09-04', async ({
      request,
    }) => {
      // Arrange
      const expectedStatusCode = 200;
      const commentJson = await responseComment.json();
      const commentId = commentJson.id;

      // Act
      const responseCommentDeleted = await request.delete(
        `${apiLinks.commentsUrl}/${commentId}`,
        {
          headers,
        },
      );

      // Assert
      const actualResponseStatus = responseCommentDeleted.status();
      expect(
        actualResponseStatus,
        `expect status code ${expectedStatusCode}, receiver ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      // Assert check deleted comment
      const responseCommentGet = await request.get(
        `${apiLinks.commentsUrl}/${commentId}`,
      );

      const expectedDeletedCommentStatusCode = 404;
      expect(
        responseCommentGet.status(),
        `expect status code ${expectedDeletedCommentStatusCode}, receiver ${responseCommentGet.status()}`,
      ).toBe(expectedDeletedCommentStatusCode);
    });

    test('should not delete an comment with a non logged-in user @GAD-R09-04', async ({
      request,
    }) => {
      // Arrange
      const expectedStatusCode = 401;
      const commentJson = await responseComment.json();
      const commentId = commentJson.id;

      // Act
      const responseCommentDelete = await request.delete(
        `${apiLinks.commentsUrl}/${commentId}`,
      );

      // Assert
      const actualResponseStatus = responseCommentDelete.status();
      expect(
        actualResponseStatus,
        `expect status code ${expectedStatusCode}, receiver ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      // Assert check not deleted comment
      const responseCommentGet = await request.get(
        `${apiLinks.commentsUrl}/${commentId}`,
      );

      const expectedNotDeletedCommentStatusCode = 200;
      expect(
        responseCommentGet.status(),
        `expect status code ${expectedNotDeletedCommentStatusCode}, receiver ${responseCommentGet.status()}`,
      ).toBe(expectedNotDeletedCommentStatusCode);
    });
  });
});
