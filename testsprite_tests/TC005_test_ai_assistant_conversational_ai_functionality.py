import requests
import uuid

BASE_URL = "http://localhost:5000"
TIMEOUT = 30

def get_token():
    unique_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    reg_payload = {"email": unique_email, "password": "Password123!"}
    requests.post(f"{BASE_URL}/api/auth/register", json=reg_payload)
    login_resp = requests.post(f"{BASE_URL}/api/auth/login", json=reg_payload)
    return login_resp.json().get("token")

def test_ai_assistant_conversational_ai_functionality():
    try:
        token = get_token()
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }

        url = f"{BASE_URL}/api/ai/converse"
        payload = {"message": "Explain accessibility features"}

        response = requests.post(url, json=payload, headers=headers, timeout=TIMEOUT)
        assert response.status_code == 200
        data = response.json()

        assert "reply" in data or "response" in data
        reply_text = data.get("reply") or data.get("response")
        assert len(reply_text) > 5

    except Exception as e:
        assert False, f"Test failed: {e}"

if __name__ == "__main__":
    test_ai_assistant_conversational_ai_functionality()
    print("TC005 passed")
