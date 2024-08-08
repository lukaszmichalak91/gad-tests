import { expect, test } from '@_src/fixtures/merge.fixture';
import { apiLinks } from '@_src/utils/api.util';

test.describe('Verify comments API endpoint @GAD-R08-02 @smoke', () => {
  test.describe('verify each condition in separate test', () => {
    test('GET comments returns status code 200', async ({ request }) => {
      // Arrange
      const expectedStatusCode = 200;

      // Act
      const response = await request.get(apiLinks.commentsUrl);

      // Assert
      expect(response.status()).toBe(expectedStatusCode);
    });

    test('GET comments should return at least one comment @predefined_data', async ({
      request,
    }) => {
      // Arrange
      const expectedMinCommentCount = 1;

      // Act
      const response = await request.get(apiLinks.commentsUrl);
      const responseJson = await response.json();

      //Assert
      expect(responseJson.length).toBeGreaterThanOrEqual(
        expectedMinCommentCount,
      );
    });

    test('GET comments should return comment object @predefined_data', async ({
      request,
    }) => {
      // Arrange
      const expectedRequiredFields = [
        'id',
        'article_id',
        'user_id',
        'body',
        'date',
      ];

      // Act
      const response = await request.get(apiLinks.commentsUrl);
      const responseJson = await response.json();
      const comment = responseJson[0];

      //Assert
      expectedRequiredFields.forEach((key) => {
        expect
          .soft(comment, `Expected key "${key}" should be in object`)
          .toHaveProperty(key);
      });
    });
  });
  test('GET comments should return an object with required fields @predefined_data', async ({
    request,
  }) => {
    // Arrange
    const response = await request.get(apiLinks.commentsUrl);

    await test.step('GET comment returns status code 200', async () => {
      const expectedStatusCode = 200;

      expect(response.status()).toBe(expectedStatusCode);
    });

    const responseJson = await response.json();
    await test.step('GET comment should return at least one comment', async () => {
      const expectedMinCommentsCount = 1;

      expect(responseJson.length).toBeGreaterThanOrEqual(
        expectedMinCommentsCount,
      );
    });

    const expectedRequiredFields = [
      'id',
      'article_id',
      'user_id',
      'body',
      'date',
    ];
    const comment = responseJson[0];

    expectedRequiredFields.forEach(async (key) => {
      await test.step(`response object contains required field: ${key}`, async () => {
        expect.soft(comment).toHaveProperty(key);
      });
    });
  });
});
