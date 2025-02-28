import { EventEmitter } from 'events';
import { ITransactionResult } from 'models';

export type TxDataState = Partial<ITransactionResult> & {
  error?: Error;
  events?: EventEmitter;
};

export type StageName = 'intro' | 'waiting' | 'success' | 'rejected';

export type NextFn = (newStage: StageName, newData?: TxDataState) => void;
