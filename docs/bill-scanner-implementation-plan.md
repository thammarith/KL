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
**✅ Phase 1 Complete:** UI Development and basic image processing implemented
**🚀 Ready for Phase 2:** Backend integration with Google Gemini API

**What Has Been Implemented:**

1. ✅ `ScanReceiptButton` component with file upload and camera capture
2. ✅ `FileContext` for managing selected images
3. ✅ `/processing` route for handling scanned receipts
4. ✅ Image compression utilities (`imageUtils.ts`)
5. ✅ `billProcessingService.ts` with service interface
6. ✅ Complete i18n support for scanning features
7. ✅ Integration with main app flow and routing

**Immediate Next Actions:**

1. Implement Google Gemini API integration in Firebase Functions
2. Uncomment and complete the processing logic in `/processing` route
3. Add structured data extraction with proper schema validation
4. Implement full end-to-end bill creation from scanned images

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
- CORS configuration verified
- Authentication flow tested
- Environment variable access confirmed

**Verification Status:**

- Firebase Functions deployed and accessible
- Basic `processBill` function tested and working
- Ready for Gemini API integration

### Phase 1: UI Development ✅ COMPLETED

**Completion Date:** January 2025
**Status:** Successfully implemented all UI components and image processing

#### 1.1 Create Bill Scanner Component ✅

**Completed Implementation:**

- ✅ `ScanReceiptButton` component with camera capture and file upload
- ✅ File validation (size limits, image types)
- ✅ Error handling and user feedback
- ✅ Support for multiple image formats (JPEG, PNG, WebP)
- ✅ Mobile-optimized camera capture with `capture="environment"`

#### 1.2 Image Processing ✅

**Completed Implementation:**

- ✅ Client-side image compression using Canvas API (`imageUtils.ts`)
- ✅ Image metadata handling and compression optimization
- ✅ FileContext for managing selected images
- ✅ Quality-optimized compression (800x1200 max, 80% quality)

#### 1.3 Integration Points ✅

**Completed Implementation:**

- ✅ Scanner button integrated into main index page (`routes/index.tsx`)
- ✅ FileContext connection for state management
- ✅ Processing route (`/processing`) for scan results
- ✅ Complete i18n integration for all scan-related strings
- ✅ Consistent UI patterns with existing app design

### Phase 2: Backend Integration (CURRENT PHASE)

**Prerequisites:** ✅ Phase 1 UI components completed
**Status:** Firebase function structure ready, needs Gemini API integration

#### 2.1 Firebase Function Enhancement

**Current Status:**
- ✅ Basic `processBill` function implemented
- ✅ CORS configuration and authentication setup
- ✅ Function deployment and testing completed

**Remaining Tasks:**

- [ ] Add Google Gemini API integration
- [ ] Implement structured data extraction with bill schema
- [ ] Add comprehensive input validation for image processing
- [ ] Enhance error handling for API failures

#### 2.2 Frontend Processing Integration

**Current Status:**
- ✅ `billProcessingService.ts` service interface created
- ✅ Processing route (`/processing`) structure implemented
- ✅ Image-to-base64 conversion utilities ready

**Remaining Tasks:**

- [ ] Uncomment and complete processing logic in `/processing` route
- [ ] Connect service to actual Firebase function endpoint
- [ ] Implement bill creation from processed data
- [ ] Add proper error handling and user feedback

#### 2.3 Google Gemini Integration

**Implementation Tasks:**

- [ ] Install Google Generative AI SDK in functions: `pnpm add @google/generative-ai`
- [ ] Update `processBill` function to accept image data and call Gemini API
- [ ] Implement structured data extraction using the bill schema
- [ ] Add comprehensive error handling and retry logic
- [ ] Configure Gemini 2.0 Flash model for cost-effectiveness

**Next Steps for Implementation:**

1. Update Firebase function to process images with Gemini
2. Test with sample receipt images
3. Validate structured output matches expected schema
4. Enable end-to-end processing in the frontend

### Phase 3: Enhancement and Testing (FUTURE)

**Prerequisites:** Complete Phase 2 backend integration

#### 3.1 Core Features Completion

- [ ] IndexedDB integration for receipt image storage (referenced in processing route)
- [ ] Receipt image viewer component enhancement
- [ ] Advanced error handling and user feedback
- [ ] Performance optimization for large images

#### 3.2 Optional Enhancements

- [ ] Image cropping and editing capabilities
- [ ] Batch processing for multiple receipts
- [ ] Receipt template recognition for common formats
- [ ] Offline processing queue

#### 3.3 Testing and Documentation

- [ ] End-to-end testing with real receipt images
- [ ] Performance testing with various image sizes
- [ ] User documentation and troubleshooting guide

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

### Phase 1 Testing ✅ COMPLETED

- [x] Image capture works on mobile devices
- [x] File upload accepts common formats (JPEG, PNG, WebP)
- [x] Image compression works correctly
- [x] File validation (size limits, type checking)
- [x] Error messages are user-friendly
- [x] Integration with app routing and navigation

### Phase 2 Testing (IN PROGRESS)

- [ ] Full-resolution image processes correctly with Gemini
- [ ] Structured data matches expected schema
- [ ] Bill creates successfully from scanned data
- [ ] End-to-end processing workflow
- [ ] Error handling for processing failures

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
