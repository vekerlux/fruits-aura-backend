const bcrypt = require('bcryptjs');

async function testBcrypt() {
    try {
        console.log('Testing bcrypt...');
        const salt = await bcrypt.genSalt(10);
        console.log('Salt generated');
        const hash = await bcrypt.hash('Admin123!', salt);
        console.log('Hash generated:', hash);
        const match = await bcrypt.compare('Admin123!', hash);
        console.log('Match:', match);
    } catch (e) {
        console.error('Bcrypt error:', e);
    }
}

testBcrypt();
