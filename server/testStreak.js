

const LEETCODE_API = 'https://leetcode.com/graphql';
const headers = { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' };

async function run() {
    const query = `
    query userProfileCalendar($username: String!) {
      matchedUser(username: $username) {
        userCalendar {
          streak
          totalActiveDays
          submissionCalendar
        }
      }
    }
    `;

    const res = await fetch(LEETCODE_API, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables: { username: "lee215" } }) // using example user
    });
    
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
}
run();
