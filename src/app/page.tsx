"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ChangeEvent } from 'react';
import {
  Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Input, InputGroup, InputRightElement, IconButton, Flex, Stack, Button,
} from '@chakra-ui/react';
import { ViewIcon, Search2Icon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import './globals.css';
import AlertDialogComponent from '@/component/AlertDialog/page';
import DateDialogComponent from '@/component/DateDialog/page';
import AlertDialogDateComponent from '@/component/AlertDialogDate/page';

interface User {
  name: string, 
  email: string
}
interface DataState {
  data: User[];
  isLoading: boolean;
}

const initialState: DataState = {
  data: [],
  isLoading: false,
};

interface Report {
  message: string;
}

interface ReportsByDate {
  [date: string]: Report[];
}

interface Reports {
  todaysReports: Report[];
  reportsByDate: ReportsByDate;
}


export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);
  const [reportDates, setReportDates] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const [data, setData] = useState<User[]>(initialState.data);
  const [reports, setReports] = useState<Reports>({
    todaysReports: [],
    reportsByDate: {},
  });
  const [selectedpersonId, setSelectedUserId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(initialState.isLoading);

  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/user');
        const result: User[] = await response.json();
        console.log('API response:', result);
        setData(result.map(user => ({ email: user.email, name: user.name })));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setStartIndex(0);
  };

  const filteredData = data.filter(
    (item) => item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pageSize = 5;
  const endIndex = startIndex + pageSize;
  const displayedData = filteredData.slice(startIndex, endIndex);
  console.log('Displayed Data:', displayedData);
  const canGoPrevious = startIndex > 0;
  const canGoNext = endIndex < filteredData.length;

  const goToPrevious = () => {
    setStartIndex(Math.max(0, startIndex - pageSize));
  };

  const goToNext = () => {
    setStartIndex(startIndex + pageSize);
  };

  const openDateDialog = async (personId:string) => {
    setSelectedUserId(personId);
    setIsLoading(true);
    try {
      const response = await fetch(`/api/rapport?personId=${personId}`);
      const result = await response.json();
      setReportDates(Object.keys(result.reportsByDate));
      setIsDateDialogOpen(true);
      setIsDialogOpen(false); // Fermer l'autre dialogue
    } catch (error) {
      console.error('Error fetching report dates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openTodayDialog = async (personId:string) => {
    setSelectedUserId(personId);
    setIsLoading(true);
    try {
      const response = await fetch(`/api/rapport?personId=${personId}`);
      const result = await response.json();
      setReports({
        todaysReports: result.todaysReports,
        reportsByDate: result.reportsByDate,
      });
      setIsDialogOpen(true);
      setIsDateDialogOpen(false); // Fermer l'autre dialogue
    } catch (error) {
      console.error('Error fetching today\'s reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDate = async (selectedDate:string) => {
    setSelectedDate(selectedDate);
    setIsLoading(true);
    try {
      const response = await fetch(`/api/rapport?personId=${selectedpersonId}`);
      const result = await response.json();
      console.log('Result from API for selected date:', result);
      console.log(result.reportsByDate[selectedDate]);
      
      // Extraire le rapport pour la date sélectionnée
      const reportsForSelectedDate = result.reportsByDate[selectedDate] || [];
      console.log('ext:', reportsForSelectedDate);
      
      // Assurez-vous que le tableau n'est pas vide
      if (reportsForSelectedDate.length > 0) {
        setReports({ todaysReports: [], reportsByDate: { [selectedDate]: reportsForSelectedDate } });
      } else {
        setReports({ todaysReports: [], reportsByDate: { [selectedDate]: [{ message: 'Pas de rapport pour cette date' }] } });
      }
      
      setIsDialogOpen(false); // Fermer l'autre dialogue
      setIsDateDialogOpen(true);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex>
      <Box flex="1" p={4}>
        <Flex justify="flex-end" mb={4}>
          <Box width="300px">
            <InputGroup>
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <InputRightElement>
                <IconButton
                  aria-label="Search"
                  icon={<Search2Icon />}
                  onClick={() => { }}
                />
              </InputRightElement>
            </InputGroup>
          </Box>
        </Flex>

        <TableContainer>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Nom Prénom</Th>
                <Th>Rapport de travail</Th>
              </Tr>
            </Thead>
            <Tbody>
              {displayedData.map((item) => (
                <Tr key={item.email}>
                  <Td>{item.name}</Td>
                  <Td>
                    <Stack direction="row" spacing={4}>
                      <Button
                        leftIcon={<ViewIcon />}
                        colorScheme="blue"
                        variant="solid"
                        size="sm"
                        onClick={() => openTodayDialog(item.email)}
                        isLoading={isLoading}
                        loadingText="Loading"
                        spinnerPlacement="start"
                      >
                        Voir aujourd&rsquo;hui
                      </Button>
                      <Button
                        leftIcon={<ViewIcon />}
                        colorScheme="yellow"
                        variant="solid"
                        size="sm"
                        onClick={() => openDateDialog(item.email)}
                        isLoading={isLoading}
                        loadingText="Loading"
                        spinnerPlacement="start"
                      >
                        Voir tout
                      </Button>
                    </Stack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        <Flex mt={4} justify="space-between">
          <IconButton
            aria-label="Previous"
            icon={<ChevronLeftIcon />}
            onClick={goToPrevious}
            disabled={!canGoPrevious}
            display={startIndex === 0 ? 'none' : 'block'}
          />
          <IconButton
            aria-label="Next"
            icon={<ChevronRightIcon />}
            onClick={goToNext}
            disabled={!canGoNext}
            display={endIndex >= filteredData.length ? 'none' : 'block'}
          />
        </Flex>

        <DateDialogComponent
          isOpen={isDateDialogOpen}
          onClose={() => setIsDateDialogOpen(false)}
          onSelectDate={handleSelectDate}
          dates={reportDates}
        />

        <AlertDialogComponent
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          cancelRef={cancelRef}
          values={reports.todaysReports ? reports.todaysReports[0] : { message: 'Pas de rapport déposé aujourd\'hui' }}
        />

<AlertDialogDateComponent
  isOpen={isDateDialogOpen && selectedDate !== null} // Adjusted to ensure selectedDate is not null
  onClose={() => setSelectedDate(null)}
  cancelRef={cancelRef}
  values={
    selectedDate && reports.reportsByDate[selectedDate]
      ? reports.reportsByDate[selectedDate][0]
      : { message: 'Pas de rapport pour cette date' }
  }
/>
      </Box>
    </Flex>
  );
}
