import { Directive, EventEmitter, ElementRef, HostListener, Input, Output } from '@angular/core';
import { FileItem } from '../models/file-item';

@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {

  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();

  @Input() archivos: FileItem[] = [];

  constructor() { }


  @HostListener('dragover', ['$event'])
  public onDragEnter(event: any) {
    this.mouseSobre.emit(true);
    this._prevenirDetener(event);

  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: any) {
    this.mouseSobre.emit(false);

  }

  @HostListener('drop', ['$event'])
  public onDrop(event: any) {

    console.log(event);

    const transferencia = this._getTransferencia(event);
    if (!transferencia) {
      return;
    }
    this._extraerArchivos(transferencia.files);
    this._prevenirDetener(event);
    this.mouseSobre.emit(false);

  }

  private _getTransferencia(event: any) {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }

  private _extraerArchivos(archivos: FileList) {
  // tslint:disable-next-line: forin
  for (const propiedad in Object.getOwnPropertyNames(archivos)) {
  const archivoTemporal = archivos[propiedad];

  if (this._archivoPuedeSerCargado(archivoTemporal)) {

    const nuevoArchivo = new FileItem(archivoTemporal);
    this.archivos.push(nuevoArchivo);
  }

  }
  console.log(this.archivos);
  }

  // Validaciones

  private _archivoPuedeSerCargado(archivo: File): boolean {
    if (!this._archivoDroppeado(archivo.name) && this.esImagen(archivo.type)) {
      return true;
    } else {
      return false;
    }
  }

  private _prevenirDetener(event) {
  event.preventDefault();
  event.stopPropagation();
  }


  private _archivoDroppeado( nombreArchivo: string): boolean {
  for (const archivo of this.archivos) {
    if (archivo.nombreArchivo === nombreArchivo) {
      console.log('El archivo ' + nombreArchivo + 'ya está droppeado');
      return true;
    }
  }
  return false;
  }


  private esImagen(tipoArchivo: string): boolean {
    return (tipoArchivo === '' || tipoArchivo === undefined) ? false : tipoArchivo.startsWith('image');

  }

}
