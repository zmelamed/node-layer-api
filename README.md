# Layer API for node.js
[![Build Status](http://img.shields.io/travis/layerhq/node-layer-api.svg?style=flat)](https://travis-ci.org/layerhq/node-layer-api)

A Node.js library, which provides a wrapper for the [Layer](https://layer.com) Platform API.

The Layer Platform API is designed to empower developers to automate, extend, and integrate functionality provided by the Layer platform with other services and applications. For more on this see our [blog post](http://blog.layer.com/introducing-layer-platform-api/).

This library supports requests from your **servers** only.

## Documentation

You can find full documentation on Platform API at [developer.layer.com/docs/platform](https://developer.layer.com/docs/platform).

## Installation

    npm install layer-api

## Simple example

```javascript
var LayerAPI = require('layer-api');

// Initialize by providing your Layer credentials
var layerAPI = new LayerAPI({
  token: API_TOKEN,
  appId: APP_ID
});

// Create a Conversation
layerAPI.conversations.create({participants: ['abcd']}, function(err, res) {
  var cid = res.body.id;

  // Send a Message
  layerAPI.messages.sendTexFromUser(cid, 'abcd', 'Hello, World!', function(err, res) {
    console.log(err || res.body);
  });
});
```

## Initialization

To use this library you need to create a new instance of the `layer-api` module by passing `options` object to a constructor.

### new LayerAPI(options)

Layer API constructor is initialized with the following options:

 - `token` - Layer Platform API token which can be obtained from [Developer Dashboard](https://developer.layer.com/projects/keys)
 - `appId` - Layer application ID
 - `debug` - *Optional* Enable debugging

## Conversations

Conversations coordinate messaging within Layer and can contain up to 25 participants. All Messages sent are sent within the context of a conversation.

### conversations.create(payload, [callback])

[Create](https://developer.layer.com/docs/platform#create-a-conversation) a new Conversation by providing paylod. Payload should contain at least `participants` array. Optional properties are `metadata` object and `distinct` boolean.

##### Arguments

 - `payload` - Payload object
 - `callback(err, res)` - *Optional* Callback function returns an error and response objects

##### Examples

```javascript
layerAPI.conversations.create({participants: ['abcd']}, function(err, res) {
  if (err) return console.error(err);

  // conversation ID
  var cid = res.body.id;
});
```

---------------------------------------

### conversations.get(cid, callback)

[Retrieve](https://developer.layer.com/docs/platform#retrieve-a-conversation) an existing Conversation by providing conversation ID. Response `body` will result in conversation object representation.

##### Arguments

 - `cid` - Conversation ID
 - `callback(err, res)` - Callback function returns an error and response objects

##### Examples

```javascript
layerAPI.conversations.get(cid, function(err, res) {
  if (err) return console.error(err);

  // conversation data
  var conversation = res.body;
});
```

---------------------------------------

### conversations.edit(cid, operations, [callback])

[Edit](https://developer.layer.com/docs/platform#edit-a-conversation) an existing Conversation by providing conversation ID and one or more `operations` as described by the [Layer Patch](https://github.com/layerhq/layer-patch) format.

##### Arguments

 - `cid` - Conversation ID
 - `operations` - Conversation operations array
 - `callback(err, res)` - *Optional* Callback function returns an error and response objects

##### Examples

```javascript
var operations = [
  {"operation": "add", "property": "participants", "value": "user1"}
];
layerAPI.conversations.edit(cid, operations, function(err, res) {
  if (err) return console.error(err);

  // conversation data
  var conversation = res.body;
});
```

## Messages

Messages can be made up of one or many individual pieces of content.

 - Message `sender` can be specified by `user_id` or `name`, but **not** both.
 - Message `parts` are the atomic object in the Layer universe. They represent the individual pieces of content embedded within a message.
 - Message `notification` object represents [push notification](https://developer.layer.com/docs/platform#push-notifications) payload.

### messages.send(cid, payload, [callback])

[Send](https://developer.layer.com/docs/platform#send-a-message) a Message by providing conversation ID and payload.

##### Arguments

 - `cid` - Conversation ID
 - `payload` - Message payload containing `sender` and `parts` data
 - `callback(err, res)` - *Optional* Callback function returns an error and response objects

##### Examples

```javascript
var payload = {
  sender: {
    user_id: 'abcd'
  },
  parts: [
    {
      body: 'Hello, World!',
      mime_type: 'text/plain'
    }
  ]
};
layerAPI.messages.sendTexFromUser(cid, payload, function(err, res) {
  if (err) return console.error(err);

  // message ID
  var messageId = res.body.id;
});
```

### messages.sendTexFromUser(cid, userId, text, [callback])

Shorthand method for sending a plain text Message by providing `userId` and `text`.

##### Arguments

 - `cid` - Conversation ID
 - `userId` - User ID of the participant that this message will appear to be from
 - `text` - Text or base64 encoded data for your message
 - `callback(err, res)` - *Optional* Callback function returns an error and response objects

### messages.sendTexFromName(cid, name, text, [callback])

Shorthand method for sending a plain text Message by providing `name` and `text`.

##### Arguments

 - `cid` - Conversation ID
 - `name` - Arbitrary string naming the service that this message will appear to be from
 - `text` - Text or base64 encoded data for your message
 - `callback(err, res)` - *Optional* Callback function returns an error and response objects

## Announcements

Announcements are messages sent to all users of the application or to a list of users.

Payload property `recipients` can contain one or more user IDs or the literal string "everyone" in order to message the entire userbase.

### announcements.send(payload, [callback])

Send an [Announcement](https://developer.layer.com/docs/platform#send-an-announcement) by providing a payload.

##### Arguments

 - `payload` - Message payload containing `recipients`, `sender` and `parts` data
 - `callback(err, res)` - *Optional* Callback function returns an error and response objects

##### Examples

```javascript
var payload = {
  recipients: ['abcd', '12345'],
  sender: {
    name: 'The System'
  },
  parts: [
    {
      body: 'Hello, World!',
      mime_type: 'text/plain'
    }
  ]
};
layerAPI.announcements.send(payload, function(err, res) {
  if (err) return console.error(err);

  // announcement data
  var announcement = res.body;
});
```

## Testing

The unit tests are based on the [mocha](http://visionmedia.github.com/mocha/) module, which may be installed via npm. To run the tests make sure that the npm dependencies are installed by running `npm install` from the project directory.

    npm test

## Contributing

Layer API is an Open Source project maintained by Layer. Feedback and contributions are always welcome and the maintainers try to process patches as quickly as possible. Feel free to open up a Pull Request or Issue on Github.

## Author

[Nil Gradisnik](https://github.com/nilgradisnik)