import requests
import json

BASE_URL = "http://localhost:5000/api/auth"
EMAIL = "test_user_for_token@example.com"
PASSWORD = "testpassword123"

def get_token():
    print(f"Attempting to register user: {EMAIL}")
    # 1. Register
    reg_response = requests.post(f"{BASE_URL}/register", json={
        "email": EMAIL,
        "password": PASSWORD
    })
    
    if reg_response.status_code == 201:
        print("Registration successful.")
    elif reg_response.status_code == 400 and "User already exists" in reg_response.text:
        print("User already exists, proceeding to login.")
    else:
        print(f"Registration failed: {reg_response.status_code} - {reg_response.text}")
        return

    # 2. Login
    print("Attempting to login...")
    login_response = requests.post(f"{BASE_URL}/login", json={
        "email": EMAIL,
        "password": PASSWORD
    })

    if login_response.status_code == 200:
        token = login_response.json().get("token")
        if token:
            print(f"\nSUCCESS! Bearer Token:\n{token}\n")
            print(f"Copy this token for your use.")
        else:
            print("Login successful but no token found in response.")
    else:
        print(f"Login failed: {login_response.status_code} - {login_response.text}")

if __name__ == "__main__":
    get_token()
