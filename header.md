------------------

# Authentication

The REST API uses the OAuth 2.0 protocol to authorize calls. OAuth is an open standard that many companies use to provide secure access to protected resources.

After a user successfully logs in, the `accessToken` field in the Login response contains a bearer token, indicated by the tokenType of Bearer:

```
{
	"accessToken": "<accessToken>",
	"tokenType": "Bearer",
	"expiresIn": 32398,
	"refreshToken": "<refreshToken>",
}
```


You must include this bearer token in API requests in the Authorization header with the Bearer authentication scheme.

This sample request uses a bearer token to list user details:

```
curl -X GET http://localhost/user \
  -H "Content-Type:application/json" \
  -H 'accept-version: ~3' \
  -H "Authorization: Bearer accessToken"
```

Access tokens have a finite lifetime. The expiresIn field in the get access token response indicates the lifetime, in seconds, of the access token. For example, an expiry value of 3600 indicates that the access token expires in one hour from the time the response was generated.

To detect when an access token expires, write your code to either:


- Keep track of the expiresIn value in the token response. The value is expressed in seconds.

- Handle the HTTP 401 Unauthorized status code. The API endpoint issues this status code when it detects an expired token.


Once you detect that an accessToken has expired via one of the methods mentioned above, you can make a call to the `GetAccessToken` endpoint providing the `refreshToken` returned to you in the response of the `Login` endpoint and you will get a new `accessToken` that will last for another hour.

This `refreshToken` is a long-lived token, it only expires several months after it was issued. Once this expires the user will need to log in again.

Detecting when the `refreshToken` expires can be done in the same way as the `accessToken`.


.
# API Requests

To construct a REST API request, combine these components:


- The HTTP method:

	- `GET` Requests data from a resource.

	- `POST` Submits data to a resource to process.

	- `PUT` Updates a resource.

	- `PATCH` Partially updates a resource.

	- `DELETE` Deletes a resource.


- The URL to the API service: `http://localhost:3000`

- The URI to the resource: `/user`

- Query parameters: Optional. Controls which data appears in the response. Use to filter, limit the size of, and sort the data in an API response.

- HTTP request headers: Includes the Authorization header with the access token.

- A JSON request body: Required for most GET, POST, PUT, and PATCH calls.


This is a simple request to update a user's first name:

```
curl -X PATCH http://localhost/user \
  -H "Content-Type:application/json" \
  -H 'accept-version: ~3' \
  -H "Authorization: Bearer accessToken" \
  -d '{
    "firstName": "Michael"
  }'
```


## Query Parameters

For most REST GET calls, you can specify one or more optional query parameters on the request URI to filter, limit the size of, and sort the data in an API response. For filter parameters, see the individual GET calls.

To limit, or page, and sort the data that is returned in some API responses, use these query parameters:


- `page`: The zero-relative start index of the entire list of items that are returned in the response. So, the combination of `page=0` and `pageSize=20` returns the first 20 items. The combination of `page=20` and `pageSize=20` returns the next 20 items.

- `pageSize`: The number of items to return in the response.

- `sortOrder`: Sorts the items in the response in ascending or descending order [`asc` or `desc`].

For example, the TeamSessions API returns the last 10 team sessions recorded by the user:

```
curl -X GET http://localhost/users?page=0&pageSize=10&sortOrder=desc \
  -H "Content-Type:application/json" \
  -H 'accept-version: ~3' \
  -H "Authorization: Bearer accessToken" \
```

.


# API Responses

The API calls return HTTP status codes. Some API calls also return JSON response bodies that include information about the resource.


## HTTP status codes

Each REST API request returns a success or error HTTP status code.


### Success

In the responses, the API returns these HTTP status codes for successful requests:

- `200 OK`: The request succeeded.

- `201 Created`: A `POST` method successfully created a resource. If the resource was already created by a previous execution of the same method, for example, the server returns the HTTP `200 OK` status code.

- `202 Accepted`: The server accepted the request and will execute it later..

- `204 No Content`: The server successfully executed the method but returns no response body.


### Error

In the responses for failed requests, the API returns HTTP `4XX` or `5XX` status codes.

For all errors except Identity errors, the API returns an error response body that includes additional error details in this format:

```
{  
    "code":"Unauthorized",
    "message":"InvalidToken"
}
```


In the responses, the API returns these HTTP status codes for failed requests:

- `400 Bad Request`: The server could not understand the request. 

- `401 Unauthorized`: The request requires authentication and the caller did not provide valid credentials.

- `403 Forbidden`: The client is not authorized to access this resource although it might have valid credentials

- `404 Not Found`: The server did not find anything that matches the request URI. Either the URI is incorrect or the resource is not available.

- `405 Method Not Allowed`: The service does not support the requested HTTP method. For example, `PATCH`.

- `500 Internal Server Error`: A system or application error occurred. Although the client appears to provide a correct request, something unexpected occurred on the server.

- `503 Service Unavailable`: The server cannot handle the request for a service due to temporary maintenance.






