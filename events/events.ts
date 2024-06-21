export type EventType = 'avatar_start_talking' | 'avatar_stop_talking';

export interface StreamingAvatarEvent{
    type: EventType;
}


export interface AvatarStartTalkingEvent extends StreamingAvatarEvent {
    type: 'avatar_start_talking';
    task_id: string;
}


export interface AvatarStopTalkingEvent extends StreamingAvatarEvent {
    type: 'avatar_stop_talking';
    task_id: string;
}

export interface EventMap {
    'avatar_start_talking': AvatarStartTalkingEvent;
    'avatar_stop_talking': AvatarStopTalkingEvent;
}
