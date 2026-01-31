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

def test_gesture_recognition_vision_based_sign_language_translation():
    try:
        token = get_token()
        headers = {
            "Authorization": f"Bearer {token}",
            "Accept": "application/json"
        }

        # Static base64 image (1x1 pixel)
        img_str = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
        payload = {"frame": img_str}

        url = f"{BASE_URL}/api/accessibility/detect-gesture"
        response = requests.post(url, json=payload, headers=headers, timeout=TIMEOUT)
        assert response.status_code == 200
        data = response.json()

        assert "gesture" in data
        assert "confidence" in data
        assert "translation" in data
        assert isinstance(data["confidence"], (float, int))

    except Exception as e:
        assert False, f"Test failed: {e}"

if __name__ == "__main__":
    test_gesture_recognition_vision_based_sign_language_translation()
    print("TC004 passed")