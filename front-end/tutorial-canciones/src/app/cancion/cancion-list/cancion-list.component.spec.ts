/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CancionListComponent } from './cancion-list.component';
import { Cancion} from '../cancion'


describe('CancionListComponent', () => {
  let component: CancionListComponent;
  let fixture: ComponentFixture<CancionListComponent>;
  let PruebaCancion: Cancion

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(PruebaCancion).toBeInstanceOf(Cancion);
  // });

});
