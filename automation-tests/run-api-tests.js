import newman from 'newman';

const API_HOST = process.env.API_HOST || 'http://localhost:5000';
const COLLECTION_URL = `${API_HOST}/api/v1/postman/collection.json`;

console.log(`🚀 Starting Postman API Automated Tests via Newman CLI...`);
console.log(`📥 Loading collection from: ${COLLECTION_URL}`);

newman.run({
  collection: COLLECTION_URL,
  reporters: ['cli'],
  bail: false
}, function (err, summary) {
  if (err) {
    console.error('❌ Error executing Newman tests:', err);
    process.exit(1);
  }

  if (summary.run.failures && summary.run.failures.length > 0) {
    console.error(`💥 ${summary.run.failures.length} API test assertions failed!`);
    process.exit(1);
  } else {
    console.log(`✅ All API Postman tests passed successfully! (${summary.run.stats.assertions.total} assertions)`);
    process.exit(0);
  }
});
