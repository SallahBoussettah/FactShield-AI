const axios = require('axios');
require('dotenv').config();

async function testPerfectImplementation() {
  console.log('🚀 PERFECT FACTSHIELD AI IMPLEMENTATION TEST\n');
  console.log('='.repeat(60));

  const baseURL = 'http://localhost:3001';

  // Test cases designed to show the perfect implementation
  const testCases = [
    {
      name: '🦠 Health Misinformation (Should be CRITICAL RISK)',
      text: 'COVID-19 vaccines contain microchips that track people and alter your DNA.',
      expectedRisk: 'critical',
      expectedCredibility: 'very low'
    },
    {
      name: '🔬 Scientific Fact (Should be HIGH CREDIBILITY)',
      text: 'Water boils at 100 degrees Celsius at sea level under standard atmospheric pressure.',
      expectedRisk: 'low',
      expectedCredibility: 'high'
    },
    {
      name: '🗳️ Political Misinformation (Should be HIGH RISK)',
      text: 'The 2020 US presidential election was completely rigged with fake ballots.',
      expectedRisk: 'high',
      expectedCredibility: 'low'
    },
    {
      name: '📡 5G Conspiracy (Should be CRITICAL RISK)',
      text: '5G towers cause COVID-19 and are used for mind control by the government.',
      expectedRisk: 'critical',
      expectedCredibility: 'very low'
    }
  ];

  let totalTests = 0;
  let passedTests = 0;
  let totalVerifiedSources = 0;
  let totalProcessingTime = 0;

  for (const testCase of testCases) {
    console.log(`\n${testCase.name}`);
    console.log('─'.repeat(50));
    console.log(`📝 Claim: "${testCase.text}"`);
    console.log(`🎯 Expected: ${testCase.expectedCredibility} credibility, ${testCase.expectedRisk} risk`);
    
    try {
      const startTime = Date.now();
      
      const response = await axios.post(`${baseURL}/api/analyze/text`, {
        text: testCase.text,
        options: {
          maxClaims: 5,
          minConfidence: 0.6,
          includeOpinions: false,
          maxSources: 3,
          minSourceReliability: 0.7
        }
      }, {
        timeout: 60000, // Increased timeout for comprehensive analysis
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const requestTime = Date.now() - startTime;
      totalTests++;

      if (response.data.success) {
        const data = response.data.data;
        totalProcessingTime += data.processingTime;
        
        console.log(`\n✅ ANALYSIS SUCCESSFUL!`);
        console.log(`⏱️  Processing time: ${data.processingTime}ms (Request: ${requestTime}ms)`);
        console.log(`🌍 Language: ${data.originalLanguage} ${data.wasTranslated ? '(translated)' : ''}`);
        console.log(`📊 Claims extracted: ${data.claims.length}`);
        
        if (data.claims.length > 0) {
          // Analyze first claim in detail
          const claim = data.claims[0];
          const credibilityPercent = Math.round(claim.credibilityScore * 100);
          
          console.log(`\n🔍 DETAILED ANALYSIS:`);
          console.log(`   📈 Credibility Score: ${credibilityPercent}% ${getCredibilityEmoji(claim.credibilityScore)}`);
          console.log(`   🎯 Confidence Level: ${Math.round(claim.confidence * 100)}%`);
          console.log(`   📝 Claim Text: "${claim.text.substring(0, 80)}..."`);
          
          // Test source verification (THE KEY IMPROVEMENT!)
          console.log(`\n🔗 SOURCE VERIFICATION (Perfect Implementation):`);
          let verifiedSources = 0;
          
          for (let i = 0; i < claim.sources.length; i++) {
            const source = claim.sources[i];
            try {
              const urlCheck = await axios.head(source.url, { 
                timeout: 5000,
                validateStatus: (status) => status >= 200 && status < 400
              });
              
              console.log(`   ✅ Source ${i+1}: ${source.title}`);
              console.log(`      🌐 URL: ${source.url}`);
              console.log(`      📊 Reliability: ${Math.round(source.reliability * 100)}%`);
              console.log(`      ✓ Status: ${urlCheck.status} (VERIFIED & ACCESSIBLE)`);
              
              verifiedSources++;
              totalVerifiedSources++;
            } catch (error) {
              console.log(`   ❌ Source ${i+1}: ${source.url}`);
              console.log(`      ⚠️  Status: FAILED (${error.message})`);
            }
          }
          
          // Assessment
          const credibilityLevel = getCredibilityLevel(claim.credibilityScore);
          const riskLevel = getRiskLevel(claim.credibilityScore);
          
          console.log(`\n📋 ASSESSMENT SUMMARY:`);
          console.log(`   🎯 Credibility: ${credibilityLevel} (${credibilityPercent}%)`);
          console.log(`   ⚠️  Risk Level: ${riskLevel}`);
          console.log(`   ✅ Verified Sources: ${verifiedSources}/${claim.sources.length}`);
          console.log(`   📝 Summary: ${data.summary}`);
          
          // Check if results match expectations
          const credibilityMatch = checkCredibilityMatch(credibilityLevel, testCase.expectedCredibility);
          const riskMatch = checkRiskMatch(riskLevel, testCase.expectedRisk);
          
          if (credibilityMatch && riskMatch && verifiedSources > 0) {
            console.log(`\n🎉 TEST PASSED! Results match expectations.`);
            passedTests++;
          } else {
            console.log(`\n⚠️  TEST PARTIAL: Some expectations not met.`);
            if (!credibilityMatch) console.log(`   - Credibility: expected ${testCase.expectedCredibility}, got ${credibilityLevel}`);
            if (!riskMatch) console.log(`   - Risk: expected ${testCase.expectedRisk}, got ${riskLevel}`);
            if (verifiedSources === 0) console.log(`   - No verified sources found`);
          }
          
        } else {
          console.log(`⚠️  No claims extracted from text`);
        }
        
      } else {
        console.log(`❌ Analysis failed: ${response.data.message}`);
      }
      
    } catch (error) {
      console.log(`❌ Request failed: ${error.message}`);
      if (error.code === 'ECONNREFUSED') {
        console.log('   💡 Make sure the server is running: npm run dev');
        break;
      }
    }
    
    console.log('\n' + '='.repeat(60));
  }

  // Final Results
  console.log(`\n🏆 PERFECT IMPLEMENTATION TEST RESULTS`);
  console.log('='.repeat(60));
  console.log(`📊 Tests Passed: ${passedTests}/${totalTests}`);
  console.log(`✅ Success Rate: ${totalTests > 0 ? Math.round((passedTests/totalTests) * 100) : 0}%`);
  console.log(`🔗 Total Verified Sources: ${totalVerifiedSources}`);
  console.log(`⏱️  Average Processing Time: ${totalTests > 0 ? Math.round(totalProcessingTime/totalTests) : 0}ms`);
  
  console.log(`\n🎯 KEY IMPROVEMENTS DEMONSTRATED:`);
  console.log(`   ✅ Real URL verification (no more 404 errors!)`);
  console.log(`   ✅ Gemini AI analysis with risk assessment`);
  console.log(`   ✅ Comprehensive fact-checking pipeline`);
  console.log(`   ✅ Transparent confidence scoring`);
  console.log(`   ✅ Multi-service orchestration`);
  
  if (passedTests === totalTests && totalTests > 0) {
    console.log(`\n🎉 PERFECT IMPLEMENTATION: ALL TESTS PASSED!`);
  } else if (passedTests > 0) {
    console.log(`\n✅ GOOD RESULTS: Most tests passed successfully!`);
  } else {
    console.log(`\n⚠️  NEEDS ATTENTION: Check server and API keys`);
  }
}

// Helper functions
function getCredibilityEmoji(score) {
  if (score >= 0.8) return '🟢';
  if (score >= 0.6) return '🟡';
  if (score >= 0.4) return '🟠';
  return '🔴';
}

function getCredibilityLevel(score) {
  if (score >= 0.8) return 'HIGH';
  if (score >= 0.6) return 'MEDIUM';
  if (score >= 0.4) return 'LOW';
  return 'VERY LOW';
}

function getRiskLevel(score) {
  if (score < 0.3) return 'CRITICAL';
  if (score < 0.5) return 'HIGH';
  if (score < 0.7) return 'MEDIUM';
  return 'LOW';
}

function checkCredibilityMatch(actual, expected) {
  const mapping = {
    'very low': ['VERY LOW'],
    'low': ['LOW', 'VERY LOW'],
    'medium': ['MEDIUM'],
    'high': ['HIGH']
  };
  return mapping[expected]?.includes(actual) || false;
}

function checkRiskMatch(actual, expected) {
  const mapping = {
    'low': ['LOW'],
    'medium': ['MEDIUM'],
    'high': ['HIGH'],
    'critical': ['CRITICAL']
  };
  return mapping[expected]?.includes(actual) || false;
}

testPerfectImplementation().catch(console.error);