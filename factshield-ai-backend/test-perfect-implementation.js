const axios = require('axios');
require('dotenv').config();

// Test the perfect implementation
async function testPerfectImplementation() {
  console.log('🚀 Testing Perfect FactShield AI Implementation\n');

  // Test 1: Google Fact Check API
  console.log('1. Testing Google Fact Check Tools API...');
  try {
    const response = await axios.get('https://factchecktools.googleapis.com/v1alpha1/claims:search', {
      params: {
        query: 'COVID-19 vaccines cause autism',
        key: process.env.GOOGLE_FACTCHECK_API_KEY,
        languageCode: 'en'
      },
      timeout: 10000
    });

    if (response.data.claims && response.data.claims.length > 0) {
      console.log('✅ Google Fact Check API working!');
      console.log(`   Found ${response.data.claims.length} fact-check results`);
      
      const firstClaim = response.data.claims[0];
      if (firstClaim.claimReview && firstClaim.claimReview.length > 0) {
        const review = firstClaim.claimReview[0];
        console.log(`   Sample result: ${review.textualRating} from ${review.publisher?.name}`);
      }
    } else {
      console.log('⚠️  Google Fact Check API working but no results found');
    }
  } catch (error) {
    console.log('❌ Google Fact Check API failed:', error.message);
    if (error.response?.status === 403) {
      console.log('   → Check your API key and make sure the API is enabled');
    }
  }

  console.log();

  // Test 2: News API
  console.log('2. Testing News API...');
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'fact check',
        apiKey: process.env.NEWS_API_KEY,
        sortBy: 'relevancy',
        pageSize: 5,
        language: 'en',
        domains: 'reuters.com,apnews.com,bbc.com'
      },
      timeout: 10000
    });

    if (response.data.articles && response.data.articles.length > 0) {
      console.log('✅ News API working!');
      console.log(`   Found ${response.data.articles.length} news articles`);
      console.log(`   Sample: ${response.data.articles[0].title}`);
    } else {
      console.log('⚠️  News API working but no results found');
    }
  } catch (error) {
    console.log('❌ News API failed:', error.message);
    if (error.response?.status === 401) {
      console.log('   → Check your News API key');
    }
  }

  console.log();

  // Test 3: URL Verification
  console.log('3. Testing URL Verification...');
  const testUrls = [
    'https://www.snopes.com',
    'https://www.factcheck.org',
    'https://www.politifact.com',
    'https://www.reuters.com',
    'https://fake-url-that-does-not-exist.com'
  ];

  for (const url of testUrls) {
    try {
      const response = await axios.head(url, { timeout: 5000 });
      console.log(`✅ ${url} - Status: ${response.status}`);
    } catch (error) {
      console.log(`❌ ${url} - Failed: ${error.message}`);
    }
  }

  console.log();

  // Test 4: Gemini API
  console.log('4. Testing Gemini API...');
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent('Analyze this claim: "The Earth is flat". Respond with JSON only: {"credibilityScore": 0.1, "reasoning": "test"}');
    const response = await result.response;
    const text = response.text();

    console.log('✅ Gemini API working!');
    console.log(`   Response length: ${text.length} characters`);
  } catch (error) {
    console.log('❌ Gemini API failed:', error.message);
  }

  console.log('\n🎉 Perfect Implementation Test Complete!');
  console.log('\nNext steps:');
  console.log('1. Replace GOOGLE_FACTCHECK_API_KEY with your actual API key');
  console.log('2. Start your backend server: npm run dev');
  console.log('3. Test the /analyze/text endpoint with real data');
}

testPerfectImplementation().catch(console.error);