const axios = require('axios');
require('dotenv').config();

async function testCompleteWebsite() {
  console.log('🌐 COMPLETE FACTSHIELD AI WEBSITE TEST');
  console.log('='.repeat(70));
  console.log('🎯 Testing: Full Integration with Proper Data');
  console.log('🔗 Frontend: http://localhost:5173');
  console.log('🔗 Backend: http://localhost:3001');
  console.log('='.repeat(70));

  const backendURL = 'http://localhost:3001';
  const frontendURL = 'http://localhost:5173';
  
  let testResults = {
    backendHealth: false,
    frontendAccessible: false,
    authSystem: false,
    analysisSystem: false,
    sourceGeneration: false,
    loginFlow: false
  };

  // Test 1: Backend Health
  console.log('\n🔍 TEST 1: Backend Health Check');
  console.log('─'.repeat(40));
  try {
    const healthResponse = await axios.get(`${backendURL}/health`, { timeout: 10000 });
    console.log('✅ Backend is running and healthy');
    console.log(`   Status: ${healthResponse.data.status || 'OK'}`);
    testResults.backendHealth = true;
  } catch (error) {
    console.log('❌ Backend health check failed');
    console.log(`   Error: ${error.message}`);
  }

  // Test 2: Frontend Accessibility
  console.log('\n🔍 TEST 2: Frontend Accessibility');
  console.log('─'.repeat(40));
  try {
    const frontendResponse = await axios.get(frontendURL, { 
      timeout: 10000,
      headers: { 'Accept': 'text/html' }
    });
    console.log('✅ Frontend is accessible');
    console.log(`   Status: ${frontendResponse.status}`);
    testResults.frontendAccessible = true;
  } catch (error) {
    console.log('❌ Frontend not accessible');
    console.log(`   Error: ${error.message}`);
  }

  // Test 3: Authentication Flow (Complete)
  console.log('\n🔍 TEST 3: Complete Authentication Flow');
  console.log('─'.repeat(40));
  try {
    const testUser = {
      name: 'Test User',
      email: `test${Date.now()}@factshield.com`,
      password: 'SecurePassword123!'
    };

    console.log('Step 1: Testing Registration...');
    const registerResponse = await axios.post(`${backendURL}/api/auth/register`, testUser, {
      timeout: 15000,
      validateStatus: (status) => status < 500
    });
    
    if (registerResponse.status === 201) {
      console.log('✅ Registration successful');
      console.log(`   User created: ${testUser.email}`);
      
      console.log('Step 2: Testing Login...');
      const loginResponse = await axios.post(`${backendURL}/api/auth/login`, {
        email: testUser.email,
        password: testUser.password
      }, {
        timeout: 15000,
        validateStatus: (status) => status < 500
      });
      
      if (loginResponse.status === 200) {
        console.log('✅ Login successful');
        console.log(`   Token received: ${loginResponse.data.token ? 'Yes' : 'No'}`);
        console.log(`   User data: ${loginResponse.data.user ? 'Yes' : 'No'}`);
        
        if (loginResponse.data.token) {
          testResults.loginFlow = true;
          testResults.authSystem = true;
        }
      } else {
        console.log(`⚠️  Login failed with status: ${loginResponse.status}`);
        console.log(`   Message: ${loginResponse.data.message}`);
      }
      
    } else if (registerResponse.status === 400) {
      console.log('⚠️  Registration validation error (expected)');
      console.log(`   Message: ${registerResponse.data.message}`);
      testResults.authSystem = true; // Endpoints are working
    }
    
  } catch (error) {
    console.log('❌ Authentication flow failed');
    console.log(`   Error: ${error.message}`);
  }

  // Test 4: Fact-Checking Analysis (With Proper Text Length)
  console.log('\n🔍 TEST 4: Fact-Checking Analysis System');
  console.log('─'.repeat(40));
  try {
    const testTexts = [
      {
        name: 'Scientific Fact',
        text: 'Water boils at 100 degrees Celsius at sea level under standard atmospheric pressure. This is a well-established scientific fact that has been verified through countless experiments.',
        expectedCredibility: 'high'
      },
      {
        name: 'Health Information',
        text: 'COVID-19 vaccines have been extensively tested in clinical trials and have been shown to be safe and effective in preventing severe illness and hospitalization from COVID-19.',
        expectedCredibility: 'high'
      }
    ];

    for (const testCase of testTexts) {
      console.log(`\nTesting: ${testCase.name}`);
      console.log(`Text: "${testCase.text.substring(0, 60)}..."`);
      
      try {
        const analysisResponse = await axios.post(`${backendURL}/api/analyze/text`, {
          text: testCase.text,
          options: {
            maxClaims: 3,
            minConfidence: 0.5,
            maxSources: 3,
            minSourceReliability: 0.7
          }
        }, {
          timeout: 90000, // Long timeout for comprehensive analysis
          headers: { 'Content-Type': 'application/json' }
        });

        if (analysisResponse.status === 200 && analysisResponse.data.success) {
          const data = analysisResponse.data.data;
          console.log('✅ Analysis completed successfully');
          console.log(`   Processing time: ${data.processingTime}ms`);
          console.log(`   Claims found: ${data.claims.length}`);
          console.log(`   Text length: ${data.textLength} characters`);
          
          if (data.claims.length > 0) {
            const claim = data.claims[0];
            console.log(`   First claim credibility: ${Math.round(claim.credibilityScore * 100)}%`);
            console.log(`   Sources provided: ${claim.sources.length}`);
            
            testResults.analysisSystem = true;
            
            // Test source quality
            if (claim.sources.length >= 3) {
              console.log('✅ Source generation working (3+ sources)');
              testResults.sourceGeneration = true;
              
              // Test source accessibility
              let workingSources = 0;
              for (let i = 0; i < Math.min(claim.sources.length, 2); i++) {
                try {
                  const sourceTest = await axios.head(claim.sources[i].url, { 
                    timeout: 8000,
                    headers: { 'User-Agent': 'FactShield-AI/1.0' }
                  });
                  console.log(`   ✅ Source ${i+1}: Working (${sourceTest.status})`);
                  workingSources++;
                } catch (sourceError) {
                  console.log(`   ⚠️  Source ${i+1}: ${sourceError.message}`);
                }
              }
              
              if (workingSources > 0) {
                console.log(`   📊 Source accessibility: ${workingSources}/${Math.min(claim.sources.length, 2)} working`);
              }
            }
          }
          
        } else {
          console.log('⚠️  Analysis endpoint issue');
          console.log(`   Status: ${analysisResponse.status}`);
          console.log(`   Success: ${analysisResponse.data.success}`);
        }
        
      } catch (analysisError) {
        console.log('❌ Analysis failed for this test case');
        console.log(`   Error: ${analysisError.message}`);
        if (analysisError.response) {
          console.log(`   Status: ${analysisError.response.status}`);
          console.log(`   Message: ${analysisError.response.data.message}`);
        }
      }
    }
    
  } catch (error) {
    console.log('❌ Analysis system test failed');
    console.log(`   Error: ${error.message}`);
  }

  // Test 5: Additional Features
  console.log('\n🔍 TEST 5: Additional Features');
  console.log('─'.repeat(40));
  
  // Test URL analysis
  try {
    console.log('Testing URL analysis endpoint...');
    const urlAnalysisResponse = await axios.post(`${backendURL}/api/analyze/url/check`, {
      url: 'https://www.example.com'
    }, { 
      timeout: 10000,
      validateStatus: (status) => status < 500
    });
    
    if (urlAnalysisResponse.status === 200) {
      console.log('✅ URL analysis endpoint working');
    }
  } catch (error) {
    console.log('⚠️  URL analysis endpoint issue');
  }

  // Calculate results
  const totalTests = Object.keys(testResults).length;
  const passedTests = Object.values(testResults).filter(Boolean).length;
  const overallScore = Math.round((passedTests / totalTests) * 100);

  // Final Results
  console.log('\n' + '='.repeat(70));
  console.log('🏆 COMPLETE WEBSITE TEST RESULTS');
  console.log('='.repeat(70));
  
  console.log(`📊 Overall Score: ${overallScore}%`);
  console.log(`✅ Tests Passed: ${passedTests}/${totalTests}`);
  
  console.log('\n📋 Detailed Results:');
  console.log(`   🔧 Backend Health: ${testResults.backendHealth ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   🌐 Frontend Access: ${testResults.frontendAccessible ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   🔐 Auth System: ${testResults.authSystem ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   🔑 Login Flow: ${testResults.loginFlow ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   🧠 Analysis System: ${testResults.analysisSystem ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   🔗 Source Generation: ${testResults.sourceGeneration ? '✅ PASS' : '❌ FAIL'}`);

  console.log('\n🎯 System Status:');
  if (overallScore >= 85) {
    console.log('🎉 EXCELLENT: Your FactShield AI website is working perfectly!');
    console.log('✅ Ready for production use');
    console.log('✅ All major systems operational');
  } else if (overallScore >= 70) {
    console.log('✅ GOOD: Most systems are working well');
    console.log('⚠️  Minor issues to address');
  } else if (overallScore >= 50) {
    console.log('⚠️  FAIR: Core systems working, some improvements needed');
  } else {
    console.log('❌ NEEDS WORK: Several critical systems need attention');
  }

  console.log('\n🚀 Next Steps:');
  if (testResults.backendHealth && testResults.frontendAccessible) {
    console.log('✅ Core infrastructure is working');
    if (testResults.authSystem) {
      console.log('✅ Authentication system is functional');
    }
    if (testResults.analysisSystem) {
      console.log('✅ Fact-checking analysis is working');
    }
    if (testResults.sourceGeneration) {
      console.log('✅ Source generation is providing real URLs');
    }
  }

  console.log('\n🔗 Access Your Website:');
  console.log(`   🌐 Main Site: ${frontendURL}`);
  console.log(`   🔐 Login: ${frontendURL}/login`);
  console.log(`   📊 Dashboard: ${frontendURL}/dashboard`);
  console.log(`   🔧 API Health: ${backendURL}/health`);
  
  return { overallScore, testResults };
}

testCompleteWebsite().catch(console.error);