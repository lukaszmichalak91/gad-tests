import { prepareRandomArticle } from '../../src/factories/article.factory';
import { AddArticleModel } from '../../src/models/article.model';
import { ArticlePage } from '../../src/pages/article.page';
import { ArticlesPage } from '../../src/pages/articles.page';
import { AddArticlesView } from '../../src/views/add-article.view';
import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });
test.describe('Create, verify and delete articles', () => {
  let articlesPage: ArticlesPage;
  let addArticlesView: AddArticlesView;
  let articleData: AddArticleModel;
  let articlePage: ArticlePage;

  test.beforeEach(async ({ page }) => {
    articlesPage = new ArticlesPage(page);
    addArticlesView = new AddArticlesView(page);
    articlePage = new ArticlePage(page);

    await articlesPage.goto();
  });

  test('create new article @GAD-R04-01 @logged', async () => {
    // Arrange
    articleData = prepareRandomArticle();

    // Act
    await articlesPage.addArticleButtonLogged.click();
    await expect.soft(addArticlesView.addNewHeader).toBeVisible();
    await addArticlesView.createArticle(articleData);

    // Assert
    await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
    await expect.soft(articlePage.articleBody).toHaveText(articleData.body, {
      useInnerText: true,
    });
  });

  test('user can access single article @GAD-R04-03 @logged', async () => {
    // Act
    await articlesPage.gotoArticle(articleData.title);

    // Assert
    await expect(articlePage.articleTitle).toHaveText(articleData.title);
    await expect(articlePage.articleBody).toHaveText(articleData.body, {
      useInnerText: true,
    });
  });

  test('user can delete his iwn article @GAD-R04-04 @logged', async () => {
    // Arrange
    const expectedArticlesTitle = 'Articles';
    const expectedNoResultText = 'No data';
    await articlesPage.gotoArticle(articleData.title);

    // Act
    await articlePage.deleteArticle();

    //Assert
    await articlePage.waitForPageToLoadUrl();
    const title = await articlesPage.getTitle();
    expect(title).toContain(expectedArticlesTitle);

    await articlesPage.searchArticle(articleData.title);
    await expect(articlesPage.noResultText).toHaveText(expectedNoResultText);
  });
});
