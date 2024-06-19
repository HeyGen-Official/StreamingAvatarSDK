
export function parseEvent(jsonString: string): CustomEvent | null {
    try {
        const obj = JSON.parse(jsonString);
        if (obj !== null) {
            let ret = new CustomEvent(obj.type, { detail: obj });
            console.debug('Parsed event:', ret);
            return ret
        } else {
            console.warn('Unknown event type:', obj);
            return null;
        }
    } catch (error) {
        console.error('Failed to parse JSON:', error);
        return null;
    }
}