import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../services/service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Para el uso de *ngIf y *ngFor
import { ReactiveFormsModule } from '@angular/forms'; // Necesario para trabajar con formularios reactivos



@Component({
  selector: 'app-gestor',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestor.component.html',
  styleUrl: './gestor.component.css',
  standalone:true
})
export class GestorComponent {

  passwords: any[] = []; // Lista de contraseñas
  passwordForm: FormGroup; // Formulario reactivo para crear contraseñas

  constructor(
    private ServiceService: ServiceService, // Servicio para interactuar con el backend
    private fb: FormBuilder // FormBuilder para crear el formulario reactivo
  ) {
    // Inicializa el formulario con validaciones
    this.passwordForm = this.fb.group({
      service: ['', Validators.required], // Servicio
      username: ['', Validators.required], // Nombre de usuario
      password: ['', Validators.required] // Contraseña
    });
  }

  ngOnInit(): void {
    this.loadPasswords(); // Carga las contraseñas al iniciar el componente
  }

  // Función para cargar las contraseñas
  loadPasswords(): void {
    this.ServiceService.getAllPasswords().subscribe({
      next: (data) => {
        this.passwords = data; // Asigna las contraseñas al array
      },
      error: (err) => {
        console.error('Error al obtener contraseñas:', err); // Muestra error en consola si ocurre
      }
    });
  }

  // Función para crear una nueva contraseña
  createPassword(): void {
    if (this.passwordForm.valid) { // Verifica si el formulario es válido
      this.ServiceService.createPassword(this.passwordForm.value).subscribe({
        next: () => {
          this.loadPasswords(); // Recarga las contraseñas
        },
        error: (err) => {
          console.error('Error al crear contraseña:', err); // Muestra error si ocurre
        }
      });
    }
  }
}
