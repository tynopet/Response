declare module 'Response' {
    import EventEmitter from 'events';

    export type StateListener = ((key: string) => any) | EventEmitter;
    export type Listener = ((...args: any[]) => any) | EventEmitter;


    export class State<R> extends EventEmitter {
        static EVENT_CHANGE_STATE: 'changeState';
        static STATE_ERROR: 'error';

        static isState(state: any): boolean; //%checks (it instanceof State);
        static create<R>(Class: Function, copyStatic?: boolean): { new (...args: unknown[]): State<R> };
        static invoke<A extends unknown[], R>(fn: (...args: A) => R, args: A | null | undefined, thisArg?: any): R;

        isState: true;
        state: string | null | undefined;
        data: {[key: string]: any};
        keys: string[];
        stateData: any[];

        constructor(state: string | undefined | void);

        invoke<A extends unknown[], R>(fn: (...args: A) => R, args: A | null | undefined, thisArg?: any): R;
        destroy(recursive: boolean | undefined | null): this;
        is(state: string): boolean;
        setState(state: string, data: any): this;
        onState(state: string, listener: StateListener, thisArg?: any): this;
        onceState(state: string, listener: StateListener, thisArg?: any): this;
        onChangeState(listener: Listener, thisArg?: any): this;
        offChangeState(listener: Listener): this;
        setData(key: string, value: any): this;
        getData(key?: string): any;
        getStateData(key: string): any;
        toObject(keys?: string[]): Object;
        toJSON(): Object;
        setKeys(keys?: string[]): this;
    }

    export default class Response<R> extends State<R> {
    // Т.к. часто используется без отдельного импорта.
    static State: typeof State;
    static Queue: typeof Queue;

    static STATE_PENDING: 'pending';
    static STATE_RESOLVED: 'resolve';
    static STATE_REJECTED: 'error';
    static EVENT_PROGRESS: 'progress';

    static isResponse(any): boolean; //%checks (it instanceof Response);
    static resolve<R>(R: any): Response<R>;
    static reject<R>(R: any): Response<R>;

    isResponse: true;

    constructor(parent?: Response<any> | Promise<any>);

    pending(): this;
    resolve(arg: any): this;
    reject(arg: any): this;
    progress(arg: any): this;
    isPending(): boolean;
    isResolved(): boolean;
    isRejected(): boolean;

    then(onResolve?: Listener, onReject?: Listener, onProgress?: Listener, thisArg?: any): this;
    any(listener: Listener, thisArg?: any): this;
    onPending(listener: Listener, thisArg?: any): this;
    onResolve(listener: Listener, thisArg?: any): this;
    onReject(listener: Listener, thisArg?: any): this;
    onProgress(listener: Listener, thisArg?: any): this;
    notify(arg: Response<any>): this;
    listen(arg: Response<any>): this;
    done(): this;
    fork(): Response<any>;
    map(listener: Listener, thisArg?: any): this;
    getResult(key: string): any;
    getReason(): any;
    }

    export class Queue extends Response<any> {
        static EVENT_START: 'start';
        static EVENT_STOP: 'stop';
        static EVENT_NEXT_ITEM: 'nextItem';
        static EVENT_ITEM_REJECTED: 'itemRejected';

        static isQueue(any): boolean; //%checks (it instanceof Queue);

        isQueue: true;
        items: any[];
        item: any;
        isStarted: boolean;
        isStrict: boolean;
        context: any;

        constructor(items: undefined | null | Queue[] | Promise<any>[] | Function[] | any[], start?: boolean);

        start(args?: any[]): this;
        stop(): this;
        push(item: Response<any> | Function, name: string): this;
        strict(flag?: boolean): this;
        onStart(listener: Listener, thisArg?: any): this;
        onStop(listener: Listener, thisArg?: any): this;
        onNextItem(listener: Listener, thisArg?: any): this;
        onItemRejected(listener: Listener, thisArg?: any): this;
        bind(thisArg?: any): this;
    }
}