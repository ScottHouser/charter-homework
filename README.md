
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## App Summary

This app uses an async await call with a setTimeout to simulate a server call to retrieve purchace data

The data is sorted into an object that acts as a map using individual unique customer Id's as keys. Points per month are calculated by comparing unix time stamps. 

This app makes use of the React `useMemo` hook to memoize data and improve scalability. The majority of code for review can be found in `src/app.js`


https://user-images.githubusercontent.com/20464795/193189299-4b42deea-450d-4168-a4e2-fa0e0c63e537.mov



## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.




