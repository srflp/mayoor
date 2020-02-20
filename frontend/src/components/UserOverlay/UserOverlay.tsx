import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import styled from '@emotion/styled';

import { useAppState } from '../../appContext/context';

import { ChangePassword } from './ChangePassword';

export const UserOverlay: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { currentUser } = useAppState();
	return (
		<>
			<Button icon="user" onClick={() => setIsOpen(true)}>
				{currentUser?.name}
			</Button>
			<Modal
				visible={isOpen}
				onCancel={() => setIsOpen(false)}
				title={currentUser?.name}
				footer={null}
			>
				<ChangePassword />
			</Modal>
		</>
	);
};
