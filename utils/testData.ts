// Test users and customer data loaded from .env

export const USERS = {
  standard: { username: process.env.SAUCE_USERNAME!, password: process.env.SAUCE_PASSWORD! },
  locked:   { username: 'locked_out_user',           password: process.env.SAUCE_PASSWORD! },
  problem:  { username: 'problem_user',               password: process.env.SAUCE_PASSWORD! },
};

export const CUSTOMER = {
  firstName: process.env.CUSTOMER_FIRST!,
  lastName:  process.env.CUSTOMER_LAST!,
  zip:       process.env.CUSTOMER_ZIP!,
};
