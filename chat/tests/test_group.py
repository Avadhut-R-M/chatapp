from rest_framework.test import APIClient
from rest_framework import status
import pytest
from django.contrib.auth.models import User
from model_bakery import baker
from chat.models import Group

@pytest.mark.django_db
class TestCreateGroup:
    def test_if_user_is_anonymus_return_403(self):
        client = APIClient()
        response = client.post('/api/group/', {'name': 'test', 'members': [1,2]})

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_if_data_is_invalid_return_400(self):
        client = APIClient()
        client.force_authenticate(user=User())
        response = client.post('/api/group/', {'name': 'test'})

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_if_data_is_invalid_2_return_400(self):
        client = APIClient()
        client.force_authenticate(user=User())
        response1 = client.post('/api/group/', {'name': 'test', 'members': "[1,2]"})
        response2 = client.post('/api/group/', {'name': 'test', 'members': "[1,2]"})

        assert response1.status_code == status.HTTP_201_CREATED
        assert response2.status_code == status.HTTP_400_BAD_REQUEST

    def test_if_data_is_valid_return_200(self):
        client = APIClient()
        client.force_authenticate(user=User())
        response = client.post('/api/group/', {'name': 'test', 'members': "[1,2]"})

        assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
class TestListGroup:
    def test_if_user_is_anonymus_return_403(self):
        client = APIClient()
        response = client.get('/api/group/')

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_if_data_is_valid_return_200(self):
        client = APIClient()
        client.force_authenticate(user=User(id=1))
        response = client.get('/api/group/')

        assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
class TestDeleteGroup:
    def test_if_user_is_anonymus_return_403(self):
        group = baker.make(Group)
        client = APIClient()
        response = client.delete('/api/group/{}/'.format(group.id))

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_if_data_is_valid_return_204(self):
        group = baker.make(Group)
        client = APIClient()
        client.force_authenticate(user=User(id=1))
        response = client.delete('/api/group/{}/'.format(group.id))

        assert response.status_code == status.HTTP_204_NO_CONTENT


@pytest.mark.django_db
class TestUpdateGroup:
    def test_if_user_is_anonymus_return_403(self):
        group = baker.make(Group)
        client = APIClient()
        response = client.patch('/api/group/{}/'.format(group.id), {'name': 'test2'})

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_if_data_is_valid_return_204(self):
        group = baker.make(Group)
        client = APIClient()
        client.force_authenticate(user=User(id=1))
        response = client.patch('/api/group/{}/'.format(group.id), {'name': 'test'})

        assert response.status_code == status.HTTP_200_OK