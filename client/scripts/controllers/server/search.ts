import $ from 'jquery';
import moment from 'moment';
import SearchStore from "stores/SearchStore";
import app from 'state';
import { SearchScope, SearchParams } from '../../models/SearchQuery';
import { OffchainThread, CommunityInfo, SearchQuery } from "../../models";
import { modelFromServer } from './threads';

export const ALL_RESULTS_QUERY = new SearchQuery('COMMONWEALTH_ALL_RESULTS');
const SEARCH_PREVIEW_SIZE = 6;
const SEARCH_PAGE_SIZE = 50; // must be same as SQL limit specified in the database query
const SEARCH_HISTORY_KEY = "COMMONWEALTH_SEARCH_HISTORY"
const SEARCH_HISTORY_SIZE = 10

export enum ContentType {
    Thread = 'thread',
    Comment = 'comment',
    Community = 'community',
    Chain = 'chain',
    Token = 'token',
    Member = 'member'
}
class SearchContoller {
  private _store: SearchStore = new SearchStore();
  public store() { return this._store; }

  public getByQuery(query: SearchQuery){
    if(query.searchTerm.length > 3){
      return this._store.getByQueryString(query.toEncodedString())
    }
    return null
  }

  public async initialize() {
    const allCommunitiesSearch = this._store.getOrAdd(ALL_RESULTS_QUERY)
    if(!this.getByQuery(ALL_RESULTS_QUERY)?.loaded) {
        try {
            const getTokens = () =>
                $.getJSON('/api/getTokensFromLists').then((response) => {
                if (response.status === 'Failure') {
                    throw response.message;
                } else {
                    return response.result;
                }
            })
            const tokens = await getTokens();
            allCommunitiesSearch.results[SearchScope.Communities] = tokens
        } catch (err) {
            allCommunitiesSearch.results[SearchScope.Communities] = []
        } finally {
            allCommunitiesSearch.loaded = true
            this._store.update(allCommunitiesSearch)
        }
    }
  }

  public async search(searchQuery: SearchQuery) {
    if (!this.getByQuery(ALL_RESULTS_QUERY)?.loaded){
      await this.initialize()
    }

    if (this.getByQuery(searchQuery)?.loaded) {
      return this.getByQuery(searchQuery)
    }
    const searchCache = this._store.getOrAdd(searchQuery)
    const { searchTerm, communityScope, chainScope, isSearchPreview, sort } = searchQuery;
    const resultSize = isSearchPreview ? SEARCH_PREVIEW_SIZE : SEARCH_PAGE_SIZE;
    const scope = searchQuery.getSearchScope()

    try {
      if(scope.includes(SearchScope.Threads) || scope.includes(SearchScope.Proposals)){

        const discussions = await this.searchDiscussions(searchTerm, {
          resultSize,
          communityScope,
          chainScope,
          sort
        })

        searchCache.results[SearchScope.Threads] = discussions
          .map((discussion) => {
              discussion.contentType = ContentType.Thread;
              discussion.searchType = SearchScope.Threads;
              return discussion;
          })
      }

      if (scope.includes(SearchScope.Members)){
        const addrs = await this.searchMentionableAddresses(
            searchTerm,
            { resultSize, communityScope, chainScope },
            ['created_at', 'DESC']
          )

        searchCache.results[SearchScope.Members] = addrs
          .map((addr) => {
              addr.contentType = ContentType.Member;
              addr.searchType = SearchScope.Members;
              return addr;
          })
          .sort(this.sortResults);
      }

      if (scope.includes(SearchScope.Replies)) {
        const comments = await this.searchComments(searchTerm, {
          resultSize,
          communityScope,
          chainScope,
        })

        searchCache.results[SearchScope.Replies] = comments.map(comment => {
          comment.contentType = ContentType.Comment
          comment.searchType = SearchScope.Replies
          return comment
        })
      }

      if (scope.includes(SearchScope.Communities)){
        const unfilteredTokens = this.getByQuery(ALL_RESULTS_QUERY).results[SearchScope.Communities];
        const tokens = unfilteredTokens.filter((token) =>
            token.name?.toLowerCase().includes(searchTerm)
        );
        searchCache.results[SearchScope.Communities] = tokens.map((token) => {
            token.contentType = ContentType.Token;
            token.searchType = SearchScope.Communities;
            return token;
        });

        const allComms = (app.config.chains.getAll() as any).concat(app.config.communities.getAll() as any);
        const filteredComms = allComms.filter((comm) => {
            return (
                comm.name?.toLowerCase().includes(searchTerm) ||
                comm.symbol?.toLowerCase().includes(searchTerm)
            );
        });
        searchCache.results[SearchScope.Communities] = searchCache.results[SearchScope.Communities]
            .concat(filteredComms.map((commOrChain) => {
              commOrChain.contentType = commOrChain instanceof CommunityInfo ?
                ContentType.Community : ContentType.Chain;
              commOrChain.searchType = SearchScope.Communities;
              return commOrChain;
            })).sort(this.sortResults);
      }
    } finally {
      searchCache.loaded = true
      this._store.update(searchCache)
    }
    return searchCache
  }

  private searchDiscussions = async (
    searchTerm: string,
    params: SearchParams
  ) => {
    const { resultSize, chainScope, communityScope, sort } = params;
    try {
        const response = await $.get(`${app.serverUrl()}/searchDiscussions`, {
          chain: chainScope,
          community: communityScope,
          cutoff_date: null, // cutoffDate.toISOString(),
          search: searchTerm,
          results_size: resultSize,
          sort
        });
        if (response.status !== 'Success') {
        throw new Error(`Got unsuccessful status: ${response.status}`);
        }
        return response.result;
    } catch (e) {
        console.error(e);
        return [];
    }
  }

  private searchComments = async (
    searchTerm: string,
    params: SearchParams
  ) => {
    const { resultSize, chainScope, communityScope, sort } = params;
    try {
        const response = await $.get(`${app.serverUrl()}/searchComments`, {
          chain: chainScope,
          community: communityScope,
          cutoff_date: null, // cutoffDate.toISOString(),
          search: searchTerm,
          results_size: resultSize,
          sort
        });
        if (response.status !== 'Success') {
        throw new Error(`Got unsuccessful status: ${response.status}`);
        }
        return response.result;
    } catch (e) {
        console.error(e);
        return [];
    }
  }

  public searchThreadTitles = async (
    searchTerm: string,
    params: SearchParams
  ): Promise<OffchainThread[]> => {
    const { resultSize, chainScope, communityScope } = params;
    try {
      const response = await $.get(`${app.serverUrl()}/searchDiscussions`, {
        chain: chainScope,
        community: communityScope,
        search: searchTerm,
        results_size: resultSize,
        thread_title_only: true,
      });
      if (response.status !== 'Success') {
        throw new Error(`Got unsuccessful status: ${response.status}`);
      }
      return response.result.map((rawThread) => {
        return modelFromServer(rawThread);
      });
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  public searchMentionableAddresses = async (
    searchTerm: string,
    params: SearchParams,
    order?: string[]
  ) => {
    const { resultSize, communityScope, chainScope } = params;
    try {
      const response = await $.get(`${app.serverUrl()}/bulkAddresses`, {
        chain: chainScope,
        community: communityScope,
        limit: resultSize,
        searchTerm,
        order,
      });
      if (response.status !== 'Success') {
        throw new Error(`Got unsuccessful status: ${response.status}`);
      }
      return response.result;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  private sortResults = (a, b) => {
    // TODO: Token-sorting approach
    // Some users are not verified; we give them a default date of 1900
    const aCreatedAt = moment(
      a.created_at || a.createdAt || a.verified || '1900-01-01T:00:00:00Z'
    );
    const bCreatedAt = moment(
      b.created_at || b.createdAt || b.verified || '1900-01-01T:00:00:00Z'
    );
    return bCreatedAt.diff(aCreatedAt);
  };

  public getHistory() {
    const rawHistory = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY)) || []
    const history = []
    // eslint-disable-next-line guard-for-in
    for(const entry in rawHistory){
      history.push(SearchQuery.fromEncodedString(entry))
    }
    return history
  }

  public addToHistory(query: SearchQuery) {
    this.removeFromHistory(query) // to refresh duplicates
    if(!this.isValidQuery(query)) return
    const rawHistory = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY)) || []
    if(rawHistory.length >= SEARCH_HISTORY_SIZE){
      rawHistory.pop()
    }
    rawHistory.unshift(query.toEncodedString())
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(rawHistory))
  }

  public removeFromHistory(query: SearchQuery) {
    const rawHistory = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY)) || []
    const index = rawHistory.indexOf(query.toEncodedString())
    if(index > -1){
      rawHistory.splice(index, 1)
    }
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(rawHistory))
  }

  public isValidQuery(searchQuery: SearchQuery){
    return searchQuery.searchTerm
      && searchQuery.searchTerm.toString().trim()
      && searchQuery.searchTerm.length > 3
  }
}

export default SearchContoller