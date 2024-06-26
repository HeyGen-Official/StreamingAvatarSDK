/* tslint:disable */
/* eslint-disable */
/**
 * Streaming Avatar SDK
 * Heygen Streaming Avatar
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: api@heygen.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
import type { IceCandidate } from './IceCandidate';
import {
    IceCandidateFromJSON,
    IceCandidateFromJSONTyped,
    IceCandidateToJSON,
} from './IceCandidate';

/**
 * 
 * @export
 * @interface IceRequest
 */
export interface IceRequest {
    /**
     * 
     * @type {IceCandidate}
     * @memberof IceRequest
     */
    candidate?: IceCandidate;
    /**
     * 
     * @type {string}
     * @memberof IceRequest
     */
    sessionId?: string;
}

/**
 * Check if a given object implements the IceRequest interface.
 */
export function instanceOfIceRequest(value: object): boolean {
    return true;
}

export function IceRequestFromJSON(json: any): IceRequest {
    return IceRequestFromJSONTyped(json, false);
}

export function IceRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): IceRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'candidate': json['candidate'] == null ? undefined : IceCandidateFromJSON(json['candidate']),
        'sessionId': json['session_id'] == null ? undefined : json['session_id'],
    };
}

export function IceRequestToJSON(value?: IceRequest | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'candidate': IceCandidateToJSON(value['candidate']),
        'session_id': value['sessionId'],
    };
}

