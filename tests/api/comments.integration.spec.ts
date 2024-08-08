import { expect, test } from '@_src/fixtures/merge.fixture';
import {
  getAuthorizationHeader,
  prepareArticlePayload,
  prepareCommentPayload,
} from '@_src/utils/api.util';

test.describe('Verify comment CRUD operations @crud @GAD-R09-02', () => {
  let headers: { [key: string]: string };
  let articleId: number;

  test.beforeAll('login and create article', async ({ request }) => {
    headers = await getAuthorizationHeader(request);

    const articlesUrl = 'api/articles';
    const articleData = prepareArticlePayload();

    const responseArticle = await request.post(articlesUrl, {
      headers,
      data: articleData,
    });

    const article = await responseArticle.json();
    articleId = article.id;
  });

  test('should not create a comment without a logged-in user', async ({
    request,
  }) => {
    // Arrange
    const expectedStatusCode = 401;
    const commentsUrl = 'api/comments';
    const commentData = prepareCommentPayload(articleId);

    // Arrange
    const response = await request.post(commentsUrl, {
      data: commentData,
    });

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
  });

  test('should create a comment with a logged-in user', async ({ request }) => {
    // Arrange
    const expectedStatusCode = 201;
    const commentsUrl = 'api/comments';

    const commentData = prepareCommentPayload(articleId);

    // Act
    const response = await request.post(commentsUrl, {
      headers,
      data: commentData,
    });

    // Assert
    const actualResponseStatus = response.status();
    expect(
      actualResponseStatus,
      `expect status code ${expectedStatusCode}, receiver ${actualResponseStatus}`,
    ).toBe(expectedStatusCode);

    const comment = await response.json();
    expect.soft(comment.body).toEqual(commentData.body);
    expect.soft(comment.article_id).toEqual(commentData.article_id);
  });
});
