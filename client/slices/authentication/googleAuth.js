export default function googleAuthFactory() {
  if (process.env.BROWSER) {
    return window.auth2;
  }

  return {};
}
