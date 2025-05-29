## Interactive-Avatar

## 2.0.16
1. Add support `activityIdleTimeout` to control time before session ending after last activity.
2. Add `keepAlive` method to continue session in a controlled way.
3. Deprecate `disableIdleTimeout`, `activityIdleTimeout` and `keepAlive` should be used instead.

## Changes 2.0.13
1. Added support for LiveKit for user audio and text messages input.

## Changes 2.0.12
1. Added support for quality indicator.

## Changes 2.0.11
1. Added support for elevenlabs `eleven_flash_v2_5` and `eleven_multilingual_v2` models.
2. Added gladia STT provider option.

## Changes 2.0.10
1. Added support for muting users audio during voice chat.

## Changes 2.0
1. Added support for voice chat.

## Changes 2.0.0-beta.1
1. Added more API events.
2. Smoother video experience.
3. Added control for avatar listening state.

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

```JS
import StreamingAvatar, { AvatarQuality, StreamingEvents } from '@heygen/streaming-avatar';

let streamingAvatar;
async function startChatCreation(){
    streamingAvatar = new StreamingAvatar({token: 'ENTER_ACCESS_TOKEN_HERE'});

    // some events
    streamingAvatar.on(StreamingEvents.AVATAR_START_TALKING, (e) => {});
    streamingAvatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {});
    streamingAvatar.on(StreamingEvents.STREAM_READY, (event) => {});

    const sessionInfo = await streamingAvatar.createStartAvatar({
        quality: AvatarQuality.Low,
        avatarName: avatarId,
        knowledgeId: knowledgeId, // from labs.heygen.com
        // knowledgeBase: knowledgeBase, // your customized prompt content
        voice: {
          voiceId: voiceId,
          rate: 1.5, // 0.5 ~ 1.5
          emotion: VoiceEmotion.EXCITED,
          // elevenlabsSettings: {} // https://docs.heygen.com/reference/new-session#voicesetting
          // model: ElevenLabsModel.MULTILINGUAL, elevenlabs audio model
        },
        sttSettings: {
          provider: STTProvider.DEEPGRAM, // STT provider to use. The default is DEEPGRAM.
          confidence: 0.55, // The default is 0.55.
        },
        language: language,
        // disableIdleTimeout: false, // Default is false; enable cautiously.
        voiceChatTransport?: VoiceChatTransport.WEBSOCKET, // user input transport. The default is WEBSOCKET
        // number of seconds that avatar will wait before closing session after last activity, 
        // expects value from 30 to 3600 (1h)
        activityIdleTimeout?: number, // The default is 120 (2 minutes)
    });
    
    // switch to voice chat. in this mode, we will record your voice and keep chatting with avatar in real time.
    await streamingAvatar.startVoiceChat({
      useSilencePrompt: true, // the default is false. true means you will receive silence prompts.
      isInputAudioMuted: true, // the default is false. you can also handle `mute` by using streamingAvatar.muteInputAudio(), streamingAvatar.unmuteInputAudio().
    });
}

// In text mode, please use the speak method (Default TALK type).
streamingAvatar.speak({ text: text, task_type: TaskType.REPEAT, taskMode: TaskMode.SYNC });

// Please note, you can use the speak method in voice chat, but only the TALK type is supported in voice chat mode.
streamingAvatar.speak({ text: text })

// close voice chat, will stop recording your voice.
streamingAvatar.closeVoiceChat();

// close the session
streamingAvatar.stopAvatar();

// keep session alive, will be count as an activity to keep session for additional `activityIdleTimeout` seconds
// after last activity.
streamingAvatar.keepAlive();

// interrupt the avatar's talking
streamingAvatar.interrupt();

// it's helpful in text mode. `startListening` will let the avatar switch to listening state.
streamingAvatar.startListening();
streamingAvatar.stopListening();
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

### Why am I encountering issues with testing?

Most likely, you are hitting your concurrent session limit. While testing this API with your Trial Token, only 3 concurrent sessions can be created. Please endeavor to close unused sessions with the Close Session endpoint when they are no longer being used; they will automatically close after some minutes.

You can check how many active sessions you have open with the List Sessions endpoint: https://docs.heygen.com/reference/list-sessions
