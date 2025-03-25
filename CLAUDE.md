# PA System Development Guide

## Build & Run Commands
- `npm run dev` - Start both frontend and backend in dev mode
- `npm run server:dev` - Start backend only with nodemon
- `npm run client` - Start frontend only
- `npm run test` - Run frontend tests
- `npm test -- --testPathPattern=ComponentName` - Run specific test

## Code Style Guidelines
- **Imports**: React/framework first, third-party next, local components, utilities last
- **Variables**: camelCase for variables/functions, PascalCase for components, ALL_CAPS for constants
- **Components**: Functional with hooks, destructure props, group related state hooks
- **Structure**: imports → state → effects → handlers → return/JSX
- **API Calls**: Centralize in utils/api.js using Axios, handle errors with try/catch
- **Error Handling**: Specific error messages with fallbacks, maintain loading states
- **Testing**: Use React Testing Library with Jest, test component rendering and interactions

## Technologies
- **Frontend**: React 17.x, Material-UI 5.x, React Router 6.x
- **Backend**: Node.js 14.x, Express 4.x, MongoDB 4.4+, Mongoose 6.x
- **State Management**: React Context API and useState/useReducer hooks