# Google Sheets Integrated Form

This project is a web form where all submitted data is saved directly to a Google Sheets document in a table format. The project utilizes Google Apps Script to handle form submissions and data storage.

## Project Overview

This project is designed to collect user inputs via a web form and save them directly to a Google Sheet. The Google Sheet acts as a database for storing and viewing submitted form data in table format.

## Features

- **Simple and Clean Form Interface**: Collects user details including name, email, gender, and message.
- **Real-Time Data Submission**: Data is instantly saved to a Google Sheet upon form submission.
- **Google Sheets as a Database**: Uses Google Sheets to store and organize the data in a tabular format.
- **Public Access to Sheet Data**: The Google Sheet is publicly accessible, allowing for easy data viewing and management.

## Technologies Used

- **HTML/CSS**: For the form structure and styling.
- **JavaScript (Vanilla JS)**: For handling form submissions and sending data.
- **Google Sheets API**: Used for storing the submitted form data.
- **Google Apps Script**: Powers the backend to handle form submissions.

## Google Sheet Link

The data is stored in the following Google Sheet:
[Google Sheet Database](https://docs.google.com/spreadsheets/d/1EdESpCfJu4-ukF0w-jpAw8RFxyEWv0cI0-1V_aOvAK0/edit?gid=0#gid=0)

## How It Works

1. When a user submits the form, the data is sent to a Google Apps Script Web App URL using a `POST` request.
2. The script processes the data and appends it to the specified Google Sheet in a new row.
3. The data can then be viewed and managed within the Google Sheet.