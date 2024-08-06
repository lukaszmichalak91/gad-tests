import { prepareRandomArticle } from '@_src/factories/article.factory';
import { prepareRandomComment } from '@_src/factories/comment.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { testUser1 } from '@_src/test-data/user.data';

test.describe('Verify comment CRUD operations @api @GAD-R09-02', () => {
  let headers: { [key: string]: string };
  let articleId: number;

  test.beforeAll('login and create article', async ({ request }) => {
    // Login
    const loginUrl = 'api/login';
    const userData = {
      email: testUser1.userEmail,
      password: testUser1.userPassword,
    };

    const responseLogin = await request.post(loginUrl, {
      data: userData,
    });
    const responseLoginJson = await responseLogin.json();

    headers = {
      Authorization: `Bearer ${responseLoginJson.access_token}`,
    };

    // Create article
    const articlesUrl = 'api/articles';

    const randomArticleData = prepareRandomArticle();
    const articleData = {
      title: randomArticleData.title,
      body: randomArticleData.body,
      date: '2024-08-06T18:06:08.817Z',
      image:
        '.\\data\\images\\256\\testing_645906ea-e746-4de1-86ce-0115b4e5e6b3.jpg',
    };

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

    const randomCommentData = prepareRandomComment();
    const commentData = {
      article_id: articleId,
      body: randomCommentData.body,
      date: '2024-08-06T15:44:31Z',
    };

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
    const randomCommentData = prepareRandomComment();

    const commentData = {
      article_id: articleId,
      body: randomCommentData.body,
      date: '2024-08-05T15:44:31Z',
    };

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
