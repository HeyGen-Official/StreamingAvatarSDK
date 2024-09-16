import { Room, RoomEvent, VideoPresets } from "livekit-client";

export interface StreamingAvatarApiConfig {
  token: string;
  basePath?: string;
}

export enum AvatarQuality {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}
export interface StartAvatarRequest {
  quality?: AvatarQuality;
  avatarName: string;
  voice?: { voiceId?: string };
  knowledgeId?: string;
}

export interface StartAvatarResponse {
  session_id: string,
  access_token: string,
  url: string,
  is_paid: boolean,
  session_duration_limit: number
}

export interface StartSessionRequest {
  sessionId: string;
}

export interface SpeakRequest {
  text: string;
  sessionId: string;
}

export interface InterruptRequest {
  sessionId: string;
}

export interface StopAvatarRequest {
  sessionId: string;
}

export interface CommonRequest {
  [key: string]: any;
}

// event types --------------------------------
export enum StreamingEvents {
  AVATAR_START_TALKING = 'avatar_start_talking',
  AVATAR_STOP_TALKING = 'avatar_stop_talking',
  AVATAR_TALKING_MESSAGE = 'avatar_talking_message',
  AVATAR_END_MESSAGE = 'avatar_end_message',
  USER_TALKING_MESSAGE = 'user_talking_message',
  USER_END_MESSAGE = 'user_end_message',
  USER_START = 'user_start',
  USER_STOP = 'user_stop',
  STREAM_READY = 'stream_ready',
  STREAM_DISCONNECTED = 'stream_disconnected',
}
export type EventHandler = (...args: any[]) => void;
export interface EventData {
  [key: string]: unknown;
  task_id: string;
}

export interface StreamingStartTalkingEvent extends EventData {
  type: StreamingEvents.AVATAR_START_TALKING;
}

export interface StreamingStopTalkingEvent extends EventData {
  type: StreamingEvents.AVATAR_STOP_TALKING;
}

export interface StreamingTalkingMessageEvent extends EventData {
  type: StreamingEvents.AVATAR_TALKING_MESSAGE;
  message: string;
}

export interface StreamingTalkingEndEvent extends EventData {
  type: StreamingEvents.AVATAR_END_MESSAGE;
}

export interface UserTalkingMessageEvent extends EventData {
  type: StreamingEvents.USER_TALKING_MESSAGE;
  message: string;
}

export interface UserTalkingEndEvent extends EventData {
  type: StreamingEvents.USER_END_MESSAGE;
}

export interface UserStartTalkingEvent {
  type: StreamingEvents.USER_START;
}
export interface UserStopTalkingEvent {
  type: StreamingEvents.USER_STOP;
}

export type StreamingEvents =
  | StreamingStartTalkingEvent
  | StreamingStopTalkingEvent
  | StreamingTalkingMessageEvent
  | StreamingTalkingEndEvent
  | UserTalkingMessageEvent
  | UserTalkingEndEvent
  | UserStartTalkingEvent
  | UserStopTalkingEvent;

class APIError extends Error {
  public status: number;
  public responseText: string;

  constructor(message: string, status: number, responseText: string) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.responseText = responseText;
  }
}

class StreamingAvatar {
  private eventTarget = new EventTarget();
  private readonly token: string;
  private readonly basePath: string;
  public room: Room | null = null;
  public mediaStream: MediaStream | null = null;

  constructor({
    token,
    basePath = "https://api.heygen.com",
  }: StreamingAvatarApiConfig) {
    this.token = token;
    this.basePath = basePath;
  }

  private getRequestUrl(endpoint: string): string {
    return `${this.basePath}${endpoint}`;
  }
  async createStartAvatar(requestData: StartAvatarRequest): Promise<any> {
    const sessionInfo = await this.newSession(requestData);

    const room = new Room({
      adaptiveStream: true,
      dynacast: true,
      videoCaptureDefaults: {
        resolution: VideoPresets.h720.resolution,
      },
    });

    this.room = room;
    this.mediaStream = null;

    room.on(RoomEvent.DataReceived, (roomMessage) => {
      let eventMsg: StreamingEvents | null = null;
      try {
        const messageString = new TextDecoder().decode(
          roomMessage as ArrayBuffer,
        );
        eventMsg = JSON.parse(messageString) as StreamingEvents;
      } catch (e) {
        console.error(e);
      }
      if (!eventMsg) {
        return;
      }
      this.emit(eventMsg.type, eventMsg);
    });

    // Create a new MediaStream to hold tracks
    const mediaStream = new MediaStream();
    let receiveVideoTrack = false;
    let receiveAudioTrack = false;
    room.on(RoomEvent.TrackSubscribed, (track, trackPublication) => {
      console.log('>>>>> room, ', trackPublication.kind);
      if (
        trackPublication.kind === "video" ||
        trackPublication.kind === "audio"
      ) {
        if (trackPublication.kind === 'video') {
          receiveVideoTrack = true;
        } else if (trackPublication.kind === 'audio') {
          receiveAudioTrack = true;
        }
        trackPublication.track?.mediaStream
          ?.getTracks()
          .forEach((mediaTrack) => {
            mediaStream.addTrack(mediaTrack);
          });
console.log('>>>>> mediaStream.getVideoTracks()', mediaStream.getVideoTracks(), mediaStream.getAudioTracks())
        if (
          receiveVideoTrack &&
          receiveAudioTrack &&
          !this.mediaStream
        ) {
          this.mediaStream = mediaStream;
          this.emit(StreamingEvents.STREAM_READY, this.mediaStream);
        }
      }
    });

    // Handle room disconnected event
    room.on(RoomEvent.Disconnected, (reason) => {
      this.emit(StreamingEvents.STREAM_DISCONNECTED, reason);
    });

    try {
      await room.prepareConnection(sessionInfo.url, sessionInfo.access_token);
    } catch (error) {}

    // Step 3: Start the avatar session
    await this.startSession({ sessionId: sessionInfo.session_id });

    // Step 4: Connect to the room
    await room.connect(sessionInfo.url, sessionInfo.access_token);

    return sessionInfo;
  }

  async request(path: string, params: CommonRequest): Promise<any> {
    try {
      const response = await fetch(this.getRequestUrl(path), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new APIError(
          `API request failed with status ${response.status}`,
          response.status,
          errorText
        );
      }

      const jsonData = await response.json();
      return jsonData.data
    } catch (error) {
      throw error;
    }
  }
  public async newSession(
    requestData: StartAvatarRequest,
  ): Promise<StartAvatarResponse> {
    return this.request("/v1/streaming.new", {
      avatar_name: requestData.avatarName,
      quality: requestData.quality,
      knowledge_base_id: requestData.knowledgeId,
      voice: requestData.voice,
      version: "v2",
      video_encoding: "H264",
    });
  }
  public async startSession(requestData: { sessionId: string }): Promise<any> {
    return this.request("/v1/streaming.start", {
      session_id: requestData.sessionId,
    });
  }
  public async speak(requestData: SpeakRequest): Promise<any> {
    return this.request("/v1/streaming.task", {
      text: requestData.text,
      session_id: requestData.sessionId,
      task_mode: 'async',
      task_type: 'talk',
    });
  }

  public async startListening(requestData: {sessionId: string}): Promise<any> {
    return this.request("/v1/streaming.start_listening", {
      session_id: requestData.sessionId,
    });
  }
  public async stopListening(requestData: {sessionId: string}): Promise<any> {
    return this.request("/v1/streaming.stop_listening", {
      session_id: requestData.sessionId,
    });
  }
  public async interrupt(requestData: InterruptRequest): Promise<any> {
    return this.request("/v1/streaming.interrupt", {
      session_id: requestData.sessionId,
    });
  }

  public async stopAvatar(requestData: StopAvatarRequest): Promise<any> {
    return this.request("/v1/streaming.stop", {
      session_id: requestData.sessionId,
    });
  }

  private emit(eventType: string, detail?: any) {
    const event = new CustomEvent(eventType, { detail });
    this.eventTarget.dispatchEvent(event);
  }

  on(eventType: string, listener: EventHandler): this {
    this.eventTarget.addEventListener(eventType, listener);
    return this;
  }

  off(eventType: string, listener: EventHandler): this {
    this.eventTarget.removeEventListener(eventType, listener);
    return this;
  }
}

export default StreamingAvatar;
