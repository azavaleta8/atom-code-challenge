import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../confirm/confirm.component';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-dashboard',
	standalone: true,
	imports: [
		NavbarComponent, 
		MatProgressSpinnerModule, 
		CommonModule, 
		MatIconModule, 
		ConfirmComponent,
		FormsModule
	],
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.scss'
})

export class DashboardComponent implements OnInit {
	
	showNewTaskForm: boolean = false;
	newEditTask : boolean = false;
	taskIdToUpdate: string = '';
	newTaskTitle: string = "";
	newDescription : string = "";
	newCompleted: boolean = false;
	error: boolean = false;
	errorMsg: string = '';
	tasksData: any[] = [];
	loading: boolean = false;
	userId: string | null = "";

	constructor(
		private apiService: ApiService, 
		private dialog: MatDialog
	) {}

	ngOnInit() {
		this.userId = sessionStorage.getItem('userId');
		this.fetchTasksData();
	}

	handleRefreshClick() {
		this.fetchTasksData();
	}

	handleNewTaskClick() {
		this.showNewTaskForm = true;
	}

	async handleFormSubmit() {
		try {

			this.loading = true;
			this.error = false;
			this.errorMsg = '';
			this.showNewTaskForm = false;

			const payload = {
				userId : this.userId,
				title : this.newTaskTitle,
				description: this.newDescription,
				completed: this.newCompleted
			}

			this.newTaskTitle = ""
			this.newDescription = ""
			this.newCompleted = false

			if(this.newEditTask){
				this.updateTask(payload)
			}else{
				this.createTask(payload)
			}

		} catch (error) {

			this.error = true;
			this.loading = false;
			console.error('Task creation failed', error);
			// throw error; // Re-lanzar el error para que pueda ser manejado en el componente
		}

	}

	async createTask(payload : any){

		const response: any = await this.apiService.post('tasks', payload).toPromise();
		console.log('Task creation successful', response);

		if (response && response.payload) {
			this.fetchTasksData()
			this.loading = false;
			return;
		} else {
			throw new Error('Invalid response from server');
		}
	}

	async updateTask(payload : any){

		const response: any = await this.apiService.put(`tasks/${this.taskIdToUpdate}`, payload).toPromise();
		console.log('Task creation successful', response);

		if (response && response.payload) {
			this.fetchTasksData()
			this.taskIdToUpdate = "";
			this.loading = false;
			return;
		} else {
			throw new Error('Invalid response from server');
		}
	}

	fetchTasksData() {
		this.loading = true;
		this.error = false;
		this.errorMsg = '';

		this.apiService.get(`tasks/users/${this.userId}`).subscribe({
			next: (result: any) => {
				this.tasksData = result.payload.reverse();
				console.log(this.tasksData);
				this.loading = false;
			},
			error: (error: any) => {
				this.error = true;
				this.loading = false;
				// switch (error.status) {
				// 	case 404:
				// 		this.errorMsg = 'No hay lotes de data';
				// 		break;
				// 	case 401:
				// 		sessionStorage.removeItem('token');
				// 		sessionStorage.removeItem('userId');
				// 		sessionStorage.removeItem('email');
				// 		this.errorMsg = 'Token vencido';
				// 		this.router.navigate(['/login']);
				// 		break;
				// 	case 422:
				// 		this.errorMsg = 'Unprocessable Entity';
				// 		break;
				// 	default:
				// 		this.errorMsg = 'Unable to connect to server';
				// }
			},
			complete: () => {
				this.loading = false;
			}
		});
	}

	parseDate(date: string): string {

		const d = new Date(date);
		return new Intl.DateTimeFormat('es', { 
			year: 'numeric', month: 'long', day: 'numeric', 
			hour: 'numeric', minute: '2-digit',
			hour12: true
		}).format(d)
	}

	async deleteTask(taskId: string): Promise<void> {

		// const dialogRef = this.dialog.open(ConfirmComponent);

    	// const result = await lastValueFrom(dialogRef.afterClosed());

		// if(!result) {return}

		try {

			this.loading = true;
			this.error = false;
			this.errorMsg = '';

			const response: any = await this.apiService.delete(`tasks/${taskId}`).toPromise();
			console.log('Task deletion successful', response);

			if (response && response.message) {
				this.loading = false;
				this.fetchTasksData()
				return;
			} else {
				throw new Error('Invalid response from server');
			}

		} catch (error) {
			this.error = true;
			this.loading = false;
			console.error('Task deletion failed', error);
			// throw error; // Re-lanzar el error para que pueda ser manejado en el componente
		}
	}

	editTask(task : any){
		this.showNewTaskForm = true;
		this.newEditTask = true;
		this.taskIdToUpdate = task.id;
		this.newTaskTitle = task.title;
		this.newDescription = task.description;
		this.newCompleted = task.completed;
	}
}
