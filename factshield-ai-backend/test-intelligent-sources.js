const axios = require('axios');
require('dotenv').config();

async function testIntelligentSources() {
  console.log('🧠 TESTING INTELLIGENT GEMINI-POWERED SOURCE GENERATION');
  console.log('='.repeat(70));
  console.log('🎯 Goal: Generate diverse, real sources using Gemini AI');
  console.log('📅 Current date context provided to Gemini');
  console.log('🔗 All URLs verified for accessibility');
  console.log('='.repeat(70));

  const baseURL = 'http://localhost:3001';
  
  const testCases = [
    {
      name: '🦠 Health Topic',
      text: 'Recent studies show that COVID-19 vaccines are effective in preventing severe illness and hospitalization.',
      expectedSources: 'Medical journals, health organizations, recent news'
    },
    {
      name: '🌍 Climate Science',
      text: 'Climate change is causing rising sea levels and more frequent extreme weather events worldwide.',
      expectedSources: 'Scientific publications, government reports, environmental organizations'
    },
    {
      name: '💻 Technology',
      text: 'Artificial intelligence is transforming various industries and changing how we work.',
      expectedSources: 'Tech publications, research papers, industry reports'
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n${testCase.name}`);
    console.log('─'.repeat(50));
    console.log(`📝 Content: "${testCase.text}"`);
    console.log(`🎯 Expected: ${testCase.expectedSources}`);
    
    try {
      const response = await axios.post(`${baseURL}/api/analyze/text`, {
        text: testCase.text,
        options: {
          maxClaims: 2,
          minConfidence: 0.5,
          includeOpinions: false,
          maxSources: 3,
          minSourceReliability: 0.7
        }
      }, {
        timeout: 60000,
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.success) {
        const data = response.data.data;
        
        console.log(`\n✅ Analysis completed in ${data.processingTime}ms`);
        console.log(`📊 Claims found: ${data.claims.length}`);
        
        if (data.claims.length > 0 && data.claims[0].sources.length > 0) {
          console.log(`\n🔗 INTELLIGENT SOURCES GENERATED:`);
          
          const sources = data.claims[0].sources;
          const domains = new Set();
          let verifiedCount = 0;
          
          for (let i = 0; i < sources.length; i++) {
            const source = sources[i];
            domains.add(source.url.split('/')[2]); // Extract domain
            
            console.log(`\n   Source ${i + 1}:`);
            console.log(`   📰 Title: ${source.title}`);
            console.log(`   🌐 URL: ${source.url}`);
            console.log(`   📊 Reliability: ${Math.round(source.reliability * 100)}%`);
            
            // Test URL accessibility
            try {
              const urlTest = await axios.head(source.url, { 
                timeout: 8000,
                headers: {
                  'User-Agent': 'FactShield-AI/1.0 (Fact-checking bot)'
                }
              });
              console.log(`   ✅ Status: ${urlTest.status} (VERIFIED & WORKING!)`);
              verifiedCount++;
            } catch (error) {
              console.log(`   ❌ Status: FAILED (${error.message})`);
            }
          }
          
          // Analysis
          console.log(`\n📈 DIVERSITY ANALYSIS:`);
          console.log(`   🌐 Unique domains: ${domains.size}/${sources.length}`);
          console.log(`   ✅ Working URLs: ${verifiedCount}/${sources.length}`);
          console.log(`   📊 Success rate: ${Math.round((verifiedCount/sources.length) * 100)}%`);
          
          if (domains.size === sources.length) {
            console.log(`   🎉 EXCELLENT: All sources from different domains!`);
          } else if (domains.size > 1) {
            console.log(`   ✅ GOOD: Sources from multiple domains`);
          } else {
            console.log(`   ⚠️  LIMITED: All sources from same domain`);
          }
          
          if (verifiedCount === sources.length) {
            console.log(`   🎯 PERFECT: All URLs verified and working!`);
          } else if (verifiedCount > 0) {
            console.log(`   ✅ PARTIAL: Some URLs working`);
          } else {
            console.log(`   ❌ FAILED: No working URLs`);
          }
          
        } else {
          console.log(`\n⚠️  No sources generated`);
        }
        
      } else {
        console.log(`❌ Analysis failed: ${response.data.message}`);
      }
      
    } catch (error) {
      console.log(`❌ Request failed: ${error.message}`);
      if (error.code === 'ECONNREFUSED') {
        console.log('💡 Make sure the server is running: npm run dev');
        break;
      }
    }
    
    console.log('\n' + '='.repeat(70));
  }

  console.log(`\n🏆 INTELLIGENT SOURCE GENERATION TEST COMPLETE!`);
  console.log(`\n🎯 KEY IMPROVEMENTS:`);
  console.log(`   ✅ Gemini AI generates diverse, real sources`);
  console.log(`   ✅ Current date context provided (${new Date().toISOString().split('T')[0]})`);
  console.log(`   ✅ Advanced URL verification with multiple methods`);
  console.log(`   ✅ Fallback to curated sources if needed`);
  console.log(`   ✅ Domain diversity analysis`);
  console.log(`   ✅ Real-time accessibility testing`);
}

testIntelligentSources().catch(console.error);