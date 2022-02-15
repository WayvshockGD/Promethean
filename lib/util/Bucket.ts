
// https://www.npmjs.com/package/ratelimit-wait

import PrometheanError from "../errors/PrometheanError";

// Ratelimit bucket fitted for promethean
export class RatelimitWait<T> {
    public bucketSize: number;
    public rejectOver: number | undefined;
    public bucketOffset: number;
    public bucket: Array<number>;
    public refillTime: number | undefined;

    constructor(options: BucketOptions) {
        this.bucketOffset = 0;

        if ((typeof options.bucketSize) != 'number') {
            throw new PrometheanError('no bucket size specified!');
        } else if (options.bucketSize < 1) {
            throw new PrometheanError('bucketSize can\'t be less than 1!');
        } else if (options.bucketSize % 1 != 0) {
            throw new PrometheanError('bucketSize has to be an integer!');
        }

        this.bucketSize = options.bucketSize;
        this.setRefillTime(options.refillTime);

        if (options.hasOwnProperty('rejectOver')) {
            if (((typeof options.rejectOver) != 'number') || (options.rejectOver! < 0)) {
                throw new PrometheanError('rejectOver must be a non-negative number!');
            }

            this.rejectOver = options.rejectOver;
        }

        this.bucket = new Array(options.bucketSize);
        this.bucket.fill(0);
    }

    wait() {
        return new Promise<T>((resolve, reject) => {
            let delay = this.consume();

            if (delay == 0) {
                // @ts-ignore
                resolve();
            } else {
                setTimeout(resolve, delay);
            }
        });
    }

    consume() {
        let delay = this.getWait();
        let now = Date.now();

        if ('rejectOver' in this) {
            if (delay > this.rejectOver!) {
                throw new PrometheanError('Wait time is higher than threshold!');
            }
        }

        this.bucket[this.bucketOffset] = now + delay;
        this.bucketOffset++;
        this.bucketOffset %= this.bucketSize;

        return delay;
    }

    getWait() {
        let now = Date.now();
        let delay = Math.max(this.bucket[this.bucketOffset] - now + this.refillTime!, 0);

        return delay;
    }

    setRefillTime(newTime: number) {
        if ((typeof newTime) != 'number') {
            throw new PrometheanError('refill time must be a number!');
        } else if (newTime < 0) {
            throw new PrometheanError('bucket can\'t take negative time to refill');
        }

        this.refillTime = newTime;
    }
}


export interface BucketOptions {
    bucketSize: number;
    refillTime: number;
    rejectOver?: number;
}