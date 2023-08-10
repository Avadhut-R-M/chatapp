import pytest
from django.contrib.auth.models import User
from model_bakery import baker
from rest_framework import status
from rest_framework.test import APIClient


@pytest.mark.django_db
class TestCreateUser:
    def test_if_user_is_anonymus_return_403(self):
        client = APIClient()
        response = client.post(
            "/api/user/",
            {
                "first_name": "test",
                "email": "test@gmail.com",
                "password": "test",
                "username": "test",
            },
        )

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_if_user_is_not_admin_return_403(self):
        client = APIClient()
        client.force_authenticate(user={})
        response = client.post(
            "/api/user/",
            {
                "first_name": "test",
                "email": "test@gmail.com",
                "password": "test",
                "username": "test",
            },
        )

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_if_data_is_invalid_return_400(self):
        client = APIClient()
        client.force_authenticate(user=User(is_staff=True))
        response = client.post(
            "/api/user/",
            {
                "first_name": "test",
                "email": "test",
                "password": "test",
                "username": "test",
            },
        )

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_if_data_is_valid_return_201(self):
        client = APIClient()
        client.force_authenticate(user=User(is_staff=True))
        response = client.post(
            "/api/user/",
            {
                "first_name": "test",
                "email": "test@gmail.com",
                "password": "test",
                "username": "test",
            },
        )

        assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
class TestListUser:
    def test_if_user_is_anonymus_return_403(self):
        client = APIClient()
        response = client.get("/api/user/")

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_if_data_is_valid_return_200(self):
        client = APIClient()
        client.force_authenticate(user=User())
        response = client.get("/api/user/")

        assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
class TestDeleteUser:
    def test_if_user_is_anonymus_return_403(self):
        user = baker.make(User)
        client = APIClient()
        response = client.delete("/api/user/{}/".format(user.id))

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_if_user_not_admin_return_400(self):
        user = baker.make(User)
        client = APIClient()
        client.force_authenticate(user=User())
        response = client.delete("/api/user/{}/".format(user.id))

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_if_data_is_valid_return_204(self):
        user = baker.make(User)
        client = APIClient()
        client.force_authenticate(user=User(is_staff=True))
        response = client.delete("/api/user/{}/".format(user.id))

        assert response.status_code == status.HTTP_204_NO_CONTENT


@pytest.mark.django_db
class TestUpdateUser:
    def test_if_user_is_anonymus_return_403(self):
        user = baker.make(User)
        client = APIClient()
        response = client.patch(
            "/api/user/{}/".format(user.id), {"email": "user@test.com"}
        )

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_if_user_not_admin_return_403(self):
        user = baker.make(User)
        client = APIClient()
        client.force_authenticate(user=User())
        response = client.patch(
            "/api/user/{}/".format(user.id), {"email": "user@test.com"}
        )

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_if_data_is_valid_return_204(self):
        user = baker.make(User)
        client = APIClient()
        client.force_authenticate(user=User(is_staff=True))
        response = client.patch(
            "/api/user/{}/".format(user.id), {"email": "user@test.com"}
        )

        assert response.status_code == status.HTTP_200_OK
