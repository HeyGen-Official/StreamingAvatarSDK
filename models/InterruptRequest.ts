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
/**
 * 
 * @export
 * @interface InterruptRequest
 */
export interface InterruptRequest {
    /**
     * 
     * @type {string}
     * @memberof InterruptRequest
     */
    sessionId?: string;
}

/**
 * Check if a given object implements the InterruptRequest interface.
 */
export function instanceOfInterruptRequest(value: object): value is InterruptRequest {
    return true;
}

export function InterruptRequestFromJSON(json: any): InterruptRequest {
    return InterruptRequestFromJSONTyped(json, false);
}

export function InterruptRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): InterruptRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'sessionId': json['session_id'] == null ? undefined : json['session_id'],
    };
}

export function InterruptRequestToJSON(value?: InterruptRequest | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'session_id': value['sessionId'],
    };
}
