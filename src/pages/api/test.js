export async function GET() {
  return new Response(JSON.stringify({ 
    message: 'API is working!',
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
} 