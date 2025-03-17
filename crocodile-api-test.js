import { check } from 'k6';
import http from 'k6/http';

export const options = {
  vus: 10,
  duration: '1m',
};

export default function () {
  // First request
  const res1 = http.get('https://test-api.k6.io/public/crocodiles/');
  console.log(`First Response Status: ${res1.status}, Body Length: ${res1.body.length}`);
  
  // Parse and log random ID
  const crocodiles = JSON.parse(res1.body);
  const randomId = crocodiles[Math.floor(Math.random() * crocodiles.length)].id;
  console.log(`Selected ID: ${randomId}`);

  // Second request
  const res2 = http.get(`https://test-api.k6.io/public/crocodiles/${randomId}/`);
  console.log(`Second Response Status: ${res2.status}, Body: ${res2.body}`);
}
