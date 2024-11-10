import { httpService } from '../../services/http.service'


const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
	login,
	logout,
	signup,
	getUsers,
	getById,
	remove,
	update,
	getLoggedinUser,
	saveLoggedinUser,
	getEmptyCredentials
}

export interface Exercise {
	sets?: number
	weight?: number
	reps?: number
	name: string
}
export interface Workout {
	_id: string
	name: string
	type: string
	exercise: Exercise[]
}
interface Weight {
	weight: number
	date: Date
}

export interface SavedUser {
	_id?: string
	username: string
	password?: string
	gmail?: string
	weight: Weight[]
	workouts: Workout[]
}
export class AuthenticationError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'AuthenticationError'
	}
}

function getUsers() {
	console.log('yooo')
	return httpService.get(`users`)
}

async function getById(userId: string) {
	const user = await httpService.get(`users/${userId}`)
	return user
}

function remove(userId: string) {
	return httpService.delete(`users/${userId}`)
}

async function update(_id: string, exercise: Exercise) {
	const loggedinUser = getLoggedinUser() // Might not work because its defined in the main service???
	const user = await httpService.put(`users/${loggedinUser?._id}/workouts/${_id}/exercise`, exercise)

	// When admin updates other user's details, do not update loggedinUser
	if (loggedinUser?._id === user._id) saveLoggedinUser(user)
	console.log("🚀 ~ update ~ user:", user)

	return user
}

async function login(credentials: SavedUser): Promise<SavedUser> {
	try {
		const user = await httpService.post('users/login', credentials)
		if (!user) {
			throw new AuthenticationError('Login failed - no user returned')
		}
		return saveLoggedinUser(user)
	} catch (err) {
		console.error('Error during loginUser:', err)
		throw new AuthenticationError(
			err instanceof Error ? err.message : 'An error occurred during the login process'
		)
	}
}


async function signup(userCred: SavedUser): Promise<SavedUser> {

	try {
		const user = await httpService.post('users/signup', userCred)
		return saveLoggedinUser(user)

	} catch (err) {
		throw new AuthenticationError(
			err instanceof Error ? err.message : 'An error occurred during the signup process'
		)
	}
}

async function logout() {
	sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
	return await httpService.post('auth/logout')
}

function getLoggedinUser(): SavedUser | null {
	try {
		const user = sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER);
		return user ? JSON.parse(user) : null; // Cast to User type
	} catch (error) {
		console.error('Failed to parse logged-in user data:', error);
		return null; // Return null on error
	}
}



function saveLoggedinUser(user: SavedUser) {
	user = {
		_id: user._id,
		username: user.username,
		weight: user.weight,
		workouts: user.workouts
	}
	sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
	return user
}

function getEmptyCredentials(): SavedUser {
	return {
		username: '',
		password: '',
		gmail: '',
		weight: [],
		workouts: []
	}
}