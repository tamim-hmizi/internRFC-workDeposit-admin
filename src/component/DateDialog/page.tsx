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
  Box,
  Stack,
  Text
} from '@chakra-ui/react';

const DateDialogComponent = ({ isOpen, onClose, onSelectDate, dates }) => {
  return (
    <AlertDialog isOpen={isOpen} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Sélectionner une date
          </AlertDialogHeader>
          <AlertDialogBody>
            <Box>
              {dates.length === 0 ? (
                <Text>Aucune date disponible</Text>
              ) : (
                <Stack direction="column">
                  {dates.map((date) => (
                    <Button key={date} onClick={() => onSelectDate(date)}>{date}</Button>
                  ))}
                </Stack>
              )}
            </Box>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button colorScheme="blue" onClick={onClose} ml={3}>Fermer</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default DateDialogComponent;
