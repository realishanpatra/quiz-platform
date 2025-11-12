import { DocumentReference } from 'firebase/firestore';

// 1. Define a simple event emitter
class EventEmitter {
  private events: { [key: string]: Function[] } = {};

  on(event: string, listener: Function) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  emit(event: string, payload: any) {
    if (this.events[event]) {
      this.events[event].forEach(listener => listener(payload));
    }
  }
}

export const errorEmitter = new EventEmitter();

// 2. Define the custom error class
export class FirestorePermissionError extends Error {
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  ref: DocumentReference;
  resource?: any;

  constructor(
    operation: 'get' | 'list' | 'create' | 'update' | 'delete',
    ref: DocumentReference,
    resource?: any
  ) {
    const message = `Firestore Permission Denied: Cannot ${operation} document at path ${ref.path}.`;
    super(message);
    this.name = 'FirestorePermissionError';
    this.operation = operation;
    this.ref = ref;
    this.resource = resource;
    
    // This is for environments like Node.js
    if (typeof (Error as any).captureStackTrace === 'function') {
      (Error as any).captureStackTrace(this, FirestorePermissionError);
    }
  }
}
