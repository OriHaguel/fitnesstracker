
import { store } from '../store'

import { SET_USER, SET_USERS } from '../reducers/user.reducer'
import { userService, SavedUser, Exercise, Workout } from '@/services/user/user.service.remote'

export async function loadUsers() {
    try {
        const users = await userService.getUsers()
        store.dispatch({ type: SET_USERS, users })
    } catch (err) {
        console.log('UserActions: err in loadUsers', err)
    } finally {
    }
}



export async function login(credentials: SavedUser) {
    try {
        const user = await userService.login(credentials);
        store.dispatch({
            type: SET_USER,
            user
        });
        return user;
    } catch (err) {
        console.error('Login failed:', err);
        throw new Error('Unable to log in. Please check your credentials and try again.');
    }
}

export async function signup(credentials: SavedUser) {
    try {
        const user = await userService.signup(credentials)
        store.dispatch({
            type: SET_USER,
            user
        })
        return user
    } catch (err) {
        console.log('Cannot signup', err)
        throw err
    }
}

export async function logout() {
    try {
        await userService.logout()
        store.dispatch({
            type: SET_USER,
            user: null
        })
    } catch (err) {
        console.log('Cannot logout', err)
        throw err
    }
}
export function initUser(userToSave: any) {
    try {
        const user = userService.saveLoggedinUser(userToSave)
        store.dispatch({
            type: SET_USER,
            user
        })
    } catch (err) {
        console.log('Cannot init user', err)
        throw err
    }
}

export async function editExercise(userId: string, exercise: Exercise, method: 'put' | 'post') {
    try {
        const user = await userService.update(userId, exercise, method)
        store.dispatch({ type: SET_USER, user })
    } catch (err) {
        console.log('Cannot load user', err)
    }
}
export async function createWorkout(workout: Workout) {
    try {
        const user = await userService.addWorkout(workout)
        store.dispatch({ type: SET_USER, user })
    } catch (err) {
        console.log('Cannot load user', err)
    }
}
export async function deleteWorkout(workoutId: string) {
    try {
        const user = await userService.deleteWorkoutById(workoutId)
        store.dispatch({ type: SET_USER, user })
    } catch (err) {
        console.log('Cannot load user', err)
    }
}
export async function deleteExercise(workoutId: string, exerciseName: { name: string }) {
    try {
        const user = await userService.deleteExerciseById(workoutId, exerciseName)
        store.dispatch({ type: SET_USER, user })
    } catch (err) {
        console.log('Cannot load user', err)
    }
}

export async function editWorkout(workoutId: string, updateData: any) {
    try {
        const user = await userService.updateWorkout(workoutId, updateData)
        store.dispatch({ type: SET_USER, user })
    } catch (err) {
        console.log('Cannot load user', err)
    }
}

export async function addWeight(weight: { weight: number }) {
    try {
        const user = await userService.updateWeight(weight)
        store.dispatch({ type: SET_USER, user })
    } catch (err) {
        console.log('Cannot load user', err)
    }
}
export async function deleteDate(workoutId: string, dateToDelete: { date: Date }) {
    try {
        const user = await userService.removeDateFromWorkout(workoutId, dateToDelete)
        store.dispatch({ type: SET_USER, user })
    } catch (err) {
        console.log('Cannot load user', err)
    }
}

