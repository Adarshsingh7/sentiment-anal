/** @format */

import type React from 'react';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { RecorderContextProvider } from './context/RecorderContext';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<Router>
			<RecorderContextProvider>
				<SidebarProvider>
					<SidebarTrigger />
					{children}
				</SidebarProvider>
			</RecorderContextProvider>
		</Router>
	);
}
