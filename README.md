# 💰 Bill Splitter

A modern Progressive Web App (PWA) for splitting bills among friends using AI-powered receipt scanning with Google's Gemini API.

## ✨ Features

- 📸 **Camera & Upload**: Take photos or upload images of receipts
- 🤖 **AI-Powered Extraction**: Use Google Gemini API to extract items from bills
- 👥 **Friend Management**: Add and manage your dining companions
- 💰 **Smart Splitting**: Assign items to specific people or split equally
- 📱 **PWA Support**: Install as a mobile app
- 🔄 **Offline Ready**: Works offline with cached data
- 📤 **Easy Sharing**: Share bill splits via native sharing API

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Google Gemini API key (free at [Google AI Studio](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd bill-splitter
   pnpm install
   ```

2. **Start development server:**
   ```bash
   pnpm dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

4. **Setup Gemini API:**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key
   - Enter the API key in the app settings

## 🛠️ Build & Deploy

### Build for Production

```bash
pnpm build
```

### Deploy to GitHub Pages

1. **Update `homepage` in package.json:**
   ```json
   "homepage": "https://yourusername.github.io/bill-splitter"
   ```

2. **Deploy:**
   ```bash
   pnpm deploy:gh
   ```

### Deploy to Google Cloud Platform

1. **Install Google Cloud CLI:**
   ```bash
   curl https://sdk.cloud.google.com | bash
   exec -l $SHELL
   gcloud init
   ```

2. **Create a new GCP project or select existing:**
   ```bash
   gcloud projects create your-project-id
   gcloud config set project your-project-id
   ```

3. **Enable App Engine:**
   ```bash
   gcloud app create --region=us-central
   ```

4. **Build and deploy:**
   ```bash
   pnpm build
   pnpm deploy:gcp
   ```

## 📱 PWA Installation

### On Mobile (iOS/Android)
1. Open the app in your mobile browser
2. Look for "Add to Home Screen" option
3. Follow the prompts to install

### On Desktop (Chrome/Edge)
1. Open the app in your browser
2. Look for the install icon in the address bar
3. Click to install as a desktop app

## 🎯 How to Use

### 1. Add Friends
- Go to the "Friends" tab
- Click "Add Friend"
- Enter friend details (name required, email/phone optional)

### 2. Scan a Bill
- Go to the "Scan" tab
- Take a photo or upload an image of your receipt
- The AI will automatically extract items and prices

### 3. Split the Bill
- Go to the "Bills" tab
- Select your scanned bill
- Assign items to specific friends by checking their names
- Items not assigned to anyone are split equally among all participants
- View the split summary at the bottom

### 4. Share Results
- Click the "Share" button to send bill details via text/email
- Use your device's native sharing capabilities

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for local development:
```
VITE_GEMINI_API_KEY=your_api_key_here
```

### Customization
- Modify colors and styling in `/src/index.css`
- Update PWA settings in `/vite.config.ts`
- Customize app metadata in `/index.html`

## 🧪 Testing

### Manual Testing
```bash
# Start dev server
pnpm dev

# Build and preview
pnpm build
pnpm preview
```

### Browser Testing
The app is tested on:
- Chrome (mobile & desktop)
- Safari (mobile & desktop)
- Firefox (desktop)
- Edge (desktop)

## 📋 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Custom Properties
- **Icons**: Lucide React
- **AI**: Google Gemini API
- **PWA**: Vite PWA Plugin
- **Package Manager**: pnpm
- **Deployment**: GitHub Pages, Google Cloud Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**Gemini API not working:**
- Verify your API key is correct
- Check if you have available quota
- Ensure the image is clear and readable

**PWA not installing:**
- Make sure you're using HTTPS (required for PWA)
- Check if service worker is registered
- Try clearing browser cache

**Bills not saving:**
- Check browser localStorage isn't full
- Try clearing app data and restart

### Getting Help

1. Check the browser console for errors
2. Verify all dependencies are installed correctly
3. Ensure you have a stable internet connection for AI features

## 🔮 Roadmap

- [ ] Receipt templates for common restaurants
- [ ] Export to popular payment apps (Venmo, PayPal, etc.)
- [ ] Multi-currency support
- [ ] Group management with persistent invitations
- [ ] Bill history and statistics
- [ ] Dark mode theme
