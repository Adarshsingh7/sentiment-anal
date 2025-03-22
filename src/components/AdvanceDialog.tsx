/** @format */

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { ReactNode, useState } from 'react';

interface Props {
	children: ReactNode;
	label: string;
	description?: string; // Optional description
	confirmText?: string; // Customizable button text
	triggerClassName?: string; // Custom styling for trigger button
	onConfirm?: () => void; // Callback function for confirm button
	open?: boolean; // Allow external control
	setOpen?: (state: boolean) => void; // State setter for external control
}

export function AdvanceDialog({
	children,
	label,
	description,
	confirmText = 'Save changes',
	onConfirm,
	open: controlledOpen,
	setOpen: setControlledOpen,
}: Props) {
	const [internalOpen, setInternalOpen] = useState(false);

	// Determine if the component is controlled externally or internally
	const isControlled =
		controlledOpen !== undefined && setControlledOpen !== undefined;
	const open = isControlled ? controlledOpen : internalOpen;

	// Ensure closing the modal allows it to reopen properly
	const handleOpenChange = (state: boolean) => {
		if (!isControlled) setInternalOpen(state);
		if (setControlledOpen) setControlledOpen(state);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={handleOpenChange}
		>
			<DialogContent className='sm:max-w-[625px]'>
				<DialogHeader>
					<DialogTitle>{label}</DialogTitle>
					{description && <DialogDescription>{description}</DialogDescription>}
				</DialogHeader>
				{children}
				<DialogFooter>
					<Button
						type='submit'
						onClick={() => {
							onConfirm?.();
							handleOpenChange(false); // Close modal properly
						}}
					>
						{confirmText}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
