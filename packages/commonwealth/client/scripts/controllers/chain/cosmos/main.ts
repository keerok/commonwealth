import BN from 'bn.js';
import $ from 'jquery';
import { ChainBase } from 'common-common/src/types';
import { ChainInfo, IChainAdapter, ITokenAdapter } from 'models';
import { IApp } from 'state';
import { CosmosToken } from './types';
import CosmosAccount from './account';
import CosmosAccounts from './accounts';
import CosmosChain from './chain';
import CosmosGovernance from './governance';

class Cosmos extends IChainAdapter<CosmosToken, CosmosAccount> implements ITokenAdapter {
  public chain: CosmosChain;
  public accounts: CosmosAccounts;
  public governance: CosmosGovernance;
  public readonly base = ChainBase.CosmosSDK;

  constructor(
    meta: ChainInfo,
    app: IApp,
  ) {
    super(meta, app);
    this.chain = new CosmosChain(this.app);
    this.accounts = new CosmosAccounts(this.app);
    this.governance = new CosmosGovernance(this.app);
  }

  public async initApi() {
    await this.chain.init(this.meta);
    await this.accounts.init(this.chain);
    await super.initApi();
  }

  public async initData() {
    await this.governance.init(this.chain, this.accounts);
    await super.initData();
    await this.activeAddressHasToken(this.app.user?.activeAccount?.address);
  }

  public async deinit(): Promise<void> {
    await super.deinit();
    await this.governance.deinit();
    await this.accounts.deinit();
    await this.chain.deinit();
    console.log('Cosmos stopped.');
  }

  // token adapter implementation
  public readonly contractAddress: string; // undefined for native tokens
  public hasToken = false;
  public tokenBalance = new BN(0);
  public async activeAddressHasToken(activeAddress?: string): Promise<boolean> {
    if (!activeAddress) return false;
    this.hasToken = false;
    const account = this.accounts.get(activeAddress);

    const balanceResp = await $.post(`${this.app.serverUrl()}/tokenBalance`, {
      chain: this.meta.id,
      address: account.address,
      author_chain: account.chain.id,
    });
    if (balanceResp.result) {
      const balance = new BN(balanceResp.result, 10);
      this.hasToken = balance && !balance.isZero();
      if (balance) this.tokenBalance = balance;
    }
  }
}

export default Cosmos;
