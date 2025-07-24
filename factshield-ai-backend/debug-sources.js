// Debug script to test source generation directly
const { sourceGenerationService } = require('./dist/services/sourceGenerationService');
const { geminiService } = require('./dist/services/geminiService');
require('dotenv').config();

async function debugSourceGeneration() {
  console.log('🔍 DEBUGGING SOURCE GENERATION\n');

  const testText = 'COVID-19 vaccines are safe and effective according to medical research.';
  
  console.log(`📝 Test text: "${testText}"`);
  console.log(`🔑 Gemini available: ${geminiService.isAvailable()}`);
  console.log(`🔑 News API key: ${process.env.NEWS_API_KEY ? 'configured' : 'missing'}`);
  
  try {
    console.log('\n🚀 Starting source generation...');
    
    const sources = await sourceGenerationService.generateSources(testText, {
      maxSources: 3,
      minReliability: 0.7
    });
    
    console.log(`\n✅ Source generation completed!`);
    console.log(`📊 Sources found: ${sources.length}`);
    
    if (sources.length > 0) {
      sources.forEach((source, index) => {
        console.log(`\n🔗 Source ${index + 1}:`);
        console.log(`   Title: ${source.title}`);
        console.log(`   URL: ${source.url}`);
        console.log(`   Domain: ${source.domain}`);
        console.log(`   Reliability: ${Math.round(source.reliability * 100)}%`);
        console.log(`   Type: ${source.sourceType}`);
        console.log(`   Verification: ${source.verificationStatus}`);
        console.log(`   Relevance: ${Math.round(source.relevanceScore * 100)}%`);
      });
    } else {
      console.log('❌ No sources generated');
    }
    
  } catch (error) {
    console.error('❌ Source generation failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

debugSourceGeneration().catch(console.error);