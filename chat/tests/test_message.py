import pytest
from django.contrib.auth.models import User
from model_bakery import baker
from rest_framework import status
from rest_framework.test import APIClient

from chat.models import Message


@pytest.mark.django_db
class TestCreateMessage:
    def test_if_user_is_anonymus_return_401(self):
        client = APIClient()
        response = client.post("/api/message/", {"group_id": "1", "content": "test"})

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_if_data_is_invalid_return_400(self):
        client = APIClient()
        user = baker.make(User)
        client.force_authenticate(user=User(user.id))
        response = client.post("/api/message/", {"content": "test"})

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_if_data_is_valid_return_200(self):
        client = APIClient()
        user = baker.make(User)
        client.force_authenticate(user=User(user.id))
        response = client.post("/api/message/", {"receiver_id": "1", "content": "test"})

        assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
class TestListMessage:
    def test_if_user_is_anonymus_return_401(self):
        client = APIClient()
        response = client.get("/api/message/")

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_if_data_is_valid_return_200(self):
        client = APIClient()
        client.force_authenticate(user=User(id=1))
        response = client.get("/api/message/")

        assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
class TestDeleteMessage:
    def test_if_user_is_anonymus_return_401(self):
        message = baker.make(Message)
        client = APIClient()
        response = client.delete("/api/message/{}/".format(message.id))

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_if_data_is_valid_return_204(self):
        message = baker.make(Message)
        client = APIClient()
        client.force_authenticate(user=User(id=1))
        response = client.delete("/api/message/{}/".format(message.id))

        assert response.status_code == status.HTTP_204_NO_CONTENT


@pytest.mark.django_db
class TestUpdateMessage:
    def test_if_user_is_anonymus_return_401(self):
        message = baker.make(Message)
        client = APIClient()
        response = client.patch(
            "/api/message/{}/".format(message.id), {"content": "test2"}
        )

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_if_data_is_invalid_return_400(self):
        message = baker.make(Message)
        client = APIClient()
        client.force_authenticate(user=User(id=1))
        response = client.patch(
            "/api/message/{}/".format(message.id), {"value": "test"}
        )

        assert response.status_code == status.HTTP_200_OK

    def test_if_data_is_valid_return_200(self):
        message = baker.make(Message)
        client = APIClient()
        client.force_authenticate(user=User(id=1))
        response = client.patch(
            "/api/message/{}/".format(message.id), {"content": "test"}
        )

        assert response.status_code == status.HTTP_200_OK
