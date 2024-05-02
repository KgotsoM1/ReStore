import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { User } from "../../app/models/User";
import agent from "../../app/api/agent";
import { FieldValues } from "react-hook-form";
import { router } from "../../app/router/Routes";
import { toast } from "react-toastify";
import { setBasket } from "../basket/basketSlice";

interface AccountState {
    user: User | null;  
}

const initialState: AccountState = {
    user: null
};

export const signInUser = createAsyncThunk<User, FieldValues>(
    'account/signInUser',
    async (data , thunkAPI) => {
        try {
            const userDto = await agent.Account.login(data);
            const {basket, ...user} = userDto;
            if (basket) thunkAPI.dispatch(setBasket(basket));
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error) {
            return thunkAPI.rejectWithValue({ error: error });
        }
    }
);


export const fetchCurrentUser = createAsyncThunk<User>(
    'account/fetchCurrentUser',
    async (_, thunkAPI) => {
        thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem('user')!)));
        try {
            const user = await agent.Account.currentUser();
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error) {
            return thunkAPI.rejectWithValue({ error: error });
        }
    },
    {
        condition: () => {
            if (!localStorage.getItem('user')) return false;
        }
    }
);

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        signOut: (state) => {
            state.user = null;
            localStorage.removeItem('user');
            router.navigate('/');
        },
        setUser: (state, action) => {
            const claims = JSON.parse(atob(action.payload.token.split('.')[1]));
            const roles = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            state.user = {...action.payload, roles: typeof(roles) === 'string' ? [roles] : roles};
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCurrentUser.rejected, (state) => {
            state.user = null;
            localStorage.removeItem('user')
            toast.error('Session expired - please login again')
            router.navigate('/');
        })
        builder
            .addMatcher(isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled), (state, action) => {
                const claims = JSON.parse(atob(action.payload.token.split('.')[1]));
                const roles = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
                state.user = {...action.payload, roles: typeof(roles) === 'string' ? [roles] : roles};
            });
        builder.addMatcher(isAnyOf(signInUser.rejected), (state, action) => {
            console.warn('State:', state);
            console.warn('Action payload:', action.payload);
        });
    }
});


export const { signOut, setUser } = accountSlice.actions;
