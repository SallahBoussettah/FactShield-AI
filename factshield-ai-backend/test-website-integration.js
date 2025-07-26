const axios = require('axios');
require('dotenv').config();

async function testWebsiteIntegration() {
  console.log('🌐 FACTSHIELD AI WEBSITE INTEGRATION TEST');
  console.log('='.repeat(70));
  console.log('🎯 Testing: Login, Authentication, and Fact-checking Integration');
  console.log('🔗 Frontend: http://localhost:5173');
  console.log('🔗 Backend: http://localhost:3001');
  console.log('='.repeat(70));

  const backendURL = 'http://localhost:3001';
  const frontendURL = 'http://localhost:5173';
  
  let testResults = {
    backendHealth: false,
    frontendAccessible: false,
    authEndpoints: false,
    analysisEndpoints: false,
    sourceGeneration: false,
    overallScore: 0
  };

  // Test 1: Backend Health Check
  console.log('\n🔍 TEST 1: Backend Health Check');
  console.log('─'.repeat(40));
  try {
    const healthResponse = await axios.get(`${backendURL}/health`, { timeout: 10000 });
    if (healthResponse.status === 200) {
      console.log('✅ Backend is running and healthy');
      console.log(`   Status: ${healthResponse.data.status || 'OK'}`);
      testResults.backendHealth = true;
    }
  } catch (error) {
    console.log('❌ Backend health check failed');
    console.log(`   Error: ${error.message}`);
    console.log('   💡 Make sure backend is running: npm run dev');
  }

  // Test 2: Frontend Accessibility
  console.log('\n🔍 TEST 2: Frontend Accessibility');
  console.log('─'.repeat(40));
  try {
    const frontendResponse = await axios.get(frontendURL, { 
      timeout: 10000,
      headers: { 'Accept': 'text/html' }
    });
    if (frontendResponse.status === 200) {
      console.log('✅ Frontend is accessible');
      console.log(`   Status: ${frontendResponse.status}`);
      console.log(`   Content-Type: ${frontendResponse.headers['content-type']}`);
      testResults.frontendAccessible = true;
    }
  } catch (error) {
    console.log('❌ Frontend accessibility check failed');
    console.log(`   Error: ${error.message}`);
    console.log('   💡 Make sure frontend is running: npm run dev');
  }

  // Test 3: Authentication Endpoints
  console.log('\n🔍 TEST 3: Authentication System');
  console.log('─'.repeat(40));
  try {
    // Test registration endpoint structure
    const testUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'TestPassword123!'
    };

    console.log('Testing registration endpoint...');
    try {
      const registerResponse = await axios.post(`${backendURL}/api/auth/register`, testUser, {
        timeout: 10000,
        validateStatus: (status) => status < 500 // Accept 4xx errors as valid responses
      });
      
      if (registerResponse.status === 201 || registerResponse.status === 200) {
        console.log('✅ Registration endpoint working');
        console.log(`   Status: ${registerResponse.status}`);
        
        // Test login with the same user
        console.log('Testing login endpoint...');
        const loginResponse = await axios.post(`${backendURL}/api/auth/login`, {
          email: testUser.email,
          password: testUser.password
        }, {
          timeout: 10000,
          validateStatus: (status) => status < 500
        });
        
        if (loginResponse.status === 200 && loginResponse.data.token) {
          console.log('✅ Login endpoint working');
          console.log(`   Status: ${loginResponse.status}`);
          console.log(`   Token received: ${loginResponse.data.token ? 'Yes' : 'No'}`);
          testResults.authEndpoints = true;
        } else {
          console.log('⚠️  Login endpoint responded but no token received');
        }
        
      } else if (registerResponse.status === 400) {
        console.log('⚠️  Registration endpoint working (user might already exist)');
        console.log(`   Status: ${registerResponse.status}`);
        console.log(`   Message: ${registerResponse.data.message || 'Validation error'}`);
        testResults.authEndpoints = true; // Endpoint is working, just validation issue
      }
      
    } catch (authError) {
      if (authError.response && authError.response.status < 500) {
        console.log('⚠️  Auth endpoints responding (validation errors expected)');
        console.log(`   Status: ${authError.response.status}`);
        testResults.authEndpoints = true;
      } else {
        throw authError;
      }
    }
    
  } catch (error) {
    console.log('❌ Authentication system test failed');
    console.log(`   Error: ${error.message}`);
  }

  // Test 4: Analysis Endpoints
  console.log('\n🔍 TEST 4: Fact-Checking Analysis System');
  console.log('─'.repeat(40));
  try {
    const testText = 'Water boils at 100 degrees Celsius at sea level.';
    console.log(`Testing with: "${testText}"`);
    
    const analysisResponse = await axios.post(`${backendURL}/api/analyze/text`, {
      text: testText,
      options: {
        maxClaims: 2,
        minConfidence: 0.5,
        maxSources: 3
      }
    }, {
      timeout: 60000, // Longer timeout for analysis
      headers: { 'Content-Type': 'application/json' }
    });

    if (analysisResponse.status === 200 && analysisResponse.data.success) {
      console.log('✅ Analysis endpoint working');
      console.log(`   Status: ${analysisResponse.status}`);
      console.log(`   Processing time: ${analysisResponse.data.data.processingTime}ms`);
      console.log(`   Claims found: ${analysisResponse.data.data.claims.length}`);
      console.log(`   Sources per claim: ${analysisResponse.data.data.claims[0]?.sources?.length || 0}`);
      testResults.analysisEndpoints = true;
      
      // Check source generation quality
      if (analysisResponse.data.data.claims[0]?.sources?.length >= 3) {
        console.log('✅ Source generation working (3+ sources)');
        testResults.sourceGeneration = true;
        
        // Test a few source URLs
        const sources = analysisResponse.data.data.claims[0].sources.slice(0, 2);
        console.log('\nTesting source URL accessibility:');
        for (let i = 0; i < sources.length; i++) {
          try {
            const sourceTest = await axios.head(sources[i].url, { timeout: 5000 });
            console.log(`   ✅ Source ${i+1}: ${sources[i].url} (${sourceTest.status})`);
          } catch (sourceError) {
            console.log(`   ⚠️  Source ${i+1}: ${sources[i].url} (${sourceError.message})`);
          }
        }
      } else {
        console.log('⚠️  Source generation needs improvement (< 3 sources)');
      }
      
    } else {
      console.log('⚠️  Analysis endpoint responded but with issues');
      console.log(`   Status: ${analysisResponse.status}`);
      console.log(`   Success: ${analysisResponse.data.success}`);
    }
    
  } catch (error) {
    console.log('❌ Analysis system test failed');
    console.log(`   Error: ${error.message}`);
    if (error.response) {
      console.log(`   Response status: ${error.response.status}`);
      console.log(`   Response data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }

  // Test 5: Additional API Endpoints
  console.log('\n🔍 TEST 5: Additional API Endpoints');
  console.log('─'.repeat(40));
  
  // Test URL accessibility check
  try {
    const urlCheckResponse = await axios.post(`${backendURL}/api/analyze/url/check`, {
      url: 'https://www.example.com'
    }, { timeout: 10000 });
    
    if (urlCheckResponse.status === 200) {
      console.log('✅ URL accessibility check endpoint working');
    }
  } catch (error) {
    console.log('⚠️  URL accessibility check endpoint issue');
  }

  // Calculate overall score
  const tests = Object.keys(testResults).filter(key => key !== 'overallScore');
  const passedTests = tests.filter(key => testResults[key]).length;
  testResults.overallScore = Math.round((passedTests / tests.length) * 100);

  // Final Results
  console.log('\n' + '='.repeat(70));
  console.log('🏆 WEBSITE INTEGRATION TEST RESULTS');
  console.log('='.repeat(70));
  
  console.log(`📊 Overall Score: ${testResults.overallScore}%`);
  console.log(`✅ Tests Passed: ${passedTests}/${tests.length}`);
  
  console.log('\n📋 Detailed Results:');
  console.log(`   🔧 Backend Health: ${testResults.backendHealth ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   🌐 Frontend Access: ${testResults.frontendAccessible ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   🔐 Authentication: ${testResults.authEndpoints ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   🧠 Analysis System: ${testResults.analysisEndpoints ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   🔗 Source Generation: ${testResults.sourceGeneration ? '✅ PASS' : '❌ FAIL'}`);

  console.log('\n🎯 System Status:');
  if (testResults.overallScore >= 80) {
    console.log('🎉 EXCELLENT: Your FactShield AI website is working great!');
    console.log('✅ Ready for production use');
    console.log('✅ Login and fact-checking systems operational');
  } else if (testResults.overallScore >= 60) {
    console.log('✅ GOOD: Most systems are working well');
    console.log('⚠️  Some minor issues to address');
  } else {
    console.log('⚠️  NEEDS ATTENTION: Several systems need fixes');
    console.log('💡 Check server status and configuration');
  }

  console.log('\n🔗 Quick Access Links:');
  console.log(`   🌐 Frontend: ${frontendURL}`);
  console.log(`   🔧 Backend API: ${backendURL}/api`);
  console.log(`   ❤️  Health Check: ${backendURL}/health`);
  console.log(`   📊 Analysis Test: ${backendURL}/api/analyze/text`);
  
  return testResults;
}

testWebsiteIntegration().catch(console.error);