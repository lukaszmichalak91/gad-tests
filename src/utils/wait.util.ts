import { RESPONSE_TIMEOUT } from '@_pw-config';
import { Page, Response } from '@playwright/test';

export async function waitForResponse(
  page: Page,
  url: string,
  method?: string, // add method type
  status?: number, // add status type
): Promise<Response> {
  return page.waitForResponse(
    (response) => {
      // console.log(
      //   response.status(),
      //   response.request().method(),
      //   response.url(),
      // );
      return (
        response.url().includes(url) &&
        (!method || response.request().method() == method) &&
        (!status || response.status() == status)
      );
    },
    {
      timeout: RESPONSE_TIMEOUT,
    },
  );
}
