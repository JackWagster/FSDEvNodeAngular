import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { BookStoreComponentsPage, BookStoreDeleteDialog, BookStoreUpdatePage } from './book-store.page-object';

const expect = chai.expect;

describe('BookStore e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let bookStoreComponentsPage: BookStoreComponentsPage;
  let bookStoreUpdatePage: BookStoreUpdatePage;
  let bookStoreDeleteDialog: BookStoreDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load BookStores', async () => {
    await navBarPage.goToEntity('book-store');
    bookStoreComponentsPage = new BookStoreComponentsPage();
    await browser.wait(ec.visibilityOf(bookStoreComponentsPage.title), 5000);
    expect(await bookStoreComponentsPage.getTitle()).to.eq('Book Stores');
    await browser.wait(ec.or(ec.visibilityOf(bookStoreComponentsPage.entities), ec.visibilityOf(bookStoreComponentsPage.noResult)), 1000);
  });

  it('should load create BookStore page', async () => {
    await bookStoreComponentsPage.clickOnCreateButton();
    bookStoreUpdatePage = new BookStoreUpdatePage();
    expect(await bookStoreUpdatePage.getPageTitle()).to.eq('Create or edit a Book Store');
    await bookStoreUpdatePage.cancel();
  });

  it('should create and save BookStores', async () => {
    const nbButtonsBeforeCreate = await bookStoreComponentsPage.countDeleteButtons();

    await bookStoreComponentsPage.clickOnCreateButton();

    await promise.all([
      bookStoreUpdatePage.setBookStoreNameInput('bookStoreName'),
      bookStoreUpdatePage.setPostalCodeInput('postalCode'),
      bookStoreUpdatePage.setCityInput('city'),
      bookStoreUpdatePage.setStateProvinceInput('stateProvince'),
      // bookStoreUpdatePage.bookSelectLastOption(),
    ]);

    expect(await bookStoreUpdatePage.getBookStoreNameInput()).to.eq(
      'bookStoreName',
      'Expected BookStoreName value to be equals to bookStoreName'
    );
    expect(await bookStoreUpdatePage.getPostalCodeInput()).to.eq('postalCode', 'Expected PostalCode value to be equals to postalCode');
    expect(await bookStoreUpdatePage.getCityInput()).to.eq('city', 'Expected City value to be equals to city');
    expect(await bookStoreUpdatePage.getStateProvinceInput()).to.eq(
      'stateProvince',
      'Expected StateProvince value to be equals to stateProvince'
    );

    await bookStoreUpdatePage.save();
    expect(await bookStoreUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await bookStoreComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last BookStore', async () => {
    const nbButtonsBeforeDelete = await bookStoreComponentsPage.countDeleteButtons();
    await bookStoreComponentsPage.clickOnLastDeleteButton();

    bookStoreDeleteDialog = new BookStoreDeleteDialog();
    expect(await bookStoreDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Book Store?');
    await bookStoreDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(bookStoreComponentsPage.title), 5000);

    expect(await bookStoreComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
