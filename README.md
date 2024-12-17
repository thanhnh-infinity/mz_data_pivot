# WebDataRocks integration with React + TypeScript

This repository contains a sample TypeScript project that shows how to integrate [WebDataRocks](https://www.webdatarocks.com/) with the [React framework](https://react.dev/).

## Prerequisites

- [Node.js 8 through 16](https://nodejs.org/en/)

## Run the project

1. Download or clone this project from GitHub:
```bash
git clone https://github.com/WebDataRocks/pivot-react
cd pivot-react/typescript
```
2. Install npm packages:
```bash
npm install
```
3. Run the project:
```bash
npm start
```
You can access the project at `http://localhost:3000/`.

## Related docs

For details on how to integrate WebDataRocks into existing React projects, check out the [integration with React](https://www.webdatarocks.com/doc/integration-with-react/).

## Support
Feel free to ask WebDataRocks-related questions on [StackOverflow](https://stackoverflow.com/questions/tagged/webdatarocks).


**Architecture Overview**

1.  **Backend Server**:

-  Use **Express.js** to handle HTTP requests from MZ Back-End Python. `/api/pivot_report`

-  The server serves the ReactJS WebDataRock app and accepts dynamic JSON data.

This server will:

-  Accept JSON data (POST request).

-  Store the JSON temporarily (e.g., in memory or a file).

-  Serve the React app with the WebDataRock tool.

2.  **Frontend (ReactJS - WebDataRock) - Fetch Dynamic JSON Data**:

-  Fetch the JSON data sent via the backend server. `/api/get_report_data`

-  Pass the dynamic JSON data into the WebDataRock configuration.

3.  **MZ Back-End**:

-  Make an HTTP POST request with dynamic JSON data to the backend server.


**How It Works**

1.  **Backend Express Server**:

-  Receives JSON data from Python on /api/pivot_report.

-  Stores the data in memory.

-  Serves the JSON data to React via /api/get_report_data.

2.  **ReactJS Frontend**:

-  Fetches the JSON data from /api/get_report_data.

-  Updates the WebDataRock pivot table configuration dynamically.

3.  **Python Script**:

-  Sends a POST request with the JSON payload to the Express server.