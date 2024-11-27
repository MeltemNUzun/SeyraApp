# Doc

ping:  `/ping` 

type: GET

response: 

```json
{
    "message": "pong"
}
```

## endpoints

api group: `/api/v1`

route: `/login` 

type: POST

parameters:

```json
{
    "username":"meltem",
    "password":"1234"
}
```

response:

```json
{
    "message": "Login successful"
}
```

route: `/register`

type: POST

parameters:

```json
{
    "username":"meltem",
    "password":"1234",
    "role_id":4
}
```

response:

```json
{
    "message": "User registered successfully"
}
```

route: `/users` 

type: GET

parameters: null

response:

```json
{
    "users": [
        {
            "user_id": 1,
            "username": "admin",
            "password_hash": "",
            "role_id": 1
        },
        {
            "user_id": 3,
            "username": "emre",
            "password_hash": "",
            "role_id": 2
        },
        {
            "user_id": 4,
            "username": "meltem",
            "password_hash": "",
            "role_id": 4
        }
    ]
}
```

route: `/update-user-role`

type: PUT

parameters:

```json
{
    "user_id":3,
    "role_id":2
}
```

response:

```json
{
    "message": "User deleted successfully"
}
```

route: `/servers` 

type: GET

parameters: null

response:

```json
[
    {
        "server_id": 1,
        "server_name": "Database Server 1",
        "server_type_id": 4,
        "ip_address": "46.2.27.18"
    },
    {
        "server_id": 2,
        "server_name": "Web Server 1",
        "server_type_id": 2,
        "ip_address": "46.2.27.19"
    }
]
```

route: `/add-server`

type: POST

parameters:

```json
{
    "server_name":"Web Server 1",
    "server_type_id": 2,
    "ip_address": "46.2.27.19"
}
```

response:

```json
{
    "message": "Server added successfully"
}
```

route: `/logout` 

type: POST

parameters: null

response:

```json
{
    "message": "Logout successful"
}
```