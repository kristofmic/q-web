import api from '../../api';

export function iAmGroot() {
  // const withError = Math.random() >= 0.5;

  return api.post('/api/groot', {
    params: {
      // error: withError || undefined,
    },
  });
}
