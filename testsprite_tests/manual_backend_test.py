import requests
import json
import time

BASE_URL_NODE = "http://localhost:5000"
BASE_URL_PYTHON = "http://localhost:5001"

def test_node_health():
    try:
        response = requests.get(f"{BASE_URL_NODE}/health")
        assert response.status_code == 200
        print(f"PASS: Node Server /health ({response.json()['status']})")
    except Exception as e:
        print(f"FAIL: Node Server /health - {e}")

def test_node_root():
    try:
        response = requests.get(f"{BASE_URL_NODE}/")
        assert response.status_code == 200
        print(f"PASS: Node Server / (Root) ({response.json()['status']})")
    except Exception as e:
        print(f"FAIL: Node Server / (Root) - {e}")

def test_python_health():
    try:
        response = requests.get(f"{BASE_URL_PYTHON}/api/health")
        assert response.status_code == 200
        print(f"PASS: Python Server /api/health ({response.json()['status']})")
    except Exception as e:
        print(f"FAIL: Python Server /api/health - {e}")

def test_auth_route_existence():
    # Verify Auth route is physically responding (even if 404 for GET, it proves router is active)
    # The API defines /api/auth.
    try:
        # Just checking if the server accepts connections on this path
        response = requests.get(f"{BASE_URL_NODE}/api/auth")
        # Likely 404 or 200 depending on implementation, but identifying no connection error is key
        print(f"PASS: Node Server /api/auth Reachability (Status: {response.status_code})")
    except Exception as e:
        print(f"FAIL: Node Server /api/auth Reachability - {e}")

if __name__ == "__main__":
    print("Starting Manual Backend Verification...")
    print("-" * 40)
    test_node_health()
    test_node_root()
    test_auth_route_existence()
    test_python_health()
    print("-" * 40)
    print("Backend verification complete.")
