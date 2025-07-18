# Virtual Try-On Web Application

A modern, responsive virtual try-on web application built with Next.js 14+, TypeScript, and Tailwind CSS. Upload images of models and garments to visualize how outfits look using AI-powered technology.

## 🌟 Features

- **Modern UI/UX**: Beautiful gradient backgrounds with smooth animations
- **Responsive Design**: Mobile-first approach with touch-friendly interface
- **Multiple Upload Options**: Upload files, capture with camera, or use image URLs
- **Real-time Preview**: Instant image previews with edit/remove controls
- **AI-Powered**: Integration with virtual try-on API endpoints
- **Download Results**: Save generated try-on images
- **Progressive Enhancement**: Works without JavaScript for basic functionality
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## 🚀 Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React for consistent iconography
- **Deployment**: Vercel-ready with environment variables
- **State Management**: React hooks (useState, useReducer)
- **Image Processing**: Base64 encoding with compression

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd viton-webapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your API endpoints:
   ```env
   NEXT_PUBLIC_TRYON_API_ENDPOINT=http://localhost:3000/api
   VITON_BACKEND_URL=your_backend_url_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                      # Next.js 14 App Router
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Landing page
│   └── try-on/
│       └── page.tsx         # Main try-on interface
├── components/              # Reusable UI components
│   ├── Navigation/
│   │   └── NavigationPills.tsx
│   ├── Preview/
│   │   └── ImagePreview.tsx
│   ├── UI/
│   │   └── LoadingSpinner.tsx
│   └── Upload/
│       └── UploadZone.tsx
├── hooks/                   # Custom React hooks
│   ├── useImageUpload.ts    # Image upload logic
│   └── useTryOn.ts          # Try-on API integration
├── lib/                     # Utility functions
│   ├── api.ts               # API service layer
│   ├── constants.ts         # App constants
│   └── utils.ts             # Helper functions
├── styles/
│   └── globals.css          # Global styles and Tailwind
└── types/
    └── index.ts             # TypeScript type definitions
```

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#5B7FFF` - Buttons, active states
- **Secondary Orange**: `#E67E22` - Upload buttons, accents
- **Background Gradient**: `#C6D3F7` to `#B8C9F1`
- **Text Colors**: 
  - Dark: `#1A1A1A`
  - Medium: `#4A5568`
  - Light: `#718096`

### Components
- **Cards**: White background with soft shadows
- **Buttons**: Rounded corners with hover effects
- **Upload Zones**: Dashed borders with drag-and-drop
- **Navigation**: Pills with completion states

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_TRYON_API_ENDPOINT` | Frontend API endpoint (usually localhost:3000/api) | Yes |
| `VITON_BACKEND_URL` | Backend server URL for try-on processing | Yes |
| `NEXT_PUBLIC_APP_URL` | Base URL for the application | No |

### Upload Configuration

- **Max file size**: 10MB
- **Supported formats**: JPEG, PNG, WebP
- **Auto-compression**: Images > 1MB are compressed
- **Max dimensions**: 2048x2048px

### API Configuration

- **Request timeout**: 5 minutes (300 seconds)
- **Retry attempts**: 3
- **Maximum function duration**: 5 minutes (Vercel Pro/Enterprise plans)

> **Note**: Vercel Hobby plan has a 10-second timeout limit. For try-on generation that may take longer, consider upgrading to Pro plan or using a different deployment platform.

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in the Vercel dashboard:
   - `NEXT_PUBLIC_TRYON_API_ENDPOINT`
3. **Deploy** - Vercel will automatically build and deploy

### Other Platforms

The application can be deployed to any platform that supports Node.js:

```bash
npm run build
npm run start
```

## 🔌 API Integration

The application expects a REST API with the following endpoint:

### POST `/viton`

**Request Body:**
```json
{
  "model_image": "base64_encoded_image",
  "garment_image": "base64_encoded_image",
  "options": {
    "preserve_background": true,
    "fit_type": "normal"
  }
}
```

**Response:**
```json
{
  "success": true,
  "result_image": "base64_encoded_result",
  "processing_time": 1500,
  "message": "Try-on generated successfully"
}
```

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

### Adding New Features

1. **Components**: Add to `src/components/`
2. **Hooks**: Add to `src/hooks/`
3. **Types**: Update `src/types/index.ts`
4. **Utilities**: Add to `src/lib/utils.ts`

## 🎯 Performance

- **Image Optimization**: Automatic compression and resizing
- **Code Splitting**: Automatic with Next.js
- **Lazy Loading**: Images load on demand
- **Caching**: Static assets cached by Vercel CDN

## ♿ Accessibility

- **ARIA Labels**: All interactive elements labeled
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Semantic HTML and announcements
- **Focus Management**: Visible focus indicators
- **Color Contrast**: WCAG AA compliant

## 🔒 Security

- **Input Validation**: File type and size validation
- **XSS Protection**: Content Security Policy headers
- **HTTPS**: Enforced in production
- **Environment Variables**: Sensitive data not exposed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Images not uploading**
   - Check file size (< 10MB)
   - Verify file format (JPEG/PNG/WebP)
   - Ensure stable internet connection

2. **API errors**
   - Verify environment variables are set
   - Check API endpoint is accessible
   - Confirm API key is valid

3. **Build errors**
   - Run `npm install` to ensure dependencies
   - Check Node.js version (>= 18.0.0)
   - Clear `.next` folder and rebuild

### Getting Help

- 📧 Email: support@virtualtryon.app
- 💬 Discord: [Join our community](https://discord.gg/virtualtryon)
- 🐛 Issues: [GitHub Issues](https://github.com/username/viton-webapp/issues)

---

Made with ❤️ by the Virtual Try-On Team
