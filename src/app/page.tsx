"use client";
import React, { useState, useEffect, useRef } from 'react';
import {
  Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Input, InputGroup, InputRightElement, IconButton, Flex, Stack, Button,
} from '@chakra-ui/react';
import { ViewIcon, Search2Icon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import './globals.css';
import AlertDialogComponent from '@/component/AlertDialog/page';
import DateDialogComponent from '@/component/DateDialog/page';

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);
  const [reportDates, setReportDates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const [data, setData] = useState([]);
  const [reports, setReports] = useState({ todaysReports: [], reportsByDate: {} });
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const cancelRef = useRef();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/user');
        const result = await response.json();
        setData(result.map(user => ({ id: user.id, name: user.name })));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setStartIndex(0);
  };

  const filteredData = data.filter(
    (item) => item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pageSize = 5;
  const endIndex = startIndex + pageSize;
  const displayedData = filteredData.slice(startIndex, endIndex);

  const canGoPrevious = startIndex > 0;
  const canGoNext = endIndex < filteredData.length;

  const goToPrevious = () => {
    setStartIndex(Math.max(0, startIndex - pageSize));
  };

  const goToNext = () => {
    setStartIndex(startIndex + pageSize);
  };

  const openDateDialog = async (userId) => {
    setSelectedUserId(userId);
    setIsLoading(true);
    try {
      const response = await fetch(`/api/rapport?personId=${userId}`);
      const result = await response.json();
      setReportDates(Object.keys(result.reportsByDate));
      setIsDateDialogOpen(true);
    } catch (error) {
      console.error('Error fetching report dates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openTodayDialog = async (userId) => {
    setSelectedUserId(userId);
    setIsLoading(true);
    try {
      const response = await fetch(`/api/rapport?personId=${userId}`);
      const result = await response.json();
      setReports({
        todaysReports: result.todaysReports,
        reportsByDate: result.reportsByDate,
      });
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDate = async (selectedDate) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/rapport?personId=${selectedUserId}&date=${selectedDate}`);
      const result = await response.json();
      setReports({ todaysReports: [], reportsByDate: { [selectedDate]: result } });
      setIsDialogOpen(true);
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
                <Tr key={item.id}>
                  <Td>{item.name}</Td>
                  <Td>
                    <Stack direction="row" spacing={4}>
                      <Button
                        leftIcon={<ViewIcon />}
                        colorScheme="blue"
                        variant="solid"
                        size="sm"
                        onClick={() => openTodayDialog(item.id)}
                        isLoading={isLoading}
                        loadingText="Loading"
                        spinnerPlacement="start"
                      >
                        Voir aujourd'hui
                      </Button>
                      <Button
                        leftIcon={<ViewIcon />}
                        colorScheme="yellow"
                        variant="solid"
                        size="sm"
                        onClick={() => openDateDialog(item.id)}
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
          values={reports.todaysReports.length ? reports.todaysReports[0] : { message: 'Pas de rapport déposé aujourd\'hui' }}
        />
      </Box>
    </Flex>
  );
}
