import { useQuery } from '@tanstack/react-query'
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
	getEmptyCredentials,
	addWorkout,
	deleteWorkoutById,
	updateWorkout,
	deleteExerciseById,
	getAuthUser,
	useAuthUser,
	updateWeight
}

export interface Exercise {
	sets?: number
	weight?: number
	reps?: number
	name: string
}
export interface Workout {
	_id?: string
	name: string
	type: string
	date?: Date
	exercise: Exercise[]
}
export interface Weight {
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
	return httpService.get(`users`)
}

async function getById(userId: string) {
	const user = await httpService.get(`users/${userId}`)
	return user
}
async function getAuthUser() {
	const user = await httpService.get(`auth/user`)
	return user
}

function useAuthUser() {
	return useQuery({
		queryKey: ['authUser'],
		queryFn: getAuthUser,
		staleTime: 1000 * 60 * 5, // 5 minutes
		gcTime: 1000 * 60, // 10 minutes
		refetchOnWindowFocus: false, // optional based on your needs
	});
}


// getAuthUser().then(res => console.log(res.user))

function remove(userId: string) {
	return httpService.delete(`users/${userId}`)
}

async function update(_id: string, exercise: Exercise, method: 'put' | 'post') {
	const loggedinUser = getLoggedinUser()
	const httpMethod = method === 'put' ? httpService.put : httpService.post
	const user = await httpMethod(`users/${loggedinUser?._id}/workouts/${_id}/exercise`, exercise)

	if (loggedinUser?._id === user._id) saveLoggedinUser(user)
	console.log("🚀 ~ update ~ user:", user)

	return user
}

async function addWorkout(workout: Workout) {
	const loggedinUser = getLoggedinUser()
	const user = await httpService.post(`users/${loggedinUser?._id}/workout`, workout)

	if (loggedinUser?._id === user._id) saveLoggedinUser(user)
	console.log("🚀 ~ update ~ user:", user)

	return user
}
async function deleteWorkoutById(workoutId: string) {
	try {
		const loggedinUser = getLoggedinUser()
		const user = await httpService.delete(`users/${loggedinUser?._id}/workouts/${workoutId}`)
		if (loggedinUser?._id === user._id) saveLoggedinUser(user)

		return user
	} catch (error) {
		console.log("🚀 ~ deleteWorkout ~ error:", error)

	}
}
async function deleteExerciseById(workoutId: string, exerciseName: { name: string }) {
	try {
		const loggedinUser = getLoggedinUser()
		const user = await httpService.delete(`users/${loggedinUser?._id}/workouts/${workoutId}/exercise`, exerciseName)
		if (loggedinUser?._id === user._id) saveLoggedinUser(user)

		return user
	} catch (error) {
		console.log("🚀 ~ deleteWorkout ~ error:", error)

	}
}
async function updateWorkout(workoutId: string, updateData: Workout) {
	try {
		const loggedinUser = getLoggedinUser()
		const user = await httpService.put(`users/${loggedinUser?._id}/workouts/${workoutId}`, updateData)
		if (loggedinUser?._id === user._id) saveLoggedinUser(user)

		return user
	} catch (error) {
		console.log("🚀 ~ deleteWorkout ~ error:", error)

	}
}
async function updateWeight(updateData: { weight: number }) {
	try {
		const loggedinUser = getLoggedinUser()
		const user = await httpService.put(`users/${loggedinUser?._id}/weight`, updateData)
		if (loggedinUser?._id === user._id) saveLoggedinUser(user)

		return user
	} catch (error) {
		console.log("🚀 ~ deleteWorkout ~ error:", error)

	}
}
// updateWeight({ weight: 65 })

async function login(credentials: SavedUser): Promise<SavedUser> {
	try {
		const user = await httpService.post('auth/login', credentials)
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
		const user = await httpService.post('auth/signup', userCred)
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
		return user ? JSON.parse(user) : null;
	} catch (error) {
		console.error('Failed to parse logged-in user data:', error);
		return null;
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