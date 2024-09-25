import { Observable } from 'rxjs';
import { HomieObserver } from './HomieObserver';
interface BufferedPropertyUpdate {
    deviceId: string;
    nodeId: string;
    propertyId: string;
    value: any;
    priority: number;
}
interface PropertyGroup {
    name: string;
    properties: string[];
    priority: number;
}
export declare class HomiePropertyBuffer {
    private homieObserver;
    private bufferTimeMs;
    private propertyUpdates$;
    private propertyGroups;
    private bufferedUpdates$;
    constructor(homieObserver: HomieObserver, bufferTimeMs?: number);
    addPropertyGroup(group: PropertyGroup): void;
    private getPropertyPriority;
    private setupPropertyUpdateStream;
    private setupBufferedUpdatesStream;
    getBufferedUpdates(): Observable<BufferedPropertyUpdate[]>;
    processBufferedUpdates(processor: (updates: BufferedPropertyUpdate[]) => void): void;
}
export {};
