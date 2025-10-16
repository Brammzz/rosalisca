#!/bin/bash

# Quick API Test Script untuk Production
API_BASE="https://rosalisca-backend.vercel.app/api"

echo "🧪 Testing Rosalisca API endpoints..."
echo "🌐 Base URL: $API_BASE"
echo ""

# Test basic API health
echo "1. Testing API health..."
curl -s -o /dev/null -w "Status: %{http_code}\n" "$API_BASE"
echo ""

# Test public endpoints
echo "2. Testing public projects endpoint..."
curl -s -o /dev/null -w "Status: %{http_code}\n" "$API_BASE/projects"
echo ""

echo "3. Testing public clients endpoint..."
curl -s -o /dev/null -w "Status: %{http_code}\n" "$API_BASE/clients"
echo ""

echo "4. Testing public companies endpoint..."
curl -s -o /dev/null -w "Status: %{http_code}\n" "$API_BASE/companies"
echo ""

echo "5. Testing public certificates endpoint..."
curl -s -o /dev/null -w "Status: %{http_code}\n" "$API_BASE/certificates"
echo ""

echo "6. Testing careers endpoint..."
curl -s -o /dev/null -w "Status: %{http_code}\n" "$API_BASE/careers/public/careers"
echo ""

echo "✅ API test complete!"
echo ""
echo "📝 Expected responses:"
echo "- 200: OK - Endpoint working"
echo "- 404: Not Found - Check endpoint URL"
echo "- 500: Server Error - Check backend logs"
echo ""
echo "🔍 To test in browser:"
echo "- Projects: $API_BASE/projects"
echo "- Clients: $API_BASE/clients"
echo "- Companies: $API_BASE/companies"
