from app import create_app


def test_index_route_returns_welcome_page():
    client = create_app({"TESTING": True}).test_client()

    response = client.get("/")

    assert response.status_code == 200
    assert b"FirstRepo Flask Starter" in response.data


def test_healthz_route_returns_ok():
    client = create_app({"TESTING": True}).test_client()

    response = client.get("/healthz")

    assert response.status_code == 200
    assert response.get_json() == {"status": "ok"}
