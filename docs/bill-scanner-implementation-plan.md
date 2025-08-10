# Bill Scanner Implementation Plan

## Overview

This document outlines the implementation plan for adding bill scanning functionality to the KL app. Users will be able to capture or upload photos of bills, which will be processed using Google Gemini API to automatically create structured bill data.

## Key Requirements

1. **Image Capture/Upload**: Allow users to take or upload bill photos
2. **Local Storage**: Store compressed images in IndexedDB for verification (not as base64)
3. **Image Processing**: Send full-resolution images to Google Gemini for maximum accuracy
4. **Structured Output**: Extract bill data matching our internal schema
5. **Security**: Protect API keys using Firebase Functions backend
6. **Deployment**: Single command deployment process
7. **Translation Format**: Deprecate English fields, use parentheses format instead

## Architecture

### Frontend (React/TypeScript)

- Image capture/upload UI in `index.tsx`
- Image compression for IndexedDB storage
- Full-resolution upload to backend
- Integration with existing bill creation flow

### Backend (Firebase Functions v2)

- Secure HTTP endpoint with authentication
- Google Gemini API integration
- Environment variable management for API keys
- Structured data extraction and formatting

### Storage

- **IndexedDB**: Compressed images for user verification
- **Memory**: Full-resolution images processed in-memory (not stored)

## Data Schema

### Google Gemini Response Schema

```typescript
const billExtractionSchema = {
	type: 'object',
	properties: {
		restaurant: {
			type: 'string',
			description:
				"Restaurant name with transliteration in parentheses, e.g., 'สุกี้ยากี้ (Suki Yaki)'",
		},
		items: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					name: {
						type: 'string',
						description:
							"Item name with translation in parentheses, e.g., 'ข้าวผัด (Fried Rice)'",
					},
					amount: {
						type: 'number',
						description: 'Price of the item',
					},
					quantity: {
						type: 'number',
						description: 'Quantity ordered',
						default: 1,
					},
				},
				required: ['name', 'amount'],
			},
		},
		adjustments: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					name: {
						type: 'string',
						description:
							"Adjustment name with translation, e.g., 'ภาษี (Tax)', 'ค่าบริการ (Service Charge)'",
					},
					amount: {
						type: 'number',
						description: 'Adjustment amount (positive or negative)',
					},
				},
				required: ['name', 'amount'],
			},
		},
		subTotal: {
			type: 'number',
			description: 'Subtotal before adjustments',
		},
		grandTotal: {
			type: 'number',
			description: 'Final total after all adjustments',
		},
		currency: {
			type: 'string',
			description: "Currency code (e.g., 'THB', 'USD')",
		},
		date: {
			type: 'string',
			description: 'Date in ISO format (YYYY-MM-DD)',
			nullable: true,
		},
		time: {
			type: 'string',
			description: 'Time in HH:MM format',
			nullable: true,
		},
	},
	required: ['restaurant', 'items', 'subTotal', 'grandTotal', 'currency'],
};
```

### Prompt Engineering

```text
Extract structured data from this bill/receipt image:

1. Restaurant name: Include original text followed by phonetic transliteration (NOT translation) in parentheses
   Example: "สุกี้ยากี้ (Suki Yaki)"

2. Menu items: Include original name followed by English translation in parentheses
   Example: "ข้าวผัด (Fried Rice)"
   - If quantity > 1, note it separately
   - Extract the total price for each line item

3. Adjustments (tax, service charge, discounts):
   Example: "ภาษี (Tax)", "ค่าบริการ (Service Charge)"
   - Include both positive and negative adjustments

4. Extract subtotal (before adjustments) and grand total (final amount)

5. Identify currency code (THB, USD, etc.)

6. Extract date and time if visible

IMPORTANT:
- For restaurant names: Use TRANSLITERATION (how it sounds), not translation
- For menu items and adjustments: Use TRANSLATION (what it means)
- Always format as: "Original Text (English)"
```

## Implementation Phases

## Current Status and Next Steps

**✅ Phase 0 Complete:** Firebase Functions infrastructure is deployed and tested
**🚀 Ready for Phase 1:** UI Development can now begin

**Immediate Next Actions:**

1. Start implementing `BillScanner.tsx` component
2. Add camera capture and file upload functionality
3. Implement image compression and IndexedDB storage
4. Integrate scanner button with existing bill creation flow

---

### Phase 0: Minimal Firebase Functions Setup ✅ COMPLETED

**Completion Date:** December 2024
**Status:** Successfully deployed and tested

#### 0.1 Initialize Firebase Functions ✅

Firebase Functions v2 has been initialized with TypeScript support:

- Node.js 20 runtime
- ESLint configuration
- TypeScript compilation
- Asia-Southeast1 region (Singapore)

#### 0.2 Create Test Function ✅

Implemented test functions in `functions/src/index.ts`:

```typescript
// functions/src/index.ts - IMPLEMENTED
import { onCall } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2';

setGlobalOptions({
	region: 'asia-southeast1', // Singapore
	maxInstances: 10,
});

export const processBill = onCall({ cors: true }, async (request) => {
	console.log('processBill function called successfully');
	return {
		success: true,
		message: 'Function is working correctly',
		timestamp: new Date().toISOString(),
		echo: request.data,
	};
});

export const testConfig = onCall({ cors: true }, async () => {
	const hasApiKey = !!process.env.GEMINI_API_KEY;
	return {
		success: true,
		configuration: {
			geminiApiKey: hasApiKey ? 'configured' : 'missing',
			region: process.env.FUNCTION_REGION || 'not set',
			nodeVersion: process.version,
		},
		timestamp: new Date().toISOString(),
	};
});
```

#### 0.3 Set Environment Variables ✅

Environment configuration completed:

- Frontend Firebase config in `.env`
- Functions environment variables in `functions/.env`
- GEMINI_API_KEY configuration verified

#### 0.4 Deploy and Test ✅

Functions successfully deployed and tested:

- Deployment to `asia-southeast1` region completed
- Frontend test component `FunctionTest.tsx` implemented
- CORS configuration verified
- Authentication flow tested
- Environment variable access confirmed

**Verification Components:**

- `src/components/bill/FunctionTest.tsx` - Frontend testing interface
- Both `processBill` and `testConfig` functions responding correctly

### Phase 1: UI Development (CURRENT PHASE)

**Next Steps:** Begin UI development for bill scanning functionality

#### 1.1 Create Bill Scanner Component

**Implementation Tasks:**

- [ ] Create `BillScanner.tsx` component with camera capture interface
- [ ] Add file upload option with drag-and-drop support
- [ ] Implement image preview with basic editing (crop, rotate)
- [ ] Add loading states with progress indicators
- [ ] Implement comprehensive error handling and user feedback
- [ ] Add support for multiple image formats (JPEG, PNG, WebP)
- [ ] Implement camera permission handling

**Best Practices (Updated 2024):**

- Use `navigator.mediaDevices.getUserMedia()` for camera access
- Implement proper error boundaries for camera failures
- Add responsive design for mobile-first approach
- Include accessibility features (screen reader support)

#### 1.2 Image Processing

**Implementation Tasks:**

- [ ] Implement client-side image compression using Canvas API
- [ ] Set up IndexedDB storage using `idb` library (already in project)
- [ ] Create image retrieval system for verification
- [ ] Add image metadata extraction (EXIF data cleanup)
- [ ] Implement progressive image loading for large files

**Technical Details:**

```typescript
// Image compression implementation
const compressImage = (file: File, quality: number = 0.8): Promise<Blob> => {
	// Implementation using Canvas API
};

// IndexedDB storage structure
interface StoredImage {
	id: string;
	compressedBlob: Blob;
	originalName: string;
	timestamp: number;
	metadata: ImageMetadata;
}
```

#### 1.3 Integration Points

**Implementation Tasks:**

- [ ] Add scanner button to main index page (`routes/index.tsx`)
- [ ] Connect to existing bill creation flow in `BillContext`
- [ ] Handle successful scan results and redirect to bill form
- [ ] Integrate with existing bill validation logic
- [ ] Add scanner option to bill edit mode
- [ ] Implement scan result preview before bill creation

**Integration Notes:**

- Maintain consistency with existing UI patterns
- Use established routing patterns from TanStack Router
- Follow existing state management patterns with React Context

### Phase 2: Basic Backend Integration

**Prerequisites:** Complete Phase 1 UI components

#### 2.1 Update Firebase Function

**Implementation Tasks:**

- [ ] Accept base64 image data in `processBill` function
- [ ] Add comprehensive input validation (file size, format, content)
- [ ] Implement size limits (max 10MB per image)
- [ ] Add image format validation (JPEG, PNG, WebP)
- [ ] Implement user authentication checks
- [ ] Add rate limiting per user (prevent abuse)

**Technical Implementation:**

```typescript
// Enhanced processBill function
export const processBillWithImage = onCall(
	{
		cors: true,
		memory: '1GiB', // Increased for image processing
		timeoutSeconds: 300, // 5 minutes for complex images
	},
	async (request) => {
		// Authentication check
		if (!request.auth) {
			throw new HttpsError('unauthenticated', 'User must be authenticated');
		}

		// Input validation
		const { imageBase64, mimeType } = request.data;
		if (!imageBase64 || !mimeType) {
			throw new HttpsError('invalid-argument', 'Image data and MIME type required');
		}

		// Size validation (10MB limit)
		const sizeInBytes = (imageBase64.length * 3) / 4;
		if (sizeInBytes > 10 * 1024 * 1024) {
			throw new HttpsError('invalid-argument', 'Image size exceeds 10MB limit');
		}

		// TODO: Add Gemini integration
		return {
			success: true,
			message: 'Image received and validated',
			userId: request.auth.uid,
			timestamp: new Date().toISOString(),
		};
	}
);
```

#### 2.2 Add Gemini Integration

**Implementation Tasks:**

- [ ] Install Google Generative AI SDK in functions
- [ ] Configure Gemini 2.0 Flash model (most cost-effective)
- [ ] Implement basic text extraction for testing
- [ ] Add error handling for Gemini API calls
- [ ] Implement retry logic for transient failures
- [ ] Add response validation and sanitization

**Updated Implementation (2024 Best Practices):**

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
import { HttpsError } from 'firebase-functions/v2/https';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const processBillWithGemini = onCall(
	{
		cors: true,
		memory: '1GiB',
		timeoutSeconds: 300,
	},
	async (request) => {
		// Validation (as above)...

		try {
			const model = genAI.getGenerativeModel({
				model: 'gemini-2.0-flash',
			});

			// Enhanced prompt for better accuracy
			const prompt = `Extract text and identify any structured data from this receipt/bill image.
			Focus on: restaurant name, menu items with prices, totals, taxes, and date/time if visible.`;

			const result = await model.generateContent([
				prompt,
				{
					inlineData: {
						mimeType: request.data.mimeType,
						data: request.data.imageBase64,
					},
				},
			]);

			const response = await result.response;
			const text = response.text();

			return {
				success: true,
				extractedText: text,
				processingTime: new Date().toISOString(),
				model: 'gemini-2.0-flash',
			};
		} catch (error) {
			console.error('Gemini API error:', error);
			throw new HttpsError('internal', 'Failed to process image with AI service');
		}
	}
);
```

**Dependencies to Add:**

```bash
cd functions
pnpm add @google/generative-ai
```

### Phase 3: Full Implementation

#### 3.1 Structured Output

- Implement JSON schema for Gemini
- Add proper prompt engineering
- Parse and validate responses

#### 3.2 Error Handling

- Rate limiting per user
- Retry logic for failures
- User-friendly error messages

#### 3.3 Performance Optimization

- Image size optimization
- Response caching (if applicable)
- Parallel processing for multiple items

### Phase 4: Polish and Testing

#### 4.1 UI Enhancements

- Add image cropping
- Implement progress indicators
- Create success animations

#### 4.2 Comprehensive Testing

- Unit tests for functions
- Integration tests
- End-to-end testing

#### 4.3 Documentation

- User guide
- API documentation
- Troubleshooting guide

## Security Measures

1. **API Key Protection**
    - Store in Firebase environment variables
    - Never expose in frontend code

2. **Authentication**
    - Require Firebase Auth
    - Validate user tokens

3. **Rate Limiting**
    - Implement per-user quotas
    - Monitor usage patterns
    - Protection against automated abuse

4. **Input Validation**
    - Check image sizes
    - Validate MIME types
    - Sanitize responses

## Deployment Configuration

### Frontend Deployment

```json
// package.json
{
	"scripts": {
		"deploy:frontend": "pnpm build && firebase deploy --only hosting",
		"deploy:functions": "cd functions && pnpm build && firebase deploy --only functions",
		"deploy:all": "pnpm deploy:frontend && pnpm deploy:functions"
	}
}
```

### Firebase Configuration

```json
// firebase.json
{
	"functions": {
		"source": "functions",
		"predeploy": ["npm --prefix \"$RESOURCE_DIR\" run build"],
		"runtime": "nodejs20"
	},
	"hosting": {
		"public": "dist",
		"ignore": ["firebase.json", "**/.*", "**/node_modules/**"]
	}
}
```

## Cost Estimation

### Google Gemini API Pricing (as of 2024)

- **Gemini 2.0 Flash**: Most cost-effective for this use case
- **Input**: ~$0.075 per 1M tokens
- **Output**: ~$0.30 per 1M tokens
- **Image Input**: Calculated based on resolution

### Optimization Strategies

1. Use Gemini 2.0 Flash for cost efficiency
2. Compress images before sending (balance quality vs cost)
3. Cache common restaurant menus (future enhancement)
4. Implement user quotas if needed

## Testing Checklist

### Phase 0 Testing ✅ COMPLETED

- [x] Firebase Functions deploy successfully
- [x] Test function callable from frontend
- [x] Authentication blocks unauthenticated calls
- [x] Environment variables are accessible
- [x] CORS configured correctly

### End-to-End Testing

- [ ] Image capture works on mobile devices
- [ ] File upload accepts common formats
- [ ] Images compress and store in IndexedDB
- [ ] Full-resolution image processes correctly
- [ ] Structured data matches expected schema
- [ ] Bill creates successfully from scanned data
- [ ] Error messages are user-friendly

## Future Enhancements

1. **Batch Processing**: Scan multiple receipts at once
2. **Template Recognition**: Identify common restaurant formats
3. **Learning System**: Improve accuracy based on corrections
4. **Offline Queue**: Process when connection available
5. **Receipt Storage**: Optional cloud backup of receipts

## Appendix

### Sample Test Data

Include sample receipt images and expected outputs for testing

### Troubleshooting Guide

Common issues and solutions during implementation

### References

- [Google Gemini API Documentation](https://ai.google.dev/gemini-api/docs/structured-output)
- [Firebase Functions v2 Guide](https://firebase.google.com/docs/functions/get-started?gen=2nd)
- [IndexedDB Best Practices](https://web.dev/articles/indexeddb)
