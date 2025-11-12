import { Observable, Subject, of, merge } from 'rxjs';
import { bufferTime, mergeMap, filter, map, tap, share } from 'rxjs/operators';
import { HomieObserver, HomieEvent, HomieEventType } from './HomieObserver';
import logger from './logger';
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

export class HomiePropertyBuffer {
  private propertyUpdates$: Subject<BufferedPropertyUpdate> = new Subject();
  private propertyGroups: PropertyGroup[] = [];
  private bufferedUpdates$: Observable<BufferedPropertyUpdate[]>;

  constructor(
    private homieObserver: HomieObserver, 
    private bufferTimeMs: number = 100
  ) {
    logger.info('HomiePropertyBuffer constructor called');
    this.setupPropertyUpdateStream();
    this.bufferedUpdates$ = this.setupBufferedUpdatesStream();
  }

  public addPropertyGroup(group: PropertyGroup) {
    this.propertyGroups.push(group);
  }

  private getPropertyPriority(nodeId: string, propertyId: string): number {
    const group = this.propertyGroups.find(g => 
      g.properties.includes(`${nodeId}/${propertyId}`)
    );
    return group ? group.priority : 0;
  }

  private setupPropertyUpdateStream() {
    logger.info('Setting up property update stream');
    merge(this.homieObserver.created$, this.homieObserver.updated$)
      .pipe(
        tap((event: HomieEvent) => logger.debug('Received event in setupPropertyUpdateStream', { event })),
        filter((event: HomieEvent) => event.type === HomieEventType.Property),
        map((event: HomieEvent) => {
          if (event.type === HomieEventType.Property) {
            logger.debug('Processing property event', { event });
            const update: BufferedPropertyUpdate = {
              deviceId: event.device.id,
              nodeId: event.node.id,
              propertyId: event.property.id,
              value: event.property.value,
              priority: this.getPropertyPriority(event.node.id, event.property.id)
            };
            logger.debug('Created BufferedPropertyUpdate', { update });
            return update;
          }
          throw new Error('Unexpected event type');
        }),
        tap((update: BufferedPropertyUpdate) => {
          logger.debug('Emitting update to propertyUpdates$', { update });
          this.propertyUpdates$.next(update);
        })
      )
      .subscribe({
        next: () => logger.debug('Subscription in setupPropertyUpdateStream emitted a value'),
        error: (err) => logger.error('Error in setupPropertyUpdateStream', { error: err }),
        complete: () => logger.info('Subscription in setupPropertyUpdateStream completed')
      });
  }

  private setupBufferedUpdatesStream(): Observable<BufferedPropertyUpdate[]> {
    logger.info('Setting up buffered updates stream');
    return this.propertyUpdates$.pipe(
      tap(() => logger.debug('propertyUpdates$ emitted a value')),
      bufferTime(this.bufferTimeMs),
      tap((updates: BufferedPropertyUpdate[]) => logger.debug('Buffered updates', { updates })),
      filter((updates: BufferedPropertyUpdate[]) => updates.length > 0),
      map((updates: BufferedPropertyUpdate[]) => {
        // Sort updates by priority (highest first) and then by the order of properties in their group
        const sortedUpdates = updates.sort((a, b) => {
          if (a.priority !== b.priority) {
              return b.priority - a.priority;
          }
          const groupA = this.propertyGroups.find(g => g.properties.includes(`${a.nodeId}/${a.propertyId}`));
          const groupB = this.propertyGroups.find(g => g.properties.includes(`${b.nodeId}/${b.propertyId}`));
          if (groupA && groupB && groupA === groupB) {
              return groupA.properties.indexOf(`${a.nodeId}/${a.propertyId}`) - 
                  groupB.properties.indexOf(`${b.nodeId}/${b.propertyId}`);
          }
          return 0;
        });
        logger.debug('Sorted updates', { updates });
        return updates;
        }),
        share()
    );
    }
    


  public getBufferedUpdates(): Observable<BufferedPropertyUpdate[]> {
    logger.info('Getting buffered updates');
    return this.bufferedUpdates$;
  }

  public processBufferedUpdates(processor: (updates: BufferedPropertyUpdate[]) => void) {
    logger.info('Setting up buffered updates processor');
    this.getBufferedUpdates().subscribe({
      next: (updates) => {
        logger.debug('Processing buffered updates', { updates });
        processor(updates);
      },
      error: (err) => logger.error('Error in processBufferedUpdates', { error: err }),
      complete: () => logger.info('processBufferedUpdates subscription completed')
    });
  }
}
