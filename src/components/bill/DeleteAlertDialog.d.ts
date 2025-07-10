import React from 'react';

export interface DeleteAlertDialogProps {
	onDelete: () => void;
	trigger: React.ReactNode;
	t: (key: string) => string;
}

declare const DeleteAlertDialog: React.FC<DeleteAlertDialogProps>;
export default DeleteAlertDialog;
