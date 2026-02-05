# 🌍 EcoLens - Planetary Defense System

**EcoLens** is an intelligent environmental monitoring and reporting platform that uses AI-powered object detection to identify environmental threats in real-time. Capture images from your device's camera, get instant AI analysis, and contribute to a global environmental database with geographic tracking.

## 🎯 Features

### 👤 User Mode

- **Real-time Webcam Capture** - Scan environmental issues directly from your device
- **AI-Powered Analysis** - Google Gemini integration for instant threat identification
- **GPS Location Tracking** - Automatic geolocation of reported environmental issues
- **Gamification System** - Earn eco-points for each verified report
- **Text-to-Speech Feedback** - Hear analysis results in Indonesian (id-ID)
- **Risk Assessment** - Automatic categorization of threat levels (Critical/High/Medium/Low)

### 📊 Admin Dashboard

- **Interactive Map Visualization** - View all reported environmental issues on a real-time map
- **Detailed Report Cards** - Access comprehensive data for each environmental threat
- **Location-based Filtering** - Analyze issues by geographic region
- **Risk Level Indicators** - Quickly identify critical environmental threats
- **Evidence Storage** - Images and analysis stored with timestamp and coordinates

### 🔐 Security

- Simple authentication system for admin access
- Demo mode with protected command center access
- CORS-enabled backend for secure cross-origin requests

## 🛠️ Tech Stack

### Frontend

- **React 19.2** - Modern UI framework with hooks
- **Vite 7.2** - Lightning-fast build tool with HMR
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Leaflet & React-Leaflet** - Interactive maps
- **Axios** - HTTP client for API communication
- **React Webcam** - Webcam component integration
- **Lucide React** - Icon library
- **ESLint** - Code quality assurance

### Backend

- **Flask** - Lightweight Python web framework
- **Google Gemini AI API** - Advanced object detection and analysis
- **SQLite** - Lightweight database for report storage
- **Flask-CORS** - Cross-Origin Resource Sharing support

## 📋 Prerequisites

Before running the application, ensure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Python** (v3.8 or higher) for backend
- **Google Gemini API Key** (obtain from [Google AI Studio](https://aistudio.google.com))

## 🚀 Installation

### 1. Clone & Setup Frontend

```bash
cd frontend
npm install
```

### 2. Setup Backend

```bash
cd backend
pip install flask flask-cors pillow requests
```

**⚠️ Important:** Update your Google Gemini API key in backend/app.py:

```python
GOOGLE_API_KEY = "YOUR_API_KEY_HERE"
```

## 📦 Scripts

### Development

```bash
# Start development server (Frontend)
npm run dev

# Lint code
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend

```bash
# Start Flask API server
python app.py
```

The Flask server will run on `http://127.0.0.1:5000`

The frontend development server will run on `http://localhost:5173`

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── App.jsx              # Main menu & routing
│   ├── UserApp.jsx          # User scanning interface
│   ├── Dashboard.jsx        # Admin map & reports view
│   ├── Docs.jsx             # Documentation page
│   ├── App.css              # Global styles
│   ├── index.css            # Base styles
│   └── assets/              # Static assets
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS setup
├── eslint.config.js         # ESLint rules
└── package.json             # Dependencies

backend/
├── app.py                   # Main Flask application
└── [additional models]      # AI models & utilities
```

## 🎮 Usage

### For Users

1. Click **"LAUNCH SCANNER"** on the main menu
2. Allow camera and location access when prompted
3. Point your camera at an environmental issue (pollution, waste, hazards)
4. Click the **"SNAP EVIDENCE"** button
5. Wait for AI analysis (typically 2-5 seconds)
6. Receive instant feedback and earn eco-points
7. Your report is automatically saved with location and timestamp

### For Admins

1. Click **"COMMAND CENTER"** on the main menu
2. Enter password: `admin123` (demo mode)
3. View all environmental reports on the interactive map
4. Click on map markers to view detailed report information
5. See risk levels, timestamps, locations, and captured images

## 🔌 API Endpoints

### `/api/analyze` (POST)

Analyze an environmental image and return threat assessment

**Parameters:**

- `image` (file) - Image file from camera
- `lat` (float) - Latitude coordinate
- `lon` (float) - Longitude coordinate

**Response:**

```json
{
  "object_name": "Plastic Waste",
  "prediction_logic": "High concentration of plastic debris detected...",
  "risk_level": "HIGH",
  "suggestions": "Report to local environmental agency..."
}
```

## 🎨 UI/UX Features

- Dark theme with neon-green accent colors (environmental theme)
- Responsive design for mobile and desktop
- Smooth animations and transitions
- Glass-morphism design elements
- Real-time loading states and feedback
- Accessibility-first components

## 🔒 Security & Privacy

- Geolocation data is optional and user-controlled
- All API requests are validated on backend
- SQLite database stores local reports only
- CORS configured for secure API access
- Demo password for admin access (changeable in production)

## 📱 Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Android)

## 🚨 Troubleshooting

### Webcam not working

- Ensure HTTPS is used (or localhost)
- Check browser camera permissions
- Allow camera access in browser settings

### API connection failed

- Verify Flask backend is running on `http://127.0.0.1:5000`
- Check CORS settings in backend
- Ensure Google Gemini API key is valid and active

### GPS not available

- Check browser geolocation permissions
- Some regions require HTTPS for geolocation
- System will use default fallback coordinates if disabled

### Build errors

- Delete `node_modules` and reinstall: `npm install`
- Clear Vite cache: `rm -rf .vite`

## 📝 Environment Configuration

Create or update configuration in backend:

```python
DEFAULT_LAT = -6.9667  # Default latitude (Semarang)
DEFAULT_LON = 110.4167 # Default longitude (Semarang)
MODEL_NAME = "gemini-flash-latest" # Google Gemini model
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run linting: `npm run lint`
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open-source and available under the MIT License.

## 🌱 Environmental Impact

Each report helps identify and track environmental threats globally. Your eco-points contribute to building awareness and data for environmental conservation efforts.

---

**Made with ♻️ for a sustainable planet** 🌍
