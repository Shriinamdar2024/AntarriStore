const axios = require('axios');

async function checkDiagnose() {
    try {
        console.log('Hitting live backend diagnostics endpoint...');
        const res = await axios.get('https://antarri-backend.onrender.com/api/auth/email/diagnose');
        console.log('Status:', res.status);
        console.log('Diagnostics Result:', JSON.stringify(res.data, null, 2));
    } catch (err) {
        if (err.response) {
            console.log(`Live backend returned status ${err.response.status}. Deployment might still be in progress.`);
            console.log('Error Data:', JSON.stringify(err.response.data, null, 2));
        } else {
            console.log('Error hitting live backend:', err.message);
        }
    }
}

checkDiagnose();
