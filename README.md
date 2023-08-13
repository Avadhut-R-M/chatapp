
## Create DB for the project
1. Install MySQL.
2. Open the MySQL command line with a command
   ```shell
   sudo mysql
   ```
3. Create a user
   ```SQL
   CREATE USER test WITH PASSWORD 'test';
   ```
4. Create a Database
   ```SQL
   CREATE DATABASE test OWNER test;
   ```
5. Grant permission to the user
   ```SQL
   GRANT ALL PRIVILEGES ON DATABASE test TO test;
   ```


## Setting Up project
1. Install Python 3.10 if not available on the device
2. cd in the project repo
3. Create virtual env with Python 3.10 with the command
   ```shell
   python3.10 -m venv venv
   ```
4. Activate virtual env with the command  
   ```shell
   source venv/bin/activate
   ```
5.  Install requirements with 
    ```shell
    pip install -r requirements.txt
    ```
6.  Migrate models
    ```shell
    python manage.py migrate
    ```
7.  Run the Project with
    ```shell
    python manage.py runserver
    ```
8. On another terminal do cd in the project repo then cd in frontend and then install node modules with
    ```shell
    npm install
    ```
9. Run frontend with command
    ```shell
    npm start
    ```


## API Documentation
To access API documentation with swagger go to link 
[http://127.0.0.1:8000/swagger](http://127.0.0.1:8000/swagger)

Error Codes
-----------
The API may return the following error codes:

- `400 Bad Request`: The request is invalid or missing the required parameters.
- `404 Not Found`: The requested resource does not exist.
- `500 Internal Server Error`: An unexpected error occurred on the server.


## Hosted Project
This project is hosted on AWS you can access it with </br>
frontend - [frontend](http://ava-chat-frontend.s3-website-us-east-1.amazonaws.com/) </br>
backend - [backend](http://44.204.86.160/)
</br>
#### Login creads - 
- admin user
  - username - admin
  - password - admin
- normal user
  - username - test
  - password - 1234
- normal user
  - username - test1
  - password - 1234
