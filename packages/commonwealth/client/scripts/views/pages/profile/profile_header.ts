/* eslint-disable @typescript-eslint/ban-types */
import m from 'mithril';
import { Button } from 'construct-ui';

import { initChain } from 'app';
import app from 'state';
import { Account } from 'models';

import SubstrateIdentity from 'controllers/chain/substrate/identity';
import User from 'views/components/widgets/user';
import EditIdentityModal from 'views/modals/edit_identity_modal';
import { notifyError, notifySuccess } from 'controllers/app/notifications';
import { setActiveAccount } from 'controllers/app/login';
import { confirmationModalWithText } from 'views/modals/confirm_modal';
import LoginWithWalletDropdown from 'views/components/login_with_wallet_dropdown';
import { alertModalWithText } from '../../modals/alert_modal';
import { CWButton } from '../../components/component_kit/cw_button';
import { BanUserModal } from '../../modals/ban_user_modal';

const editIdentityAction = (
  account: Account,
  currentIdentity: SubstrateIdentity,
  vnode
) => {
  const chainObj = app.config.chains.getById(account.chain.id);
  if (!chainObj) return;

  // TODO: look up the chainObj's chain base
  return (
    (account.chain.id.indexOf('edgeware') !== -1 ||
      account.chain.id.indexOf('kusama') !== -1) &&
    m(Button, {
      intent: 'primary',
      // wait for info to load before making it clickable
      disabled: vnode.state.chainLoading,
      rounded: true,
      onclick: async () => {
        if (app.activeChainId() !== chainObj.id) {
          let confirmed = false;
          const msg = `Must switch to ${chainObj.name} to set on-chain identity. Continue?`;
          confirmed = await confirmationModalWithText(msg)();
          if (confirmed) {
            m.route.set(`/${chainObj.id}/account/${account.address}`, {
              setIdentity: true,
            });
          }
        } else if (!app.chain?.loaded) {
          vnode.state.chainLoading = true;
          initChain()
            .then(() => {
              vnode.state.chainLoading = false;
              app.modals.create({
                modal: EditIdentityModal,
                data: { account, currentIdentity },
              });
            })
            .catch((err) => {
              vnode.state.chainLoading = false;
            });
        } else {
          app.modals.create({
            modal: EditIdentityModal,
            data: { account, currentIdentity },
          });
        }
      },
      loading: !!vnode.state.chainLoading,
      label: currentIdentity?.exists ? 'Edit identity' : 'Set identity',
    })
  );
};

export interface IProfileHeaderAttrs {
  account;
  setIdentity: boolean;
  refreshCallback: Function;
  onLinkedProfile: boolean;
  onOwnProfile: boolean;
}

export interface IProfileHeaderState {
  identity: SubstrateIdentity | null;
  copied: boolean;
  loading: boolean;
}

const ProfileHeader: m.Component<IProfileHeaderAttrs, IProfileHeaderState> = {
  view: (vnode) => {
    const { account, refreshCallback, onOwnProfile, onLinkedProfile } =
      vnode.attrs;
    const showJoinCommunityButton = vnode.attrs.setIdentity && !onOwnProfile;
    const isClaimable = !account || !account.profile || account.profile.isEmpty;

    // For Banning
    const loggedInUserIsAdmin =
      app.user.isSiteAdmin ||
      app.roles.isAdminOfEntity({
        chain: app.activeChainId(),
      });

    const joinCommunity = async () => {
      if (!app.activeChainId() || onOwnProfile) return;
      vnode.state.loading = true;
      const addressInfo = app.user.addresses.find(
        (a) => a.address === account.address && a.chain.id === app.activeChainId()
      );
      try {
        await app.roles.createRole({
          address: addressInfo,
          chain: app.activeChainId(),
        });
        vnode.state.loading = false;
        await setActiveAccount(account);
        m.redraw();
        notifySuccess('Joined community');
      } catch (err) {
        vnode.state.loading = false;
        notifyError('Failed to join community');
      }
    };

    return m('.ProfileHeader', [
      m('.bio-main', [
        m('.bio-left', [
          // TODO: Rename class to non-bio to avoid confusion with Bio component
          account.profile && account.profile?.getAvatar(90),
        ]),
        m('.bio-right', [
          m('.name-row', [
            m(
              '.User',
              account.profile
                ? m(User, { user: account, hideAvatar: true, showRole: true })
                : account.address
            ),
          ]),
          m('.address-block-left', [
            m(
              '.address',
              `${account.address.slice(0, 6)}...${account.address.slice(
                account.address.length - 6
              )}`
            ),
            m('img', {
              src: '/static/img/copy_default.svg',
              alt: '',
              class: 'cursor-pointer',
              onclick: (e) => {
                window.navigator.clipboard
                  .writeText(account.address)
                  .then(() => notifySuccess('Copied address to clipboard'));
              },
            }),
          ]),
          m('.info-row', [
            account.profile?.headline &&
              m('span.profile-headline', account.profile.headline),
            m('.space'),
            isClaimable &&
              m(LoginWithWalletDropdown, {
                prepopulateAddress: account.address,
                loggingInWithAddress: !app.isLoggedIn(),
                joiningChain: app.activeChainId(),
                label: 'Claim address',
              }),
          ]),
        ]),
      ]),
      m('.bio-actions', [
        account.profile &&
          account.profile.bio &&
          m(CWButton, {
            onclick: () => {
              alertModalWithText(account.profile.bio, 'Close')();
            },
            label: 'View Bio',
          }),
        // If Admin Allow Banning
        loggedInUserIsAdmin &&
          m('.ban-wrapper', [
            m(CWButton, {
              onclick: () => {
                app.modals.create({
                  modal: BanUserModal,
                  data: { profile: account.profile },
                });
              },
              label: 'Ban User',
              buttonType: 'primary-red',
            }),
          ]),
        m('', [
          onOwnProfile
            ? showJoinCommunityButton && app.activeChainId()
            : m(Button, {
                intent: 'primary',
                rounded: true,
                onclick: async () => {
                  if (onLinkedProfile) {
                    vnode.state.loading = true;
                    try {
                      await setActiveAccount(account);
                      m.redraw();
                    } catch (e) {
                      vnode.state.loading = false;
                      notifyError(e);
                    }
                  } else {
                    try {
                      await joinCommunity();
                      m.redraw();
                    } catch (e) {
                      vnode.state.loading = false;
                      notifyError(e);
                    }
                  }
                },
                label: onLinkedProfile ? 'Switch to address' : 'Join community',
              }),
        ]),
      ]),
    ]);
  },
};

export default ProfileHeader;
