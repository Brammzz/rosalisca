#!/bin/bash

# Quick API Test Script untuk Production
API_BASE="https://rosalisca-backend.vercel.app"

echo "🧪 Testing Rosalisca API endpoints..."
echo "🌐 Base URL: $API_BASE"
echo ""

# Test basic API health
echo "1. Testing API health..."
echo "URL: $API_BASE/"
curl -s "$API_BASE/" | head -3
echo ""
echo ""

# Test API base route
echo "2. Testing API base route..."
echo "URL: $API_BASE/api"
curl -s "$API_BASE/api" | head -3
echo ""
echo ""

# Test public endpoints
echo "3. Testing public projects endpoint..."
echo "URL: $API_BASE/api/projects"
curl -s -o /dev/null -w "Status: %{http_code}\n" "$API_BASE/api/projects"
echo ""

echo "4. Testing public clients endpoint..."
echo "URL: $API_BASE/api/clients"
curl -s -o /dev/null -w "Status: %{http_code}\n" "$API_BASE/api/clients"
echo ""

echo "5. Testing public companies endpoint..."
echo "URL: $API_BASE/api/companies"
curl -s -o /dev/null -w "Status: %{http_code}\n" "$API_BASE/api/companies"
echo ""

echo "6. Testing public certificates endpoint..."
echo "URL: $API_BASE/api/certificates"
curl -s -o /dev/null -w "Status: %{http_code}\n" "$API_BASE/api/certificates"
echo ""

echo "7. Testing careers endpoint..."
echo "URL: $API_BASE/api/careers/public/careers"
curl -s -o /dev/null -w "Status: %{http_code}\n" "$API_BASE/api/careers/public/careers"
echo ""

echo "✅ API test complete!"
echo ""
echo "📝 Expected responses:"
echo "- 200: OK - Endpoint working"
echo "- 404: Not Found - Check endpoint URL"
echo "- 500: Server Error - Check backend logs"
echo ""
echo "🔍 Test manually in browser:"
echo "- Root: $API_BASE/"
echo "- Projects: $API_BASE/api/projects"
echo "- Clients: $API_BASE/api/clients"
