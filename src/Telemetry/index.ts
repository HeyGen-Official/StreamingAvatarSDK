import StreamingAvatar, {StreamingEvents} from '../index';
import { ConnectionQuality } from '../QualityIndicator';

export class Telemetry {
  private basePath: string;
  private avatar: StreamingAvatar;

  constructor({
    basePath = 'https://api.heygen.com',
    avatar,
  }: {
    basePath?: string;
    avatar: StreamingAvatar;
  }) {
    this.basePath = basePath;
    this.avatar = avatar;
  }

  private async send(data: any): Promise<any> {
    try {
      // TODO: use correct endpoint
      fetch(`${this.basePath}/telemetry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      throw error;
    }
  }

  private onQualityChanged(quality: ConnectionQuality) {
    this.send({
      type: 'connection_quality',
      quality,
    });
  }

  public start() {
    this.avatar.on(StreamingEvents.CONNECTION_QUALITY_CHANGED, this.onQualityChanged);
  }

  public stop() {
    this.avatar.off(StreamingEvents.CONNECTION_QUALITY_CHANGED, this.onQualityChanged);
  }
}
