import { MainMenuComponent } from '@_src/components/main-menu.component';
import { ArticlePage } from '@_src/pages/article.page';
import { BasePage } from '@_src/pages/base.page';
import { EditCommentsView } from '@_src/views/edit-comment.view';
import { Page } from '@playwright/test';

export class CommentPage extends BasePage {
  url = '/comment.html';
  mainMenu = new MainMenuComponent(this.page);
  commentBody = this.page.getByTestId('comment-body');
  editButton = this.page.getByTestId('edit');
  alertPopup = this.page.getByTestId('alert-popup');
  returnLink = this.page.getByTestId('return');

  constructor(page: Page) {
    super(page);
  }

  async clickEditButton(): Promise<EditCommentsView> {
    await this.editButton.click();
    return new EditCommentsView(this.page);
  }

  async clickReturnLink(): Promise<ArticlePage> {
    await this.returnLink.click();
    return new ArticlePage(this.page);
  }
}
