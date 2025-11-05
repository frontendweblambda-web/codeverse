export const regex = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  password:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  mobile: /^\+?[1-9]\d{1,14}$/,
  name: /^[a-zA-Z\s'-]{2,50}$/,
  username: /^[a-zA-Z0-9._-]{3,20}$/,
};
