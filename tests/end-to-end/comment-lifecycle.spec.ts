import { prepareRandomArticle } from '../../src/factories/article.factory';
import { AddArticleModel } from '../../src/models/article.model';
import { ArticlePage } from '../../src/pages/article.page';
import { ArticlesPage } from '../../src/pages/articles.page';
import { LoginPage } from '../../src/pages/login.page';
import { testUser1 } from '../../src/test-data/user.data';
import { AddArticlesView } from '../../src/views/add-article.view';
import { AddCommentsView } from '../../src/views/add-comment.view';
import { expect, test } from '@playwright/test';

test.describe('Create, verify and delete comment', () => {
  let loginPage: LoginPage;
  let articlesPage: ArticlesPage;
  let addArticlesView: AddArticlesView;
  let articleData: AddArticleModel;
  let articlePage: ArticlePage;
  let addCommentView: AddCommentsView;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    articlesPage = new ArticlesPage(page);
    addArticlesView = new AddArticlesView(page);
    articlePage = new ArticlePage(page);
    addCommentView = new AddCommentsView(page);

    articleData = prepareRandomArticle();
    await loginPage.goto();
    await loginPage.login(testUser1);
    await articlesPage.goto();
    await articlesPage.addArticleButtonLogged.click();
    await addArticlesView.createArticle(articleData);
  });

  test('create new comment @GAD-R05-01', async () => {
    // Create new comment
    // Arrange
    const expectedAddCommentHeader = 'Add New Comment';
    const expectedCommentCreatedPopup = 'Comment was created';

    // Act
    await articlePage.addCommentButton.click();
    await expect(addCommentView.addNewHeader).toHaveText(
      expectedAddCommentHeader,
    );
    await addCommentView.bodyInput.fill('test123');
    await addCommentView.saveButton.click();

    // Assert
    await expect(articlePage.alertPopup).toHaveText(
      expectedCommentCreatedPopup,
    );
  });
});
