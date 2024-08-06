import { prepareRandomArticle } from '@_src/factories/article.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { testUser1 } from '@_src/test-data/user.data';

test.describe('Verify articles CRUD operations @api @GAD-R09-01', () => {
  test('should not create an article without a logged-in user', async ({
    request,
  }) => {
    // Arrange
    const expectedStatusCode = 401;
    const articlesUrl = 'api/articles';

    const randomArticleData = prepareRandomArticle();
    const articleData = {
      title: randomArticleData.title,
      body: randomArticleData.body,
      date: '2024-08-06T18:06:08.817Z',
      image: '',
    };

    // Arrange
    const response = await request.post(articlesUrl, {
      data: articleData,
    });

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
  });

  test('should create an article with a logged-in user', async ({
    request,
  }) => {
    // Arrange
    const expectedStatusCode = 201;

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

    // Act
    const articlesUrl = 'api/articles';

    const randomArticleData = prepareRandomArticle();
    const articleData = {
      title: randomArticleData.title,
      body: randomArticleData.body,
      date: '2024-08-06T18:06:08.817Z',
      image:
        '.\\data\\images\\256\\testing_645906ea-e746-4de1-86ce-0115b4e5e6b3.jpg',
    };

    const headers = {
      Authorization: `Bearer ${responseLoginJson.access_token}`,
    };
    const responseArticle = await request.post(articlesUrl, {
      headers,
      data: articleData,
    });

    // Assert
    const actualResponseStatus = responseArticle.status();
    expect(
      actualResponseStatus,
      `expect status code ${expectedStatusCode}, receiver ${actualResponseStatus}`,
    ).toBe(expectedStatusCode);

    const article = await responseArticle.json();
    expect.soft(article.title).toEqual(articleData.title);
    expect.soft(article.body).toEqual(articleData.body);
  });
});
