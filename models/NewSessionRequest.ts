/* tslint:disable */
/* eslint-disable */
/**
 * Streaming Avatar SDK
 * Heygen Streaming Avatar
 *
 * The version of the OpenAPI document: 1.0.4
 * Contact: api@heygen.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
import type { NewSessionRequestVoice } from './NewSessionRequestVoice';
import {
    NewSessionRequestVoiceFromJSON,
    NewSessionRequestVoiceFromJSONTyped,
    NewSessionRequestVoiceToJSON,
} from './NewSessionRequestVoice';

/**
 * 
 * @export
 * @interface NewSessionRequest
 */
export interface NewSessionRequest {
    /**
     * 
     * @type {string}
     * @memberof NewSessionRequest
     */
    quality?: NewSessionRequestQualityEnum;
    /**
     * 
     * @type {string}
     * @memberof NewSessionRequest
     */
    avatarName?: string;
    /**
     * 
     * @type {NewSessionRequestVoice}
     * @memberof NewSessionRequest
     */
    voice?: NewSessionRequestVoice;
    /**
     * 
     * @type {string}
     * @memberof NewSessionRequest
     */
    knowledgeBase?: string;
}


/**
 * @export
 */
export const NewSessionRequestQualityEnum = {
    Low: 'low',
    Medium: 'medium',
    High: 'high'
} as const;
export type NewSessionRequestQualityEnum = typeof NewSessionRequestQualityEnum[keyof typeof NewSessionRequestQualityEnum];


/**
 * Check if a given object implements the NewSessionRequest interface.
 */
export function instanceOfNewSessionRequest(value: object): value is NewSessionRequest {
    return true;
}

export function NewSessionRequestFromJSON(json: any): NewSessionRequest {
    return NewSessionRequestFromJSONTyped(json, false);
}

export function NewSessionRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): NewSessionRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'quality': json['quality'] == null ? undefined : json['quality'],
        'avatarName': json['avatar_name'] == null ? undefined : json['avatar_name'],
        'voice': json['voice'] == null ? undefined : NewSessionRequestVoiceFromJSON(json['voice']),
        'knowledgeBase': json['knowledge_base'] == null ? undefined : json['knowledge_base'],
    };
}

export function NewSessionRequestToJSON(value?: NewSessionRequest | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'quality': value['quality'],
        'avatar_name': value['avatarName'],
        'voice': NewSessionRequestVoiceToJSON(value['voice']),
        'knowledge_base': value['knowledgeBase'],
    };
}

