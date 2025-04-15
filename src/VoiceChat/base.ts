export enum VoiceChatState {
  INACTIVE = 'inactive',
  STARTING = 'starting',
  ACTIVE = 'started',
  STOPPING = 'stopping',
}

export interface VoiceChatConfig {
  config?: { defaultMuted?: boolean };
}

export abstract class AbstractVoiceChat<T extends VoiceChatConfig = VoiceChatConfig> {
  abstract get isMuted(): boolean;
  abstract get isVoiceChatting(): boolean;
  abstract startVoiceChat(config: T): Promise<void>;
  abstract stopVoiceChat(): Promise<void>;
  abstract mute(): void;
  abstract unmute(): void;
}

export abstract class AbstractVoiceChatImplementation<T extends VoiceChatConfig = VoiceChatConfig> extends AbstractVoiceChat<T> {
  private _isMuted: boolean = true;
  protected state: VoiceChatState = VoiceChatState.INACTIVE;

  public get isMuted(): boolean {
    return this._isMuted;
  }

  public get isVoiceChatting(): boolean {
    return this.state !== VoiceChatState.INACTIVE;
  }

  protected abstract _startVoiceChat(voiceChatConfig: T): Promise<void>;
  protected abstract _stopVoiceChat(): Promise<void>;

  public async startVoiceChat(voiceChatConfig: T) {
    if (this.state !== VoiceChatState.INACTIVE) {
      await this.stopVoiceChat();
    }
    try {
      this.state = VoiceChatState.STARTING;
      await this._startVoiceChat(voiceChatConfig);
      this.state = VoiceChatState.ACTIVE;
    } catch (e) {
      await this.stopVoiceChat();
      throw e;
    }
  }

  public async stopVoiceChat() {
    if (this.state === VoiceChatState.INACTIVE) {
      return;
    }
    this.state = VoiceChatState.STOPPING;
    await this._stopVoiceChat();
    this._isMuted = true;
    this.state = VoiceChatState.INACTIVE;
  }

  protected _mute(): void {
    return;
  }

  protected _unmute(): void {
    return;
  }

  public mute() {
    if (!this.isVoiceChatting) {
      return;
    }
    this._mute();
    this._isMuted = true;
  }

  public unmute() {
    if (!this.isVoiceChatting) {
      return;
    }
    this._unmute();
    this._isMuted = false;
  }
}
