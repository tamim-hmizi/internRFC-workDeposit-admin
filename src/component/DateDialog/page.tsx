

import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Stack,
} from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';

const DateDialog = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const dates = ['2024-07-15', '2024-07-16', '2024-07-17', '2024-07-18', '2024-07-19'];

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredDates = dates.filter((date) =>
    date.includes(searchQuery.toLowerCase())
  );

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} size="lg">
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader fontSize="lg" fontWeight="bold">
          Choose a Date
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
                onClick={() => {} }
              />
            </InputRightElement>
          </InputGroup>
          <Stack direction="row" spacing={4} flexWrap="wrap">
            {filteredDates.map((date, index) => (
              <Button key={index} onClick={() => onClose(date)} variant="outline"  colorScheme="blue">
                {date}
              </Button>
            ))}
          </Stack>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button onClick={onClose} colorScheme="blue">Cancel</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DateDialog;
