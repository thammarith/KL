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
			reject(new Error('Image format not supported. Please use camera or select JPEG/PNG.'));
		};

		img.src = URL.createObjectURL(file);
	});
};

export const capturePhoto = (): Promise<File> => {
	return new Promise((resolve, reject) => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.capture = 'environment';

		input.onchange = (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];

			if (!file) {
				reject(new Error('No file selected'));
				return;
			}

			resolve(file);
		};

		input.click();
	});
};
