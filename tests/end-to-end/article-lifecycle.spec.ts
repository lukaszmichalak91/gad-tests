import { prepareRandomArticle } from '@_src/factories/article.factory';
import { AddArticleModel } from '@_src/models/article.model';
import { ArticlesPage } from '@_src/pages/articles.page';
import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });
test.describe('Create, verify and delete articles', () => {
  let articlesPage: ArticlesPage;
  let articleData: AddArticleModel;

  test.beforeEach(async ({ page }) => {
    articlesPage = new ArticlesPage(page);
    await articlesPage.goto();
  });

  test('create new article @GAD-R04-01 @logged', async () => {
    // Arrange
    articleData = prepareRandomArticle();

    // Act
    const addArticlesView = await articlesPage.clickAddArticleButtonLogged();
    await expect.soft(addArticlesView.addNewHeader).toBeVisible();
    const articlePage = await addArticlesView.createArticle(articleData);

    // Assert
    await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
    await expect.soft(articlePage.articleBody).toHaveText(articleData.body, {
      useInnerText: true,
    });
  });

  test('user can access single article @GAD-R04-03 @logged', async () => {
    // Act
    const articlePage = await articlesPage.gotoArticle(articleData.title);

    // Assert
    await expect(articlePage.articleTitle).toHaveText(articleData.title);
    await expect(articlePage.articleBody).toHaveText(articleData.body, {
      useInnerText: true,
    });
  });

  test('user can delete his own article @GAD-R04-04 @logged', async () => {
    // Arrange
    const expectedArticlesTitle = 'Articles';
    const expectedNoResultText = 'No data';
    const articlePage = await articlesPage.gotoArticle(articleData.title);

    // Act
    articlesPage = await articlePage.deleteArticle();

    //Assert
    await articlePage.waitForPageToLoadUrl();
    const title = await articlesPage.getTitle();
    expect(title).toContain(expectedArticlesTitle);

    articlesPage = await articlesPage.searchArticle(articleData.title);
    await expect(articlesPage.noResultText).toHaveText(expectedNoResultText);
  });
});
