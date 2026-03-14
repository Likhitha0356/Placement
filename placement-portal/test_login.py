import requests

# Test student login API
def test_student_login():
    url = "http://127.0.0.1:5002/api/student/login"
    
    # Test with a valid roll number from dataset
    data = {
        "rollNumber": "21ME0001",
        "password": "test123"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.json().get('success'):
            print("✅ Student login successful!")
            student_data = response.json().get('data', {})
            print(f"Student Name: {student_data.get('name')}")
            print(f"Department: {student_data.get('dept')}")
            print(f"Placement Readiness: {student_data.get('placementReadiness')}")
        else:
            print("❌ Student login failed")
            print(f"Error: {response.json().get('message')}")
            
    except Exception as e:
        print(f"Error: {e}")

# Test faculty login API
def test_faculty_login():
    url = "http://127.0.0.1:5002/api/faculty/login"
    
    # Test with faculty ID
    data = {
        "facultyId": "F100",
        "password": "test123"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"\nFaculty Login - Status Code: {response.status_code}")
        print(f"Faculty Response: {response.json()}")
        
        if response.json().get('success'):
            print("✅ Faculty login successful!")
            faculty_data = response.json().get('data', {})
            print(f"Faculty Name: {faculty_data.get('name')}")
            print(f"Department: {faculty_data.get('department')}")
        else:
            print("❌ Faculty login failed")
            print(f"Error: {response.json().get('message')}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    print("🧪 Testing Login APIs...")
    test_student_login()
    test_faculty_login()
