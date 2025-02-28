/* @jsx m */

import m from 'mithril';

import { Thread } from 'models';
import { DiscussionRow } from 'views/pages/discussions/discussion_row';
import { orderDiscussionsbyLastComment } from './helpers';

type IPinnedListingAttrs = {
  proposals: Thread[];
};

export const getLastUpdate = (proposal: Thread) => {
  const lastComment = proposal.lastCommentedOn?.unix() || 0;
  const createdAt = proposal.createdAt?.unix() || 0;
  const lastUpdate = Math.max(createdAt, lastComment);
  return lastUpdate;
};

export class PinnedListing implements m.ClassComponent<IPinnedListingAttrs> {
  view(vnode) {
    const { proposals } = vnode.attrs;
    const sortedProposals = proposals.sort(orderDiscussionsbyLastComment);

    return sortedProposals.length > 0 ? (
      <>
        {sortedProposals.map((proposal) => {
          return <DiscussionRow proposal={proposal} />;
        })}
      </>
    ) : null;
  }
}
