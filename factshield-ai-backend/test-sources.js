const axios = require('axios');
require('dotenv').config();

async function testSourceGeneration() {
  console.log('🔗 TESTING SOURCE GENERATION DIRECTLY\n');

  const baseURL = 'http://localhost:3001';
  
  // Test with a simple claim
  const testText = 'COVID-19 vaccines are safe and effective according to medical research.';
  
  console.log(`📝 Testing with: "${testText}"`);
  console.log('─'.repeat(60));

  try {
    const response = await axios.post(`${baseURL}/api/analyze/text`, {
      text: testText,
      options: {
        maxClaims: 3,
        minConfidence: 0.5,
        includeOpinions: false,
        maxSources: 3,
        minSourceReliability: 0.7
      }
    }, {
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      const data = response.data.data;
      
      console.log(`✅ Analysis completed in ${data.processingTime}ms`);
      console.log(`📊 Claims found: ${data.claims.length}`);
      console.log(`📝 Summary: ${data.summary}`);
      
      if (data.claims.length > 0) {
        data.claims.forEach((claim, index) => {
          console.log(`\n🔍 Claim ${index + 1}:`);
          console.log(`   Text: "${claim.text}"`);
          console.log(`   Credibility: ${Math.round(claim.credibilityScore * 100)}%`);
          console.log(`   Confidence: ${Math.round(claim.confidence * 100)}%`);
          console.log(`   Sources: ${claim.sources.length}`);
          
          claim.sources.forEach((source, sourceIndex) => {
            console.log(`   Source ${sourceIndex + 1}:`);
            console.log(`     Title: ${source.title}`);
            console.log(`     URL: ${source.url}`);
            console.log(`     Reliability: ${Math.round(source.reliability * 100)}%`);
          });
        });
      }
      
    } else {
      console.log(`❌ Analysis failed: ${response.data.message}`);
    }
    
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
}

testSourceGeneration().catch(console.error);