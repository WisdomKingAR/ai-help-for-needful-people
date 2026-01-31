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

def test_accessibility_controls_settings_application():
    try:
        token = get_token()
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }

        settings_payload = {
            "voiceNavigation": {"enabled": True, "language": "en-US", "sensitivity": 0.8},
            "screenReader": {"enabled": True, "voice": "default", "speed": 1.0, "pitch": 1.0},
            "visualAdjustments": {"fontSize": 18, "fontFamily": "OpenDyslexic", "colorTheme": "highContrast", "lineSpacing": 1.5, "letterSpacing": 0.1}
        }

        url_settings = f"{BASE_URL}/api/accessibility/settings"

        # Update settings using PUT
        put_resp = requests.put(url_settings, headers=headers, json=settings_payload, timeout=TIMEOUT)
        assert put_resp.status_code == 200
        put_data = put_resp.json()

        assert put_data.get("voiceNavigation", {}).get("enabled") == True
        assert put_data.get("visualAdjustments", {}).get("fontSize") == 18

        # Get settings using GET
        get_resp = requests.get(url_settings, headers=headers, timeout=TIMEOUT)
        assert get_resp.status_code == 200
        get_data = get_resp.json()
        assert get_data.get("voiceNavigation", {}).get("enabled") == True

    except Exception as e:
        assert False, f"Test failed: {e}"

if __name__ == "__main__":
    test_accessibility_controls_settings_application()
    print("TC003 passed")
