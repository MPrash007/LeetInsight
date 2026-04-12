import fs from 'fs';

async function testCF() {
    try {
        const username = 'tourist';
        console.time('fetch userInfo');
        let res = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
        let data = await res.json();
        console.timeEnd('fetch userInfo');
        console.log(data.result[0].rating);

        console.time('fetch rating');
        res = await fetch(`https://codeforces.com/api/user.rating?handle=${username}`);
        data = await res.json();
        console.timeEnd('fetch rating');
        console.log(data.result.length);

        console.time('fetch status');
        res = await fetch(`https://codeforces.com/api/user.status?handle=${username}`);
        data = await res.json();
        console.timeEnd('fetch status');
        console.log(data.result.length);
        
        fs.writeFileSync('cf_status_sample.json', JSON.stringify(data.result.slice(0, 5), null, 2));

    } catch (e) {
        console.error(e);
    }
}

testCF();
