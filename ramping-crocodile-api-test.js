import { check } from 'k6';
import http from 'k6/http';
import { Trend } from 'k6/metrics';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const firstRequestTime = new Trend('first_request_time');
const secondRequestTime = new Trend('second_request_time');

// Gradual ramp-up pattern
export const options = {
    scenarios: {
      gradual_load: {
        executor: 'ramping-vus',
        startVUs: 0,
        stages: [
          { duration: '2m', target: 20 },  // Ramp-up to 20 VUs
          { duration: '5m', target: 20 },  // Sustain
          { duration: '1m', target: 0 }    // Cool-down
        ],
        gracefulRampDown: '30s'
      }
    }
  };

export default function () {
  // First request
  const res1 = http.get('https://test-api.k6.io/public/crocodiles/');
  check(res1, {
    'status is 200': (r) => r.status === 200,
    })
  //console.log(`First Response Status: ${res1.status}, Body Length: ${res1.body.length}`);
  firstRequestTime.add(res1.timings.duration);
  
  // Parse and log random ID
  const crocodiles = JSON.parse(res1.body);
  const randomId = crocodiles[Math.floor(Math.random() * crocodiles.length)].id;
  //console.log(`Selected ID: ${randomId}`);

  // Second request
  const res2 = http.get(`https://test-api.k6.io/public/crocodiles/${randomId}/`);
  check(res2, {
    'status is 200': (r) => r.status === 200,
    });
  //console.log(`Second Response Status: ${res2.status}, Body: ${res2.body}`);
  secondRequestTime.add(res2.timings.duration);
}

//Create summary.html report where title reflects duration and no. of vu's
// export function handleSummary(data) {
//   const vus = __ENV.VUS || 'unknown';
//   const duration = __ENV.DURATION || 'unknown';
//   const reportName = `summary_${vus}vu_${duration}s.html`;
  
//   return {
//     [reportName]: htmlReport(data),
//   };
// }