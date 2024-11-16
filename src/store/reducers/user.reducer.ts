import { userService } from "@/services/user/user.service.remote";
import { SavedUser } from "@/services/user/user.service.remote";


// Action Types
export const SET_USER = 'SET_USER' as const;
export const SET_WATCHED_USER = 'SET_WATCHED_USER' as const;
export const SET_USERS = 'SET_USERS' as const;

// Define the User interface (update properties as per your actual user structure)


// State Type
interface UserState {
    user: SavedUser | null;
    users: SavedUser[];
}

// Action Types
interface SetUserAction {
    type: typeof SET_USER;
    user: SavedUser | null;
}

interface SetUsersAction {
    type: typeof SET_USERS;
    users: SavedUser[];
}



// Union type for all actions
type UserActions = SetUserAction | SetUsersAction;

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
        default:
            return state; // Return the current state for unrecognized actions
    }
}


// For debug:
// window.userState = newState
// console.log('State:', newState)

