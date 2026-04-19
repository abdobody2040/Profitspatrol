import http from 'k6/http';
import { check, sleep } from 'k6';

// Config: Simulate 50 concurrent users
export const options = {
    stages: [
        { duration: '30s', target: 20 }, // Ramp up to 20 users
        { duration: '1m', target: 50 },  // Stay at 50 users
        { duration: '30s', target: 0 },  // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    },
};

const BASE_URL = 'http://localhost:5000'; // Change to https://kidcaphq.com for prod

export default function () {
    // 1. Visit Landing Page
    const res = http.get(BASE_URL);
    check(res, { 'status was 200': (r) => r.status == 200 });

    sleep(1);

    // 2. Visit Login Page (Static Asset Load)
    const loginRes = http.get(`${BASE_URL}/login`);
    check(loginRes, { 'login status 200': (r) => r.status == 200 });

    sleep(2);

    // Note: Actual Auth load testing requires a valid Supabase JWT generator
    // or a mock endpoint to avoid banning your IP.
    // For now, we stress test the static serving capabilities.
}
