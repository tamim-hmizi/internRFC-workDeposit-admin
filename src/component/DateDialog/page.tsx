"use client";
import React, { useState } from 'react';
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

const DateDialogComponent = ({ isOpen, onClose, onSelectDate, dates }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filtrage des dates en fonction de la requête de recherche, si la recherche est active
  const filteredDates = searchQuery
    ? dates.filter((date) => date.toLowerCase().includes(searchQuery.toLowerCase()))
    : dates;
  
  return (
    <AlertDialog isOpen={isOpen} onClose={onClose}>
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
            <Button colorScheme="blue" onClick={onClose} ml={3}>
              Fermer
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default DateDialogComponent;
