
import { store } from '../store'

import { SET_USER, SET_USERS } from '../reducers/user.reducer'
import { userService, SavedUser, Exercise } from '@/services/user/user.service.remote'

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

        // socketService.login(user._id)
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

export async function editExersice(userId: string, exersice: Exercise, method: 'put' | 'post') {
    try {
        const user = await userService.update(userId, exersice, method)
        store.dispatch({ type: SET_USER, user })
    } catch (err) {
        console.log('Cannot load user', err)
    }
}