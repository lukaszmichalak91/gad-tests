import { expect, test } from '@_src/fixtures/merge.fixture';

test.describe('Verify articles API endpoint @GAD-R08-01 @api', () => {
  test('GET articles returns status code 200', async ({ request }) => {
    // Arrange
    const expectedStatusCode = 200;
    const articlesUrl = 'api/articles';

    // Act
    const response = await request.get(articlesUrl);
    // Assert
    expect(response.status()).toBe(expectedStatusCode);
  });

  test('GET article should return at least one article @predefined_data', async ({
    request,
  }) => {
    // Arrange
    const expectedMinArticleCount = 1;
    const articlesUrl = 'api/articles';

    // Act
    const response = await request.get(articlesUrl);
    const responseJson = await response.json();

    //Assert
    expect(responseJson.length).toBeGreaterThanOrEqual(expectedMinArticleCount);
  });

  test('GET article should return article object @predefined_data', async ({
    request,
  }) => {
    // Arrange
    const expectedRequiredFields = [
      'id',
      'user_id',
      'title',
      'body',
      'date',
      'image',
    ];

    const articlesUrl = 'api/articles';

    // Act
    const response = await request.get(articlesUrl);
    const responseJson = await response.json();
    const article = responseJson[0];

    //Assert

    expectedRequiredFields.forEach((key) => {
      expect.soft(article).toHaveProperty(key);
    });
  });
});
