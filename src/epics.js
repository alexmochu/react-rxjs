import { combineEpics, ofType } from 'redux-observable';
import { FETCH_USER, FETCH_USER_FAILED } from './types';
import { fetchUserSuccess } from './actions';
import { ajax } from 'rxjs/observable/dom/ajax';
import { of } from 'rxjs';
import { mergeMap, map, takeUntil, retry, catchError } from 'rxjs/operators';

export const fetchUser = actions$ =>
  actions$.pipe(
    ofType(FETCH_USER),
    mergeMap(action =>
      ajax.getJSON(`https://api.github.com/users/${action.payload.username}`)
        .pipe(map(user => fetchUserSuccess(user)),
        takeUntil(actions$.ofType(FETCH_USER)),
        retry(2),
        catchError(error => of({
            type: FETCH_USER_FAILED,
            payload: error.xhr.response,
            error: true
          }))
        )
    )
  );


export default combineEpics(
  fetchUser
);