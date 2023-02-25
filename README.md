# node-red-contrib-zoomus-api
Provide nodes to call Zoom.us API

# nodes
- config: allows to input API_KEY, API_SECRET
- zoomus: api calls

# example
Send this message to the zoomus node to create a new meeting.
Related documentation of zoom.us: https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingcreate

```js
var userId = `USER_ID`;
msg.payload = {
    endpoint: `/users/${userId}/meetings`,
    body: {
        "topic": "Test from API",
        "type": 2,
        "start_time": "2019-06-20T18:00:00Z",
        "duration": 1,
        "timezone": "Asia/Shanghai",
        //"password": "1234",
        "agenda": "Meeting Agenda set by API",
        "settings": {
            "host_video": false,
            "participant_video": false,
            //"cn_meeting": "boolean",
            "in_meeting": true,
            "join_before_host": true,
            "mute_upon_entry": false,
            "watermark": false,
            "use_pmi": false,
            "approval_type": 2,
            //"registration_type": "integer",
            "audio": "both",
            "auto_recording": "none",
            "enforce_login": false,
            "enforce_login_domains": false,
            //"alternative_hosts": "string"
        }
    }
};
```
