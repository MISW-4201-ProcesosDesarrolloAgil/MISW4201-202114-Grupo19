/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Cancion_favorita_usuarioComponent } from './cancion_favorita_usuario.component';

describe('Cancion_favorita_usuarioComponent', () => {
  let component: Cancion_favorita_usuarioComponent;
  let fixture: ComponentFixture<Cancion_favorita_usuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Cancion_favorita_usuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Cancion_favorita_usuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
