/*
 * A generic class for searching, sorting and pagination of a list of objects.
 * The constructor can be initialized with a set data, and a map of seaching and sorting methods.
 */

interface SearchTypesMap<T> {
  [key: string]: (keyword: string, list: T[], extraArgs?: object) => T[];
}

interface SortTypesMap<T> {
  [key: string]: (list: T[], extraArgs?: object) => void;
}

interface SearchOptions {
  keyword: string;
  searchTypeKey: string;
  extraArgs?: object;
}

interface SortOptions {
  sortTypeKey: string;
  extraArgs?: object;
}

interface PaginateOptions {
  offset: number;
  pageSize: number;
}

interface FilterResult<T> {
  list: T[];
  totalPages: number;
}

class ListFilterProvider<T> {
  private list: T[];

  private filteredList: T[];

  private totalPages: number;

  private searchTypesMap: SearchTypesMap<T>;

  private sortTypesMap: SortTypesMap<T>;

  constructor(
    filterableList?: T[],
    searchTypesMap?: SearchTypesMap<T>,
    sortTypesMap?: SortTypesMap<T>
  ) {
    this.list = filterableList || [];
    this.filteredList = [];
    this.totalPages = 0;
    this.searchTypesMap = searchTypesMap || {};
    this.sortTypesMap = sortTypesMap || {};
  }

  updateList(newList: T[]): void {
    this.list = newList;
    this.filteredList = [];
  }

  private search(searchOptions: SearchOptions): void {
    if (searchOptions) {
      const { keyword, searchTypeKey, extraArgs } = searchOptions;
      const searchFn = this.searchTypesMap[searchTypeKey];
      const trimmedKeyword = typeof keyword === 'string' && keyword.trim();
      if (trimmedKeyword && searchFn && typeof searchFn === 'function') {
        this.filteredList = searchFn(trimmedKeyword, this.list, extraArgs);
      } else {
        this.filteredList = this.list;
      }
    }
  }

  private sort(sortOptions: SortOptions): void {
    if (sortOptions) {
      const { sortTypeKey, extraArgs } = sortOptions;
      const sortFn = this.sortTypesMap[sortTypeKey];
      if (sortFn && typeof sortFn === 'function') {
        sortFn(this.filteredList, extraArgs);
      }
    }
  }

  private paginate(paginateOptions: PaginateOptions): void {
    if (paginateOptions) {
      const { offset, pageSize } = paginateOptions;
      this.totalPages = Math.ceil(this.filteredList.length / pageSize);
      const sliceOffset = offset < this.filteredList.length ? offset : 0;
      const pagedList = this.filteredList.slice(sliceOffset, sliceOffset + pageSize);
      this.filteredList = pagedList;
    }
  }

  filter(
    paginateOptions: PaginateOptions,
    searchOptions: SearchOptions,
    sortOptions: SortOptions
  ): FilterResult<T> {
    this.search(searchOptions);
    this.sort(sortOptions);
    this.paginate(paginateOptions);
    return {
      list: this.filteredList,
      totalPages: this.totalPages
    };
  }
}

export default ListFilterProvider;
