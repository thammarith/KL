export const compressImageForStorage = (file: File): Promise<Blob> => {
	return new Promise((resolve, reject) => {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d')!;
		const img = new Image();

		img.onload = () => {
			const maxWidth = 800;
			const maxHeight = 1200;
			let { width, height } = img;

			if (width > height && width > maxWidth) {
				height *= maxWidth / width;
				width = maxWidth;
			}

			if (height >= width && height > maxHeight) {
				width *= maxHeight / height;
				height = maxHeight;
			}

			canvas.width = width;
			canvas.height = height;
			ctx.drawImage(img, 0, 0, width, height);

			canvas.toBlob(
				(blob) => {
					if (!blob) {
						reject(new Error('Failed to compress image'));
						return;
					}

					resolve(blob);
				},
				'image/jpeg',
				0.8
			);
		};

		img.onerror = () => {
			reject(
				new Error(
					'Image format not supported. Please use JPEG, PNG, WebP, HEIC, or HEIF format.'
				)
			);
		};

		img.src = URL.createObjectURL(file);
	});
};

export const fileToBase64 = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => {
			if (!reader.result) {
				reject(new Error('Failed to read file'));
				return;
			}

			resolve(reader.result as string);
		};

		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
};
