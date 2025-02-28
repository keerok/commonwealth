/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-restricted-globals */
import 'pages/admin.scss';

import $ from 'jquery';
import m from 'mithril';
import { ISubmittableResult } from '@polkadot/types/types';

import app from 'state';
import Sublayout from 'views/sublayout';
import { blockperiodToDuration, formatDuration } from 'helpers';
import { formatCoin } from 'adapters/currency';
import Substrate from 'controllers/chain/substrate/main';
import { SubstrateAccount } from 'controllers/chain/substrate/account';

import EdgewareFunctionPicker from 'views/components/edgeware_function_picker';
import { DropdownFormField } from 'views/components/forms';
import User from 'views/components/widgets/user';
import { PageLoading } from 'views/pages/loading';

interface ISudoFormState {
  txProcessing: boolean;
  resultText: string;
}

const SudoForm: m.Component<{}, ISudoFormState> = {
  view: (vnode) => {
    const author = app.user.activeAccount as SubstrateAccount;
    if (!(app.chain as Substrate).chain.sudoKey) {
      return m(
        '.SudoForm',
        {
          style:
            'padding: 20px 24px; border: 1px solid #eee; margin-bottom: 40px;',
        },
        'No sudo key available on this chain.'
      );
    }

    if (author && author.address !== (app.chain as Substrate).chain.sudoKey) {
      return m(
        '.SudoForm',
        {
          style:
            'padding: 20px 24px; border: 1px solid #eee; margin-bottom: 40px;',
        },
        [
          'Must be logged into admin account to use Sudo: ',
          m(User, {
            user: app.chain.accounts.get(
              (app.chain as Substrate).chain.sudoKey
            ),
          }),
        ]
      );
    }

    let keyring;
    try {
      // keyring = author.getKeyringPair();
      // TODO: FIXME: we do not support unlocking with seed/mnemonic, so we will need to use
      //   the signer from Polkadotjs web wallet to perform sudo actions.
    } catch (e) {
      return m(
        '.SudoForm',
        {
          style:
            'padding: 20px 24px; border: 1px solid #eee; margin-bottom: 40px;',
        },
        'Account must be unlocked to use Sudo.'
      );
    }

    return m(
      '.SudoForm',
      {
        style:
          'width: 80%; padding: 5px 24px; border: 1px solid #eee; margin-bottom: 15px;',
      },
      [
        m(
          'h2.header',
          { style: 'margin: 15px 0;' },
          'Sudo: run function as Admin'
        ),
        m(EdgewareFunctionPicker),
        m(
          'button',
          {
            type: 'submit',
            disabled: vnode.state.txProcessing,
            onclick: (e) => {
              e.preventDefault();
              const call = EdgewareFunctionPicker.getMethod();
              vnode.state.txProcessing = true;
              vnode.state.resultText = 'Waiting...';
              m.redraw();
              (app.chain as Substrate).chain.api.tx.sudo
                .sudo(call)
                .signAndSend(keyring, (result: ISubmittableResult) => {
                  if (result.isCompleted) {
                    vnode.state.txProcessing = false;
                    if (result.isFinalized) {
                      vnode.state.resultText = 'Action completed successfully.';
                    } else {
                      vnode.state.resultText = 'Action was unsuccessful.';
                    }
                    m.redraw();
                  }
                });
            },
          },
          'Submit Action'
        ),
        m('h4.header', { style: 'margin: 15px 0;' }, vnode.state.resultText),
        m('br'),
      ]
    );
  },
};

const ChainStats: m.Component<{}> = {
  view: () => {
    const header = (label) =>
      m('h4.header', { style: 'margin: 15px 0;' }, label);
    const stat = (label, content) =>
      m('.stat', [m('.label', label), m('.value', content)]);
    const formatBlocks = (blocks) => [
      blocks,
      ' blocks - ',
      formatDuration(blockperiodToDuration(blocks)),
    ];

    return m(
      '.ChainStats',
      {
        style:
          'padding: 5px 24px; border: 1px solid #eee; margin-bottom: 40px;',
      },
      [
        m(
          'style',
          '.ChainStats .stat > * { display: inline-block; width: 50%; }'
        ),
        header('ChainInfo'),
        stat('ChainInfo', app.activeChainId()),
        stat('ChainInfo Name', app.chain.name?.toString()),
        stat('ChainInfo Version', app.chain.version?.toString()),
        stat('ChainInfo Runtime', app.chain.runtimeName?.toString()),
        header('Block Production'),
        stat('Current block', app.chain.block?.height),
        stat(
          'Last block created',
          app.chain.block?.lastTime.format('HH:mm:ss')
        ),
        stat('Target block time', `${app.chain.block?.duration} sec`),
        header('Balances'),
        stat(
          'Total EDG',
          formatCoin((app.chain as Substrate).chain.totalbalance)
        ),
        stat(
          'Existential deposit',
          formatCoin((app.chain as Substrate).chain.existentialdeposit)
        ),
        // stat('Transfer fee',        formatCoin((app.chain as Substrate).chain.transferfee)),
        header('Democracy Proposals'),
        stat(
          'Launch period',
          formatBlocks((app.chain as Substrate).democracyProposals.launchPeriod)
        ),
        stat(
          'Minimum deposit',
          formatCoin((app.chain as Substrate).democracyProposals.minimumDeposit)
        ),
        header('Phragmen Elections'),
        stat(
          'Term length',
          formatBlocks((app.chain as Substrate).phragmenElections.termDuration)
        ),
        stat(
          'Voting bond',
          formatCoin((app.chain as Substrate).phragmenElections.votingBond)
        ),
        stat(
          'Candidacy bond',
          formatCoin((app.chain as Substrate).phragmenElections.candidacyBond)
        ),
        m('br'),
      ]
    );
  },
};

/*
const ProposalCreationRow = {
  view: (vnode) => {
    return m('span', [
      m('p', `Create ${vnode.attrs.name} proposal`),
      m('button', {
        class: vnode.state.inprogress ? 'disabled' : '',
        onclick: (e) => {
          e.preventDefault();
          vnode.state.inprogress = true;
          vnode.attrs.func().subscribe(
            (e: SubmittableResult) => {
              if (e.status.isReady) {
                vnode.state.inprogress = true;
              } else if (e.status.isFinalized) {
                vnode.state.inprogress = false;
              } else {
                console.log(e);
                vnode.state.inprogress = false;
                throw new Error(e.status.type.toString());
              }
            },
            (e: Error) => {
              console.log(`${vnode.attrs.name} proposal err`, e);
            }
          );
        }
      }, vnode.state.inprogress ? 'Creating proposal' : 'Create proposal')
    ]);
  }
};
*/

interface IAdminActionsState {
  inprogress: boolean;
  disabled: boolean;
  success: boolean;
  failure: boolean;
  error: string;
  profiles: object;
  selected_profile: string;
  role: string;
}

const AdminActions: m.Component<{}, IAdminActionsState> = {
  oninit: (vnode: m.VnodeDOM<{}, IAdminActionsState>) => {
    const profiles = app.profiles.store.getAll();
    vnode.state.profiles = {};

    for (const profile in profiles) {
      if (profile) {
        vnode.state.profiles[profile] = {
          address: profiles[profile].address,
          name: profiles[profile].name,
        };
      }
    }
  },
  view: (vnode: m.VnodeDOM<{}, IAdminActionsState>) => {
    let adminChoices;
    if (vnode.state.profiles) {
      adminChoices = Object.keys(vnode.state.profiles).map((key) => {
        return vnode.state.profiles[key].address;
      });
      vnode.state.selected_profile = adminChoices[0];
    }

    return m('.AdminActions', [
      m('h4', 'Admin'),
      m('p', 'Set up the chain with test proposals'),
      m('p', 'Run individual test suites (suite 1 required before 2 and 3)'),
      m('p', 'Create identities'),
      // m('button', {
      //   class: vnode.state.inprogress ? 'disabled' : '',
      //   onclick: (e) => {
      //     e.preventDefault();
      //     console.log('registering and attesting identities for initial council set');
      //     vnode.state.inprogress = true;
      //   }
      // }, vnode.state.inprogress ? 'Creating identities' : 'Create identities'),
      // m('br'),
      m('br'),
      m('h4', 'Site admin panel (unimplemented)'),
      m('.form', [
        m('.form-left', [
          // TD: verify this is correct char lim
          m(
            '.caption',
            { style: 'margin-top: 20px;' },
            'Choose a possible admin'
          ),
          m(DropdownFormField, {
            name: 'alt-del',
            options: { style: 'padding: 5px' },
            choices: adminChoices,
            callback: (result) => {
              vnode.state.selected_profile = result;
            },
          }),
        ]),
        m('.explanation', [
          m('span', [
            'This list contains all potential ',
            'individuals to make admin. ',
          ]),
        ]),
        m('.form-left', [
          // TD: verify this is correct char lim
          m('.caption', { style: 'margin-top: 20px;' }, 'Choose a role'),
          m(DropdownFormField, {
            name: 'alt-del',
            options: { style: 'padding: 5px' },
            choices: [
              {
                name: 'siteAdmin',
                label: 'siteAdmin',
                value: 'siteAdmin',
              },
              {
                name: 'chainAdmin',
                label: 'chainAdmin',
                value: 'chainAdmin',
              },
            ],
            callback: (result) => {
              vnode.state.role = result;
            },
          }),
        ]),
        m(
          'button',
          {
            class: vnode.state.inprogress ? 'disabled' : '',
            onclick: (e) => {
              e.preventDefault();
              vnode.state.inprogress = true;
              // TODO: Change to PUT /adminStatus
              $.post(`${app.serverUrl()}/updateAdminStatus`, {
                admin: app.user.activeAccount.address,
                address: vnode.state.selected_profile, // the address to be changed
                role: vnode.state.role,
                jwt: app.user.jwt,
              }).then(
                (response) => {
                  if (response.status === 'Success') {
                    if (!app.isLoggedIn()) {
                    }
                    m.redraw();
                  } else {
                    // error tracking
                  }
                  vnode.state.inprogress = false;
                },
                (err) => {
                  vnode.state.failure = true;
                  vnode.state.disabled = false;
                  if (err.responseJSON)
                    vnode.state.error = err.responseJSON.error;
                  m.redraw();
                }
              );
            },
          },
          vnode.state.inprogress
            ? `Adding ${vnode.state.selected_profile}`
            : 'Add admin'
        ),
      ]),
      m('br'),
      m('br'),
    ]);
  },
};

const AdminPage: m.Component<{}> = {
  oncreate: () => {},
  view: () => {
    if (!app.user.isSiteAdmin) {
      m.route.set('/', {}, { replace: true });
      return m(PageLoading);
    }

    return m(
      Sublayout,
      m('.AdminPage', [
        app.chain ? [m(AdminActions), m(SudoForm), m(ChainStats)] : [],
      ])
    );
  },
};

export default AdminPage;
