"use client";
import React from 'react';
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Text,
} from '@chakra-ui/react';

interface AlertDialogComponentProps {
  isOpen: boolean;
  onClose: () => void;
  cancelRef: React.RefObject<HTMLButtonElement>;
  values: {
    message?: string;
    Theme?: string;
    Date?: string;
    Avancement?: string;
    Tâche?: string;
  };
}
const AlertDialogComponent : React.FC<AlertDialogComponentProps> = ({ isOpen, onClose, cancelRef, values }) => {
  console.log('AlertDialog Values:', values);
  const safeValues = values || {};

  return (
    
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Rapport de travail
          </AlertDialogHeader>
          <AlertDialogBody>
            {safeValues.message ? (
              <Text>{safeValues.message}</Text>
            ) : (
              <>
                <Text><strong>Thème:</strong> {safeValues.Theme || 'Non spécifié'}</Text>
                <Text><strong>Date:</strong> {safeValues.Date || 'Non spécifiée'}</Text>
                <Text><strong>Avancement:</strong> {safeValues.Avancement || 'Non spécifié'}%</Text>
                <Text><strong>Tâche:</strong> {safeValues.Tâche || 'Non spécifiée'}</Text>
              </>
            )}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button colorScheme="blue" onClick={onClose} ml={3}>OK</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default AlertDialogComponent;
