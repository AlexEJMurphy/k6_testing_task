import { check } from 'k6';
import http from 'k6/http';

export const options = {
  vus: 10,
  duration: '1m',
};

export default function () {
  // First request: Get all crocodiles
  const res1 = http.get('https://test-api.k6.io/public/crocodiles/');
  check(res1, {
    'status is 200': (r) => r.status === 200,
  });
  
  // Store IDs from response
  const crocodiles = JSON.parse(res1.body);
  const randomId = crocodiles[Math.floor(Math.random() * crocodiles.length)].id;

  // Second request: Get specific crocodile
  const res2 = http.get(`https://test-api.k6.io/public/crocodiles/${randomId}/`);
  check(res2, {
    'status is 200': (r) => r.status === 200,
  });
}
