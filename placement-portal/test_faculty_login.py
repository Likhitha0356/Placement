import requests

# Test faculty login flow
def test_faculty_login_flow():
    url = "http://localhost:5002/api/faculty/login"
    
    # Test with faculty ID
    data = {
        "facultyId": "F100",
        "password": "test123"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Faculty Login Status: {response.status_code}")
        
        if response.json().get('success'):
            faculty_data = response.json().get('data', {})
            print("✅ Faculty login successful!")
            print(f"Faculty Name: {faculty_data.get('name')}")
            print(f"Department: {faculty_data.get('department')}")
            print(f"Designation: {faculty_data.get('designation')}")
            print(f"User Type: {faculty_data.get('type')}")
            print(f"ID: {faculty_data.get('id')}")
            
            # This should redirect to /faculty-dashboard
            print("🔄 Should redirect to: /faculty-dashboard")
        else:
            print("❌ Faculty login failed")
            print(f"Error: {response.json().get('message')}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    print("🧪 Testing Faculty Login Flow...")
    test_faculty_login_flow()
