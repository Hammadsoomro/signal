// Script to add phone number +12494440933 to user account
// This should be run with proper authentication token

const phoneNumber = "+12494440933";
const label = "Main Business Line";
const city = "Houston"; // Assuming Texas based on area code 249
const state = "TX";
const country = "US";
const monthlyPrice = 5.0;

console.log(`
Adding phone number ${phoneNumber} to user account...

To add this number, make a POST request to:
/api/phone-numbers/add-manual

With the following data:
{
  "number": "${phoneNumber}",
  "label": "${label}",
  "city": "${city}",
  "state": "${state}",
  "country": "${country}",
  "monthlyPrice": ${monthlyPrice}
}

Make sure to include the Authorization header with a valid Bearer token.
`);

// You can use this with curl:
console.log(`
Example curl command:
curl -X POST http://localhost:8080/api/phone-numbers/add-manual \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \\
  -d '{
    "number": "${phoneNumber}",
    "label": "${label}",
    "city": "${city}",
    "state": "${state}",
    "country": "${country}",
    "monthlyPrice": ${monthlyPrice}
  }'
`);
