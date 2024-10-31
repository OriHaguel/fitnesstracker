import { userService } from "@/services/user/user.service.remote";
import { savedUser } from "@/services/user/user.service.remote";


// Action Types
export const SET_USER = 'SET_USER' as const;
export const SET_WATCHED_USER = 'SET_WATCHED_USER' as const;
export const SET_USERS = 'SET_USERS' as const;
export const SET_SCORE = 'SET_SCORE' as const;

// Define the User interface (update properties as per your actual user structure)


// State Type
interface UserState {
    user: savedUser | null;
    users: savedUser[];
}

// Action Types
interface SetUserAction {
    type: typeof SET_USER;
    user: savedUser | null;
}

interface SetUsersAction {
    type: typeof SET_USERS;
    users: savedUser[];
}

interface SetScoreAction {
    type: typeof SET_SCORE;
    score: number;
}

// Union type for all actions
type UserActions = SetUserAction | SetUsersAction | SetScoreAction;

// Initial State
const initialState: UserState = {
    user: userService.getLoggedinUser(),
    users: [],
};

// Reducer
export function userReducer(state: UserState = initialState, action: UserActions): UserState {
    switch (action.type) {
        case SET_USER:
            return { ...state, user: action.user };
        case SET_USERS:
            return { ...state, users: action.users };
        case SET_SCORE:
            if (!state.user) return state; // Ensure user exists before updating score
            const updatedUser = { ...state.user, score: action.score };
            userService.saveLoggedinUser(updatedUser);
            return { ...state, user: updatedUser };
        default:
            return state; // Return the current state for unrecognized actions
    }
}


// For debug:
// window.userState = newState
// console.log('State:', newState)

