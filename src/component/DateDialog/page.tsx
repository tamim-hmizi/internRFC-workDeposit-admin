"use client";
import React, { useState, ChangeEvent, useRef } from 'react';
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
  Text,
  InputGroup,
  InputRightElement,
  IconButton,
  Input,
} from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';

// Define props type
interface DateDialogComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (date: string) => void;
  dates: string[];
}

const DateDialogComponent: React.FC<DateDialogComponentProps> = ({ isOpen, onClose, onSelectDate, dates }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Filter dates based on search query
  const filteredDates = searchQuery
    ? dates.filter((date) => date.toLowerCase().includes(searchQuery.toLowerCase()))
    : dates;

  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Sélectionner une date
          </AlertDialogHeader>
          <AlertDialogBody>
            <InputGroup mb={4}>
              <Input
                placeholder="Recherche..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <InputRightElement>
                <IconButton
                  aria-label="Search"
                  icon={<Search2Icon />}
                  onClick={() => {}}
                />
              </InputRightElement>
            </InputGroup>
            <Box>
              {filteredDates.length === 0 ? (
                <Text>Aucune date disponible</Text>
              ) : (
                <Stack direction='row' spacing={4} flexWrap='wrap'>
                  {filteredDates.map((date) => (
                    <Button
                      key={date}
                      colorScheme='teal'
                      variant='outline'
                      onClick={() => onSelectDate(date)}
                    >
                      {date}
                    </Button>
                  ))}
                </Stack>
              )}
            </Box>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button colorScheme="blue" onClick={onClose} ml={3} ref={cancelRef}>
              Fermer
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default DateDialogComponent;
