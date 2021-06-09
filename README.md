# Update: Exercise completed using NodeJS.
* **To start server:** `npm run start`
* **To run tests:** `npm run test`
* **Entry point:** index.js

For development Postman was used to test endpoints by passing an the order object into the request body in the form of

`
{
    "customerId": "1",
    "items": {
        "4": 2,
        "0": 2
    }
}
`

This was to keep the object as minimal as possible as the customer, and item information could be retrieved from the JSON objects in the data folder, which were acting as pseudo-databases.

When an order is deleted, it made most business sense to me to set the status of the order to "Cancelled" instead of a hard delete to keep track of records.

File system module was used to access/read/write to the JSON files. The provided template for NodeJS was used and modified for this exercise.

jsonReader helper function was created to make a simpler way of retrieving updated values from the "orders database."

# Hey developers, engineers, hackers. 
**This is important!** We want to respect your valuable time so **_PLEASE_** timebox this exercise.

Your current mission, should you choose to accept it, is to take a few (no more than two) hours to build an Orders REST API endpoint. We have created some starter templates for a few languages but you don't need to use them if you would prefer to roll your own.

## What we would like to see from this exercise:
* Create order endpoint
* List all orders by customer endpoint
* Update order endpoint
* Cancel order endpoint
* Tests to prove your code works as expected

**Currently supported languages templates:** C#, Go, Node.JS, Python

_We are open to other languages if you feel more comfortable in them. We have expertises in **Java**, **Kotlin**, and a few others._

If you don't see your language of preference on the list of languages above, **_please reach out_**. We are happy to discuss other langages as well.

## How to interact with this activity:
1. Fork this repo
2. Complete exercise with a language listed above (assuming you haven't chosen another, hipper language and discussed it with us)
3. Provide a link to the completed exercise to Jenny Hove [jenny.hove@sogeti.com]
4. Receive personalized code review/feedback session from our technical team



