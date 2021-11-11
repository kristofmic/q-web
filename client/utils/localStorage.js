export function setItem(key, value) {
  if (process.env.BROWSER && typeof localStorage !== 'undefined') {
    localStorage.setItem(key, value);
  }

  throw Error('localStorage is not defined');
}

export function getItem(key) {
  if (process.env.BROWSER && typeof localStorage !== 'undefined') {
    return localStorage.getItem(key);
  }

  throw Error('localStorage is not defined');
}
