import requests
import time
import uuid

BASE_URL = "http://localhost:5000"
TIMEOUT = 30

def get_token():
    unique_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    reg_payload = {"email": unique_email, "password": "Password123!"}
    requests.post(f"{BASE_URL}/api/auth/register", json=reg_payload)
    login_resp = requests.post(f"{BASE_URL}/api/auth/login", json=reg_payload)
    return login_resp.json().get("token")

def test_dashboard_real_time_accessibility_statistics():
    try:
        token = get_token()
        headers = {
            "Authorization": f"Bearer {token}",
            "Accept": "application/json"
        }

        # Check server availability
        health_resp = requests.get(f"{BASE_URL}/health", timeout=TIMEOUT)
        assert health_resp.status_code == 200

        # Endpoint to fetch dashboard statistics
        stats_url = f"{BASE_URL}/api/dashboard/stats"
        
        # Retrieve initial stats
        resp_initial = requests.get(stats_url, headers=headers, timeout=TIMEOUT)
        assert resp_initial.status_code == 200
        data_initial = resp_initial.json()

        assert "realTimeAccessibilityStats" in data_initial
        assert "complianceTrends" in data_initial
        assert isinstance(data_initial["realTimeAccessibilityStats"], dict)
        assert isinstance(data_initial["complianceTrends"], list)

        # Wait some time to check dynamic update
        time.sleep(2)

        resp_updated = requests.get(stats_url, headers=headers, timeout=TIMEOUT)
        assert resp_updated.status_code == 200
        data_updated = resp_updated.json()

        assert data_updated != data_initial, "Dashboard statistics did not update dynamically"

    except Exception as e:
        assert False, f"Test failed: {e}"

if __name__ == "__main__":
    test_dashboard_real_time_accessibility_statistics()
    print("TC002 passed")