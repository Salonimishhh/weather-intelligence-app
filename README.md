# 🌦️ Weather Intelligence App

## Overview

The Weather Intelligence App is a responsive web application built using **Google AI Studio App Build**, **React**, and **Vite**. It enables users to search for any city and view real-time weather information, a 7-day forecast, weather trends, and intelligent recommendations using the public **Open-Meteo APIs**.

This project was developed as part of the **Stack AI Foundation – AI Native App Building Level 2** assignment.

---

## Features

- Search weather by city name
- Current weather details
- 7-day weather forecast
- Weather trend visualization
- Smart weather recommendations
- User-friendly error handling for invalid cities
- Responsive design for desktop and mobile devices
- Powered by public Open-Meteo APIs

---

## Technology Stack

- React
- TypeScript
- Vite
- Google AI Studio App Build
- Open-Meteo Geocoding API
- Open-Meteo Forecast API
- GitHub
- Cloudflare

---

## APIs Used

### Open-Meteo Geocoding API

Converts city names into latitude and longitude.

https://geocoding-api.open-meteo.com/v1/search

### Open-Meteo Forecast API

Retrieves current weather and 7-day forecast.

https://api.open-meteo.com/v1/forecast

---

## Project Structure

```
weather-intelligence-app/
│
├── src/
├── assets/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
└── README.md
```

---

## Installation

Clone the repository

```bash
git clone https://github.com/Salonimishhh/weather-intelligence-app.git
```

Move into the project

```bash
cd weather-intelligence-app
```

Install dependencies

```bash
npm install
```

Run locally

```bash
npm run dev
```

Build production version

```bash
npm run build
```

---

## Deployment

The application was:

1. Built using Google AI Studio App Build.
2. Connected directly to GitHub.
3. Deployed using Cloudflare deployment.
4. Successfully published with a live deployment URL.

---

## Validation Performed

- ✅ Weather search for Chennai
- ✅ Weather search for London
- ✅ Invalid city error handling
- ✅ Responsive UI validation
- ✅ Successful production deployment

---

## Repository

GitHub Repository

https://github.com/Salonimishhh/weather-intelligence-app

---

## Live Deployment

Cloudflare Deployment

https://weather-intelligence-app-v2.mishsaloni.workers.dev

---

## Author

**Saloni Mishra**

Stack AI Foundation – AI Native App Building Level 2
