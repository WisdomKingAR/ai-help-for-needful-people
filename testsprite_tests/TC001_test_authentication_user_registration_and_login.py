import requests
import uuid

BASE_URL = "http://localhost:5000"
HEADERS = {"Content-Type": "application/json"}
TIMEOUT = 30

def test_authentication_user_registration_and_login():
    # Generate unique email for registration to avoid conflicts
    unique_email = f"testuser_{uuid.uuid4().hex[:8]}@example.com"
    register_payload = {
        "email": unique_email,
        "password": "TestPass123!",
        "biometricData": "sampleBiometricDataPlaceholder",
        "mfaEnabled": True
    }
    login_payload = {
        "email": unique_email,
        "password": "TestPass123!",
        "mfaToken": "123456"  # Assuming test MFA token is fixed or mocked
    }

    session = requests.Session()
    try:
        # Check server reachability
        health_resp = session.get(BASE_URL, timeout=TIMEOUT)
        assert health_resp.status_code < 500, "Server unreachable or server error"

        # 1. Register User
        register_resp = session.post(
            f"{BASE_URL}/auth/register",
            headers=HEADERS,
            json=register_payload,
            timeout=TIMEOUT
        )
        assert register_resp.status_code == 201 or register_resp.status_code == 200, \
            f"Registration failed with status code {register_resp.status_code}"
        register_data = register_resp.json()
        assert "userId" in register_data or "id" in register_data, "Registration response missing userId"
        user_id = register_data.get("userId") or register_data.get("id")

        # 2. Login User
        login_resp = session.post(
            f"{BASE_URL}/auth/login",
            headers=HEADERS,
            json=login_payload,
            timeout=TIMEOUT
        )
        assert login_resp.status_code == 200, f"Login failed with status code {login_resp.status_code}"
        login_data = login_resp.json()
        assert "token" in login_data, "Login response missing JWT token"
        token = login_data["token"]
        assert token.startswith("eyJ"), "Returned token does not appear to be a JWT"

        # 3. Validate token by accessing a protected endpoint
        protected_headers = {"Authorization": f"Bearer {token}"}
        protected_resp = session.get(
            f"{BASE_URL}/auth/profile",
            headers=protected_headers,
            timeout=TIMEOUT
        )
        assert protected_resp.status_code == 200, "Access with JWT token to protected endpoint failed"
        profile_data = protected_resp.json()
        assert profile_data.get("email") == unique_email, "Profile email does not match registered email"

    finally:
        # Cleanup: delete the created user to keep environment clean (if such endpoint exists)
        # Using the provided bearer token credential from instructions for admin auth if needed
        admin_headers = {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QxNzY5Nzg3MjU5MDAyQGV4YW1wbGUuY29tIiwiaWF0IjoxNzY5Nzg3MjU5LCJleHAiOjE3Njk3OTA4NTl9.Ck15oVOguTY7oaF2m_eNAC37tU_qP6TcZO5HQGrz1Lg"
        }
        if 'user_id' in locals():
            try:
                del_resp = session.delete(
                    f"{BASE_URL}/auth/user/{user_id}",
                    headers=admin_headers,
                    timeout=TIMEOUT
                )
                # Accept 200 or 204 as successful deletion
                assert del_resp.status_code in (200, 204, 404), \
                    f"User deletion failed with status code {del_resp.status_code}"
            except Exception:
                pass

test_authentication_user_registration_and_login()