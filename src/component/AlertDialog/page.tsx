// components/AlertDialogComponent.tsx
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

const AlertDialogComponent = ({ isOpen, onClose, cancelRef, values }) => {
  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Rapport de travail
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text>
              <strong>Thème:</strong> {values.Thème}
            </Text>
            <Text>
              <strong>Date:</strong> {values.Date}
            </Text>
            <Text>
              <strong>Avancement:</strong> {values.Avancement}%
            </Text>
            <Text>
              <strong>Tâche:</strong> {values.Tâche}
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={onClose} colorScheme="blue" ml={3}>
              Fermer
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default AlertDialogComponent;
