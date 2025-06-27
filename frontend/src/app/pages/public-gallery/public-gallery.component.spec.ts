import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicGalleryComponent } from './public-gallery.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('PublicGalleryComponent', () => {
  let component: PublicGalleryComponent;
  let fixture: ComponentFixture<PublicGalleryComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicGalleryComponent, HttpClientTestingModule, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PublicGalleryComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
    // Flush both requests made on init
    httpMock.expectOne(req => req.url.includes('/api/tag')).flush([]);
    httpMock.expectOne(req => req.url.includes('/api/artwork?status=approved')).flush([]);
  });

  it('should fetch artworks on init', () => {
    httpMock.expectOne(req => req.url.includes('/api/tag')).flush([]);
    const mockArtworks = [{ id: 1, title: 'Test Art', tags: ['Tag1'], image_url: 'test.jpg' }];
    const req = httpMock.expectOne(req => req.url.includes('/api/artwork?status=approved'));
    expect(req.request.method).toBe('GET');
    req.flush(mockArtworks);
    expect(component.artworks.length).toBe(1);
    expect(component.artworks[0].title).toBe('Test Art');
  });

  it('should filter artworks by tag', () => {
    httpMock.expectOne(req => req.url.includes('/api/tag')).flush([]);
    httpMock.expectOne(req => req.url.includes('/api/artwork?status=approved')).flush([]);
    component.artworks = [
      { id: 1, title: 'A', tags: ['Tag1'] },
      { id: 2, title: 'B', tags: ['Tag2'] }
    ];
    component.selectedTag = 'Tag1';
    component.applyTagFilter();
    expect(component.filteredArtworks.length).toBe(1);
    expect(component.filteredArtworks[0].title).toBe('A');
  });

  afterEach(() => {
    httpMock.verify();
  });
});
