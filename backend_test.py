#!/usr/bin/env python3
"""
Backend API Testing for INOVIX Customer Portal - Admin Panel Deletion Endpoints
Tests all deletion endpoints as requested by user for admin panel functionality.
"""

import requests
import json
import time
from datetime import datetime

# Get backend URL from environment
BACKEND_URL = "https://customer-hub-63.preview.emergentagent.com/api"

def log_test(test_name, status, details=""):
    """Log test results with timestamp"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    status_symbol = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
    print(f"[{timestamp}] {status_symbol} {test_name}")
    if details:
        print(f"    {details}")
    print()

def test_health_check():
    """Test if backend is running"""
    try:
        response = requests.get(f"{BACKEND_URL}/health", timeout=10)
        if response.status_code == 200:
            log_test("Health Check", "PASS", f"Backend is running: {response.json()}")
            return True
        else:
            log_test("Health Check", "FAIL", f"Status: {response.status_code}")
            return False
    except Exception as e:
        log_test("Health Check", "FAIL", f"Connection error: {str(e)}")
        return False

def create_test_quiz_result(name, correct_answers, total_questions=15, average_time=45.5, instagram=""):
    """Helper function to create a test quiz result"""
    data = {
        "name": name,
        "correct_answers": correct_answers,
        "total_questions": total_questions,
        "average_time": average_time,
        "instagram": instagram
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/quiz-arena/submit", json=data, timeout=10)
        if response.status_code == 200:
            result = response.json()
            return result.get("id")
        else:
            print(f"Failed to create test data: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"Error creating test data: {str(e)}")
        return None

def create_test_rating(stars=4, comment="Test rating for deletion", company="Test Company", photo=""):
    """Helper function to create a test rating"""
    data = {
        "stars": stars,
        "comment": comment,
        "company": company,
        "photo": photo
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/ratings", json=data, timeout=10)
        if response.status_code == 200:
            result = response.json()
            return result.get("id")
        else:
            print(f"Failed to create test rating: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"Error creating test rating: {str(e)}")
        return None

def test_get_all_quiz_arena_empty():
    """Test GET /api/quiz-arena/all with empty database"""
    try:
        # First clear all data
        requests.delete(f"{BACKEND_URL}/quiz-arena", timeout=10)
        
        response = requests.get(f"{BACKEND_URL}/quiz-arena/all", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) == 0:
                log_test("GET /api/quiz-arena/all (empty)", "PASS", "Returns empty array correctly")
                return True
            else:
                log_test("GET /api/quiz-arena/all (empty)", "FAIL", f"Expected empty array, got: {data}")
                return False
        else:
            log_test("GET /api/quiz-arena/all (empty)", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        log_test("GET /api/quiz-arena/all (empty)", "FAIL", f"Error: {str(e)}")
        return False

def test_get_all_quiz_arena_with_data():
    """Test GET /api/quiz-arena/all with multiple results"""
    try:
        # Create test data
        test_results = [
            ("Alice Johnson", 12, 15, 42.3, "@alice_quiz"),
            ("Bob Smith", 10, 15, 55.7, "@bob_gamer"),
            ("Carol Davis", 14, 15, 38.9, ""),
            ("David Wilson", 8, 15, 67.2, "@david_learns"),
            ("Eva Martinez", 13, 15, 41.1, "@eva_smart")
        ]
        
        created_ids = []
        for name, correct, total, avg_time, instagram in test_results:
            quiz_id = create_test_quiz_result(name, correct, total, avg_time, instagram)
            if quiz_id:
                created_ids.append(quiz_id)
            time.sleep(0.1)  # Small delay between creations
        
        if len(created_ids) != len(test_results):
            log_test("GET /api/quiz-arena/all (with data)", "FAIL", f"Failed to create all test data. Created: {len(created_ids)}/{len(test_results)}")
            return False, []
        
        # Test the endpoint
        response = requests.get(f"{BACKEND_URL}/quiz-arena/all", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            # Validate response structure
            if not isinstance(data, list):
                log_test("GET /api/quiz-arena/all (with data)", "FAIL", "Response is not a list")
                return False, created_ids
            
            if len(data) < len(test_results):
                log_test("GET /api/quiz-arena/all (with data)", "FAIL", f"Expected at least {len(test_results)} results, got {len(data)}")
                return False, created_ids
            
            # Check required fields in first result
            if data:
                first_result = data[0]
                required_fields = ["_id", "name", "correct_answers", "total_questions", "average_time", "instagram", "timestamp"]
                missing_fields = [field for field in required_fields if field not in first_result]
                
                if missing_fields:
                    log_test("GET /api/quiz-arena/all (with data)", "FAIL", f"Missing fields: {missing_fields}")
                    return False, created_ids
                
                # Check if sorted by timestamp (newest first)
                if len(data) > 1:
                    timestamps = [result["timestamp"] for result in data[:2]]
                    if timestamps[0] < timestamps[1]:
                        log_test("GET /api/quiz-arena/all (with data)", "WARN", "Results may not be sorted by timestamp (newest first)")
                
                log_test("GET /api/quiz-arena/all (with data)", "PASS", f"Returns {len(data)} results with all required fields")
                return True, created_ids
            else:
                log_test("GET /api/quiz-arena/all (with data)", "FAIL", "No results returned despite creating test data")
                return False, created_ids
        else:
            log_test("GET /api/quiz-arena/all (with data)", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
            return False, created_ids
            
    except Exception as e:
        log_test("GET /api/quiz-arena/all (with data)", "FAIL", f"Error: {str(e)}")
        return False, []

def test_delete_single_quiz_arena_score(score_id):
    """Test DELETE /api/quiz-arena/{score_id}"""
    try:
        response = requests.delete(f"{BACKEND_URL}/quiz-arena/{score_id}", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("deleted") == 1:
                log_test("DELETE /api/quiz-arena/{score_id} (valid)", "PASS", f"Successfully deleted score {score_id}")
                return True
            else:
                log_test("DELETE /api/quiz-arena/{score_id} (valid)", "FAIL", f"Unexpected response: {data}")
                return False
        else:
            log_test("DELETE /api/quiz-arena/{score_id} (valid)", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        log_test("DELETE /api/quiz-arena/{score_id} (valid)", "FAIL", f"Error: {str(e)}")
        return False

def test_delete_nonexistent_quiz_arena_score():
    """Test DELETE /api/quiz-arena/{score_id} with invalid ID"""
    try:
        fake_id = "507f1f77bcf86cd799439011"  # Valid ObjectId format but doesn't exist
        response = requests.delete(f"{BACKEND_URL}/quiz-arena/{fake_id}", timeout=10)
        
        if response.status_code == 404:
            log_test("DELETE /api/quiz-arena/{score_id} (invalid)", "PASS", "Correctly returns 404 for non-existent ID")
            return True
        else:
            log_test("DELETE /api/quiz-arena/{score_id} (invalid)", "FAIL", f"Expected 404, got {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("DELETE /api/quiz-arena/{score_id} (invalid)", "FAIL", f"Error: {str(e)}")
        return False

def test_delete_all_quiz_arena_scores():
    """Test DELETE /api/quiz-arena"""
    try:
        response = requests.delete(f"{BACKEND_URL}/quiz-arena", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and "deleted" in data:
                deleted_count = data.get("deleted", 0)
                log_test("DELETE /api/quiz-arena", "PASS", f"Successfully deleted {deleted_count} scores")
                return True, deleted_count
            else:
                log_test("DELETE /api/quiz-arena", "FAIL", f"Unexpected response: {data}")
                return False, 0
        else:
            log_test("DELETE /api/quiz-arena", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
            return False, 0
    except Exception as e:
        log_test("DELETE /api/quiz-arena", "FAIL", f"Error: {str(e)}")
        return False, 0

def verify_score_deleted(score_id):
    """Verify that a score was actually deleted from database"""
    try:
        response = requests.get(f"{BACKEND_URL}/quiz-arena/all", timeout=10)
        if response.status_code == 200:
            data = response.json()
            for result in data:
                if result.get("_id") == score_id:
                    return False  # Score still exists
            return True  # Score not found (deleted)
        return False
    except:
        return False

def run_integration_test():
    """Run comprehensive integration test as requested"""
    print("=" * 60)
    print("INTEGRATION TEST - Quiz Arena Admin Panel Endpoints")
    print("=" * 60)
    
    # Step 1: Clear database and verify empty
    print("Step 1: Testing with empty database...")
    if not test_get_all_quiz_arena_empty():
        return False
    
    # Step 2: Create 3-5 test results
    print("Step 2: Creating test quiz results...")
    test_data = [
        ("Emma Thompson", 13, 15, 39.2, "@emma_quiz"),
        ("James Rodriguez", 11, 15, 48.7, "@james_gamer"),
        ("Sophia Chen", 14, 15, 35.8, ""),
        ("Michael Brown", 9, 15, 62.1, "@mike_learns"),
        ("Isabella Garcia", 12, 15, 44.3, "@bella_smart")
    ]
    
    created_ids = []
    for name, correct, total, avg_time, instagram in test_data:
        quiz_id = create_test_quiz_result(name, correct, total, avg_time, instagram)
        if quiz_id:
            created_ids.append(quiz_id)
            print(f"    Created: {name} (ID: {quiz_id})")
        time.sleep(0.1)
    
    if len(created_ids) != len(test_data):
        log_test("Integration Test", "FAIL", f"Failed to create all test data. Created: {len(created_ids)}/{len(test_data)}")
        return False
    
    # Step 3: Verify GET /api/quiz-arena/all returns all of them
    print("\nStep 3: Verifying GET /api/quiz-arena/all returns all results...")
    response = requests.get(f"{BACKEND_URL}/quiz-arena/all", timeout=10)
    if response.status_code != 200:
        log_test("Integration Test", "FAIL", f"GET all failed: {response.status_code}")
        return False
    
    all_results = response.json()
    if len(all_results) < len(created_ids):
        log_test("Integration Test", "FAIL", f"Expected {len(created_ids)} results, got {len(all_results)}")
        return False
    
    print(f"    ✅ GET /api/quiz-arena/all returned {len(all_results)} results")
    
    # Step 4: Delete one using DELETE /api/quiz-arena/{score_id}
    print("\nStep 4: Deleting one result...")
    target_id = created_ids[0]
    if not test_delete_single_quiz_arena_score(target_id):
        return False
    
    # Verify it was deleted
    if not verify_score_deleted(target_id):
        log_test("Integration Test", "FAIL", f"Score {target_id} was not actually deleted from database")
        return False
    
    print(f"    ✅ Verified score {target_id} was deleted from database")
    
    # Step 5: Verify GET /api/quiz-arena/all returns remaining ones
    print("\nStep 5: Verifying remaining results...")
    response = requests.get(f"{BACKEND_URL}/quiz-arena/all", timeout=10)
    if response.status_code != 200:
        log_test("Integration Test", "FAIL", f"GET all failed after deletion: {response.status_code}")
        return False
    
    remaining_results = response.json()
    expected_remaining = len(created_ids) - 1
    
    if len(remaining_results) != expected_remaining:
        log_test("Integration Test", "FAIL", f"Expected {expected_remaining} remaining results, got {len(remaining_results)}")
        return False
    
    print(f"    ✅ GET /api/quiz-arena/all returned {len(remaining_results)} remaining results")
    
    # Step 6: Delete all using DELETE /api/quiz-arena
    print("\nStep 6: Deleting all remaining results...")
    success, deleted_count = test_delete_all_quiz_arena_scores()
    if not success:
        return False
    
    print(f"    ✅ Deleted {deleted_count} results")
    
    # Step 7: Verify GET /api/quiz-arena/all returns empty array
    print("\nStep 7: Verifying empty database...")
    response = requests.get(f"{BACKEND_URL}/quiz-arena/all", timeout=10)
    if response.status_code != 200:
        log_test("Integration Test", "FAIL", f"GET all failed after delete all: {response.status_code}")
        return False
    
    final_results = response.json()
    if len(final_results) != 0:
        log_test("Integration Test", "FAIL", f"Expected empty array, got {len(final_results)} results")
        return False
    
    print(f"    ✅ GET /api/quiz-arena/all returned empty array")
    
    log_test("INTEGRATION TEST", "PASS", "All steps completed successfully")
    return True

def main():
    """Main test runner"""
    print("INOVIX Quiz Arena Backend API Testing")
    print("=" * 50)
    
    # Test backend connectivity
    if not test_health_check():
        print("❌ Backend is not accessible. Stopping tests.")
        return
    
    print("Testing Quiz Arena Admin Panel Endpoints...")
    print("-" * 50)
    
    # Test individual endpoints
    test_results = []
    
    # Test 1: GET /api/quiz-arena/all with empty database
    test_results.append(test_get_all_quiz_arena_empty())
    
    # Test 2: GET /api/quiz-arena/all with data
    success, created_ids = test_get_all_quiz_arena_with_data()
    test_results.append(success)
    
    # Test 3: DELETE single score (if we have IDs)
    if created_ids:
        test_results.append(test_delete_single_quiz_arena_score(created_ids[0]))
    
    # Test 4: DELETE non-existent score
    test_results.append(test_delete_nonexistent_quiz_arena_score())
    
    # Test 5: DELETE all scores
    success, _ = test_delete_all_quiz_arena_scores()
    test_results.append(success)
    
    # Run comprehensive integration test
    integration_success = run_integration_test()
    test_results.append(integration_success)
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(test_results)
    total = len(test_results)
    
    print(f"Tests Passed: {passed}/{total}")
    
    if passed == total:
        print("🎉 ALL TESTS PASSED - Quiz Arena endpoints are working correctly!")
    else:
        print("⚠️  Some tests failed. Check the detailed output above.")
    
    return passed == total

if __name__ == "__main__":
    main()