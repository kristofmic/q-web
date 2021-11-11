let _localData = {};

if (process.env.BROWSER) {
  const { __startr = {} } = window;
  _localData = JSON.parse(__startr.localData || '{}');
}

export default function localData() {
  return _localData;
}
