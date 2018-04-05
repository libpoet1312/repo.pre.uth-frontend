import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SearchFacetFilterComponent } from './search-facet-filter.component';
import { SearchFilterService } from '../search-filter.service';
import { SearchFilterConfig } from '../../../search-service/search-filter-config.model';
import { FilterType } from '../../../search-service/filter-type.model';
import { FacetValue } from '../../../search-service/facet-value.model';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { SearchService } from '../../../search-service/search.service';
import { SearchServiceStub } from '../../../../shared/testing/search-service-stub';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';

describe('SearchFacetFilterComponent', () => {
  let comp: SearchFacetFilterComponent;
  let fixture: ComponentFixture<SearchFacetFilterComponent>;
  const filterName1 = 'test name';
  const value1 = 'testvalue1';
  const value2 = 'test2';
  const value3 = 'another value3';
  const mockFilterConfig: SearchFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: filterName1,
    type: FilterType.text,
    hasFacets: false,
    isOpenByDefault: false,
    pageSize: 2
  });
  const values: FacetValue[] = [
    {
      value: value1,
      count: 52,
      search: ''
    }, {
      value: value2,
      count: 20,
      search: ''
    }, {
      value: value3,
      count: 5,
      search: ''
    }
  ];

  const searchLink = '/search';
  const selectedValues = [value1, value2];
  let filterService;
  const page = Observable.of(0);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), NoopAnimationsModule, FormsModule],
      declarations: [SearchFacetFilterComponent],
      providers: [
        { provide: SearchService, useValue: new SearchServiceStub(searchLink) },
        {
          provide: SearchFilterService, useValue: {
          isFilterActiveWithValue: (paramName: string, filterValue: string) => true,
          getPage: (paramName: string) => page,
          /* tslint:disable:no-empty */
          incrementPage: (filterName: string) => {
          },
          resetPage: (filterName: string) => {
          },
          getSearchOptions: () => Observable.of({}),

          /* tslint:enable:no-empty */
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(SearchFacetFilterComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFacetFilterComponent);
    comp = fixture.componentInstance; // SearchPageComponent test instance
    comp.filterConfig = mockFilterConfig;
    comp.filterValues = [Observable.of(new RemoteData(false, false, true, null, new PaginatedList(null, values)))];
    comp.selectedValues = selectedValues;
    filterService = (comp as any).filterService;
    fixture.detectChanges();
  });

  describe('when the isChecked method is called with a value', () => {
    beforeEach(() => {
      spyOn(filterService, 'isFilterActiveWithValue');
      comp.isChecked(values[1]);
    });

    it('should call isFilterActiveWithValue on the filterService with the correct filter parameter name and the passed value', () => {
      expect(filterService.isFilterActiveWithValue).toHaveBeenCalledWith(mockFilterConfig.paramName, values[1].value)
    });
  });

  describe('when the getSearchLink method is triggered', () => {
    let link: string;
    beforeEach(() => {
      link = comp.getSearchLink();
    });

    it('should return the value of the searchLink variable in the filter service', () => {
      expect(link).toEqual(searchLink);
    });
  });

  describe('when the getAddParams method is called wih a value', () => {
    it('should return the selectedValueq list with the new parameter value', () => {
      const result = comp.getAddParams(value3);
      expect(result).toEqual({[mockFilterConfig.paramName]: [value1, value2, value3]});
    });
  });

  describe('when the getRemoveParams method is called wih a value', () => {
    it('should return the selectedValueq list with the parameter value left out', () => {
      const result = comp.getRemoveParams(value1);
      expect(result).toEqual({[mockFilterConfig.paramName]: [value2]});
    });
  });

  describe('when the showMore method is called', () => {
    beforeEach(() => {
      spyOn(filterService, 'incrementPage');
      comp.showMore();
    });

    it('should call incrementPage on the filterService with the correct filter parameter name', () => {
      expect(filterService.incrementPage).toHaveBeenCalledWith(mockFilterConfig.name)
    });
  });

  describe('when the showFirstPageOnly method is called', () => {
    beforeEach(() => {
      spyOn(filterService, 'resetPage');
      comp.showFirstPageOnly();
    });

    it('should call resetPage on the filterService with the correct filter parameter name', () => {
      expect(filterService.resetPage).toHaveBeenCalledWith(mockFilterConfig.name)
    });
  });

  describe('when the getCurrentPage method is called', () => {
    beforeEach(() => {
      spyOn(filterService, 'getPage');
      comp.getCurrentPage();
    });

    it('should call getPage on the filterService with the correct filter parameter name', () => {
      expect(filterService.getPage).toHaveBeenCalledWith(mockFilterConfig.name)
    });
  });
});
