// Test users and customer data loaded from .env

export const USERS = {
  standard: { username: process.env.SAUCE_USERNAME ?? 'standard_user', password: process.env.SAUCE_PASSWORD ?? 'secret_sauce' },
  locked:   { username: 'locked_out_user',                             password: process.env.SAUCE_PASSWORD ?? 'secret_sauce' },
  problem:  { username: 'problem_user',                                password: process.env.SAUCE_PASSWORD ?? 'secret_sauce' },
};

export const CUSTOMER = {
  firstName: process.env.CUSTOMER_FIRST ?? 'John',
  lastName:  process.env.CUSTOMER_LAST  ?? 'Doe',
  zip:       process.env.CUSTOMER_ZIP   ?? '12345',
};
