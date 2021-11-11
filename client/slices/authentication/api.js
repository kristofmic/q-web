import api from '../../api';

export function loginWithEmail(email, password) {
  return api.post('/api/auth/login/email', {
    email,
    password,
  });
}

export function loginWithGoogle(code) {
  return api.post('/api/auth/login/google', {
    code,
  });
}

export function logout() {
  return api.post('/api/auth/logout');
}

export function signupWithEmail(email, password, context) {
  return api.post('/api/auth/signup/email', {
    email,
    password,
    context,
  });
}

export function signupWithGoogle(code, context) {
  return api.post('/api/auth/signup/google', {
    code,
    context,
  });
}
