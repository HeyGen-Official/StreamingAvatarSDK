import { createLocalAudioTrack, LocalAudioTrack, Room, Track } from 'livekit-client';
import { AbstractVoiceChatImplementation, VoiceChatConfig } from './base';
import { sleep } from '../utils';

export interface LivekitVoiceChatConfig extends VoiceChatConfig {
  room: Room;
}

export class LivekitVoiceChat extends AbstractVoiceChatImplementation<LivekitVoiceChatConfig> {
  private room: Room | null = null;
  private track: LocalAudioTrack | null = null;

  protected async _startVoiceChat(voiceChatConfig: LivekitVoiceChatConfig) {
    this.room = voiceChatConfig.room;
    this.track = await createLocalAudioTrack({
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    });
    if (voiceChatConfig.config?.defaultMuted) {
      this.mute();
    }
    await this.room.localParticipant.publishTrack(this.track);
    await sleep(4000);
  }

  protected async _stopVoiceChat() {
    if (this.room?.localParticipant) {
      this.room.localParticipant.getTrackPublications().forEach((publication) => {
        if (publication.track && publication.track.kind === Track.Kind.Audio) {
          publication.track.stop();
        }
      });
    }
    if (this.track) {
      this.track.stop();
      this.track = null;
    }
  }

  protected _mute(): void {
    this.track?.mute();
  }

  protected _unmute(): void {
    this.track?.unmute();
  }
}
