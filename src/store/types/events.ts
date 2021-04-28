type EntityType = 'network';
type ActionType = 'create' | 'delete';

export type EventDesc = {
  id: string;
  entityType: EntityType;
  actionType: ActionType;
};

export function encodeEventDesc(desc: EventDesc): string {
  return JSON.stringify(desc);
}

export function decodeEventDesc(desc: string): EventDesc {
  return JSON.parse(desc);
}
