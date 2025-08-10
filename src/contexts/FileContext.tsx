import { createContext, useContext, useState } from 'react';

interface FileContextType {
	currentFile: File | null;
	setCurrentFile: (file: File | null) => void;
}

const FileContext = createContext<FileContextType>({
	currentFile: null,
	setCurrentFile: () => {},
});

export const FileProvider = ({ children }: { children: React.ReactNode }) => {
	const [currentFile, setCurrentFile] = useState<File | null>(null);

	return (
		<FileContext.Provider value={{ currentFile, setCurrentFile }}>
			{children}
		</FileContext.Provider>
	);
};

export const useFile = () => useContext(FileContext);
