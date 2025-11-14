#!/usr/bin/env python3
"""
INOVIX Customer Portal Backend API Test Suite
Tests all backend endpoints with comprehensive scenarios
"""

import requests
import json
import base64
from datetime import datetime
import sys
import os

# Backend URL from environment
BACKEND_URL = os.getenv("BACKEND_URL", "https://expo-inovix.preview.emergentagent.com/api")

class BackendTester:
    def __init__(self):
        self.test_results = []
        self.failed_tests = []
        
    def log_test(self, test_name, success, message="", response_data=None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "response_data": response_data
        }
        self.test_results.append(result)
        
        if not success:
            self.failed_tests.append(result)
            
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if message:
            print(f"   {message}")
        if response_data and not success:
            print(f"   Response: {response_data}")
        print()

    def test_health_check(self):
        """Test GET /api/health endpoint"""
        try:
            response = requests.get(f"{BACKEND_URL}/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "ok":
                    self.log_test("Health Check", True, "API is running correctly")
                    return True
                else:
                    self.log_test("Health Check", False, f"Unexpected response format: {data}")
                    return False
            else:
                self.log_test("Health Check", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Health Check", False, f"Connection error: {str(e)}")
            return False

    def test_submit_rating_full(self):
        """Test POST /api/ratings with all fields"""
        try:
            # Create sample base64 image (small PNG)
            sample_image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
            
            rating_data = {
                "stars": 5,
                "comment": "Excellent service! Very satisfied with the quality and professionalism.",
                "company": "INOVIX Solutions Ltd",
                "photo": sample_image
            }
            
            response = requests.post(
                f"{BACKEND_URL}/ratings",
                json=rating_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("id"):
                    self.log_test("Submit Rating (Full)", True, f"Rating submitted with ID: {data['id']}")
                    return True
                else:
                    self.log_test("Submit Rating (Full)", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_test("Submit Rating (Full)", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Submit Rating (Full)", False, f"Connection error: {str(e)}")
            return False

    def test_submit_rating_minimal(self):
        """Test POST /api/ratings with only required fields"""
        try:
            rating_data = {
                "stars": 3
            }
            
            response = requests.post(
                f"{BACKEND_URL}/ratings",
                json=rating_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("id"):
                    self.log_test("Submit Rating (Minimal)", True, f"Rating submitted with ID: {data['id']}")
                    return True
                else:
                    self.log_test("Submit Rating (Minimal)", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_test("Submit Rating (Minimal)", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Submit Rating (Minimal)", False, f"Connection error: {str(e)}")
            return False

    def test_submit_rating_invalid_stars(self):
        """Test POST /api/ratings with invalid stars (should fail)"""
        try:
            # Test with stars = 0 (invalid)
            rating_data = {
                "stars": 0,
                "comment": "This should fail"
            }
            
            response = requests.post(
                f"{BACKEND_URL}/ratings",
                json=rating_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 400:
                self.log_test("Submit Rating (Invalid Stars)", True, "Correctly rejected invalid stars value")
                return True
            else:
                self.log_test("Submit Rating (Invalid Stars)", False, f"Expected 400 error, got {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Submit Rating (Invalid Stars)", False, f"Connection error: {str(e)}")
            return False

    def test_get_ratings(self):
        """Test GET /api/ratings endpoint"""
        try:
            response = requests.get(f"{BACKEND_URL}/ratings", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Get All Ratings", True, f"Retrieved {len(data)} ratings")
                    
                    # Validate structure if ratings exist
                    if data:
                        first_rating = data[0]
                        required_fields = ["id", "stars", "comment", "company", "photo", "timestamp"]
                        missing_fields = [field for field in required_fields if field not in first_rating]
                        
                        if missing_fields:
                            self.log_test("Get All Ratings - Structure", False, f"Missing fields: {missing_fields}")
                            return False
                        else:
                            self.log_test("Get All Ratings - Structure", True, "Rating structure is correct")
                    
                    return True
                else:
                    self.log_test("Get All Ratings", False, f"Expected list, got: {type(data)}")
                    return False
            else:
                self.log_test("Get All Ratings", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Get All Ratings", False, f"Connection error: {str(e)}")
            return False

    def test_get_rating_stats(self):
        """Test GET /api/ratings/stats endpoint"""
        try:
            response = requests.get(f"{BACKEND_URL}/ratings/stats", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["total_ratings", "average_stars", "star_distribution"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test("Get Rating Stats", False, f"Missing fields: {missing_fields}")
                    return False
                
                # Validate star_distribution structure
                star_dist = data.get("star_distribution", {})
                expected_keys = ["1", "2", "3", "4", "5"]
                missing_star_keys = [key for key in expected_keys if key not in star_dist]
                
                if missing_star_keys:
                    self.log_test("Get Rating Stats", False, f"Missing star distribution keys: {missing_star_keys}")
                    return False
                
                self.log_test("Get Rating Stats", True, f"Stats: {data['total_ratings']} ratings, avg: {data['average_stars']}")
                return True
            else:
                self.log_test("Get Rating Stats", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Get Rating Stats", False, f"Connection error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all backend tests"""
        print("=" * 60)
        print("INOVIX Customer Portal Backend API Tests")
        print("=" * 60)
        print(f"Testing backend at: {BACKEND_URL}")
        print()
        
        # Run tests in order
        tests = [
            self.test_health_check,
            self.test_submit_rating_full,
            self.test_submit_rating_minimal,
            self.test_submit_rating_invalid_stars,
            self.test_get_ratings,
            self.test_get_rating_stats
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            if test():
                passed += 1
        
        print("=" * 60)
        print(f"TEST SUMMARY: {passed}/{total} tests passed")
        print("=" * 60)
        
        if self.failed_tests:
            print("\nFAILED TESTS:")
            for failure in self.failed_tests:
                print(f"❌ {failure['test']}: {failure['message']}")
        
        return passed == total

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)