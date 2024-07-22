## Interactive-Avatar

## Changes 1.0.15
1. The API now returns `duration_ms` in the `avatar_stop_talking` event

## Changes 1.0.14
1. The API now supports a knowledge base parameter in the createStreamingAvatar function
2. The API now supports chat mode in the speak function
3. The API now supports rate and emotion (only some voices support emotion) in the voice settings in the createStreamingAvatar function

## Changes 1.0.13
1. The API now sets default jitter bufffer target to 200ms

## Changes 1.0.11

1. The API now supports interrupt current streaming

## Changes 1.0.9

1. The API now supports start/stop event callbacks
2. The API now supports setting jitter buffer target (https://developer.mozilla.org/en-US/docs/Web/API/RTCRtpReceiver/jitterBufferTarget)

## Introduction

This SDK provides a convenient way for developers to better interface with HeyGen's Interactive Avatar. 

## Installation 

```
npm install @heygen/streaming-avatar
```

To build and compile the typescript sources to javascript run install then:
```
npm run build
```

## Implementation

For demo of this SDK and how it is used when installed in an app, please refer to the following: https://github.com/HeyGen-Official/InteractiveAvatarNextJSDemo. 

```
import { Configuration, NewSessionData, StreamingAvatarApi} from 'streaming-avatar';

const streamingAvatar = new StreamingAvatarApi(
      new Configuration({accessToken: 'ENTER_ACCESS_TOKEN_HERE'})
    )

async function main(){
    await avatar.current.createStartAvatar(
      { newSessionRequest: 
        { quality: "low",
          avatarName: avatarId, 
          voice:{voiceId: voiceId}
        }
      });
}

main();

```

## Troubleshooting FAQ


### How do I get an Access token Key?

To generate your access token you must first have access to your API key. API Keys are reserved for Enterprise customers. You can retrieve either the API Key or Trial Token by logging in to HeyGen and navigating to this page in your settings: https://app.heygen.com/settings?nav=API. Afterwards you can run the following to obtain your access token.

Please note the tokens are one time use.

```
curl -X POST https://api.heygen.com/v1/streaming.create_token -H "x-api-key: <api-key>"
```

### Which Avatars can I use with this project?

By default, there are several Public Interactive Avatars that can be used. You can find the Avatar IDs for these Avatars by navigating to labs.heygen.com/interactive-avatar and clicking 'Select Avatar'.

You can create your own Interactive Avatar to use with this API by visiting labs.heygen.com/interactive-avatar and clicking 'Create Interactive Avatar' at the bottom of the screen.

### Which voices can I use?

Most of HeyGen's AI Voices can be used with the API. To find the Voice IDs that you can use, please use the List Voices v2 endpoint from HeyGen: https://docs.heygen.com/reference/list-voices-v2

### Why am I encountering issues with testing?

Most likely, you are hitting your concurrent session limit. While testing this API with your Trial Token, only 3 concurrent sessions can be created. Please endeavor to close unused sessions with the Close Session endpoint when they are no longer being used; they will automatically close after some minutes.

You can check how many active sessions you have open with the List Sessions endpoint: https://docs.heygen.com/reference/list-sessions
