export enum ConnectionQuality {
  UNKNOWN = 'UNKNOWN',
  GOOD = 'GOOD',
  BAD = 'BAD',
}

type ChildTrackerConfig<T, U> = {
  TrackerClass: new (
    onConnectionQualityChanged: (quality: ConnectionQuality) => void
  ) => AbstractConnectionQualityIndicator<U>;
  getParams: (params: T) => U;
};

export abstract class AbstractConnectionQualityIndicator<T> {
  private _selfConnectionQuality: ConnectionQuality = ConnectionQuality.UNKNOWN;
  private _connectionQuality: ConnectionQuality = ConnectionQuality.UNKNOWN;
  protected readonly onConnectionQualityChanged: (quality: ConnectionQuality) => void;
  protected readonly childTrackerClasses: ChildTrackerConfig<T, any>[] = [];
  private childTrackers: {
    tracker: AbstractConnectionQualityIndicator<any>;
    getParams: (params: T) => any;
  }[] = [];

  constructor(onConnectionQualityChanged: (quality: ConnectionQuality) => void) {
    this.onConnectionQualityChanged = onConnectionQualityChanged;
    this.childTrackers = this.childTrackerClasses.map(({ getParams, TrackerClass }) => ({
      tracker: new TrackerClass(() => this.handleStatsChanged(true)),
      getParams,
    }));
  }

  get connectionQuality(): ConnectionQuality {
    return this._connectionQuality;
  }

  private getJointConnectionQuality(): ConnectionQuality {
    const connectionQualities = [
      this._selfConnectionQuality,
      ...this.childTrackers.map(({ tracker }) => tracker.connectionQuality),
    ];

    if (connectionQualities.some((quality) => quality === ConnectionQuality.BAD)) {
      return ConnectionQuality.BAD;
    }
    if (connectionQualities.every((quality) => quality === ConnectionQuality.UNKNOWN)) {
      return ConnectionQuality.UNKNOWN;
    }
    return ConnectionQuality.GOOD;
  }

  protected handleStatsChanged(fromChild?: boolean) {
    if (!fromChild) {
      this._selfConnectionQuality = this.calculateConnectionQuality();
    }
    const newConnectionQuality = this.getJointConnectionQuality();
    if (newConnectionQuality !== this._connectionQuality) {
      this._connectionQuality = newConnectionQuality;
      this.onConnectionQualityChanged(newConnectionQuality);
    }
  }

  protected abstract calculateConnectionQuality(): ConnectionQuality;
  protected abstract _start(params: T): void;
  protected abstract _stop(): void;

  public start(params: T) {
    this.stop();
    this._start(params);
    this.childTrackers.forEach(({ tracker, getParams }) =>
      tracker.start(getParams(params))
    );
  }

  public stop() {
    this._stop();
    this.childTrackers.forEach(({ tracker }) => tracker.stop());
    this._selfConnectionQuality = ConnectionQuality.UNKNOWN;
    this._connectionQuality = ConnectionQuality.UNKNOWN;
  }
}
