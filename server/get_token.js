const http = require('http');
const fs = require('fs');

const email = 'test' + Date.now() + '@example.com';
const password = 'password123';

function request(path, body) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(body);
        const req = http.request({
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }, (res) => {
            let resData = '';
            res.on('data', (chunk) => resData += chunk);
            res.on('end', () => resolve(JSON.parse(resData)));
        });

        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
}

async function run() {
    let output = '';
    try {
        console.log('Registering...');
        const reg = await request('/api/auth/register', { email, password });
        console.log('Register:', reg);
        output += `Register: ${JSON.stringify(reg)}\n`;

        console.log('Logging in...');
        const login = await request('/api/auth/login', { email, password });
        console.log('Login:', login);
        output += `Login: ${JSON.stringify(login)}\n`;

        if (login.token) {
            console.log('TOKEN FOUND');
            output += `TOKEN: ${login.token}\n`;
        }
    } catch (e) {
        console.error('Error:', e);
        output += `Error: ${e.message}\n`;
    } finally {
        fs.writeFileSync('token_result.txt', output);
        process.exit();
    }
}

run();
